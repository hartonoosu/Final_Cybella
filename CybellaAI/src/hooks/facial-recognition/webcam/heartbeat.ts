
import { RefObject, MutableRefObject } from "react";
import { stopWebcamStream, reconnectWebcam } from "./streamControls";

interface WebcamHeartbeatParams {
  videoRef: RefObject<HTMLVideoElement>;
  streamRef: MutableRefObject<MediaStream | null>;
  isMountedRef: MutableRefObject<boolean>;
  permission: boolean;
  initializingRef: MutableRefObject<boolean>;
  reconnectAttemptsRef: MutableRefObject<number>;
  MAX_RECONNECT_ATTEMPTS: number;
  setError: (msg: string) => void;
  setPermission: (b: boolean) => void;
  initializeWebcam: () => Promise<void>;
  heartbeatIntervalRef: MutableRefObject<NodeJS.Timeout | null>;
}

/**
 * Starts interval checking the stream and video element for connection liveness.
 */
export function startWebcamHeartbeat({
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
  heartbeatIntervalRef,
}: WebcamHeartbeatParams) {
  if (heartbeatIntervalRef.current) {
    clearInterval(heartbeatIntervalRef.current);
  }

  heartbeatIntervalRef.current = setInterval(() => {
    if (!isMountedRef.current) {
      clearInterval(heartbeatIntervalRef.current as NodeJS.Timeout);
      heartbeatIntervalRef.current = null;
      return;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      if (videoRef.current.readyState < 2) {
        if (streamRef.current && streamRef.current.active) {
          const videoTrack = streamRef.current.getVideoTracks()[0];
          if (videoTrack && videoTrack.readyState === "ended") {
            reconnectWebcam(
              reconnectAttemptsRef,
              MAX_RECONNECT_ATTEMPTS,
              isMountedRef,
              setError,
              setPermission,
              initializeWebcam
            );
          } else {
            videoRef.current.srcObject = null;
            setTimeout(() => {
              if (videoRef.current && streamRef.current) {
                videoRef.current.srcObject = streamRef.current;
                videoRef.current.play().catch(() => {});
              }
            }, 100);
          }
        } else {
          reconnectWebcam(
            reconnectAttemptsRef,
            MAX_RECONNECT_ATTEMPTS,
            isMountedRef,
            setError,
            setPermission,
            initializeWebcam
          );
        }
      } else {
        reconnectAttemptsRef.current = 0;
      }
    } else if (permission && !initializingRef.current) {
      reconnectWebcam(
        reconnectAttemptsRef,
        MAX_RECONNECT_ATTEMPTS,
        isMountedRef,
        setError,
        setPermission,
        initializeWebcam
      );
    }
  }, 5000);
}
