
import { useState, RefObject, useEffect, useCallback, useRef } from 'react';
import { startWebcamHeartbeat } from './webcam/heartbeat';
import { stopWebcamStream, reconnectWebcam } from './webcam/streamControls';
import { parseWebcamError } from './webcam/webcamErrors';

interface UseWebcamSetupProps {
  videoRef: RefObject<HTMLVideoElement>;
}

interface UseWebcamSetupReturn {
  permission: boolean;
  error: string | null;
  initializeWebcam: () => Promise<void>;
  stopWebcam: () => void;
}

export function useWebcamSetup({ videoRef }: UseWebcamSetupProps): UseWebcamSetupReturn {
  const [permission, setPermission] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);
  const initializingRef = useRef(false);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopWebcam();
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, []);

  const stopWebcam = useCallback(() => {
    stopWebcamStream(videoRef, streamRef, isMountedRef, setPermission);
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    initializingRef.current = false;
    reconnectAttemptsRef.current = 0;
  }, [videoRef]);

  const initializeWebcam = useCallback(async () => {
    if (initializingRef.current) return;
    initializingRef.current = true;
    try {
      if (!isMountedRef.current) return;
      stopWebcam();
      if (isMountedRef.current) setError(null);

      await new Promise(resolve => setTimeout(resolve, 500));
      if (!isMountedRef.current) return;

      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!isMountedRef.current) {
        newStream.getTracks().forEach(track => track.stop());
        return;
      }
      streamRef.current = newStream;

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        try {
          await videoRef.current.play();
          startWebcamHeartbeat({
            videoRef,
            streamRef,
            isMountedRef,
            permission,
            initializingRef,
            reconnectAttemptsRef,
            MAX_RECONNECT_ATTEMPTS,
            setError,
            setPermission,
            initializeWebcam,
            heartbeatIntervalRef
          });
          if (isMountedRef.current) {
            setPermission(true);
            setError(null);
          }
        } catch {
          videoRef.current.onloadedmetadata = async () => {
            try {
              if (videoRef.current) {
                await videoRef.current.play();
                if (isMountedRef.current) {
                  setPermission(true);
                  setError(null);
                  startWebcamHeartbeat({
                    videoRef,
                    streamRef,
                    isMountedRef,
                    permission,
                    initializingRef,
                    reconnectAttemptsRef,
                    MAX_RECONNECT_ATTEMPTS,
                    setError,
                    setPermission,
                    initializeWebcam,
                    heartbeatIntervalRef
                  });
                }
              }
            } catch (playErr) {
              if (isMountedRef.current) setError("Camera autoplay blocked. Please reload the page and try again.");
            }
          };
        }
      }
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      if (isMountedRef.current) setPermission(false);
      if (isMountedRef.current) setError(parseWebcamError(err));
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    } finally {
      initializingRef.current = false;
    }
  }, [videoRef, stopWebcam, permission]);

  return {
    permission,
    error,
    initializeWebcam,
    stopWebcam
  };
}
