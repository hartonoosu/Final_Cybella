import React from 'react';
import VoicePlayback from '../VoicePlayback';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from '@/hooks/use-mobile';

interface AIResponseDisplayProps {
  processingInput: boolean;
  aiResponse: string;
  shouldPlayVoice: boolean;
  sessionActive: boolean;
}

const AIResponseDisplay: React.FC<AIResponseDisplayProps> = ({
  processingInput,
  aiResponse,
  shouldPlayVoice,
  sessionActive
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col space-y-2 md:space-y-3">
      {(processingInput || aiResponse) && (
        <div className="flex items-start gap-2">
          <Avatar className="border border-primary bg-purple-100/50 h-6 w-6 md:h-8 md:w-8">
            <AvatarFallback className="text-primary text-xs">AI</AvatarFallback>
          </Avatar>
          
          <div className="bg-purple-100/30 rounded-lg rounded-tl-none p-2 max-w-[90%] border border-purple-200/50">
            {processingInput && !aiResponse ? (
              <p className="text-xs md:text-sm text-purple-700">
                <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-pulse mr-1"></span>
                <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-pulse mx-1"></span>
                <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-pulse ml-1"></span>
              </p>
            ) : aiResponse ? (
              <div>
                <p className="text-xs md:text-sm text-purple-900">{aiResponse}</p>
                {shouldPlayVoice && (
                  <div className="mt-1 md:mt-2 flex justify-end">
                    <VoicePlayback 
                      text={aiResponse}
                      autoplay={shouldPlayVoice}
                    />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {!processingInput && !aiResponse && sessionActive && (
        <div className="text-center py-1 md:py-2">
          <p className="text-xs md:text-sm text-white/90">Say something to start the conversation</p>
        </div>
      )}
      
      {!sessionActive && (
        <div className="text-center py-1 md:py-2">
          <p className="text-xs md:text-sm text-white/90">Start a session to chat with Cybella</p>
        </div>
      )}
    </div>
  );
};

export default AIResponseDisplay;
