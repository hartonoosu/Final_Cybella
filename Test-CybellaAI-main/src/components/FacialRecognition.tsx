import React, { useRef, useState, useEffect } from 'react';
import FacialRecognitionCard from './facial-recognition/FacialRecognitionCard';
import { useFacialRecognition } from '@/hooks/useFacialRecognition';
import { EmotionProvider, useEmotion } from '@/contexts/EmotionContext';
import { loadFaceDetectionModels, getLoadedModelsStatus } from '@/utils/recognition';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Emotion } from '@/components/EmotionDisplay';

interface FacialRecognitionProps {
  onEmotionDetected?: (emotion: Emotion, confidence: number) => void;
  isActive: boolean;
  connectionIssue?: boolean;
}

const FacialRecognitionInner: React.FC<FacialRecognitionProps> = ({
  onEmotionDetected,
  isActive,
  connectionIssue = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { stableEmotion, setEmotionData } = useEmotion();
  const [currentConfidence, setCurrentConfidence] = useState(0);
  const [cameraRequested, setCameraRequested] = useState(false);
  const { toast } = useToast();
  const [highAccuracyMode, setHighAccuracyMode] = useState(true);
  const toastShownRef = useRef(false);
  const lastActiveStateRef = useRef(isActive);
  const modelsLoadingRef = useRef(false);
  const isMobile = useIsMobile();
  const sessionIdRef = useRef<string>("");

  // Generate new session ID when session state changes
  useEffect(() => {
    if (isActive && !lastActiveStateRef.current) {
      sessionIdRef.current = `session-${Date.now()}`;
      console.log("New face detection session ID:", sessionIdRef.current);
    }
    lastActiveStateRef.current = isActive;
  }, [isActive]);

  // Load facial detection models
  useEffect(() => {
    if (modelsLoadingRef.current) return;
    modelsLoadingRef.current = true;
    loadFaceDetectionModels()
      .then(() => {
        if (!toastShownRef.current) {
          toast({
            title: "Facial Recognition Ready",
            description: isMobile ?
              "Emotion detection optimized for mobile device." :
              "Emotion detection is ready."
          });
          toastShownRef.current = true;
        }
      })
      .catch(() => {
        toast({
          title: "Detection Models Issue",
          description: "There was a problem loading emotion detection models. Please refresh the page.",
          variant: "destructive"
        });
      });
  }, [toast, isMobile]);

  // Optional logging of emotion data to server - with error handling
  const logEmotionToTerminal = async (emotion: Emotion, confidence: number) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      // Skip logging if no API URL is configured
      if (!apiUrl || !isActive) return;
      
      // Create the endpoint URL - add '/log-emotion' to the API URL
      const endpoint = `${apiUrl}/log-emotion`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          emotion,
          confidence,
          sessionId: sessionIdRef.current,
          source: 'facial'
        }),
      });

      if (!response.ok) {
        // Log error but don't throw - this is non-critical functionality
        console.log(`Emotion logging received status ${response.status}`);
      }
    } catch (error) {
      // Silently handle errors to prevent app disruption
      // This is an optional feature and shouldn't crash the app
      console.log("Emotion logging unavailable");
    }
  };

  // Handle detected emotions and pass to parent component
  const handleEmotionDetected = (emotion: Emotion, confidence: number) => {
    if (isActive) {
      setEmotionData(emotion, confidence);
      setCurrentConfidence(confidence);
      
      // Try to log emotion, but don't let it affect the app if it fails
      logEmotionToTerminal(emotion, confidence).catch(() => {
        // Intentionally empty - we don't want to propagate errors from logging
      });
      
      if (onEmotionDetected) {
        onEmotionDetected(emotion, confidence);
      }
    }
  };

  // Use the facial recognition hook
  const { permission, error, modelsLoaded, connectionIssue: detectedConnectionIssue, requestCameraAccess } = useFacialRecognition({
    videoRef,
    canvasRef,
    isActive,
    cameraRequested,
    onEmotionDetected: handleEmotionDetected,
    sessionId: sessionIdRef.current
  });

  // Request camera access handler
  const handleRequestCameraAccess = () => {
    if (isActive) {
      setCameraRequested(true);
      requestCameraAccess();
    }
  };

  const hasConnectionIssue = connectionIssue || detectedConnectionIssue;

  // Auto request camera when session becomes active
  useEffect(() => {
    if (isActive && !permission && !cameraRequested) {
      setCameraRequested(true);
      setTimeout(() => {
        requestCameraAccess();
      }, 500);
    }
  }, [isActive, permission, cameraRequested, requestCameraAccess]);

  // Reset camera state when session ends
  useEffect(() => {
    if (!isActive && lastActiveStateRef.current) {
      setCameraRequested(false);
      // Clear any stored emotion data when session ends
      setEmotionData(null, 0);
    }
    lastActiveStateRef.current = isActive;
  }, [isActive, setEmotionData]);

  return (
    <FacialRecognitionCard
      videoRef={videoRef}
      canvasRef={canvasRef}
      permission={permission}
      error={error}
      modelsLoaded={modelsLoaded}
      connectionIssue={hasConnectionIssue}
      isActive={isActive}
      emotion={isActive ? stableEmotion : null}
      confidence={currentConfidence}
      requestCameraAccess={handleRequestCameraAccess}
      cameraRequested={cameraRequested}
      highAccuracyMode={highAccuracyMode}
      mirrored={true}
    />
  );
};

const FacialRecognition: React.FC<FacialRecognitionProps> = (props) => {
  return (
    <EmotionProvider>
      <FacialRecognitionInner {...props} />
    </EmotionProvider>
  );
};

export default FacialRecognition;