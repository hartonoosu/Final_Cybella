
import { useEffect, useState, RefObject, useCallback } from 'react';

// Manages video loaded/error state + “kick” logic for camera restarts.
export function useVideoState(
  videoRef: RefObject<HTMLVideoElement>,
  isActive: boolean,
  permissionGranted: boolean,
  sessionKey: string
) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoErrorMessage, setVideoErrorMessage] = useState<string | null>(null);

  // Clear state/reset on session changes or permission changes.
  useEffect(() => {
    setVideoLoaded(false);
    setVideoErrorMessage(null);
  }, [isActive, permissionGranted, sessionKey]);

  // Attach video events.
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleError = (e: Event) => {
      setVideoLoaded(false);
      setVideoErrorMessage("Camera error encountered. Please refresh the page and try again.");
    };
    const handleLoadedData = () => {
      setVideoLoaded(true);
      setVideoErrorMessage(null);
    };
    const handlePlay = () => {
      setVideoLoaded(true);
      setVideoErrorMessage(null);
    };
    const handleStalled = () => {
      setVideoLoaded(false);
      setVideoErrorMessage("Video stream stalled. Please wait...");
    };
    const handleSuspend = () => {
      if (videoLoaded) {
        setVideoErrorMessage("Video stream suspended. Attempting to reconnect...");
      }
    };

    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('stalled', handleStalled);
    videoElement.addEventListener('suspend', handleSuspend);

    return () => {
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('stalled', handleStalled);
      videoElement.removeEventListener('suspend', handleSuspend);
    };
  }, [videoRef, videoLoaded, sessionKey]);

  // Attempt to reload video if stuck (kick on isActive/permission/session changes)
  useEffect(() => {
    if (isActive && permissionGranted && videoRef.current && !videoLoaded) {
      const timer = setTimeout(() => {
        const vid = videoRef.current;
        if (vid && !videoLoaded) {
          const currentSrcObj = vid.srcObject;
          vid.srcObject = null;
          setTimeout(() => {
            if (vid) {
              vid.srcObject = currentSrcObj;
              vid.play().catch(() => {
                setVideoErrorMessage("Failed to start camera stream. Please reload the page.");
              });
            }
          }, 200);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isActive, permissionGranted, videoRef, videoLoaded, sessionKey]);

  // Manual reset (if needed)
  const resetVideoState = useCallback(() => {
    setVideoLoaded(false);
    setVideoErrorMessage(null);
  }, []);

  return { videoLoaded, videoErrorMessage, resetVideoState };
}
