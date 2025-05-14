
import * as faceapi from 'face-api.js';
import { Emotion } from '@/components/EmotionDisplay';
import { eyebrowAnalysis } from './eyebrowAnalysis';
import { mouthAnalysis } from './mouthAnalysis';
import { eyeAnalysis } from './eyeAnalysis';

/**
 * Extracts advanced emotional features from facial landmarks
 * Used to detect complex emotional states like depression, anxiety, etc.
 */
export function analyzeAdvancedEmotions(
  detection: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>,
  baseEmotion: string,
  score: number
): { emotion: Emotion, adjustedScore: number } {
  const landmarks = detection.landmarks;
  const positions = landmarks.positions;
  const faceBox = detection.detection.box;
  
  // Get feature analyses
  const eyebrowFeatures = eyebrowAnalysis(positions, faceBox);
  const mouthFeatures = mouthAnalysis(positions, faceBox);
  const eyeFeatures = eyeAnalysis(positions, faceBox);
  
  // Default to the base emotion
  let emotion: Emotion = baseEmotion as Emotion;
  let adjustedScore = score;
  
  // IMPROVED: Enhanced emotional states analysis with landmarks
  if (baseEmotion === 'sad' && score > 0.5) {
    // High intensity sadness with specific facial features may indicate depression
    if (eyebrowFeatures.browSlant > 0 && mouthFeatures.mouthCornerHeight < -0.02) {
      emotion = 'depressed';
      adjustedScore *= 1.3; // Higher confidence boost
    }
  } else if (baseEmotion === 'fearful' && score > 0.3) { // Even lower threshold
    // Better distinguish between anxiety and stress
    
    // GREATLY IMPROVED anxiety detection with covered mouth
    if (mouthFeatures.isMouthCovered) {
      // When mouth is covered, prioritize eye features for anxiety detection
      if (eyeFeatures.eyeOpenness > 0.01 && 
          (eyeFeatures.leftEyeDeviation > 0.05 || eyeFeatures.rightEyeDeviation > 0.05)) {
        emotion = 'anxious';
        adjustedScore *= 2.0; // Major boost for covered mouth anxiety
        return { emotion, adjustedScore }; // Return immediately - high confidence detection
      }
    }
    
    // Standard anxiety detection (uncovered face) with lowered thresholds
    if ((eyeFeatures.eyeOpenness > 0.13 && eyebrowFeatures.browPositionRatio < 0) ||
        // Check for anxious eyes with potentially small mouth visibility
        (eyeFeatures.eyeOpenness > 0.13 && mouthFeatures.mouthArea < 0.015)) {
      emotion = 'anxious';
      adjustedScore *= 1.8; // Higher boost for anxiety detection
    } 
    // Specific markers for stress (moderate eyes, tense mouth, neutral/lowered brows)
    else if (eyeFeatures.eyeOpenness > 0.13 && eyeFeatures.eyeOpenness < 0.28 && 
             mouthFeatures.mouthHeight < 0.02 && eyebrowFeatures.browPositionRatio > -0.03) {
      emotion = 'stressed';
      adjustedScore *= 1.3; // Higher boost for stress detection
    }
  } else if (baseEmotion === 'neutral' && score > 0.5) {
    // FIXED: More stringent criteria for confusion detection to prevent false positives
    // Confusion requires significant asymmetrical eyebrows and specific mouth position
    if ((eyebrowFeatures.browAsymmetry > 0.04 || eyebrowFeatures.browPositionRatio < -0.08) && 
        mouthFeatures.mouthOpenRatio > 0.02 && mouthFeatures.mouthOpenRatio < 0.07 &&
        Math.abs(mouthFeatures.mouthAsymmetry) > 0.03) {
      emotion = 'confused';
      adjustedScore *= 1.25; // Higher adjustment for confusion
    } else {
      // Strengthen neutral when confusion markers aren't clearly present
      adjustedScore *= 1.4; // Higher boost for neutral
    }
  } else if (baseEmotion === 'disgusted' && score > 0.5) {
    // Strengthen disgust detection with specific features
    if (mouthFeatures.noseLipDistance < 0.03) {
      adjustedScore *= 1.2; // Higher boost for disgust confidence
    }
  } 
  
  // SIGNIFICANTLY IMPROVED: Better differentiation between contempt and angry
  // This is a key fix to address the confusion between these two emotions
  else if (baseEmotion === 'contemptuous' || baseEmotion === 'angry') {
    // Check if this is contempt (asymmetrical smile/smirk is the key differentiator)
    if (mouthFeatures.mouthAsymmetry > 0.02) {
      // Strong asymmetry is the defining feature of contempt vs anger
      emotion = 'contempt';
      adjustedScore *= 1.4; // Higher boost
    } 
    // If there's anger but also asymmetry, consider if it might be contempt
    else if (baseEmotion === 'angry' && mouthFeatures.mouthAsymmetry > 0.015) {
      // Look for additional contempt indicators - eye narrowing on one side
      if (Math.abs(eyeFeatures.leftEyeOpenness - eyeFeatures.rightEyeOpenness) > 0.01) {
        emotion = 'contempt';
        adjustedScore *= 1.3;
      } else {
        // Confirm it's actually anger - check for anger-specific markers
        if (eyebrowFeatures.browFurrow < 0.4 && eyebrowFeatures.browPositionRatio < -0.01) {
          emotion = 'angry';
          adjustedScore *= 1.4; // Boost anger confidence when confirmed
        }
      }
    }
    // Pure anger detection
    else if (baseEmotion === 'angry') {
      // Specific anger markers: eyebrows down and together, mouth tension
      if (eyebrowFeatures.browFurrow < 0.4 && eyebrowFeatures.browPositionRatio < -0.01 && 
          mouthFeatures.jawTension < 0.04) {
        emotion = 'angry';
        adjustedScore *= 1.5; // Strong boost for confirmed anger
      }
    }
  }
  
  // ADDED: Special handling for confused detection to reduce false positives
  if (emotion === 'confused') {
    // Apply more stringent confidence requirements for confusion
    if (adjustedScore < 0.65) {
      emotion = 'neutral'; // Fall back to neutral for low-confidence confusion
      adjustedScore = 0.7; // Set a reasonable confidence for neutral
    }
  }
  
  return { emotion, adjustedScore };
}
