import React from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

export type Emotion = 'happy' | 'sad' | 'neutral' | 'angry' | 'surprised' | 'fearful' | 'stressed' | 'anxious' | 'depressed' | 'disgusted' | 'contempt' | 'confused' | 'calm' | 'disgust' | "too short" | "too soft" | "too noisy";

interface EmotionDisplayProps {
  faceEmotion?: Emotion | null;
  voiceEmotion?: Emotion | null;
  confidence?: {
    face?: number;
    voice?: number;
  };
  isLoading?: boolean;
  topEmotions?: { emotion: Emotion; confidence: number }[];
}

const emotionColors = {
  happy: 'bg-therapeutic-calm',
  sad: 'bg-therapeutic-tranquil',
  neutral: 'bg-therapeutic-serene',
  angry: 'bg-red-400',
  surprised: 'bg-therapeutic-relaxed',
  fearful: 'bg-therapeutic-peaceful',
  stressed: 'bg-amber-500',
  anxious: 'bg-purple-400',
  depressed: 'bg-indigo-600',
  disgusted: 'bg-green-600',
  contempt: 'bg-amber-700',
  confused: 'bg-blue-400',
  disgust: "bg-green-400",
  calm: "bg-blue-300",
  "too short": "bg-yellow-300",
  "too soft": "bg-orange-300",
  "too noisy": "bg-gray-400",
};

const emotionEmojis = {
  happy: '😊',
  sad: '😔',
  neutral: '😐',
  angry: '😠',
  surprised: '😮',
  fearful: '😨',
  stressed: '😫',
  anxious: '😰',
  depressed: '😞',
  disgusted: '🤢',
  calm: '🙂',
  disgust: '🤢',
  contempt: '😏',
  confused: '😕',
  "too short": "🛑",
  "too soft": "🔈",
  "too noisy": "🔊",
};

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ 
  faceEmotion, 
  voiceEmotion,
  confidence = { face: 0, voice: 0 },
  isLoading,
  topEmotions
}) => {  
  const isMobile = useIsMobile();

  return (
    <Card className="p-2 md:p-4 shadow-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
      <h3 className="text-sm md:text-lg font-medium mb-1 md:mb-2">Current Emotional State</h3>
      
      <div className="grid grid-cols-2 gap-1 md:gap-4">
        <div className="flex items-center space-x-1 md:space-x-3 p-1 md:p-3 rounded-lg bg-gradient-to-br from-white/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80">
          <div className={`w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center ${faceEmotion && emotionColors[faceEmotion] || 'bg-gray-200'}`}>
            <span className="text-base md:text-xl" role="img" aria-label={faceEmotion || 'unknown'}>
              {faceEmotion ? emotionEmojis[faceEmotion] : '❓'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium">Facial Expression</p>
            <div className="flex justify-between items-center">
              <span className="capitalize text-xs md:text-sm truncate mr-1">{faceEmotion || 'Processing...'}</span>
              {confidence.face !== undefined && faceEmotion && (
                <span className="text-2xs md:text-xs font-semibold px-1.5 py-0.5 bg-primary/20 rounded-full whitespace-nowrap">
                  {Math.round(confidence.face * 100)}%
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-3 p-1 md:p-3 rounded-lg bg-gradient-to-br from-white/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80">
          <div
            className={`w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
              voiceEmotion && emotionColors[voiceEmotion] || 'bg-gray-200'
            }`}
          >
            <span className="text-base md:text-xl" role="img" aria-label={voiceEmotion || 'unknown'}>
              {voiceEmotion ? emotionEmojis[voiceEmotion] : '❓'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium">Voice Tone</p>
            <div className="flex justify-between items-center">
              <span className="capitalize text-xs md:text-sm truncate mr-1">
                {isLoading ? "Predicting..." : voiceEmotion}
              </span>
              {!isLoading && confidence.voice !== undefined && (
                <span className="text-2xs md:text-xs font-semibold px-1.5 py-0.5 bg-primary/20 rounded-full whitespace-nowrap">
                  {Math.round(confidence.voice * 100)}%
                </span>
              )}
            </div>
          </div>
        </div>
       </div>
       {/*uncomment this to display top 3 voice emotion detection */}
        
       {topEmotions && topEmotions.length > 0 && !isLoading && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-1">Top Predictions:</p>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {topEmotions.map((e, i) => (
              <li key={i}>
                {emotionEmojis[e.emotion]} {e.emotion}: {(e.confidence * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default EmotionDisplay;
