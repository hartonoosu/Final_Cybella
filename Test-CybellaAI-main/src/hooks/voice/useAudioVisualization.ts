
import { useState, useEffect } from 'react';
import { speechRecognition } from '@/utils/recognition';

export function useAudioVisualization(isListening: boolean) {
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    let visualizerInterval: NodeJS.Timeout | null = null;
    
    if (isListening) {
      visualizerInterval = setInterval(() => {
        const data = speechRecognition.getAudioData();
        if (data) {
          setAudioData(data);
        }
      }, 100);
    } else {
      setAudioData(null);
    }

    return () => {
      if (visualizerInterval) {
        clearInterval(visualizerInterval);
      }
    };
  }, [isListening]);

  return audioData;
}
