
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

    speechRecognition.onResult((transcript, isFinal) => {
      if (isFinal) {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
          setTranscription(transcript);
          setInterimTranscript("");

          if (onTranscriptionComplete) {
            onTranscriptionComplete(transcript);
          }

          if (isListening) {
            stopListening();
          }
        }, 2000); // wait 2 seconds of silence
      } else {
        setInterimTranscript(transcript);
      }
    });

    speechRecognition.onEnd(() => {
      setIsListening(false);
    });
  }, [isListening, speechRecognitionSupported, onTranscriptionComplete]);
  
  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };
  
  const startListening = async () => {
    if (!sessionActive || !speechRecognitionSupported) return;
    
    try {
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
  };
}
