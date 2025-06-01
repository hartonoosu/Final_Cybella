
import React, { RefObject, useEffect } from 'react';
import { useVideoState } from '@/hooks/facial-recognition/useVideoState';
import CameraFeed from './CameraFeed';
import VideoOverlay from './VideoOverlay';

interface VideoDisplayProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  permissionGranted: boolean;
  isActive: boolean;
  highQuality?: boolean;
  mirrored?: boolean;
  showDetectionVisuals?: boolean;
  sessionKey?: string; // New: unique per session for forced resets
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  videoRef,
  canvasRef,
  permissionGranted,
  isActive,
  highQuality = false,
  mirrored = true,
  showDetectionVisuals = true,
  sessionKey = ''
}) => {
  // Use custom hook for video loading/error state (using sessionKey for full re-initialization)
  const { videoLoaded, videoErrorMessage } = useVideoState(
    videoRef,
    isActive,
    permissionGranted,
    sessionKey
  );

  // Optionally clear canvas on any session boundary, active, or permissions changes
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx && canvasRef.current.width > 0 && canvasRef.current.height > 0) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [canvasRef, isActive, permissionGranted, sessionKey]);

  return (
    <div className="relative w-full h-full">
      <CameraFeed
        videoRef={videoRef}
        canvasRef={canvasRef}
        mirrored={mirrored}
        showDetectionVisuals={showDetectionVisuals}
        highQuality={highQuality}
        permissionGranted={permissionGranted}
        isActive={isActive}
      />
      <VideoOverlay loading={!videoLoaded && permissionGranted && isActive} errorMessage={videoErrorMessage} />
    </div>
  );
};

export default VideoDisplay;
