
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, WifiOff, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { sendFaceRecognitionNotification } from '@/hooks/facial-recognition/useFaceExpressionDetection';

interface FacialRecognitionStatusProps {
  permissionGranted?: boolean;
  isActive: boolean;
  modelsLoaded: boolean;
  connectionIssue?: boolean;
  cameraRequested?: boolean;
  onRequestCamera?: () => void;
  error?: string | null;
}

const FacialRecognitionStatus: React.FC<FacialRecognitionStatusProps> = ({
  error,
  isActive,
  modelsLoaded,
  connectionIssue = false,
  cameraRequested = false,
  permissionGranted = false,
  onRequestCamera
}) => {
   const { user } = useAuth();
  
  // Send notifications for status changes
  useEffect(() => {
    if (isActive && user) {
      if (error) {
        sendFaceRecognitionNotification(`Camera Error: ${error}`, user.id, 'error');
      } else if (connectionIssue) {
        sendFaceRecognitionNotification("Connection Issues Detected - Facial recognition may be affected", user.id, 'warning');
      } else if (!cameraRequested && isActive) {
        sendFaceRecognitionNotification("Please enable camera access to use facial recognition", user.id, 'info');
      } else if (!modelsLoaded && cameraRequested) {
        sendFaceRecognitionNotification("Loading facial recognition models...", user.id, 'info');
      }
    }
  }, [error, connectionIssue, cameraRequested, modelsLoaded, isActive, user]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-black/10 backdrop-blur-sm z-20">
        <div className="max-w-xs space-y-3">
          <p className="text-sm text-red-500 font-medium">{error}</p>
          {onRequestCamera && isActive && (
            <Button 
              onClick={onRequestCamera} 
              size="sm" 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  if (connectionIssue && isActive) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-10">
        <div className="text-center px-4">
          <WifiOff className="mx-auto h-8 w-8 text-amber-500 mb-2" />
          <p className="text-sm text-amber-500 font-medium mb-1">Connection Issues Detected</p>
          <p className="text-xs text-muted-foreground">
            Facial recognition models may struggle with your current connection.
          </p>
          {onRequestCamera && (
            <Button 
              onClick={onRequestCamera} 
              size="sm" 
              variant="outline"
              className="mt-2 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Retry Connection
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  if (!isActive) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-10">
        <p className="text-sm text-center px-4 text-muted-foreground">
          Click "Start Session" to enable facial analysis
        </p>
      </div>
    );
  }
  
  if (isActive && !cameraRequested && onRequestCamera) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-10">
        <div className="text-center">
          <Button 
            onClick={onRequestCamera} 
            size="lg" 
            className="flex items-center gap-2 mb-2"
          >
            <Camera size={20} />
            Enable Camera
          </Button>
          <p className="text-xs text-muted-foreground max-w-[260px]">
            Browser security requires user interaction before enabling camera access
          </p>
        </div>
      </div>
    );
  }
  
  if (!modelsLoaded && cameraRequested && isActive) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-10">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
          <p className="text-sm text-center px-4 text-muted-foreground">
            Loading face detection models...
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default FacialRecognitionStatus;
