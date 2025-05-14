
import * as faceapi from 'face-api.js';

// Load face detection models
export async function loadFaceDetectionModels() {
  try {
    // Use a more reliable public CDN for models
    const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
    
    console.log("Beginning to load face detection models...");
    
    // Force models to load in parallel for faster loading
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
    ]);
    
    console.log("All models requested to load");
    
    // Verify models are actually loaded
    const modelStatus = getLoadedModelsStatus();
    console.log("Model load status:", modelStatus);
    
    // Critical models check with more detailed logging
    if (!modelStatus.tinyFaceDetector || !modelStatus.faceExpressionNet || !modelStatus.faceLandmark68Net) {
      console.error("Critical models failed to load! Status:", modelStatus);
      
      // Attempt to re-load critical models if they failed
      if (!modelStatus.tinyFaceDetector) {
        console.log("Retrying tinyFaceDetector model load...");
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      }
      
      if (!modelStatus.faceExpressionNet) {
        console.log("Retrying faceExpressionNet model load...");
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      }
      
      if (!modelStatus.faceLandmark68Net) {
        console.log("Retrying faceLandmark68Net model load...");
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      }
      
      // Check again after retry
      const retryStatus = getLoadedModelsStatus();
      console.log("Model status after retry:", retryStatus);
      
      if (!retryStatus.tinyFaceDetector || !retryStatus.faceExpressionNet || !retryStatus.faceLandmark68Net) {
        console.error("Critical models still failed to load after retry!");
        return false;
      }
    }
    
    console.log("All facial recognition models loaded successfully!");
    return true;
  } catch (error) {
    console.error('Error loading face detection models:', error);
    return false;
  }
}

// Function to show which models are loaded and their status
export function getLoadedModelsStatus() {
  return {
    tinyFaceDetector: faceapi.nets.tinyFaceDetector.isLoaded,
    faceExpressionNet: faceapi.nets.faceExpressionNet.isLoaded,
    faceLandmark68Net: faceapi.nets.faceLandmark68Net.isLoaded,
    faceRecognitionNet: faceapi.nets.faceRecognitionNet.isLoaded,
    ssdMobilenetv1: faceapi.nets.ssdMobilenetv1.isLoaded
  };
}

// Custom descriptors for specific emotions
export function getCustomEmotionDescriptors() {
  return {
    // Provide specific facial feature combinations for each emotion
    // These values help guide the detection algorithm
    contempt: {
      asymmetryThreshold: 0.025,
      mouthCornerRaiseThreshold: 0.02,
      eyebrowLowerThreshold: 0.01
    },
    disgusted: {
      noseWrinkleThreshold: 0.015,
      mouthCurveThreshold: 0.02,
      upperLipRaiseThreshold: 0.018
    },
    confused: {
      eyebrowRaiseThreshold: 0.02,
      mouthSlightOpenThreshold: 0.01,
      eyeSquintThreshold: 0.015
    }
  };
}
