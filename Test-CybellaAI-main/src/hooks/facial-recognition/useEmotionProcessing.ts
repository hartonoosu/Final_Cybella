
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
  sessionId?: string; // Add sessionId to track different sessions
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
  const [lastDetectedEmotion, setLastDetectedEmotion] = useState<{emotion: Emotion, confidence: number} | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { getStabilizedEmotion, resetHistory } = useEmotionHistory();
  const lastSuccessfulDetectionRef = useRef<number>(0);
  const MAX_DETECTION_GAP_MS = 3000; // 3 seconds - for faster updates
  const consecutiveFailuresRef = useRef<number>(0);
  const MAX_CONSECUTIVE_FAILURES = 2; // More aggressive failure detection
  const confidenceThresholdRef = useRef<number>(0.35); // Lower threshold for better recall
  const lastEmotionUpdateTime = useRef<number>(0);
  const lastEmotionOutputTime = useRef<number>(0);
  const MIN_EMOTION_UPDATE_INTERVAL = 1500; // 1.5 seconds between internal updates
  const MAX_EMOTION_OUTPUT_INTERVAL = 5000; // 5 seconds max between outputs
  const lastSessionIdRef = useRef<string>(""); // Track session ID to reset history on change

  // Clean up on unmount
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

  // Reset history when session ID changes
  useEffect(() => {
    if (sessionId && sessionId !== lastSessionIdRef.current) {
      console.log("Session ID changed, resetting emotion history. New session:", sessionId);
      resetHistory();
      setLastDetectedEmotion(null);
      lastEmotionUpdateTime.current = 0;
      lastEmotionOutputTime.current = 0;
      lastSuccessfulDetectionRef.current = 0;
      consecutiveFailuresRef.current = 0;
      confidenceThresholdRef.current = 0.35;
      lastSessionIdRef.current = sessionId;
    }
  }, [sessionId, resetHistory]);

  // Process a frame of emotion detection
  const processFrame = useCallback(async (timestamp: number) => {
    if (!mountedRef.current) return;
    
    if (isActive && permission && modelsLoaded) {
      const elapsed = timestamp - lastProcessTimeRef.current;
      const now = Date.now();
      
      // Process frequently to keep camera active
      if (elapsed >= processingInterval) {
        try {
          // Set a timeout to prevent getting stuck in processing
          const detectionPromise = detectEmotion();
          
          // Setup a safety timeout to prevent getting stuck
          const timeoutPromise = new Promise<null>((resolve) => {
            processingTimeoutRef.current = setTimeout(() => {
              console.log("Emotion detection timed out, continuing...");
              resolve(null);
            }, 800); // Reduced for faster processing
          });
          
          // Race between detection and timeout
          const result = await Promise.race([detectionPromise, timeoutPromise]);
          
          if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
            processingTimeoutRef.current = null;
          }
          
          if (result && mountedRef.current) {
            console.log("Got emotion detection result:", result);
            lastSuccessfulDetectionRef.current = now;
            consecutiveFailuresRef.current = 0; // Reset failure counter on success
            
            const stabilizedResult = getStabilizedEmotion(
              result.emotion, 
              result.confidence, 
              lastDetectedEmotion
            );
            
            console.log("Stabilized result:", stabilizedResult);
            
            const timeSinceLastUpdate = now - lastEmotionUpdateTime.current;
            const timeSinceLastOutput = now - lastEmotionOutputTime.current;
            
            // Update internal state based on MIN_EMOTION_UPDATE_INTERVAL
            const shouldUpdateInternal = 
              !lastDetectedEmotion || 
              (timeSinceLastUpdate >= MIN_EMOTION_UPDATE_INTERVAL && 
                (stabilizedResult.confidence > confidenceThresholdRef.current ||
                 (stabilizedResult.emotion !== lastDetectedEmotion.emotion && 
                  stabilizedResult.confidence > 0.4)));
            
            // Force update if we haven't output an emotion in MAX_EMOTION_OUTPUT_INTERVAL (5 seconds)
            const shouldForceOutput = timeSinceLastOutput >= MAX_EMOTION_OUTPUT_INTERVAL;
            
            if (shouldUpdateInternal || shouldForceOutput) {
              console.log(`Updating emotion to: ${stabilizedResult.emotion} (${stabilizedResult.confidence.toFixed(2)})${shouldForceOutput ? " [FORCED UPDATE]" : ""}`);
              setLastDetectedEmotion(stabilizedResult);
              lastEmotionUpdateTime.current = now;
              
              if (onEmotionDetected) {
                onEmotionDetected(stabilizedResult.emotion, stabilizedResult.confidence);
                lastEmotionOutputTime.current = now;
              }
            }
          } else {
            // Increment failure counter
            consecutiveFailuresRef.current++;
            
            // Check if we've gone too long without a successful detection
            if (now - lastSuccessfulDetectionRef.current > MAX_DETECTION_GAP_MS || 
                consecutiveFailuresRef.current >= MAX_CONSECUTIVE_FAILURES) {
              console.log("No successful emotion detection for too long, resetting history");
              resetHistory();
              lastSuccessfulDetectionRef.current = now;
              consecutiveFailuresRef.current = 0;
              
              // Clear last detected emotion to allow for fresh detection
              if (lastDetectedEmotion) {
                setLastDetectedEmotion(null);
              }
              
              // Lower confidence threshold to make it easier to get a new detection
              confidenceThresholdRef.current = 0.3;
            }
            
            // Force output if we haven't updated for too long
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

  // Start/stop the animation frame loop based on active state
  useEffect(() => {
    if (isActive && permission && modelsLoaded && mountedRef.current) {
      console.log("Starting emotion processing loop");
      resetHistory();
      lastSuccessfulDetectionRef.current = Date.now();
      lastEmotionUpdateTime.current = 0; // Reset last update time to force first detection
      lastEmotionOutputTime.current = 0; // Reset last output time to force first output
      consecutiveFailuresRef.current = 0;
      confidenceThresholdRef.current = 0.35; // Start with lower threshold for better recall
      
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
