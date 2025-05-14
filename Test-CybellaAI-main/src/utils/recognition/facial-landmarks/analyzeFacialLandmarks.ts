
import * as faceapi from 'face-api.js';
import { mouthAnalysis } from './mouthAnalysis';
import { eyebrowAnalysis } from './eyebrowAnalysis';
import { eyeAnalysis } from './eyeAnalysis';

/**
 * Analyzes facial landmarks to enhance emotion detection
 * Returns a modifier score that can adjust the base emotion prediction
 */
export function analyzeFacialLandmarks(
  detection: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>,
  baseEmotion: string
): number {
  const landmarks = detection.landmarks;
  const positions = landmarks.positions;
  const faceBox = detection.detection.box;
  
  // Get facial feature analyses
  const mouthFeatures = mouthAnalysis(positions, faceBox);
  const eyebrowFeatures = eyebrowAnalysis(positions, faceBox);
  const eyeFeatures = eyeAnalysis(positions, faceBox);
  
  console.log(`Analyzing landmarks for ${baseEmotion}`, {
    mouth: mouthFeatures,
    eyebrows: eyebrowFeatures,
    eyes: eyeFeatures
  });
  
  // Apply moderate modifiers based on the base emotion
  switch (baseEmotion) {
    case 'happy':
      // In happy expressions, lips are often curled up and mouth may be open
      return mouthFeatures.mouthOpenRatio > 0.03 ? 1.5 : 1.3; // Moderate boost
      
    case 'sad':
      // In sad expressions, eyebrows often slant down at the outside
      return eyebrowFeatures.browSlant > 0 ? 1.5 : 1.3; // Moderate boost
      
    case 'angry':
      // In angry expressions, eyebrows are often lowered and drawn together
      return (eyebrowFeatures.browPositionRatio < -0.03 && eyebrowFeatures.browFurrow < 0.5) ? 1.6 : 1.4; // Moderate boost
      
    case 'surprised':
      // In surprised expressions, eyes and mouth are wide open
      return (eyeFeatures.eyeOpenness > 0.08 && mouthFeatures.mouthOpenRatio > 0.1) ? 1.7 : 1.5; // Moderate boost
      
    case 'fearful':
      // In fearful expressions, eyes are wide and eyebrows are raised
      return (eyeFeatures.eyeOpenness > 0.07 && eyebrowFeatures.browPositionRatio > 0.03) ? 1.6 : 1.4; // Moderate boost
      
    case 'disgusted':
      // In disgusted expressions, nose is wrinkled and upper lip is raised
      if (mouthFeatures.noseLipDistance < 0.03 && mouthFeatures.mouthCornerHeight < -0.01) {
        return 1.7; // Moderate boost
      }
      return 1.5; // Moderate boost
      
    case 'contemptuous':
      // In contempt, one side of mouth is raised/curled (asymmetry)
      if (mouthFeatures.asymmetryRatio > 0.03 || mouthFeatures.mouthAsymmetry > 0.02) {
        return 1.8; // Moderate boost
      }
      return 1.6; // Moderate boost
      
    case 'anxious':
      // Enhanced anxiety detection that works better with covered mouth
      // Check for anxiety in eyes even when mouth may be covered
      if ((eyeFeatures.eyeOpenness > 0.07 && 
          (eyeFeatures.leftEyeDeviation > 0.12 || eyeFeatures.rightEyeDeviation > 0.12)) ||
          // Alternative detection with minimal mouth area (potentially covered)
          (eyeFeatures.eyeOpenness > 0.06 && mouthFeatures.mouthArea < 0.01)) {
        return 1.9; // Higher boost for covered mouth anxiety
      }
      return 1.5; // Moderate boost
    
    case 'stressed':
      // Stress shows in tightened jaw, compressed lips, and brow tension
      if (mouthFeatures.jawTension < 0.03 && 
          mouthFeatures.mouthAspectRatio > 3.0 && 
          eyebrowFeatures.browPositionRatio < -0.01) {
        return 1.7; // Moderate boost
      }
      return 1.5; // Moderate boost
    
    case 'confused':
      // Improved accuracy for confusion
      if (eyebrowFeatures.browAsymmetry > 0.03 && 
          mouthFeatures.partialMouthOpening && 
          mouthFeatures.headTilt > 0.04) {
        return 1.4; // Moderate boost
      }
      return 1.2; // Slight boost
      
    case 'neutral':
      // Moderate boost for neutral detection
      return 1.6; // Moderate boost
      
    default:
      return 1.3; // Moderate general boost for all emotions
  }
}
