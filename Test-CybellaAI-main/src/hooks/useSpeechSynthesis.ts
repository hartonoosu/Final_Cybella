
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Interface for hook props
interface UseSpeechSynthesisProps {
  text: string;
  autoplay?: boolean;
  voiceGender: "male" | "female";
}

// Interface for hook return value
interface UseSpeechSynthesisReturn {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  handlePlay: () => void;
  handleStop: () => void;
  toggleMute: () => void;
  handleVolumeChange: (value: number) => void;
}

// Speech Synthesis Hook
export function useSpeechSynthesis({ 
  text, 
  autoplay = false, 
  voiceGender
}: UseSpeechSynthesisProps): UseSpeechSynthesisReturn {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const { language } = useLanguage();
  
  // Map of language codes to voices
  const languageVoiceMap: Record<string, string> = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'zh': 'zh-CN',
    'ja': 'ja-JP'
  };
  
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Clean up any existing speech synthesis when unmounting
  useEffect(() => {
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  useEffect(() => {
    if (autoplay && text && !isMuted) {
      handlePlay();
    }
  }, [text, autoplay, isMuted]);
  
  const handlePlay = () => {
    if (!text || isMuted) return;
    
    // Force stop backend mic if it's still recording
    const stopBtn = document.getElementById("force-stop-recording");
    if (stopBtn) {
      console.log("AI voice about to speak — forcing backend mic to stop");
      stopBtn.click();
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Get the appropriate language voice
    const voiceLanguage = languageVoiceMap[language] || 'en-US';
    
    // Create and configure a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = 1.1;
    speechRef.current = utterance;
    utterance.volume = isMuted ? 0 : volume;
    utterance.lang = voiceLanguage;
    
  
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = voiceGender === "male"
  ? ["Google UK English Male", "Daniel (English (United Kingdom))"]
  : ["Google UK English Female", "Samantha", "Karen", "Catherine"];

    const matchingVoice = voices.find(v => preferredVoices.includes(v.name)) 
                      || voices.find(v => v.lang.startsWith(voiceLanguage));

    // If voices are not yet loaded (or no match found), wait and retry
    if (!matchingVoice && typeof window !== "undefined") {
      window.speechSynthesis.onvoiceschanged = () => {
        const loadedVoices = window.speechSynthesis.getVoices();
        const fallbackVoice = loadedVoices.find(v => preferredVoices.includes(v.name)) 
                          || loadedVoices.find(v => v.lang.startsWith(voiceLanguage));

        if (fallbackVoice) {
          utterance.voice = fallbackVoice;
          utterance.rate = fallbackVoice.name === "Samantha" ? 1.05 : 1.25;
          utterance.pitch = fallbackVoice.name === "Samantha" ? 0.7 : 1.15; 

          window.speechSynthesis.speak(utterance);
        }
      };
    } else {
      utterance.voice = matchingVoice!;
      utterance.rate = matchingVoice.name === "Samantha" ? 1.05 : 1.25;
      utterance.pitch = matchingVoice.name === "Samantha" ? 0.7 : 1.15;;

      window.speechSynthesis.speak(utterance);
    }


    // Set up event handlers
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    // Store the utterance 
    speechRef.current = utterance;
  };
  
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }; 

  const toggleMute = () => {
    if (isPlaying && !isMuted) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    // If speaking and not muted, restart from current text
    if (speechRef.current && isPlaying && !isMuted) {
      const currentText = speechRef.current.text;
      
      // Stop and immediately replay with new volume
      window.speechSynthesis.cancel();
  
      const utterance = new SpeechSynthesisUtterance(currentText);
      utterance.volume = value;
      utterance.lang = speechRef.current.lang;
  
      // Use same voice
      utterance.voice = speechRef.current.voice;
  
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
  
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  
    // If not speaking, just update for next time
    if (speechRef.current && !isPlaying) {
      speechRef.current.volume = value;
    }
  };
  
  return {
    isPlaying,
    isMuted,
    volume,
    handlePlay,
    handleStop,
    toggleMute,
    handleVolumeChange
  };
}
