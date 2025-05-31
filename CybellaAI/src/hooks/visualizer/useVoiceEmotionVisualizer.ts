import { useState, useEffect, useRef } from 'react';
import { Emotion } from '@/components/EmotionDisplay';
import { EmotionDataPoint } from '@/hooks/dashboard/useEmotionData';

export type { EmotionDataPoint };


export interface EmotionVisualizerOptions {
  sessionActive: boolean;
  maxDataPoints?: number;
  updateInterval?: number;
}

export function useVoiceEmotionVisualizer({
  sessionActive,
  maxDataPoints = 30,
  updateInterval = 2000
}: EmotionVisualizerOptions) {
  const [emotionData, setEmotionData] = useState<EmotionDataPoint[]>([]);
  const [animationActive, setAnimationActive] = useState<boolean>(true);
  const sessionStartRef = useRef<number>(0);
  
  // Track animation frame for cleanup
  const animationFrameRef = useRef<number | null>(null);
  
  // Reset data when session changes
  useEffect(() => {
    if (sessionActive) {
      sessionStartRef.current = Date.now();
      setEmotionData([]);
      setAnimationActive(true);
    } else {
      // When session ends, stop animation
      setAnimationActive(false);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sessionActive]);
  
  // Update the emotion data
  const updateEmotion = (emotion: Emotion, confidence: number) => {
    if (!sessionActive) return;
    
    const timestamp = Date.now();
    
    setEmotionData(prevData => {
      // If we've reached the max data points, remove the oldest one
      const newData = [...prevData];
      if (newData.length >= maxDataPoints) {
        newData.shift();
      }
      
      // Add the new data point with source type
      newData.push({
        emotion,
        confidence,
        timestamp,
        type: 'voice'
      });
      
      return newData;
    });
  };
  
  return {
    emotionData,
    animationActive,
    updateEmotion
  };
}
