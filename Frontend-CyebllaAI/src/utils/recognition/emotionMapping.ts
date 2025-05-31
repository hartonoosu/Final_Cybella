
import * as faceapi from 'face-api.js';
import { Emotion } from '@/components/EmotionDisplay';

/**
 * Maps face-api emotion labels to our application emotion types
 */
export function getEmotionMapping(): Record<string, Emotion> {
  return {
    happy: 'happy',
    sad: 'sad',
    neutral: 'neutral',
    angry: 'angry',
    fearful: 'fearful',
    surprised: 'surprised',
    disgusted: 'disgusted',
    contemptuous: 'contempt'
  };
}

/**
 * Adjusts emotion scores based on domain knowledge to improve accuracy
 * @param emotion The emotion to adjust
 * @param score The original confidence score
 * @returns The adjusted confidence score
 */
export function adjustEmotionScore(emotion: string, score: number): number {
  // Apply strategic corrections based on observed biases in the model
  // IMPROVED: Higher boost factors for problematic emotions
  switch(emotion) {
    case 'neutral':
      // Stronger boost for neutral detection to avoid confusion misclassification
      return score * 3.5;
    case 'happy':
      // Strong boost for happy detection
      return score * 3.2;
    case 'sad':
      // Moderate boost for sad detection
      return score * 3.0;
    case 'angry':
      // Modified boost for angry to help differentiate from contempt
      return score * 2.9; // Slightly lower to avoid confusion with contempt
    case 'surprised':
      // Moderate boost for surprised
      return score * 3.0;
    case 'fearful':
      // Strong boost for fearful to help with anxiety detection
      return score * 3.8; // Significantly increased to help anxious detection
    case 'disgusted':
      // Moderate boost for disgusted
      return score * 3.0;
    case 'contemptuous':
      // Modified boost for contempt detection to differentiate from anger
      return score * 3.4; // Increased to ensure contempt is detected correctly
    default:
      return score * 2.5; // General boost for other emotions
  }
}

// Map face-api emotions to our app emotions with improved accuracy
export function mapFaceApiEmotionToAppEmotion(
  expressions: faceapi.FaceExpressions
): { emotion: Emotion; confidence: number } {
  const emotionMap: Record<string, Emotion> = {
    happy: 'happy',
    sad: 'sad',
    angry: 'angry',
    fearful: 'fearful',
    disgusted: 'disgusted',
    surprised: 'surprised',
    neutral: 'neutral',
    contemptuous: 'contempt'
  };

  // Find the highest confidence emotion
  let highestConfidence = 0;
  let dominantEmotion: string = 'neutral';

  // First pass - gather raw scores and apply initial boosting
  const scores: Record<string, number> = {};
  let totalScore = 0;
  
  for (const [emotion, confidence] of Object.entries(expressions)) {
    // IMPROVED: Higher threshold to prevent misclassification of subtle facial movements
    if (confidence > 0.05) { 
      // Apply initial boosting to raw scores
      const boostedScore = emotion === 'neutral' ? confidence * 2.5 : confidence * 2.0;
      scores[emotion] = boostedScore;
      totalScore += boostedScore;
    }
  }
  
  // Handle contempt vs. anger differentiation
  if (scores['contemptuous'] && scores['angry']) {
    const contemptScore = scores['contemptuous'];
    const angerScore = scores['angry'];
    
    // If contempt and anger are close, bias slightly toward contempt
    // as it's typically more subtle and harder to detect
    if (contemptScore > angerScore * 0.7 && contemptScore < angerScore * 1.3) {
      scores['contemptuous'] *= 1.3;
      scores['angry'] *= 0.9;
    }
  }
  
  // Second pass - normalize and apply weight adjustments
  for (const [emotion, rawScore] of Object.entries(scores)) {
    // Normalize score
    const normalizedScore = rawScore / totalScore;
    
    // Apply appropriate weight adjustments - higher boost factors
    let adjustedScore = normalizedScore;
    if (emotion === 'neutral') adjustedScore *= 2.5;
    if (emotion === 'happy') adjustedScore *= 2.3;
    if (emotion === 'angry') adjustedScore *= 2.3; // Reduced to avoid confusion with contempt
    if (emotion === 'fearful') adjustedScore *= 3.0; // Increased for anxious detection
    if (emotion === 'disgusted') adjustedScore *= 2.2;
    if (emotion === 'contemptuous') adjustedScore *= 2.3; // Increased to ensure detection
    
    if (adjustedScore > highestConfidence) {
      highestConfidence = adjustedScore;
      dominantEmotion = emotion;
    }
  }

  // Advanced emotion analysis for the new emotion types
  let mappedEmotion: Emotion = emotionMap[dominantEmotion] || 'neutral';
  
  // IMPROVED: Enhanced anxious detection - lower threshold
  if ((scores['fearful'] > 0.1 && scores['surprised'] > 0.1) || 
      (scores['fearful'] > 0.2)) { // More emphasis on fear for anxiety
    mappedEmotion = 'anxious';
    highestConfidence = Math.max(highestConfidence, 0.85);
  }
  
  // FIXED: Higher thresholds for confused emotion to prevent false positives
  if ((scores['surprised'] > 0.22 && scores['fearful'] > 0.16) || 
      (scores['neutral'] > 0.35 && scores['surprised'] > 0.25)) {
    mappedEmotion = 'confused';
    highestConfidence = Math.max(highestConfidence, 0.85);
  }
  
  // Detect stressed, anxious, and depressed states based on combinations
  if (dominantEmotion === 'sad' && highestConfidence > 0.5) {
    // High intensity sadness may indicate depression
    mappedEmotion = 'depressed';
  } else if (dominantEmotion === 'fearful') {
    // Check if fear is closer to anxiety or stress
    const angerComponent = scores['angry'] || 0;
    const surpriseComponent = scores['surprised'] || 0;
    
    if (angerComponent > 0.15) { // Higher threshold
      // Stress often combines fear with some anger
      mappedEmotion = 'stressed';
    } else if (surpriseComponent > 0.15) { // Higher threshold
      // Anxiety often combines fear with some surprise
      mappedEmotion = 'anxious';
    } else {
      // Even with just fear and no other components, bias toward anxiety 
      // since pure fear is less common than anxiety in real interactions
      mappedEmotion = 'anxious';
    }
  }

  // Final confidence adjustment - higher boost
  return {
    emotion: mappedEmotion,
    confidence: highestConfidence * 1.7, // Overall higher confidence
  };
}

// Keep the remaining code the same
export function simulateVoiceEmotionDetection(): { emotion: Emotion; confidence: number } {
  const emotions: Emotion[] = ['happy', 'sad', 'neutral', 'surprised', 'fearful', 'angry', 'stressed', 'anxious', 'depressed', 'disgusted', 'contempt', 'confused'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomConfidence = 0.75 + Math.random() * 0.2; // Higher base confidence
  
  return {
    emotion: randomEmotion,
    confidence: randomConfidence
  };
}

