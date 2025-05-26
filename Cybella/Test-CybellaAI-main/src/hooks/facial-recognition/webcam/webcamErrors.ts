
/**
 * Formats a webcam error according to DOMException types.
 */
export function parseWebcamError(err: unknown): string {
  if (!(err instanceof DOMException)) return 'Unable to access webcam. Please ensure your camera is connected and working properly.';

  switch (err.name) {
    case 'NotAllowedError':
      return 'Camera access denied. Please grant camera permissions in your browser settings.';
    case 'NotFoundError':
      return 'No camera found. Please connect a camera and try again.';
    case 'NotReadableError':
    case 'AbortError':
      return 'Camera is already in use or not available. Please close other applications that might be using your camera, refresh the page, and try again.';
    case 'OverconstrainedError':
      return 'Camera cannot satisfy the requested constraints. Please try with a different camera.';
    case 'SecurityError':
      return 'Camera access blocked due to security policy. Please check your browser settings.';
    case 'TypeError':
      return 'No camera available or constraints cannot be satisfied. Please check your camera connection.';
    default:
      return 'Unable to access webcam. Please ensure your camera is connected and working properly.';
  }
}
