
import { useState, useEffect, RefObject, useCallback, useRef } from 'react';
import { Emotion } from '@/components/EmotionDisplay';
import { useWebcamSetup } from './facial-recognition/useWebcamSetup';
import { useFaceDetection } from './facial-recognition/useFaceDetection';
import { useEmotionDetection } from './facial-recognition/useEmotionDetection';
import { useEmotionProcessing } from './facial-recognition/useEmotionProcessing';
import { useConnectionStatus } from './facial-recognition/useConnectionStatus';

interface UseFacialRecognitionProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  isActive: boolean;
  cameraRequested?: boolean;
  onEmotionDetected?: (emotion: Emotion, confidence: number) => void;
  connectionIssue?: boolean;
  showDetectionVisuals?: boolean;
  sessionId?: string; // Add sessionId to track different sessions
}

interface UseFacialRecognitionReturn {
  permission: boolean;
  error: string | null;
  modelsLoaded: boolean;
  connectionIssue: boolean;
  requestCameraAccess: () => void;
}

export function useFacialRecognition({
  videoRef,
  canvasRef,
  isActive,
  cameraRequested = false,
  onEmotionDetected,
  connectionIssue: externalConnectionIssue,
  showDetectionVisuals = false,
  sessionId = ""
}: UseFacialRecognitionProps): UseFacialRecognitionReturn {
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const lastCameraRequestTime = useRef<number>(0);
  const CAMERA_REQUEST_DEBOUNCE_MS = 2000; // Prevent too frequent camera requests
  const currentSessionIdRef = useRef<string>("");
  
  // Update session ID reference when it changes
  useEffect(() => {
    if (sessionId) {
      currentSessionIdRef.current = sessionId;
      console.log("Updated session ID in hook:", sessionId);
    }
  }, [sessionId]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Handle webcam setup
  const { permission, error: webcamError, initializeWebcam, stopWebcam } = useWebcamSetup({ 
    videoRef
  });
  
  // Face detection models
  const { modelsLoaded } = useFaceDetection();
  
  // Emotion detection
  const { detectEmotion, lastProcessTimeRef, PROCESS_INTERVAL_MS } = useEmotionDetection({
    videoRef,
    canvasRef,
    showDetectionVisuals
  });
  
  // Connection status - don't check connection quality while inactive to prevent false positives
  const { connectionIssue: detectedConnectionIssue } = useConnectionStatus({
    externalConnectionIssue,
    checkConnectionQuality: isActive && permission
  });
  
  // Use external connection issue flag if provided, otherwise use detected issue
  const connectionIssue = externalConnectionIssue !== undefined ? externalConnectionIssue : detectedConnectionIssue;
  
  // Emotion processing - don't stop processing on connection issues, just warn user
  useEmotionProcessing({
    isActive: isActive && permission && cameraRequested,
    permission,
    modelsLoaded,
    detectEmotion,
    lastProcessTimeRef,
    processingInterval: PROCESS_INTERVAL_MS,
    onEmotionDetected,
    sessionId: currentSessionIdRef.current // Pass session ID to reset emotion history
  });
  
  // Update error state from webcam errors
  useEffect(() => {
    if (webcamError && mountedRef.current) {
      setError(webcamError);
    }
  }, [webcamError]);
  
  // Handle camera initialization and cleanup based on active state
  useEffect(() => {
    console.log("FacialRecognition status - isActive:", isActive, "cameraRequested:", cameraRequested, "sessionId:", currentSessionIdRef.current);
    
    if (isActive && cameraRequested && mountedRef.current) {
      const now = Date.now();
      // Prevent too frequent camera initialization attempts
      if (now - lastCameraRequestTime.current > CAMERA_REQUEST_DEBOUNCE_MS) {
        console.log("Initializing webcam - user interaction detected");
        lastCameraRequestTime.current = now;
        
        initializeWebcam().catch(err => {
          console.error("Failed to initialize webcam:", err);
          if (mountedRef.current) {
            setError(`Camera initialization failed: ${err.message || 'Unknown error'}`);
          }
        });
      } else {
        console.log("Skipping camera initialization due to debounce:", 
          now - lastCameraRequestTime.current, "ms since last request");
      }
    } else if (!isActive && mountedRef.current) {
      console.log("Stopping webcam - session inactive");
      stopWebcam();
    }
    
    return () => {
      if (!isActive || !mountedRef.current) {
        console.log("Cleanup function called in useFacialRecognition");
        stopWebcam();
      }
    };
  }, [isActive, cameraRequested, initializeWebcam, stopWebcam]);
  
  // Explicit camera access request handler
  const requestCameraAccess = useCallback(() => {
    console.log("Camera access explicitly requested by user");
    
    if (!isActive) {
      console.log("Cannot request camera when session is inactive");
      return;
    }
    
    if (!mountedRef.current) {
      console.log("Component unmounted, skipping camera request");
      return;
    }
    
    const now = Date.now();
    // Prevent too frequent camera initialization attempts
    if (now - lastCameraRequestTime.current > CAMERA_REQUEST_DEBOUNCE_MS) {
      console.log("Initializing webcam after explicit user request");
      lastCameraRequestTime.current = now;
      
      // Clear any previous errors
      if (mountedRef.current) {
        setError(null);
      }
      
      initializeWebcam().catch(err => {
        console.error("Failed to initialize webcam after user interaction:", err);
        if (mountedRef.current) {
          setError(`Camera initialization failed: ${err.message || 'Unknown error'}`);
        }
      });
    } else {
      console.log("Skipping camera initialization due to debounce:", 
        now - lastCameraRequestTime.current, "ms since last request");
    }
  }, [isActive, initializeWebcam]);
  
  return {
    permission,
    error,
    modelsLoaded,
    connectionIssue,
    requestCameraAccess
  };
}
