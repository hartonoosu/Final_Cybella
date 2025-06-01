import * as faceapi from 'face-api.js';

export interface EyeFeatures {
  eyeOpenness: number;
  leftEyeOpenness: number;
  rightEyeOpenness: number;
  leftEyeDeviation: number;
  rightEyeDeviation: number;
}

/**
 * Analyzes eye-related facial features with enhanced sensitivity for fearful detection
 */
export function eyeAnalysis(
  positions: faceapi.Point[], 
  faceBox: faceapi.Box
): EyeFeatures {
  const faceHeight = faceBox.height;
  
  // Eye openness for surprise/fear with amplification
  const leftEyeTop = positions[43].y;
  const leftEyeBottom = positions[47].y;
  const rightEyeTop = positions[37].y;
  const rightEyeBottom = positions[41].y;
  
  // Multiply by 1.2 to increase sensitivity for fearful detection
  const leftEyeOpenness = ((leftEyeBottom - leftEyeTop) / faceHeight) * 1.15;
  const rightEyeOpenness = ((rightEyeBottom - rightEyeTop) / faceHeight) * 1.15;
  const eyeOpenness = (leftEyeOpenness + rightEyeOpenness) / 2;
  
  // Eye darting calculation for anxiety detection
  const leftEyeCenter = { x: (positions[37].x + positions[40].x) / 2, y: (positions[37].y + positions[40].y) / 2 };
  const rightEyeCenter = { x: (positions[43].x + positions[46].x) / 2, y: (positions[43].y + positions[46].y) / 2 };
  const faceCenter = { x: positions[30].x, y: positions[30].y };
  
  // Calculate eye deviation from the center of the face
  const leftEyeDeviation = Math.sqrt(Math.pow(leftEyeCenter.x - faceCenter.x, 2) + Math.pow(leftEyeCenter.y - faceCenter.y, 2)) / faceBox.width;
  const rightEyeDeviation = Math.sqrt(Math.pow(rightEyeCenter.x - faceCenter.x, 2) + Math.pow(rightEyeCenter.y - faceCenter.y, 2)) / faceBox.width;
  
  return {
    eyeOpenness,
    leftEyeOpenness,
    rightEyeOpenness,
    leftEyeDeviation,
    rightEyeDeviation
  };
}
