
import { RefObject, MutableRefObject } from "react";

export function stopWebcamStream(
  videoRef: RefObject<HTMLVideoElement>, 
  streamRef: MutableRefObject<MediaStream | null>, 
  isMountedRef: MutableRefObject<boolean>, 
  setPermission: (b: boolean) => void
) {
  // Stop all tracks from the MediaStream in ref
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => {
      track.stop();
    });
    streamRef.current = null;
  }
  // Also stop any tracks directly on the video element
  if (videoRef.current && videoRef.current.srcObject) {
    const currentStream = videoRef.current.srcObject as MediaStream;
    currentStream.getTracks().forEach((track) => {
      track.stop();
    });
    videoRef.current.srcObject = null;
  }
  if (isMountedRef.current) {
    setPermission(false);
  }
}

export function reconnectWebcam(
  reconnectAttemptsRef: MutableRefObject<number>,
  MAX_RECONNECT_ATTEMPTS: number,
  isMountedRef: MutableRefObject<boolean>,
  setError: (msg: string) => void,
  setPermission: (b: boolean) => void,
  initializeWebcam: () => Promise<void>
) {
  if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
    if (isMountedRef.current) {
      setError("Camera connection lost. Please refresh the page and try again.");
      setPermission(false);
    }
    return;
  }
  reconnectAttemptsRef.current++;
  if (initializeWebcam) initializeWebcam();
}
