
# Troubleshooting Guide

This guide provides solutions for common issues with the facial recognition system.

## Camera Access Issues

If users are having trouble with camera access:

1. **HTTPS Required**: Ensure the site is using HTTPS (required for camera access)
2. **Browser Permissions**: Check browser permissions (camera may be blocked)
3. **Camera Usage**: Verify no other applications are using the camera
4. **Page Reload**: Try reloading the page after granting permissions

### Example Camera Permission Check

```tsx
useEffect(() => {
  if (error?.includes('permission')) {
    // Display helpful message about browser permissions
    console.log('Camera access denied. Please check browser permissions.');
    
    // Suggest browser-specific steps to fix permission issues
    if (navigator.userAgent.includes('Chrome')) {
      console.log('In Chrome: Click the camera icon in the address bar');
    } else if (navigator.userAgent.includes('Firefox')) {
      console.log('In Firefox: Click the camera icon in the address bar');
    }
  }
}, [error]);
```

## Performance Issues

If detection is slow or causing performance problems:

1. **Reduce Video Resolution**:
   ```tsx
   // In useWebcamSetup.ts
   const newStream = await navigator.mediaDevices.getUserMedia({
     video: {
       width: { ideal: 320 }, // Reduced from 640
       height: { ideal: 240 }, // Reduced from 480
       facingMode: 'user',
       frameRate: { ideal: 10 } // Reduced from 15
     }
   });
   ```

2. **Increase Detection Interval**:
   ```tsx
   // In useEmotionDetection.ts
   const PROCESS_INTERVAL_MS = 300; // Increased from 150
   ```

3. **Use TinyFaceDetector**:
   ```tsx
   // In useFaceExpressionDetection.ts
   const detectionOptions = new faceapi.TinyFaceDetectorOptions({
     inputSize: 224, // Reduced from 416
     scoreThreshold: 0.5 // Increased from 0.3
   });
   ```

## Model Loading Issues

If models fail to load:

1. **Check Network Connectivity**: Ensure there's a stable internet connection
2. **Verify CDN Access**: Make sure the CDN is accessible from the user's location
3. **Check Console Errors**: Look in the browser console for specific errors
4. **Alternative CDN**: Try using a different CDN or locally hosted models

```tsx
// Alternate CDN approach in faceDetection.ts
export async function loadFaceDetectionModels() {
  try {
    // Try primary CDN first
    const PRIMARY_CDN = 'https://justadudewhohacks.github.io/face-api.js/models';
    // Fallback to alternate CDN if primary fails
    const FALLBACK_CDN = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights';
    
    let modelUrl = PRIMARY_CDN;
    
    // Check if primary CDN is reachable
    try {
      const response = await fetch(`${PRIMARY_CDN}/tiny_face_detector_model-weights_manifest.json`);
      if (!response.ok) throw new Error('Primary CDN unavailable');
    } catch (e) {
      console.log('Switching to fallback CDN');
      modelUrl = FALLBACK_CDN;
    }
    
    // Load models from selected CDN
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
      faceapi.nets.faceExpressionNet.loadFromUri(modelUrl),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
    ]);
    
    return true;
  } catch (error) {
    console.error('Error loading face detection models:', error);
    return false;
  }
}
```

## Low Detection Accuracy

If emotion detection seems inaccurate:

1. **Lighting**: Ensure the user's face is well-lit from the front
2. **Face Position**: The face should be clearly visible and centered
3. **Camera Quality**: Higher quality cameras generally produce better results
4. **Distance**: User should be at an appropriate distance from the camera

## Specific Browser Issues

### Safari

On iOS Safari, you might need to handle specific permission issues:

```tsx
// Safari-specific handling
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari) {
  // Safari requires user interaction before camera access
  console.log('Safari requires a user interaction before camera access');
  
  // Use a button that directly calls getUserMedia
  return (
    <button 
      onClick={() => {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(() => {
            setCameraRequested(true);
            requestCameraAccess();
          })
          .catch(err => console.error('Safari camera error:', err));
      }}
    >
      Enable Camera (Safari)
    </button>
  );
}
```

### Firefox

Firefox may require additional permissions handling:

```tsx
// Firefox specific messaging
const isFirefox = navigator.userAgent.includes('Firefox');

if (isFirefox && error?.includes('permission')) {
  return (
    <div className="firefox-help">
      <p>Firefox requires you to:</p>
      <ol>
        <li>Click the camera icon in the address bar</li>
        <li>Select "Remember this decision"</li>
        <li>Click "Allow"</li>
      </ol>
    </div>
  );
}
```
