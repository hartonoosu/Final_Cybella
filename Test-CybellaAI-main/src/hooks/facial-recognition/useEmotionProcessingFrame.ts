import { useRef, useCallback } from 'react';
import { Emotion } from '@/components/EmotionDisplay';
import { useEmotionHistory } from './useEmotionHistory';

interface EmotionProcessingFrameParams {
  isActive: boolean;
  permission: boolean;
  modelsLoaded: boolean;
  detectEmotion: () => Promise<{ emotion: Emotion; confidence: number } | null>;
  lastProcessTimeRef: React.MutableRefObject<number>;
  processingInterval: number;
  onEmotionDetected?: (emotion: Emotion, confidence: number) => void;
  getStabilizedEmotion: ReturnType<typeof useEmotionHistory>['getStabilizedEmotion'];
  resetHistory: ReturnType<typeof useEmotionHistory>['resetHistory'];
  lastDetectedEmotion: {emotion: Emotion, confidence: number} | null;
  setLastDetectedEmotion: (val: {emotion: Emotion, confidence: number} | null) => void;
  sessionId: string;
}

export function useEmotionProcessingFrame({
  isActive,
  permission,
  modelsLoaded,
  detectEmotion,
  lastProcessTimeRef,
  processingInterval,
  onEmotionDetected,
  getStabilizedEmotion,
  resetHistory,
  lastDetectedEmotion,
  setLastDetectedEmotion,
  sessionId
}: EmotionProcessingFrameParams) {
  const animationFrameIdRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSuccessfulDetectionRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);
  const MAX_DETECTION_GAP_MS = 8000; // Increased from 2000ms to 8000ms for more tolerance
  const consecutiveFailuresRef = useRef<number>(0);
  const MAX_CONSECUTIVE_FAILURES = 4; // Increased from 2 to 4 for more tolerance before resetting
  const confidenceThresholdRef = useRef<number>(0.35);
  const lastEmotionUpdateTime = useRef<number>(0);
  const lastEmotionOutputTime = useRef<number>(0);
  const noDetectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    console.log("Running emotion frame cleanup");
    mountedRef.current = false;
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
    if (noDetectionTimeoutRef.current) {
      clearTimeout(noDetectionTimeoutRef.current);
      noDetectionTimeoutRef.current = null;
    }
    isProcessingRef.current = false;
  }, []);

  const processFrame = useCallback(async (timestamp: number) => {
    if (!mountedRef.current) return;
    if (!isActive || !permission || !modelsLoaded) {
      // Skip processing when inactive
      animationFrameIdRef.current = requestAnimationFrame(processFrame);
      return;
    }

    // Check if we're already processing - avoid overlapping detections
    if (isProcessingRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const elapsed = timestamp - lastProcessTimeRef.current;
    if (elapsed < processingInterval) {
      // Not time to process yet
      animationFrameIdRef.current = requestAnimationFrame(processFrame);
      return;
    }

    // Start processing
    const now = Date.now();
    isProcessingRef.current = true;
    lastProcessTimeRef.current = timestamp;
    
    // Set up a detection timeout if not already set
    if (isActive && !noDetectionTimeoutRef.current) {
      noDetectionTimeoutRef.current = setTimeout(() => {
        const timeSinceLastDetection = Date.now() - lastSuccessfulDetectionRef.current;
        if (timeSinceLastDetection > MAX_DETECTION_GAP_MS && isActive) {
          console.log("No successful emotion detection for too long. Restarting history.");
          resetHistory();
          setLastDetectedEmotion(null);
          lastSuccessfulDetectionRef.current = Date.now(); // Reset timer
        }
        // Clear the timeout reference so we can set it again
        noDetectionTimeoutRef.current = null;
      }, MAX_DETECTION_GAP_MS + 1000);
    }
    
    try {
      // Set a timeout to prevent hanging
      const timeoutPromise = new Promise<null>((resolve) => {
        processingTimeoutRef.current = setTimeout(() => {
          console.log("Emotion detection timed out");
          resolve(null);
        }, 600); // Slightly increased timeout for lower-end devices
      });
      
      const result = await Promise.race([detectEmotion(), timeoutPromise]);
      
      // Clear timeout
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
      
      if (result && mountedRef.current) {
        // Success path
        lastSuccessfulDetectionRef.current = now;
        consecutiveFailuresRef.current = 0;
        
        const stabilizedResult = getStabilizedEmotion(
          result.emotion,
          result.confidence,
          lastDetectedEmotion
        );
        
        const MIN_EMOTION_UPDATE_INTERVAL = 1000; // Faster updates
        const shouldUpdateInternal = 
          !lastDetectedEmotion || 
          (now - lastEmotionUpdateTime.current >= MIN_EMOTION_UPDATE_INTERVAL && 
           stabilizedResult.confidence > confidenceThresholdRef.current);
        
        if (shouldUpdateInternal) {
          setLastDetectedEmotion(stabilizedResult);
          lastEmotionUpdateTime.current = now;
          
          if (onEmotionDetected) {
            onEmotionDetected(stabilizedResult.emotion, stabilizedResult.confidence);
            lastEmotionOutputTime.current = now;
          }
        }
      } else {
        // No result path
        consecutiveFailuresRef.current++;
        
        if (consecutiveFailuresRef.current >= MAX_CONSECUTIVE_FAILURES) {
          console.log(`${MAX_CONSECUTIVE_FAILURES} consecutive failed detections. Resetting.`);
          resetHistory();
          lastSuccessfulDetectionRef.current = now;
          consecutiveFailuresRef.current = 0;
        }
      }
    } catch (err) {
      consecutiveFailuresRef.current++;
      console.error("Error in emotion detection frame:", err);
    } finally {
      isProcessingRef.current = false;
    }
    
    // Continue the loop if still mounted
    if (mountedRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(processFrame);
    }
  }, [
    isActive, permission, modelsLoaded, detectEmotion, 
    lastProcessTimeRef, processingInterval, onEmotionDetected, 
    getStabilizedEmotion, lastDetectedEmotion, resetHistory, 
    setLastDetectedEmotion
  ]);

  const startLoop = useCallback(() => {
    console.log("Starting emotion processing loop");
    mountedRef.current = true;
    isProcessingRef.current = false;
    lastSuccessfulDetectionRef.current = Date.now(); // Reset detection timer on start
    if (animationFrameIdRef.current === null) {
      animationFrameIdRef.current = requestAnimationFrame(processFrame);
    }
  }, [processFrame]);

  const stopLoop = useCallback(() => {
    console.log("Stopping emotion processing loop");
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
    if (noDetectionTimeoutRef.current) {
      clearTimeout(noDetectionTimeoutRef.current);
      noDetectionTimeoutRef.current = null;
    }
    isProcessingRef.current = false;
  }, []);

  return {
    startLoop,
    stopLoop,
    cleanup
  };
}
