// Unchanged imports
import { useState, useEffect, useRef, useCallback } from 'react';
import { Emotion } from '@/components/EmotionDisplay';
import { useEmotionHistory } from './useEmotionHistory';

interface UseEmotionProcessingProps {
  isActive: boolean;
  permission: boolean;
  modelsLoaded: boolean;
  detectEmotion: () => Promise<{ emotion: Emotion; confidence: number } | null>;
  lastProcessTimeRef: React.MutableRefObject<number>;
  processingInterval: number;
  onEmotionDetected?: (emotion: Emotion, confidence: number) => void;
  sessionId?: string;
}

export function useEmotionProcessing({
  isActive,
  permission,
  modelsLoaded,
  detectEmotion,
  lastProcessTimeRef,
  processingInterval,
  onEmotionDetected,
  sessionId = ""
}: UseEmotionProcessingProps) {
  const [lastDetectedEmotion, setLastDetectedEmotion] = useState<{ emotion: Emotion; confidence: number } | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { getStabilizedEmotion, resetHistory } = useEmotionHistory();
  const lastSuccessfulDetectionRef = useRef<number>(0);
  const MAX_DETECTION_GAP_MS = 1000; // ✅ Reduced from 3000
  const consecutiveFailuresRef = useRef<number>(0);
  const MAX_CONSECUTIVE_FAILURES = 2;
  const confidenceThresholdRef = useRef<number>(0.30); // ✅ Lowered from 0.35
  const lastEmotionUpdateTime = useRef<number>(0);
  const lastEmotionOutputTime = useRef<number>(0);
  const MIN_EMOTION_UPDATE_INTERVAL = 500; // ✅ Reduced from 1500
  const MAX_EMOTION_OUTPUT_INTERVAL = 1500; // ✅ Reduced from 5000
  const lastSessionIdRef = useRef<string>("");

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (sessionId && sessionId !== lastSessionIdRef.current) {
      console.log("Session ID changed, resetting emotion history. New session:", sessionId);
      resetHistory();
      setLastDetectedEmotion(null);
      lastEmotionUpdateTime.current = 0;
      lastEmotionOutputTime.current = 0;
      lastSuccessfulDetectionRef.current = 0;
      consecutiveFailuresRef.current = 0;
      confidenceThresholdRef.current = 0.30; // ✅ Match initial threshold
      lastSessionIdRef.current = sessionId;
    }
  }, [sessionId, resetHistory]);

  const processFrame = useCallback(async (timestamp: number) => {
    if (!mountedRef.current) return;

    if (isActive && permission && modelsLoaded) {
      const elapsed = timestamp - lastProcessTimeRef.current;
      const now = Date.now();

      if (elapsed >= processingInterval) {
        try {
          const detectionPromise = detectEmotion();

          const timeoutPromise = new Promise<null>((resolve) => {
            processingTimeoutRef.current = setTimeout(() => {
              console.log("Emotion detection timed out, continuing...");
              resolve(null);
            }, 800); // ✅ Keep this responsive
          });

          const result = await Promise.race([detectionPromise, timeoutPromise]);

          if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
            processingTimeoutRef.current = null;
          }

          if (result && mountedRef.current) {
            console.log("Got emotion detection result:", result);
            lastSuccessfulDetectionRef.current = now;
            consecutiveFailuresRef.current = 0;

            const stabilizedResult = getStabilizedEmotion(
              result.emotion,
              result.confidence,
              lastDetectedEmotion
            );

            const timeSinceLastUpdate = now - lastEmotionUpdateTime.current;
            const timeSinceLastOutput = now - lastEmotionOutputTime.current;

            const shouldUpdateInternal =
              !lastDetectedEmotion ||
              (timeSinceLastUpdate >= MIN_EMOTION_UPDATE_INTERVAL &&
                (stabilizedResult.confidence > confidenceThresholdRef.current ||
                  (stabilizedResult.emotion !== lastDetectedEmotion.emotion &&
                    stabilizedResult.confidence > 0.4)));

            const shouldForceOutput = timeSinceLastOutput >= MAX_EMOTION_OUTPUT_INTERVAL;

            if (shouldUpdateInternal || shouldForceOutput) {
              console.log(
                `Updating emotion to: ${stabilizedResult.emotion} (${stabilizedResult.confidence.toFixed(2)})${shouldForceOutput ? " [FORCED UPDATE]" : ""}`
              );
              setLastDetectedEmotion(stabilizedResult);
              lastEmotionUpdateTime.current = now;

              if (onEmotionDetected) {
                onEmotionDetected(stabilizedResult.emotion, stabilizedResult.confidence);
                lastEmotionOutputTime.current = now;
              }
            }
          } else {
            consecutiveFailuresRef.current++;

            if (
              now - lastSuccessfulDetectionRef.current > MAX_DETECTION_GAP_MS ||
              consecutiveFailuresRef.current >= MAX_CONSECUTIVE_FAILURES
            ) {
              console.log("No successful emotion detection for too long, resetting history");
              resetHistory();
              lastSuccessfulDetectionRef.current = now;
              consecutiveFailuresRef.current = 0;

              if (lastDetectedEmotion) {
                setLastDetectedEmotion(null);
              }

              confidenceThresholdRef.current = 0.30; // ✅ Maintain lower threshold
            }

            if (lastDetectedEmotion && now - lastEmotionOutputTime.current >= MAX_EMOTION_OUTPUT_INTERVAL) {
              console.log("Forcing emotion output due to timeout");
              if (onEmotionDetected) {
                onEmotionDetected(lastDetectedEmotion.emotion, lastDetectedEmotion.confidence);
                lastEmotionOutputTime.current = now;
              }
            }
          }

          lastProcessTimeRef.current = timestamp;
        } catch (err) {
          console.error("Error during emotion detection:", err);
          consecutiveFailuresRef.current++;
        }
      }
    }

    if (mountedRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(processFrame);
    }
  }, [isActive, permission, modelsLoaded, detectEmotion, lastProcessTimeRef, processingInterval, onEmotionDetected, getStabilizedEmotion, lastDetectedEmotion, resetHistory]);

  useEffect(() => {
    if (isActive && permission && modelsLoaded && mountedRef.current) {
      console.log("Starting emotion processing loop");
      resetHistory();
      lastSuccessfulDetectionRef.current = Date.now();
      lastEmotionUpdateTime.current = 0;
      lastEmotionOutputTime.current = 0;
      consecutiveFailuresRef.current = 0;
      confidenceThresholdRef.current = 0.30; // ✅ Match all locations

      animationFrameIdRef.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
    };
  }, [isActive, permission, modelsLoaded, processFrame, resetHistory]);

  return {
    lastDetectedEmotion
  };
}
