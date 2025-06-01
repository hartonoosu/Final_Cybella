
import * as faceapi from 'face-api.js';

export interface EyebrowFeatures {
  browSlant: number;
  browPositionRatio: number;
  browFurrow: number;
  browAsymmetry: number;
}

/**
 * Analyzes eyebrow-related facial features
 */
export function eyebrowAnalysis(
  positions: faceapi.Point[], 
  faceBox: faceapi.Box
): EyebrowFeatures {
  const faceHeight = faceBox.height;
  
  // Eyebrows position for anger/surprise detection
  const leftBrowPos = (positions[22].y - positions[27].y) * 1.15;
  const rightBrowPos = (positions[17].y - positions[27].y) * 1.15;
  const browPositionRatio = ((leftBrowPos + rightBrowPos) / 2) / faceHeight;
  
  // Eyebrow slant for sadness
  const browSlant = (positions[21].y - positions[17].y) / faceHeight;
  
  // Eyebrow furrow for anger
  const browFurrow = Math.abs(positions[21].x - positions[17].x) / faceBox.width;
  
  // Brow asymmetry for confusion
  const browAsymmetry = Math.abs((positions[21].y - positions[22].y) - (positions[17].y - positions[18].y)) / faceHeight;
  
  return {
    browSlant,
    browPositionRatio,
    browFurrow,
    browAsymmetry
  };
}
