
import React from 'react';
import { Card } from '@/components/ui/card';
import VideoDisplay from './VideoDisplay';
import FacialRecognitionStatus from './FacialRecognitionStatus';
import { useIsMobile } from '@/hooks/use-mobile';

interface FacialRecognitionCardProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  permission: boolean;
  error: string | null;
  modelsLoaded: boolean;
  connectionIssue: boolean;
  isActive: boolean;
  emotion: string | null;
  confidence?: number;
  requestCameraAccess: () => void;
  cameraRequested: boolean;
  highAccuracyMode?: boolean;
  mirrored?: boolean;
}

const FacialRecognitionCard: React.FC<FacialRecognitionCardProps> = ({
  videoRef,
  canvasRef,
  permission,
  error,
  modelsLoaded,
  connectionIssue,
  isActive,
  emotion,
  confidence = 0,
  requestCameraAccess,
  cameraRequested,
  highAccuracyMode = false,
  mirrored = true
}) => {
  const handleCameraAccess = () => {
    requestCameraAccess();
  };
  
  const isMobile = useIsMobile();

  return (
    <Card className="overflow-hidden relative">
      <div className="aspect-video bg-muted relative overflow-hidden rounded-md">
        <FacialRecognitionStatus 
          error={error}
          isActive={isActive}
          modelsLoaded={modelsLoaded}
          connectionIssue={connectionIssue}
          cameraRequested={cameraRequested}
          onRequestCamera={handleCameraAccess}
          permissionGranted={permission}
        />
        <VideoDisplay
          videoRef={videoRef}
          canvasRef={canvasRef}
          permissionGranted={permission}
          isActive={isActive}
          highQuality={highAccuracyMode}
          mirrored={mirrored}
        />
        
      </div>
    </Card>
  );
};

export default FacialRecognitionCard;