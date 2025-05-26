
import * as faceapi from 'face-api.js';

export interface MouthFeatures {
  mouthOpenRatio: number;
  mouthCornerHeight: number;
  noseLipDistance: number;
  mouthAsymmetry: number;
  mouthWidth: number;
  mouthHeight: number;
  mouthAspectRatio: number;
  jawTension: number;
  partialMouthOpening: boolean;
  headTilt: number;
  asymmetryRatio: number;
  mouthArea: number;
  isMouthCovered: boolean;
}

/**
 * Analyzes mouth-related facial features with improved covered mouth detection
 */
export function mouthAnalysis(
  positions: faceapi.Point[], 
  faceBox: faceapi.Box
): MouthFeatures {
  // Mouth shape analysis
  const upperLipY = positions[62].y;
  const lowerLipY = positions[66].y;
  const lipDistance = (lowerLipY - upperLipY) * 1.15;
  const faceHeight = faceBox.height;
  const mouthOpenRatio = lipDistance / faceHeight;
  
  // Mouth corners for emotion detection
  const leftMouthCorner = positions[48];
  const rightMouthCorner = positions[54];
  const mouthCornerHeight = ((leftMouthCorner.y + rightMouthCorner.y) / 2 - positions[33].y) / faceHeight;
  
  // Nose-lip distance for disgust/contempt
  const noseBottom = positions[33].y;
  const upperLipTop = positions[51].y;
  const noseLipDistance = (upperLipTop - noseBottom) / faceHeight;
  
  // Asymmetry detection
  const leftSideHeight = positions[29].y - positions[2].y;
  const rightSideHeight = positions[29].y - positions[14].y;
  const asymmetryRatio = Math.abs(leftSideHeight - rightSideHeight) / faceHeight;
  
  // Mouth features for stress detection
  const mouthWidth = Math.abs(positions[48].x - positions[54].x) / faceBox.width;
  const mouthHeight = Math.abs(positions[51].y - positions[57].y) / faceBox.height;
  const mouthAspectRatio = mouthWidth / Math.max(0.001, mouthHeight); // Prevent division by zero
  
  // Jaw tension indicator
  const jawTension = Math.abs(positions[7].y - positions[8].y) / faceBox.height;
  
  // IMPROVED: Enhanced mouth asymmetry detection for better contempt recognition
  // This specifically addresses the contempt vs. anger confusion
  const leftCornerHeight = (leftMouthCorner.y - positions[33].y) / faceHeight;
  const rightCornerHeight = (rightMouthCorner.y - positions[33].y) / faceHeight;
  let mouthAsymmetry = Math.abs(leftCornerHeight - rightCornerHeight);
  
  // Additional contempt indicators
  const leftLipCornerAngle = Math.atan2(positions[48].y - positions[31].y, positions[48].x - positions[31].x);
  const rightLipCornerAngle = Math.atan2(positions[54].y - positions[35].y, positions[54].x - positions[35].x);
  const cornerAngleDifference = Math.abs(leftLipCornerAngle - rightLipCornerAngle);
  
  // If corner angle difference is significant, boost mouth asymmetry score
  if (cornerAngleDifference > 0.2) {
    // This helps distinguish contempt (asymmetrical smile/smirk) from anger
    mouthAsymmetry += 0.01;
  }
  
  // Partial mouth opening indicator (for confusion)
  const partialMouthOpening = mouthOpenRatio > 0.01 && mouthOpenRatio < 0.08;
  
  // Head tilt indicator
  const headTilt = Math.abs(positions[0].y - positions[16].y) / faceBox.height;
  
  // Calculate mouth area (for detecting covered mouth in anxiety)
  const mouthArea = mouthWidth * mouthHeight;
  
  // Expected mouth area ratio for normal face
  const expectedMouthArea = 0.018;
  
  // FURTHER IMPROVED covered mouth detection with additional indicators
  // This directly addresses the anxious detection issue
  const chinVisibility = positions[8].y / faceBox.height;
  const normalChinVisibility = 0.9;
  const chinOcclusion = chinVisibility < normalChinVisibility - 0.05;
  
  // Check for lower lip visibility
  const lowerLipVisibility = Math.abs(positions[57].y - positions[8].y) / faceHeight;
  const expectedLowerLipToChainDistance = 0.15;
  const lowerLipOcclusion = lowerLipVisibility < expectedLowerLipToChainDistance * 0.6;
  
  // Upper face to lower face ratio (often changes when hand covers mouth)
  const upperFaceHeight = (positions[27].y - positions[0].y) / faceHeight;
  const lowerFaceHeight = (positions[8].y - positions[27].y) / faceHeight;
  const upperToLowerRatio = upperFaceHeight / Math.max(0.001, lowerFaceHeight);
  const abnormalFaceRatio = upperToLowerRatio > 1.2 || upperToLowerRatio < 0.7;
  
  // Check for mouth width-to-height ratio abnormalities
  const abnormalMouthRatio = mouthWidth > 0 && mouthHeight > 0 && (mouthWidth / mouthHeight > 8 || mouthHeight / mouthWidth > 3);
  
  // Check if nose and mouth areas have unusual relationship
  const noseToMouthAreaRatio = noseLipDistance / Math.max(0.001, mouthArea);
  const abnormalNoseMouthRelationship = noseToMouthAreaRatio > 6 || noseToMouthAreaRatio < 0.5;
  
  // EXTREME sensitivity for mouth covering detection
  const isMouthCovered = 
    (mouthArea < expectedMouthArea * 0.6) || // Even lower threshold
    (mouthHeight < 0.012 && noseLipDistance < 0.027) || // Even looser thresholds
    (mouthHeight < 0.01 && mouthWidth > 0.13) || // Very narrow mouth opening threshold
    (jawTension < 0.025 && mouthHeight < 0.015) || // Looser tense jaw threshold
    (mouthHeight > 0 && mouthWidth / mouthHeight > 8) || // Lower aspect ratio threshold
    chinOcclusion || // Check for chin occlusion
    lowerLipOcclusion || // Check for lower lip occlusion
    abnormalFaceRatio || // Check for abnormal face ratio
    abnormalMouthRatio || // Check for abnormal mouth ratio
    abnormalNoseMouthRelationship; // Check for unusual nose-mouth relationship
  
  return {
    mouthOpenRatio,
    mouthCornerHeight,
    noseLipDistance,
    mouthAsymmetry,
    mouthWidth,
    mouthHeight,
    mouthAspectRatio,
    jawTension,
    partialMouthOpening,
    headTilt,
    asymmetryRatio,
    mouthArea,
    isMouthCovered
  };
}
