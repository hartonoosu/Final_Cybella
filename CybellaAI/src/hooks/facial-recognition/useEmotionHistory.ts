
import { useRef, useCallback } from 'react';
import { Emotion } from '@/components/EmotionDisplay';

interface EmotionHistoryEntry {
  emotion: Emotion;
  confidence: number;
  timestamp: number;
}

export function useEmotionHistory() {
  const emotionHistoryRef = useRef<EmotionHistoryEntry[]>([]);
  const MAX_HISTORY_LENGTH = 5; // Increased history length for better stabilization
  const EMOTION_HISTORY_MAX_AGE_MS = 7000; // 7 seconds for emotion history
  
  // Define emotion constants
  const NEUTRAL = 'neutral' as Emotion;
  const CONFUSED = 'confused' as Emotion;
  const COMPLEX_EMOTIONS: readonly Emotion[] = ['confused', 'stressed', 'anxious'];

  const addEmotionToHistory = useCallback((emotion: Emotion, confidence: number) => {
    const now = Date.now();
    
    // Add new emotion to history
    emotionHistoryRef.current.push({
      emotion,
      confidence,
      timestamp: now
    });
    
    // Clean up old entries
    emotionHistoryRef.current = emotionHistoryRef.current
      .filter(entry => (now - entry.timestamp) <= EMOTION_HISTORY_MAX_AGE_MS)
      .slice(-MAX_HISTORY_LENGTH);
  }, []);

  const getStabilizedEmotion = useCallback((
    newEmotion: Emotion, 
    newConfidence: number, 
    lastDetectedEmotion: {emotion: Emotion, confidence: number} | null
  ): {emotion: Emotion, confidence: number} => {
    addEmotionToHistory(newEmotion, newConfidence);
    
    const now = Date.now();
    
    // Filter out old entries
    emotionHistoryRef.current = emotionHistoryRef.current
      .filter(entry => (now - entry.timestamp) <= EMOTION_HISTORY_MAX_AGE_MS)
      .slice(-MAX_HISTORY_LENGTH);
    
    // Create entry for all possible emotions with better weighting
    const emotionCounts: Record<Emotion, { count: number, totalConfidence: number, weightedCount: number }> = {
      'happy': { count: 0, totalConfidence: 0, weightedCount: 0 },
      'sad': { count: 0, totalConfidence: 0, weightedCount: 0 },
      'neutral': { count: 0, totalConfidence: 0, weightedCount: 0 },
      'angry': { count: 0, totalConfidence: 0, weightedCount: 0 },
      'surprised': { count: 0, totalConfidence: 0, weightedCount: 0 },
      'fearful': { count: 0, totalConfidence: 0, weightedCount: 0 },
      'stressed': { count: 0, totalConfidence: 0, weightedCount: 0 },
      'anxious': { count: 0, totalConfidence: 0, weightedCount: 0 },
      'depressed': { count: 0, totalConfidence: 0, weightedCount: 0 },
      'disgusted': { count: 0, totalConfidence: 0, weightedCount: 0 },
      'contempt': { count: 0, totalConfidence: 0, weightedCount: 0 },
      'confused': { count: 0, totalConfidence: 0, weightedCount: 0 }
    };
    
    // Count occurrences with better recency bias
    emotionHistoryRef.current.forEach((entry, index) => {
      // Apply stronger recency bias with a more balanced curve
      const recencyWeight = 1.0 + (index / Math.max(1, emotionHistoryRef.current.length - 1)); 
      // Also weigh by confidence (higher confidence entries count more)
      const confidenceWeight = 1.0 + (entry.confidence * 0.5);
      const totalWeight = recencyWeight * confidenceWeight;
      
      emotionCounts[entry.emotion].count++;
      emotionCounts[entry.emotion].totalConfidence += entry.confidence;
      emotionCounts[entry.emotion].weightedCount += totalWeight;
    });
    
    let dominantEmotion: Emotion = NEUTRAL;
    let maxWeightedCount = 0;
    let maxConfidence = 0;
    
    // Less bias toward neutral to allow emotions to be detected more readily
    emotionCounts[NEUTRAL].weightedCount += 0.3; 
    
    // Apply penalty to "confused" emotion to reduce false positives
    emotionCounts[CONFUSED].weightedCount *= 0.8;
    
    // Find the dominant emotion based on weighted count and confidence
    Object.entries(emotionCounts).forEach(([emotion, data]) => {
      if (data.weightedCount > maxWeightedCount || 
         (data.weightedCount === maxWeightedCount && data.totalConfidence > maxConfidence)) {
        maxWeightedCount = data.weightedCount;
        maxConfidence = data.totalConfidence;
        dominantEmotion = emotion as Emotion;
      }
    });
    
    const avgConfidence = maxWeightedCount > 0 ? maxConfidence / emotionCounts[dominantEmotion].count : 0;
    
    // Apply smarter stabilization logic
    if (lastDetectedEmotion) {
      if (dominantEmotion === lastDetectedEmotion.emotion) {
        // Strengthen confidence when emotion is stable
        return { emotion: dominantEmotion, confidence: Math.min(0.98, avgConfidence * 1.35) }; 
      }
      
      // More willing to change from neutral to any emotion
      if (lastDetectedEmotion.emotion === NEUTRAL) {
        // Lower threshold to switch away from neutral
        const confidenceThreshold = lastDetectedEmotion.confidence * 0.45;
        if (avgConfidence > confidenceThreshold || dominantEmotion === 'happy') {
          return { 
            emotion: dominantEmotion, 
            confidence: Math.min(0.50, avgConfidence * 1.2)
          };
        }
        return lastDetectedEmotion;
      } 
      
      // More discerning when changing between emotions
      const confidenceThreshold = lastDetectedEmotion.confidence * 0.65;
      if (avgConfidence > confidenceThreshold) {
        return { 
          emotion: dominantEmotion, 
          confidence: Math.min(0.95, avgConfidence * 1.2)
        };
      }
      
      // Priority for clear happy detection
      if (dominantEmotion === 'happy' && emotionCounts['happy'].count >= 2) {
        return { 
          emotion: 'happy', 
          confidence: Math.min(0.95, avgConfidence * 1.3)
        };
      }
      
      // Higher threshold for switching to confused
      if (dominantEmotion === CONFUSED) {
        if (avgConfidence < 0.7) {
          return lastDetectedEmotion;
        }
      }
      
      // Lower threshold for complex emotions detection
      if (COMPLEX_EMOTIONS.includes(dominantEmotion) && 
          dominantEmotion !== CONFUSED && 
          avgConfidence > 0.5) {
        return { 
          emotion: dominantEmotion, 
          confidence: Math.min(0.9, avgConfidence * 1.2)
        };
      }
      
      return lastDetectedEmotion;
    }
    
    // First emotion detected - higher confidence boost
    return { 
      emotion: dominantEmotion, 
      confidence: Math.min(0.9, avgConfidence * 1.4)
    };
  }, [addEmotionToHistory]);

  return {
    getStabilizedEmotion,
    resetHistory: useCallback(() => {
      emotionHistoryRef.current = [];
    }, [])
  };
}
