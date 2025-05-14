
# Advanced Emotions Detection Guide

## Expanded Emotion Set

The facial recognition system now detects an expanded set of emotions:

### Basic Emotions
- Happy - Detected through smiles, raised cheeks
- Sad - Detected through lowered mouth corners, drooping eyelids
- Neutral - Detected through balanced facial features
- Angry - Detected through lowered brows, compressed lips
- Surprised - Detected through raised eyebrows, widened eyes, open mouth
- Fearful - Detected through raised eyebrows, widened eyes, tensed lower face

### Advanced Emotions
- Stressed - Detected through a combination of fear and anger markers
- Anxious - Detected through a combination of fear and surprise markers
- Depressed - Detected through prolonged sadness with specific facial features

### Newly Added Emotions
- Disgusted - Detected through nose wrinkling, raised upper lip
- Contempt - Detected through asymmetrical mouth/smirk, one-sided expressions
- Confused - Detected through furrowed brow, slightly open mouth, head tilt indicators

## Testing Specific Emotions

### How to Express Anxiety for Testing
- Widen your eyes slightly
- Raise your eyebrows
- Create light tension around your mouth
- Rapid eye movements or darting eyes
- Slightly parted lips

### How to Express Stress for Testing
- Tighten your jaw muscles
- Compress your lips horizontally (make them thinner)
- Lower your eyebrows slightly
- Create tension in your facial muscles
- Keep your eyes at normal openness (not too wide)

### How to Express Confusion for Testing
- Raise one eyebrow higher than the other (asymmetrical)
- Furrow your brow slightly
- Open your mouth slightly
- Tilt your head slightly to one side
- Look directly at the camera with a puzzled expression

## Accuracy Improvements

The system now uses several techniques to improve detection accuracy:

1. **Facial Landmark Analysis** - Using 68 facial landmarks to precisely measure facial features
2. **Multi-pass Processing** - Running several analysis passes with increasing specificity
3. **Emotion Stabilization** - Using temporal stability to prevent emotion flickering
4. **Confidence Thresholds** - Using dynamic confidence thresholds based on emotion type
5. **Advanced Model Selection** - Using the most accurate available model for the detection

## Live Testing Tips

1. **Lighting Matters**: Ensure even lighting on your face, avoiding harsh shadows
2. **Face Position**: Position your face to fill about 60-70% of the camera frame
3. **Expression Intensity**: Start with exaggerated expressions, then reduce intensity
4. **Hold Expressions**: Hold expressions for 2-3 seconds during testing
5. **Progressive Testing**: Test one emotion at a time in isolation
6. **Emotion Blending**: For complex emotions like anxiety, try blending basic emotions:
   - Anxious = slight fear + slight surprise
   - Stressed = slight anger + slight fear + tension
   - Confused = raised eyebrow + slight surprise + neutral mouth

## Best Practices for Live Testing

1. **Enable Detection Visuals**: Toggle on "Show Detection Visuals" to see how the system tracks your face
2. **Check Confidence Values**: Higher confidence (>70%) indicates better detection
3. **Adjust Your Distance**: Find the optimal distance from your camera (typically 2-3 feet)
4. **Minimize Distractions**: Use a plain background when testing
5. **Test Against Baseline**: Start with easy emotions (happy, sad) to confirm system is working
6. **Check Framerate**: If detection seems slow, reduce browser workload by closing tabs

## Sample Code for Accessing Specific Emotions

```tsx
import { Emotion } from '@/components/EmotionDisplay';
import { FacialRecognition } from '@/components/FacialRecognition';

function MyComponent() {
  const handleEmotionDetected = (emotion: Emotion, confidence: number) => {
    // Check for specific emotions
    if (emotion === 'anxious' && confidence > 0.7) {
      console.log('High confidence anxiety detected');
    } else if (emotion === 'stressed') {
      console.log('Stress detected with confidence:', confidence);
    } else if (emotion === 'confused') {
      console.log('Confusion detected with confidence:', confidence);
    }
  };

  return (
    <FacialRecognition
      onEmotionDetected={handleEmotionDetected}
      isActive={true}
      showDetectionVisuals={true} // Set to true to see detection overlay
    />
  );
}
```

## Troubleshooting Detection Issues

If specific emotions aren't being detected:

1. **Anxious Detection Issues**:
   - Try widening your eyes more noticeably
   - Raise your eyebrows slightly higher
   - Add some small eye movements
   - Ensure good lighting shows your eye details

2. **Stressed Detection Issues**:
   - Focus on creating visible tension in your jaw
   - Press your lips together more firmly
   - Add slight furrowing of your brow
   - Combine with slightly narrowed eyes

3. **Confused Detection Issues**:
   - Exaggerate the eyebrow asymmetry (one raised, one neutral)
   - Tilt your head more visibly to one side
   - Open your mouth slightly with a visible gap
   - Try looking slightly upward while maintaining the expression
