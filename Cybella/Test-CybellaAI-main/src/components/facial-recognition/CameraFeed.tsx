
import React, { RefObject } from 'react';

interface CameraFeedProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  mirrored?: boolean;
  showDetectionVisuals?: boolean;
  highQuality?: boolean;
  permissionGranted: boolean;
  isActive: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  videoRef,
  canvasRef,
  mirrored = true,
  showDetectionVisuals = true,
  highQuality = false,
  permissionGranted,
  isActive
}) => {
  // Determine resolution based on quality setting
  const resolution = {
    width: highQuality ? 1280 : 640,
    height: highQuality ? 720 : 480
  };

  // Always clear the canvas on relevant prop changes (not managing in this component, assume parent handles)
  // This is just a “dumb” renderer.

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width={resolution.width}
        height={resolution.height}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: mirrored ? 'scaleX(-1)' : 'none',
          opacity: (!permissionGranted || !isActive) ? 0.5 : 1,
          transition: 'all 300ms ease'
        }}
        className="w-full h-full object-cover rounded-md"
      />

      <canvas
        ref={canvasRef}
        width={resolution.width}
        height={resolution.height}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          transform: mirrored ? 'scaleX(-1)' : 'none',
          opacity: showDetectionVisuals ? 1 : 0,
          transition: 'opacity 300ms ease',
          zIndex: 10
        }}
      />
    </div>
  );
};

export default CameraFeed;
