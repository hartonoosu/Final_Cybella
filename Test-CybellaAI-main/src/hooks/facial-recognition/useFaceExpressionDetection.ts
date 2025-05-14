import * as faceapi from 'face-api.js';
import { Emotion } from '@/components/EmotionDisplay';
import { processEmotions } from '@/utils/recognition/emotionProcessing';

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
    // Skip if no video dimensions
    if (!video.videoWidth || !video.videoHeight) return null;
    
    // Set canvas display depending on showDetectionVisuals
    canvas.style.display = showDetectionVisuals ? 'block' : 'none';
    
    // Use optimal resolution based on device
    const displaySize = { 
      width: video.videoWidth, 
      height: video.videoHeight
    };
    
    // Match canvas size to video
    faceapi.matchDimensions(canvas, displaySize);
    
    // Ultra performance mode for lower-end devices
    const detectionOptions = new faceapi.TinyFaceDetectorOptions({
      inputSize: isMobile ? 128 : 160, // Even smaller for better performance on mobile
      scoreThreshold: 0.25 // Lower threshold to catch more faces even with poor camera
    });
    
    // Faster detection by using Promise.all for concurrency
    const detection = await faceapi
      .detectSingleFace(video, detectionOptions)
      .withFaceLandmarks()
      .withFaceExpressions();
    
    if (!detection) return null;
    
    // Only draw visualization if enabled
    if (showDetectionVisuals) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear previous frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Resize detections to match display size
        const resizedDetection = faceapi.resizeResults(detection, displaySize);
        
        // Simplified drawing with thicker lines for mobile
        if (isMobile) {
          // Draw only minimal detection rectangle for mobile
          const box = resizedDetection.detection.box;
          ctx.strokeStyle = '#43a047';
          ctx.lineWidth = 2;
          ctx.strokeRect(box.x, box.y, box.width, box.height);
        } else {
          // Draw full detection visuals for desktop
          faceapi.draw.drawDetections(canvas, [resizedDetection]);
          faceapi.draw.drawFaceExpressions(canvas, [resizedDetection], 0.05);
        }
      }
    }
    
    // Process emotions with optimized pipeline
    return processEmotions([detection]);
    
  } catch (error) {
    console.error('Error in face detection:', error);
    return null;
  }
}