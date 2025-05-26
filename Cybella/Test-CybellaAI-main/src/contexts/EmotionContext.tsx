
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Emotion } from '@/components/EmotionDisplay';

interface EmotionContextType {
  stableEmotion: Emotion | null;
  stableConfidence: number;
  setEmotionData: (emotion: Emotion, confidence: number) => void;
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export function EmotionProvider({ children }: { children: ReactNode }) {
  const [stableEmotion, setStableEmotion] = useState<Emotion | null>(null);
  const [stableConfidence, setStableConfidence] = useState<number>(0);
  
  const setEmotionData = (emotion: Emotion, confidence: number) => {
    setStableEmotion(emotion);
    setStableConfidence(confidence);
  };
  
  return (
    <EmotionContext.Provider value={{
      stableEmotion,
      stableConfidence,
      setEmotionData
    }}>
      {children}
    </EmotionContext.Provider>
  );
}

export function useEmotion() {
  const context = useContext(EmotionContext);
  if (context === undefined) {
    throw new Error('useEmotion must be used within an EmotionProvider');
  }
  return context;
}
