import { useRef, RefObject, useCallback } from 'react';
import { Emotion } from '@/components/EmotionDisplay';
import { detectFaceExpressions } from './useFaceExpressionDetection';
import { useIsMobile } from '@/hooks/use-mobile';

interface UseEmotionDetectionProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  showDetectionVisuals?: boolean;
}

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
  const emotionBuffer: { emotion: Emotion; confidence: number }[] = [];

  // Aggregate buffer for smoothing
  const getSmoothedEmotion = () => {
    if (emotionBuffer.length === 0) return null;
    const emotionScores: Record<Emotion, number> = {} as any;
    emotionBuffer.forEach(({ emotion, confidence }) => {
      emotionScores[emotion] = (emotionScores[emotion] || 0) + confidence;
    });
    return Object.entries(emotionScores).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as Emotion;
  };

  // Base detection
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
      console.error('Error in emotion detection:', error);
      isProcessingRef.current = false;
      return null;
    }
  }, [videoRef, canvasRef, showDetectionVisuals, isMobile]);

  // Smoothed wrapper
  const detectEmotionWithBuffer = useCallback(async () => {
    const result = await detectEmotion();
    if (result) {
      emotionBuffer.push(result);
      if (emotionBuffer.length > 5) emotionBuffer.shift();
    }

    const smoothed = getSmoothedEmotion();
    if (smoothed) {
      const avgConfidence =
        emotionBuffer
          .filter(e => e.emotion === smoothed)
          .reduce((sum, e) => sum + e.confidence, 0) /
        emotionBuffer.filter(e => e.emotion === smoothed).length;

      return {
        emotion: smoothed,
        confidence: avgConfidence,
      };
    }

    return result; // fallback to base if no buffer result
  }, [detectEmotion]);

  return {
    detectEmotion: detectEmotionWithBuffer,
    lastProcessTimeRef,
    PROCESS_INTERVAL_MS,
  };
}
