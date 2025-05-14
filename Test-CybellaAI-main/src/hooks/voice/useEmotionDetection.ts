
import { useState, useCallback } from 'react';
import { Emotion } from '@/components/EmotionDisplay';

// Simulated voice emotion detection function
function simulateVoiceEmotionDetection(): { emotion: Emotion; confidence: number } {
  const emotions: Emotion[] = ['happy', 'sad', 'neutral', 'surprised', 'fearful', 'angry', 'stressed', 'anxious', 'depressed', 'disgusted', 'contempt', 'confused'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomConfidence = 0.6 + Math.random() * 0.3;
  
  return {
    emotion: randomEmotion,
    confidence: randomConfidence
  };
}

export interface EmotionDetectionOptions {
  sessionActive: boolean;
  onVoiceEmotionDetected?: (emotion: Emotion, confidence: number) => void;
}

export function useEmotionDetection({
  sessionActive,
  onVoiceEmotionDetected
}: EmotionDetectionOptions) {
  // For tracking the last few emotions to make decisions more stable
  const [recentEmotions, setRecentEmotions] = useState<Emotion[]>([]);
  
  // Simulate voice emotion detection
  const detectVoiceEmotion = useCallback(() => {
    if (!sessionActive || !onVoiceEmotionDetected) return;
    
    const result = simulateVoiceEmotionDetection();
    onVoiceEmotionDetected(result.emotion, result.confidence);
    return result;
  }, [sessionActive, onVoiceEmotionDetected]);
  
  // Function to record and stabilize emotions over time
  const recordEmotion = useCallback((emotion: Emotion) => {
    setRecentEmotions(prev => {
      const newEmotions = [...prev, emotion].slice(-5); // Keep last 5 emotions
      return newEmotions;
    });
  }, []);
  
  // Get the most common emotion from recent detections
  const getStableEmotion = useCallback((): Emotion | null => {
    if (recentEmotions.length === 0) return null;
    
    // Count occurrences of each emotion
    const counts = recentEmotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<Emotion, number>);
    
    // Find the emotion with the highest count
    const stableEmotion = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Emotion;
    return stableEmotion;
  }, [recentEmotions]);

  return {
    detectVoiceEmotion,
    recordEmotion,
    getStableEmotion,
    recentEmotions
  };
}
