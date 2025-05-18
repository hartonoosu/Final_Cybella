
// import { useState, useCallback } from 'react';
// import { Emotion } from '@/components/EmotionDisplay';

// // Simulated voice emotion detection function
// function simulateVoiceEmotionDetection(): { emotion: Emotion; confidence: number } {
//   const emotions: Emotion[] = ['happy', 'sad', 'neutral', 'surprised', 'fearful', 'angry', 'stressed', 'anxious', 'depressed', 'disgusted', 'contempt', 'confused'];
//   const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
//   const randomConfidence = 0.6 + Math.random() * 0.3;
  
//   return {
//     emotion: randomEmotion,
//     confidence: randomConfidence
//   };
// }

// export interface EmotionDetectionOptions {
//   sessionActive: boolean;
//   onVoiceEmotionDetected?: (emotion: Emotion, confidence: number) => void;
// }

// export function useEmotionDetection({
//   sessionActive,
//   onVoiceEmotionDetected
// }: EmotionDetectionOptions) {
//   // For tracking the last few emotions to make decisions more stable
//   const [recentEmotions, setRecentEmotions] = useState<Emotion[]>([]);
  
//   // Simulate voice emotion detection
//   const detectVoiceEmotion = useCallback(() => {
//     if (!sessionActive || !onVoiceEmotionDetected) return;
    
//     const result = simulateVoiceEmotionDetection();
//     onVoiceEmotionDetected(result.emotion, result.confidence);
//     return result;
//   }, [sessionActive, onVoiceEmotionDetected]);
  
//   // Function to record and stabilize emotions over time
//   const recordEmotion = useCallback((emotion: Emotion) => {
//     setRecentEmotions(prev => {
//       const newEmotions = [...prev, emotion].slice(-5); // Keep last 5 emotions
//       return newEmotions;
//     });
//   }, []);
  
//   // Get the most common emotion from recent detections
//   const getStableEmotion = useCallback((): Emotion | null => {
//     if (recentEmotions.length === 0) return null;
    
//     // Count occurrences of each emotion
//     const counts = recentEmotions.reduce((acc, emotion) => {
//       acc[emotion] = (acc[emotion] || 0) + 1;
//       return acc;
//     }, {} as Record<Emotion, number>);
    
//     // Find the emotion with the highest count
//     const stableEmotion = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Emotion;
//     return stableEmotion;
//   }, [recentEmotions]);

//   return {
//     detectVoiceEmotion,
//     recordEmotion,
//     getStableEmotion,
//     recentEmotions
//   };
// }


import { useRef, RefObject, useCallback } from "react";
import { Emotion } from "@/components/EmotionDisplay";
import { detectFaceExpressions } from "@/hooks/facial-recognition/useFaceExpressionDetection";
import { useIsMobile } from "@/hooks/use-mobile";

interface UseEmotionDetectionProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  showDetectionVisuals?: boolean;
}

const BUFFER_SIZE = 15;

export function useEmotionDetection({
  videoRef,
  canvasRef,
  showDetectionVisuals = true,
}: UseEmotionDetectionProps) {
  const isMobile = useIsMobile();
  const lastProcessTimeRef = useRef<number>(0);
  const PROCESS_INTERVAL_MS = isMobile ? 400 : 300;
  const isProcessingRef = useRef<boolean>(false);

  // Emotion buffer to store recent results
  const emotionBufferRef = useRef<{ emotion: Emotion; confidence: number }[]>([]);

  /**
   * Initialize emotion counts dynamically based on the `Emotion` type
   */
  const initializeEmotionCounts = (): Record<Emotion, { count: number; weightedConfidence: number }> => {
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
      "disgust",
      "too short",
      "too soft",
      "too noisy",
    ];

    const initialObject = emotionTypes.reduce((acc, emotion) => {
      acc[emotion] = { count: 0, weightedConfidence: 0 };
      return acc;
    }, {} as Record<Emotion, { count: number; weightedConfidence: number }>);

    return initialObject;
  };

  /**
   * Aggregate buffer for smoothing
   */
  const getSmoothedEmotion = (): Emotion | null => {
    if (emotionBufferRef.current.length === 0) return null;

    const emotionCounts = initializeEmotionCounts();

    emotionBufferRef.current.forEach(({ emotion, confidence }) => {
      emotionCounts[emotion].count += 1;
      emotionCounts[emotion].weightedConfidence += confidence;
    });

    // Determine dominant emotion
    const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) =>
      a[1].weightedConfidence > b[1].weightedConfidence ? a : b
    )[0] as Emotion;

    return dominantEmotion;
  };

  /**
   * Detect emotion and manage buffer
   */
  const detectEmotion = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessingRef.current) return null;
    if (videoRef.current.paused || videoRef.current.ended || videoRef.current.readyState < 2) {
      console.log("Video not ready for emotion detection", videoRef.current.readyState);
      return null;
    }

    isProcessingRef.current = true;

    try {
      const result = await detectFaceExpressions(
        videoRef.current,
        canvasRef.current,
        showDetectionVisuals,
        isMobile
      );
      isProcessingRef.current = false;
      return result || null;
    } catch (error) {
      console.error("Error in emotion detection:", error);
      isProcessingRef.current = false;
      return null;
    }
  }, [videoRef, canvasRef, showDetectionVisuals, isMobile]);

  /**
   * Enhanced detection with buffer logic
   */
  const detectEmotionWithBuffer = useCallback(async () => {
    const result = await detectEmotion();

    if (result) {
      emotionBufferRef.current.push(result);

      // Maintain buffer size at 15 frames
      if (emotionBufferRef.current.length > BUFFER_SIZE) {
        emotionBufferRef.current.shift();
      }
    }

    const smoothedEmotion = getSmoothedEmotion();

    if (smoothedEmotion) {
      const relevantEmotions = emotionBufferRef.current.filter(
        (e) => e.emotion === smoothedEmotion
      );

      const avgConfidence =
        relevantEmotions.reduce((sum, e) => sum + e.confidence, 0) / relevantEmotions.length;

      return {
        emotion: smoothedEmotion,
        confidence: parseFloat(avgConfidence.toFixed(2)),
      };
    }

    return result; // Fallback to base detection if buffer is not full
  }, [detectEmotion]);

  /**
   * Reset the emotion buffer
   */
  const resetBuffer = () => {
    emotionBufferRef.current = [];
  };

  return {
    detectEmotion: detectEmotionWithBuffer,
    lastProcessTimeRef,
    PROCESS_INTERVAL_MS,
    resetBuffer,
  };
}
