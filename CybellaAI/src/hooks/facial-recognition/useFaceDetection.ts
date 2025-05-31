
import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export function useFaceDetection() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  
  useEffect(() => {
    async function loadModels() {
      try {
        console.log("Loading face detection models...");
        // Use a public CDN instead of local path
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        
        console.log("Face detection models loaded successfully");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Failed to load face detection models:", error);
        setModelsLoaded(false);
      }
    }
    
    loadModels();
  }, []);
  
  return { modelsLoaded };
}
