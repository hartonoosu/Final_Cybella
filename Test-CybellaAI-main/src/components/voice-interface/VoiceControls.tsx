import React from 'react';
import { Mic, MicOff, WifiOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AudioVisualizer from '../AudioVisualizer';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { recordVoice } from '@/utils/voiceRecorder';
import { useVoiceProcessing } from '@/hooks/useVoiceProcessing';
import { Emotion } from "@/components/EmotionDisplay";

interface VoiceControlsProps {
  isListening: boolean;
  audioData: Uint8Array | null;
  sessionActive: boolean;
  processingInput: boolean;
  connectionIssue?: boolean;
  toggleListening: () => void;
  setVoiceEmotion: (emotion: Emotion, confidence: number, top3?: { emotion: Emotion; confidence: number }[]) => void; 
  stopListening: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  audioData,
  sessionActive,
  processingInput,
  connectionIssue = false,
  toggleListening,
  setVoiceEmotion,
  stopListening
}) => {
  const isMobile = useIsMobile();

  const {
    detectVoiceEmotion, generateAIResponse, forceStopRef
  } = useVoiceProcessing({
    sessionActive,
    onVoiceEmotionDetected: (emotion, confidence, top3) => {
      console.log("Emotion detected:", emotion, confidence, top3);
      setVoiceEmotion(emotion, confidence, top3);
    }
  });
  
  return (
    <div className="flex items-center">
      <div className="flex-1">
        {isListening && audioData && (
          <AudioVisualizer isListening={isListening} audioData={audioData} />
        )}
        
        {connectionIssue && (
          <div className="flex items-center text-amber-500 mb-1">
            <WifiOff className="inline mr-1" size={isMobile ? 10 : 12} />
            <p className="text-2xs md:text-xs">
              Network connection issues detected
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                aria-label="Voice detection information"
              >
                <Info size={isMobile ? 12 : 16} className="text-purple-300" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[250px] text-xs">
              <p>Too smooth or noisy voice recordings may affect emotion detection accuracy or produce incorrect results.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant="default" 
          size="icon" 
          className={`w-8 h-8 md:w-12 md:h-12 rounded-full shadow-md ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-600 hover:bg-purple-700'}`} 
          disabled={!sessionActive || processingInput || connectionIssue}
          aria-label={isListening ? "Stop listening" : "Start listening"}
          onClick={async () => {
            toggleListening(); // IMMEDIATELY reflect UI change (mic turns red, visualizer starts)
          
            if (!isListening) {
              const {blob, duration} = await recordVoice();
              // Check for too short before calling backend
              // if (blob.size < 70000) {
              //   console.warn("Frontend check: Voice input too short — skipping backend prediction");
              //   stopListening(); 
              //   await generateAIResponse("too short");
              //   setVoiceEmotion("too short", 0, []);
              //   return;
              // }

              // Check for too short (under 2 seconds) before calling backend
              if (duration < 4000 || blob.size < 75000) {
                console.warn("Frontend check: Voice input too short — skipping backend prediction");
                stopListening(); 
                await generateAIResponse("too short");
                setVoiceEmotion("too short", 0, []);
                return;
              }

              // Check for too soft
              if (blob.size < 80000) {
                console.warn("Too soft — skipping backend prediction");
                stopListening();
                await generateAIResponse("too soft");
                setVoiceEmotion("too soft", 0, []);
                return;
              }

              forceStopRef.current = true;

          
              // Download voice blob (optional)
              // const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
              // const url = URL.createObjectURL(blob);
              // const a = document.createElement("a");
              // a.href = url;
              // a.download = `my_voice_${timestamp}.webm`;
              // a.style.display = "none";
              // document.body.appendChild(a);
              // a.click();
              // document.body.removeChild(a);
              // console.log("Voice downloaded (once)");
          
              stopListening(); // ← force stop speech-to-text once backend recording finishes
              await detectVoiceEmotion(blob); // Trigger emotion prediction
            }
          }}      
        >
          {isListening ? 
            <MicOff size={isMobile ? 14 : 20} /> : 
            <Mic size={isMobile ? 14 : 20} />
          }
        </Button>
      </div>
    </div>
  );
};

export default VoiceControls;