import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { speechRecognition } from '@/utils/recognition';

export interface VoiceSessionOptions {
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
}

export function useVoiceSession({
  onSessionStart,
  onSessionEnd
}: VoiceSessionOptions) {
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const sessionStartTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);
  
  const startSession = () => {
    if (isProcessingRef.current) return null;
    isProcessingRef.current = true;
    
    setSessionActive(true);
    sessionStartTimeRef.current = Date.now();
    
    if (onSessionStart) onSessionStart();
    
    // Simplified toast
    toast({
      title: "Session started",
      description: "Click the microphone and speak when you're ready.",
    });
    
    isProcessingRef.current = false;
    return "Hello, I'm Cybella, your AI therapy assistant. I'm here to listen and help you with whatever you're going through. How are you feeling today?";
  };
  
  const endSession = () => {
    if (isProcessingRef.current) return;
    
    // Set processing flag to prevent multiple calls
    isProcessingRef.current = true;
    
    // First update state to reflect UI change immediately
    setSessionActive(false);
    
    // Then stop the speech recognition
    try {
      speechRecognition.stop();
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
    
    // Simple toast
    toast({
      title: "Session ended",
      description: "Thank you for using Cybella.",
    });
    
    // Call the onSessionEnd callback if provided
    if (onSessionEnd) {
      try {
        onSessionEnd();
      } catch (error) {
        console.error("Error in onSessionEnd callback:", error);
      }
    }
    
    // Reset processing flag
    isProcessingRef.current = false;
  };
  
  const toggleSession = () => {
    if (sessionActive) {
      endSession();
      return null;
    } else {
      return startSession();
    }
  };

  return {
    sessionActive,
    toggleSession,
    startSession,
    endSession,
    sessionStartTime: sessionStartTimeRef.current
  };
}
