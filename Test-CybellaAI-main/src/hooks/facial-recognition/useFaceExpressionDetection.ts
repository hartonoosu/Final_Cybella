import * as faceapi from 'face-api.js'; 
import { Emotion } from '@/components/EmotionDisplay';
import { processEmotions } from '@/utils/recognition/emotionProcessing';
import { addNotification } from '@/components/header/NotificationBell';
import { toast } from '@/hooks/use-toast';
/**
 * Highly optimized face expression detection for better performance
 */
export async function detectFaceExpressions(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  showDetectionVisuals: boolean = true,
  isMobile: boolean = false
): Promise<{ emotion: Emotion; confidence: number } | null> {
  try {
    if (!video.videoWidth || !video.videoHeight) return null;

    canvas.style.display = showDetectionVisuals ? 'block' : 'none';

    const displaySize = { 
      width: video.videoWidth, 
      height: video.videoHeight
    };
    
    faceapi.matchDimensions(canvas, displaySize);

    const detectionOptions = new faceapi.TinyFaceDetectorOptions({
      inputSize: isMobile ? 128 : 160,
      scoreThreshold: 0.25
    });

    const detection = await faceapi
      .detectSingleFace(video, detectionOptions)
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detection) return null;

    if (showDetectionVisuals) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const resizedDetection = faceapi.resizeResults(detection, displaySize);

        if (isMobile) {
          const box = resizedDetection.detection.box;
          ctx.strokeStyle = '#43a047';
          ctx.lineWidth = 2;
          ctx.strokeRect(box.x, box.y, box.width, box.height);
        } else {
          faceapi.draw.drawDetections(canvas, [resizedDetection]);
          faceapi.draw.drawFaceExpressions(canvas, [resizedDetection], 0.05);
        }
      }
    }

    return processEmotions([detection]);

  } catch (error) {
    console.error('Error in face detection:', error);
    return null;
  }
}

/**
 * Helper function to add face recognition notifications + toast
 */
export function sendFaceRecognitionNotification(
  message: string,
  userId?: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  mode: 'toast' | 'bell' | 'both' = 'both'
) {

  const variantMap = {
    info: "default",
    success: "default",
    warning: "warning",
    error: "destructive"
  } as const;

  //  Notification bell
  if (mode === 'bell' || mode === 'both'){
    addNotification({
      message,
      read: false,
      type,
      userId
    });
  }
  //  Toast (quick visual)
  toast({
    title: message,
    variant: variantMap[type] ?? "default",
    duration: 2000 // disappears after 2 seconds
  });
}
