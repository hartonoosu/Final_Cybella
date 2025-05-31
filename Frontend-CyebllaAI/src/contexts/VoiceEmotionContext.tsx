// contexts/VoiceEmotionContext.tsx
import React, { createContext, useContext, useState } from "react";

export interface SegmentEmotion {
  start: number;
  end: number;
  emotion: string;
  confidence: number;
  startTime: string;
  endTime: string;  
}

interface VoiceEmotionContextType {
  segmentEmotions: SegmentEmotion[];
  setSegmentEmotions: (segments: SegmentEmotion[]) => void;
}

const VoiceEmotionContext = createContext<VoiceEmotionContextType | undefined>(undefined);

export const VoiceEmotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [segmentEmotions, setSegmentEmotions] = useState<SegmentEmotion[]>([]);

  return (
    <VoiceEmotionContext.Provider value={{ segmentEmotions, setSegmentEmotions }}>
      {children}
    </VoiceEmotionContext.Provider>
  );
};

export const useVoiceEmotionContext = () => {
  const context = useContext(VoiceEmotionContext);
  if (!context) {
    throw new Error("useVoiceEmotionContext must be used within a VoiceEmotionProvider");
  }
  return context;
};