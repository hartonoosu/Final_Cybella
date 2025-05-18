
// import { useRef } from 'react';
// import { Emotion } from '@/components/EmotionDisplay';

// interface BufferedEmotion {
//   emotion: Emotion;
//   confidence: number;
// }

// interface UseEmotionBufferReturn {
//   addEmotion: (emotion: Emotion, confidence: number) => void;
//   processEmotionBuffer: (onStableEmotion: (emotion: Emotion, confidence: number) => void) => void;
//   resetBuffer: () => void;
// }

// export function useEmotionBuffer(): UseEmotionBufferReturn {
//   // For emotion smoothing
//   const emotionBufferRef = useRef<BufferedEmotion[]>([]);
//   const BUFFER_SIZE = 20; // Increased buffer size for smoother emotions
  
//   // To track if the detection has stabilized
//   const stableEmotionRef = useRef<{
//     emotion: Emotion | null,
//     confidence: number,
//     lastUpdated: number,
//     stabilityCount: number
//   }>({
//     emotion: null,
//     confidence: 0,
//     lastUpdated: 0,
//     stabilityCount: 0
//   });
  
//   // Minimum number of consecutive detections to consider an emotion stable
//   const MIN_STABILITY_COUNT = 5;

//   const addEmotion = (emotion: Emotion, confidence: number) => {
//     // Add to emotion buffer for smoothing - only if confidence is high enough
//     if (confidence > 0.4) {  // Lower threshold to capture more subtle emotions
//       emotionBufferRef.current.push({
//         emotion,
//         confidence
//       });
      
//       // Keep buffer at fixed size
//       if (emotionBufferRef.current.length > BUFFER_SIZE) {
//         emotionBufferRef.current.shift();
//       }
//     }
//   };

//   // Process the emotion buffer to get a smoothed emotion with stability
//   const processEmotionBuffer = (onStableEmotion: (emotion: Emotion, confidence: number) => void) => {
//     if (emotionBufferRef.current.length < 5) return;
    
//     // Advanced emotion smoothing algorithm with stability enhancement
//     // 1. Count occurrences of each emotion
//     // 2. Calculate weighted confidence (more recent emotions have higher weight)
//     // 3. Find the most significant emotion
//     const emotionCounts: Record<Emotion, {count: number, totalConfidence: number, weightedConfidence: number}> = {
//       happy: {count: 0, totalConfidence: 0, weightedConfidence: 0},
//       sad: {count: 0, totalConfidence: 0, weightedConfidence: 0},
//       neutral: {count: 0, totalConfidence: 0, weightedConfidence: 0},
//       angry: {count: 0, totalConfidence: 0, weightedConfidence: 0},
//       fearful: {count: 0, totalConfidence: 0, weightedConfidence: 0},
//       surprised: {count: 0, totalConfidence: 0, weightedConfidence: 0},
//       stressed: {count: 0, totalConfidence: 0, weightedConfidence: 0},
//       anxious: {count: 0, totalConfidence: 0, weightedConfidence: 0},
//       depressed: {count: 0, totalConfidence: 0, weightedConfidence: 0},
//       disgusted: {count: 0, totalConfidence: 0, weightedConfidence: 0},
//       contempt: {count: 0, totalConfidence: 0, weightedConfidence: 0},
//       confused: {count: 0, totalConfidence: 0, weightedConfidence: 0}
//     };
    
//     // Process emotions with recency bias (more recent emotions have more impact)
//     emotionBufferRef.current.forEach((item, index) => {
//       // Calculate weight - more recent emotions have higher weight
//       const recencyWeight = Math.pow((index + 1) / emotionBufferRef.current.length, 2);
      
//       emotionCounts[item.emotion].count += 1;
//       emotionCounts[item.emotion].totalConfidence += item.confidence;
//       emotionCounts[item.emotion].weightedConfidence += item.confidence * recencyWeight;
//     });
    
//     // Find the dominant emotion using weighted confidence
//     let dominantEmotion: Emotion = 'neutral';
//     let highestWeightedScore = 0;
//     let avgConfidence = 0;
    
//     Object.entries(emotionCounts).forEach(([emotion, data]) => {
//       if (data.count > 0 && data.weightedConfidence > highestWeightedScore) {
//         highestWeightedScore = data.weightedConfidence;
//         dominantEmotion = emotion as Emotion;
//         avgConfidence = data.totalConfidence / data.count;
//       }
//     });
    
//     // Check if this is the same emotion as our current stable emotion
//     const currentTime = Date.now();
    
//     if (stableEmotionRef.current.emotion === dominantEmotion) {
//       // Same emotion, increment stability counter
//       stableEmotionRef.current.stabilityCount += 1;
//       stableEmotionRef.current.confidence = 
//         (stableEmotionRef.current.confidence * 0.7) + (avgConfidence * 0.3); // Smooth confidence
      
//       // If we've seen this emotion consistently, report it
//       if (stableEmotionRef.current.stabilityCount >= MIN_STABILITY_COUNT) {
//         // Only report if it's been a while since our last update (avoid too frequent updates)
//         const timeSinceLastUpdate = currentTime - stableEmotionRef.current.lastUpdated;
//         if (timeSinceLastUpdate > 2000) { // Only report every 2 seconds at most
//           onStableEmotion(dominantEmotion, stableEmotionRef.current.confidence);
//           stableEmotionRef.current.lastUpdated = currentTime;
//         }
//       }
//     } else {
//       // Different emotion, reset stability counter or decrement
//       // If it's a momentary change, we don't immediately reset
//       stableEmotionRef.current.stabilityCount = Math.max(0, stableEmotionRef.current.stabilityCount - 2);
      
//       // If stability is lost completely, switch to new emotion
//       if (stableEmotionRef.current.stabilityCount === 0) {
//         stableEmotionRef.current.emotion = dominantEmotion;
//         stableEmotionRef.current.confidence = avgConfidence;
//         stableEmotionRef.current.stabilityCount = 1;
//       }
//     }
//   };

//   const resetBuffer = () => {
//     emotionBufferRef.current = [];
//     stableEmotionRef.current = {
//       emotion: null,
//       confidence: 0,
//       lastUpdated: Date.now(),
//       stabilityCount: 0
//     };
//   };

//   return {
//     addEmotion,
//     processEmotionBuffer,
//     resetBuffer
//   };
// }


import { useRef } from "react";
import { Emotion } from "@/components/EmotionDisplay";

interface BufferedEmotion {
  emotion: Emotion;
  confidence: number;
}

interface UseEmotionBufferReturn {
  addEmotion: (emotion: Emotion, confidence: number) => void;
  processEmotionBuffer: (onStableEmotion: (emotion: Emotion, confidence: number) => void) => void;
  resetBuffer: () => void;
}

export function useEmotionBuffer(): UseEmotionBufferReturn {
  const BUFFER_SIZE = 15;
  const MIN_STABILITY_COUNT = 5;

  const emotionBufferRef = useRef<BufferedEmotion[]>([]);
  const stableEmotionRef = useRef<{
    emotion: Emotion | null;
    confidence: number;
    lastUpdated: number;
    stabilityCount: number;
  }>({
    emotion: null,
    confidence: 0,
    lastUpdated: 0,
    stabilityCount: 0,
  });

  /**
   * Dynamically initialize emotion counts based on the Emotion type
   */
  const initializeEmotionCounts = (): Record<Emotion, { count: number; totalConfidence: number; weightedConfidence: number }> => {
    const emotionTypes: Emotion[] = [
      "happy",
      "sad",
      "neutral",
      "angry",
      "fearful",
      "surprised",
      "stressed",
      "anxious",
      "depressed",
      "disgusted",
      "contempt",
      "confused",
      "calm",
      "too short",
      "too soft",
      "too noisy",
    ];

    const initialObject = emotionTypes.reduce((acc, emotion) => {
      acc[emotion] = { count: 0, totalConfidence: 0, weightedConfidence: 0 };
      return acc;
    }, {} as Record<Emotion, { count: number; totalConfidence: number; weightedConfidence: number }>);

    return initialObject;
  };

  /**
   * Add emotion to the buffer
   */
  const addEmotion = (emotion: Emotion, confidence: number) => {
    if (confidence > 0.4) {
      emotionBufferRef.current.push({ emotion, confidence });

      if (emotionBufferRef.current.length > BUFFER_SIZE) {
        emotionBufferRef.current.shift();
      }
    }
  };

  /**
   * Process the buffer and calculate the dominant emotion
   */
  const processEmotionBuffer = (onStableEmotion: (emotion: Emotion, confidence: number) => void) => {
    if (emotionBufferRef.current.length < 5) return;

    const emotionCounts = initializeEmotionCounts();

    emotionBufferRef.current.forEach((item, index) => {
      const recencyWeight = Math.pow((index + 1) / emotionBufferRef.current.length, 2);

      emotionCounts[item.emotion].count += 1;
      emotionCounts[item.emotion].totalConfidence += item.confidence;
      emotionCounts[item.emotion].weightedConfidence += item.confidence * recencyWeight;
    });

    let dominantEmotion: Emotion = "neutral";
    let highestWeightedScore = 0;
    let avgConfidence = 0;

    Object.entries(emotionCounts).forEach(([emotion, data]) => {
      if (data.count > 0 && data.weightedConfidence > highestWeightedScore) {
        dominantEmotion = emotion as Emotion;
        highestWeightedScore = data.weightedConfidence;
        avgConfidence = data.totalConfidence / data.count;
      }
    });

    const currentTime = Date.now();

    if (stableEmotionRef.current.emotion === dominantEmotion) {
      stableEmotionRef.current.stabilityCount += 1;
      stableEmotionRef.current.confidence =
        stableEmotionRef.current.confidence * 0.7 + avgConfidence * 0.3;

      if (stableEmotionRef.current.stabilityCount >= MIN_STABILITY_COUNT) {
        const timeSinceLastUpdate = currentTime - stableEmotionRef.current.lastUpdated;
        if (timeSinceLastUpdate > 2000) {
          onStableEmotion(dominantEmotion, stableEmotionRef.current.confidence);
          stableEmotionRef.current.lastUpdated = currentTime;
        }
      }
    } else {
      stableEmotionRef.current.stabilityCount = Math.max(0, stableEmotionRef.current.stabilityCount - 2);

      if (stableEmotionRef.current.stabilityCount === 0) {
        stableEmotionRef.current.emotion = dominantEmotion;
        stableEmotionRef.current.confidence = avgConfidence;
        stableEmotionRef.current.stabilityCount = 1;
      }
    }
  };

  /**
   * Reset buffer and stability tracking
   */
  const resetBuffer = () => {
    emotionBufferRef.current = [];
    stableEmotionRef.current = {
      emotion: null,
      confidence: 0,
      lastUpdated: Date.now(),
      stabilityCount: 0,
    };
  };

  return {
    addEmotion,
    processEmotionBuffer,
    resetBuffer,
  };
}
