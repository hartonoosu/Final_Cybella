
# Advanced Features

This guide explains advanced features and customization options for the facial recognition system.

## Using With Emotion History

For applications that need to track emotions over time:

```tsx
import { useState, useEffect } from 'react';
import { Emotion } from '@/components/EmotionDisplay';

// In your component:
const MyComponent = () => {
  // Track emotion history
  const [emotionHistory, setEmotionHistory] = useState<
    Array<{ emotion: Emotion; timestamp: number; confidence: number }>
  >([]);

  // Add emotion to history when detected
  useEffect(() => {
    if (emotion && confidence > 0.6) {
      setEmotionHistory(prev => [
        ...prev, 
        { emotion, timestamp: Date.now(), confidence }
      ].slice(-10)); // Keep last 10 emotions
    }
  }, [emotion, confidence]);

  // Render emotion history
  return (
    <div>
      <h3>Emotion History</h3>
      <ul>
        {emotionHistory.map((entry, index) => (
          <li key={index}>
            {new Date(entry.timestamp).toLocaleTimeString()}: {entry.emotion} 
            ({Math.round(entry.confidence * 100)}%)
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Customizing Detection Visualization

To show the face detection landmarks (for debugging):

```tsx
// Import useFacialRecognition with showDetectionVisuals set to true
const { /* ... */ } = useFacialRecognition({
  videoRef,
  canvasRef,
  isActive: true,
  cameraRequested,
  onEmotionDetected: handleEmotionDetected,
  
  // Additional options
  showDetectionVisuals: true // Make the canvas visible with face detection landmarks
});

// Make the canvas visible
<canvas 
  ref={canvasRef} 
  className="absolute top-0 left-0 w-full h-full opacity-100" // Changed from opacity-0
/>
```

## Handling Connection Issues

For better user experience with connectivity problems:

```tsx
// Use useNetworkStatus to detect network issues
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const { isOnline, connectionQuality } = useNetworkStatus();

// Pass connection information to facial recognition
const { /* ... */ } = useFacialRecognition({
  videoRef,
  canvasRef,
  isActive: true,
  cameraRequested,
  onEmotionDetected: handleEmotionDetected,
  connectionIssue: !isOnline || connectionQuality === 'poor'
});

// Display connection warnings
{!isOnline && (
  <div className="connection-warning">
    No internet connection detected. Facial recognition may not work properly.
  </div>
)}

{connectionQuality === 'poor' && (
  <div className="connection-warning">
    Poor network connection. Performance may be affected.
  </div>
)}
```

## Enhanced Emotion Processing

The system supports advanced emotion processing techniques:

### Multi-class Emotion Detection

The system can detect multiple distinct emotional states:
- Basic emotions: happy, sad, neutral, angry, surprised, fearful
- Advanced states: stressed, anxious, depressed (when enabled)

### Facial Landmark Analysis

For improved accuracy, the system uses detailed facial landmark analysis:
- Mouth shape analysis for happiness/sadness
- Eyebrow position for anger/surprise
- Eye openness for surprise/fear
- Combined features for advanced emotional states

### Temporal Stability

To prevent emotion flickering and provide a smoother user experience:
- Emotions are tracked over time (recent 5-second window)
- Confidence thresholds are applied to new detections
- Weighted averaging is used to determine dominant emotions
- Hysteresis is applied when transitioning between emotions
