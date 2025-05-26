
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { speechRecognition } from '@/utils/recognition';

export interface SpeechRecognitionOptions {
  sessionActive: boolean;
  onTranscriptionComplete?: (transcript: string) => void;
}

export function useSpeechRecognition({ 
  sessionActive, 
  onTranscriptionComplete 
}: SpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  
  const speechRecognitionSupported = typeof window !== 'undefined' && 
    (typeof window.SpeechRecognition !== 'undefined' || typeof window.webkitSpeechRecognition !== 'undefined');

     const debounceTimer = useRef<NodeJS.Timeout | null>(null);
     const forceStopRef = useRef(false);

  useEffect(() => {
    if (!speechRecognitionSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.",
        variant: "destructive"
      });
      return;
    }

    speechRecognition.configure({
      continuous: true,
      interimResults: true,
      language: 'en-US'
    });

    let sttHoldTimeout: NodeJS.Timeout | null = null;

    speechRecognition.onResult((transcript, isFinal) => {
      if (isFinal) {
        if (sttHoldTimeout) clearTimeout(sttHoldTimeout);

        // Hold for 1.5s in case user speaks again
        sttHoldTimeout = setTimeout(() => {
          setTranscription(transcript);
          setInterimTranscript("");

          if (onTranscriptionComplete) {
            onTranscriptionComplete(transcript);
          }

          if (forceStopRef.current) {
            stopListening();
          }
        }, 2000); // 1.5s hold to check if user continues
      } else {
        if (sttHoldTimeout) clearTimeout(sttHoldTimeout); // cancel previous send
        setInterimTranscript(transcript);
      }
    });

speechRecognition.onEnd(() => {
  // Don't trigger anything immediately — wait for timeout logic
  setIsListening(false);
});


    speechRecognition.onEnd(() => {
  // Don't trigger anything immediately — wait for timeout logic
  setIsListening(false);
});



    speechRecognition.onEnd(() => {
      setIsListening(false);
    });
  }, [isListening, speechRecognitionSupported, onTranscriptionComplete]);
  
  const toggleListening = async () => {
    if (forceStopRef.current) {
      stopListening();
    } else {
      await startListening();
    }
  };
  
  const startListening = async () => {
    if (!sessionActive || !speechRecognitionSupported) return;
    
    try {
      forceStopRef.current = false;
      await speechRecognition.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  const stopListening = () => {
    speechRecognition.stop();
    setIsListening(false);
  };

  return {
    isListening,
    transcription,
    interimTranscript,
    speechRecognitionSupported,
    toggleListening,
    startListening,
    stopListening,
    setTranscription,
    setInterimTranscript,
    forceStopRef,
  };
}
