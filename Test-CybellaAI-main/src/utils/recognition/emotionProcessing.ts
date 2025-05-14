import * as faceapi from 'face-api.js';
import { Emotion } from '@/components/EmotionDisplay';
import { getEmotionMapping, adjustEmotionScore } from '@/utils/recognition/emotionMapping';
import { analyzeFacialLandmarks, analyzeAdvancedEmotions } from '@/utils/recognition/facial-landmarks';
import { mouthAnalysis } from '@/utils/recognition/facial-landmarks/mouthAnalysis';
import { eyebrowAnalysis } from '@/utils/recognition/facial-landmarks/eyebrowAnalysis';
import { eyeAnalysis } from '@/utils/recognition/facial-landmarks/eyeAnalysis';

/**
 * Processes the detected facial expressions to determine the most likely emotion
 * Using improved analysis techniques with better accuracy
 */
export function processEmotions(
  detections: faceapi.WithFaceLandmarks<
    { detection: faceapi.FaceDetection; expressions: faceapi.FaceExpressions },
    faceapi.FaceLandmarks68
  >[]
): { emotion: Emotion; confidence: number } | null {
  if (!detections || detections.length === 0) {
    return null;
  }

  const emotionMapping = getEmotionMapping();
  let bestEmotion: Emotion = 'neutral';
  let highestScore = 0.3;

  for (const detection of detections) {
    if (!detection.expressions) {
      console.log("No expressions detected in this face");
      continue;
    }

    const expressions = detection.expressions;
    const emotionScores: Record<string, number> = {};
    let totalScore = 0;

    for (const [emotion, score] of Object.entries(expressions)) {
      if (score > 0.08) {
        emotionScores[emotion] = score;
        totalScore += score;
      }
    }

    if (totalScore === 0) continue;

    const contemptScore = emotionScores['contemptuous'] || 0;
    const angerScore = emotionScores['angry'] || 0;

    if (contemptScore > 0.15 && angerScore > 0.15) {
      try {
        const mouth = mouthAnalysis(detection.landmarks.positions, detection.detection.box);
        if (mouth && mouth.mouthAsymmetry > 0.02) {
          emotionScores['contemptuous'] = contemptScore * 1.8;
        } else {
          emotionScores['angry'] = angerScore * 1.6;
        }
        totalScore = Object.values(emotionScores).reduce((sum, score) => sum + score, 0);
      } catch (error) {
        console.error("Error in contempt/anger disambiguation:", error);
      }
    }

    for (const [emotion, score] of Object.entries(emotionScores)) {
      const normalizedScore = score / totalScore;
      let adjustedScore = adjustEmotionScore(emotion, normalizedScore) * 1.7;

      try {
        const landmarkModifier = analyzeFacialLandmarks(detection, emotion);
        adjustedScore *= landmarkModifier * 1.3;
        if (['happy', 'sad', 'angry', 'disgusted', 'surprised'].includes(emotion)) {
          adjustedScore *= 1.5;
        }
      } catch (error) {
        console.error("Error in landmark analysis:", error);
      }

      if (adjustedScore > highestScore) {
        highestScore = adjustedScore;
        bestEmotion = emotion in emotionMapping
          ? emotionMapping[emotion as keyof typeof emotionMapping]
          : 'neutral';

        try {
          const advanced = analyzeAdvancedEmotions(detection, emotion, adjustedScore);
          if (
            advanced.emotion !== (emotion as Emotion) &&
            advanced.adjustedScore > adjustedScore * 1.2
          ) {
            bestEmotion = advanced.emotion;
            highestScore = advanced.adjustedScore;
          }
        } catch (error) {
          console.error("Error in advanced emotion analysis:", error);
        }
      }
    }

    const surprisedScore = emotionScores['surprised'] || 0;
    const neutralScore = emotionScores['neutral'] || 0;
    const fearfulScore = emotionScores['fearful'] || 0;

    if (surprisedScore > 0.18 && neutralScore > 0.2 && fearfulScore > 0.12) {
      try {
        const eyebrows = eyebrowAnalysis(detection.landmarks.positions, detection.detection.box);
        if (eyebrows.browAsymmetry > 0.04) {
          const confusedScore = (surprisedScore * 0.5 + neutralScore * 0.3 + fearfulScore * 0.2) * 2.5;
          if (confusedScore > highestScore) {
            bestEmotion = 'confused';
            highestScore = confusedScore;
          }
        }
      } catch (error) {
        console.error("Error analyzing eyebrows for confusion:", error);
        const confusedScore = (surprisedScore * 0.4 + neutralScore * 0.3 + fearfulScore * 0.3) * 2.0;
        if (confusedScore > highestScore) {
          bestEmotion = 'confused';
          highestScore = confusedScore;
        }
      }
    }

    const sadScore = emotionScores['sad'] || 0;

    if (angerScore > 0.15 && fearfulScore > 0.15 && sadScore > 0.1) {
      try {
        const mouth = mouthAnalysis(detection.landmarks.positions, detection.detection.box);
        if (mouth && mouth.jawTension < 0.035) {
          const stressedScore = (angerScore * 0.5 + fearfulScore * 0.3 + sadScore * 0.2) * 2.2;
          if (stressedScore > highestScore) {
            bestEmotion = 'stressed';
            highestScore = stressedScore;
          }
        }
      } catch (error) {
        console.error("Error in mouth analysis for stress:", error);
        const stressedScore = (angerScore * 0.4 + fearfulScore * 0.3 + sadScore * 0.3) * 2.0;
        if (stressedScore > highestScore) {
          bestEmotion = 'stressed';
          highestScore = stressedScore;
        }
      }
    }

    try {
      const eyes = eyeAnalysis(detection.landmarks.positions, detection.detection.box);
      if (eyes && eyes.eyeOpenness > 0.07 &&
          (eyes.leftEyeDeviation > 0.1 || eyes.rightEyeDeviation > 0.1)) {
        const anxiousScore = ((fearfulScore || 0) * 0.7 + (surprisedScore || 0) * 0.3) * 3.0;
        if (anxiousScore > highestScore) {
          bestEmotion = 'anxious';
          highestScore = anxiousScore;
        }
      } else if (fearfulScore > 0.18) {
        const mouth = mouthAnalysis(detection.landmarks.positions, detection.detection.box);
        if (mouth && mouth.mouthTension > 0.02) {
          const anxiousScore = fearfulScore * 2.8;
          if (anxiousScore > highestScore) {
            bestEmotion = 'anxious';
            highestScore = anxiousScore;
          }
        }
      }
    } catch (error) {
      console.error("Error in eye/mouth analysis for anxiety:", error);
      if (fearfulScore > 0.2 || (fearfulScore > 0.15 && surprisedScore > 0.15)) {
        const fallbackScore = (fearfulScore * 0.7 + (surprisedScore || 0) * 0.3) * 2.2;
        if (fallbackScore > highestScore) {
          bestEmotion = 'anxious';
          highestScore = fallbackScore;
        }
      }
    }
  }

  return {
    emotion: bestEmotion,
    confidence: Math.min(0.98, highestScore * 1.5)
  };
}

