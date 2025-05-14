
# Facial Recognition Quick Start Guide

This guide provides a quick overview of how to integrate the facial recognition system into your components.

## Basic Setup

```tsx
import { useRef, useState } from 'react';
import { useFacialRecognition } from '@/hooks/useFacialRecognition';
import { Emotion } from '@/components/EmotionDisplay';

const MyComponent = () => {
  // Create refs for video and canvas elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Track camera permission request state
  const [cameraRequested, setCameraRequested] = useState(false);
  
  // Track detected emotion
  const [emotion, setEmotion] = useState<Emotion>('neutral');
  const [confidence, setConfidence] = useState<number>(0);

  // Handle detected emotions
  const handleEmotionDetected = (detectedEmotion: Emotion, detectedConfidence: number) => {
    setEmotion(detectedEmotion);
    setConfidence(detectedConfidence);
  };

  // Initialize facial recognition
  const { 
    permission,        // Whether camera access is granted
    error,             // Error message if any
    modelsLoaded,      // Whether face-api.js models are loaded
    connectionIssue,   // Whether there are network connectivity issues
    requestCameraAccess // Function to request camera access
  } = useFacialRecognition({
    videoRef,          // Ref to video element
    canvasRef,         // Ref to canvas element
    isActive: true,    // Whether facial recognition is active
    cameraRequested,   // Whether camera access has been requested
    onEmotionDetected: handleEmotionDetected // Callback for emotion detection
  });

  // Request camera access
  const handleRequestCameraAccess = () => {
    setCameraRequested(true);
    requestCameraAccess();
  };

  return (
    <div className="relative">
      {/* Video element displays webcam feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full rounded-lg"
      />
      
      {/* Canvas overlays face detection (usually hidden) */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full opacity-0"
      />
      
      {/* Camera access request button */}
      {!permission && (
        <button 
          onClick={handleRequestCameraAccess}
          className="btn btn-primary"
        >
          Enable Camera
        </button>
      )}
      
      {/* Display detected emotion */}
      {permission && modelsLoaded && (
        <div className="mt-4">
          <h3>Detected Emotion: {emotion}</h3>
          <p>Confidence: {Math.round(confidence * 100)}%</p>
        </div>
      )}
      
      {/* Display error if any */}
      {error && (
        <div className="error-message mt-2 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default MyComponent;
```

## Core Features

- **Real-time emotion detection** from facial expressions
- **Multiple emotion categories**: happy, sad, neutral, angry, fearful, surprised
- **Confidence scoring** for detected emotions
- **Emotion stabilization** to prevent flickering between different emotions
- **Error handling** for camera access and connectivity issues

## Next Steps

For more advanced usage, see:
- [Advanced Features](./AdvancedFeatures.md) - Customizing detection and visualization
- [Troubleshooting](./Troubleshooting.md) - Handling common issues
- [API Reference](./APIReference.md) - Complete function reference
