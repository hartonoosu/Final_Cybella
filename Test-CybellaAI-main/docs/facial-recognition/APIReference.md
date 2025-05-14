
# API Reference

This document provides a comprehensive reference for all functions and hooks in the facial recognition system.

## Main Integration Hook

### `useFacialRecognition`

**File:** `src/hooks/useFacialRecognition.ts`

```typescript
interface UseFacialRecognitionProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  isActive: boolean;
  cameraRequested?: boolean;
  onEmotionDetected?: (emotion: Emotion, confidence: number) => void;
  connectionIssue?: boolean;
  showDetectionVisuals?: boolean;
}

interface UseFacialRecognitionReturn {
  permission: boolean;
  error: string | null;
  modelsLoaded: boolean;
  connectionIssue: boolean;
  requestCameraAccess: () => void;
}

function useFacialRecognition(props: UseFacialRecognitionProps): UseFacialRecognitionReturn
```

## Webcam Management

### `useWebcamSetup`

**File:** `src/hooks/facial-recognition/useWebcamSetup.ts`

```typescript
interface UseWebcamSetupProps {
  videoRef: RefObject<HTMLVideoElement>;
}

interface UseWebcamSetupReturn {
  permission: boolean;
  error: string | null;
  initializeWebcam: () => Promise<void>;
  stopWebcam: () => void;
}

function useWebcamSetup(props: UseWebcamSetupProps): UseWebcamSetupReturn
```

## Model Loading

### `useFaceDetection`

**File:** `src/hooks/facial-recognition/useFaceDetection.ts`

```typescript
function useFaceDetection(): { modelsLoaded: boolean }
```

## Emotion Detection

### `useEmotionDetection`

**File:** `src/hooks/facial-recognition/useEmotionDetection.ts`

```typescript
interface UseEmotionDetectionProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  showDetectionVisuals?: boolean;
}

function useEmotionDetection(props: UseEmotionDetectionProps): {
  detectEmotion: () => Promise<{ emotion: Emotion; confidence: number } | null>;
  lastProcessTimeRef: React.MutableRefObject<number>;
  PROCESS_INTERVAL_MS: number;
}
```
