
import React, { useState, useEffect } from 'react';
import { Emotion } from '@/components/EmotionDisplay';
import { useSupportiveMessages, enhanceMessageWithPreferences } from '@/utils/supportiveMessages';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Timer } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface EmotionSupportMessageProps {
  emotion: Emotion | null;
  confidence: number;
  highAccuracyMode?: boolean;
}

const EmotionSupportMessage: React.FC<EmotionSupportMessageProps> = ({
  emotion,
  confidence,
  highAccuracyMode = false
}) => {
  const [message, setMessage] = useState<string>('');
  const [displayMessage, setDisplayMessage] = useState<string>('');
  const [isMessageActive, setIsMessageActive] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { getRandomMessageForEmotion } = useSupportiveMessages();
  const { preferences } = useUserPreferences();
  
  const MESSAGE_DISPLAY_TIME = 120; // 2 minutes
  
  const confidenceThreshold = highAccuracyMode ? 0.65 : 0.7;
  
  useEffect(() => {
    if (!emotion || confidence < confidenceThreshold) {
      return;
    }
    
    let supportiveMessage = getRandomMessageForEmotion(emotion);
    
    if (['sad', 'angry', 'fearful', 'stressed', 'anxious', 'depressed'].includes(emotion)) {
      supportiveMessage = enhanceMessageWithPreferences(supportiveMessage, emotion, preferences);
    }
    
    setMessage(supportiveMessage);
  }, [emotion, confidence, preferences, confidenceThreshold, getRandomMessageForEmotion]);
  
  useEffect(() => {
    if (!message || isMessageActive) return;
    
    setDisplayMessage(message);
    setIsMessageActive(true);
    setTimeRemaining(MESSAGE_DISPLAY_TIME);
    
    const timer = setTimeout(() => {
      setIsMessageActive(false);
      setDisplayMessage('');
    }, MESSAGE_DISPLAY_TIME * 1000);
    
    return () => clearTimeout(timer);
  }, [message]);
  
  useEffect(() => {
    if (!isMessageActive || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isMessageActive, timeRemaining]);
  
  const alertStyles = {
    happy: "bg-therapeutic-calm/20 border-therapeutic-calm",
    neutral: "bg-therapeutic-serene/20 border-therapeutic-serene",
    sad: "bg-therapeutic-tranquil/20 border-therapeutic-tranquil",
    angry: "bg-red-400/20 border-red-400",
    fearful: "bg-therapeutic-peaceful/20 border-therapeutic-peaceful",
    surprised: "bg-therapeutic-relaxed/20 border-therapeutic-relaxed",
    stressed: "bg-amber-500/20 border-amber-500",
    anxious: "bg-purple-400/20 border-purple-400",
    depressed: "bg-indigo-600/20 border-indigo-600",
    disgusted: "bg-green-600/20 border-green-600",
    contempt: "bg-amber-700/20 border-amber-700",
    confused: "bg-blue-400/20 border-blue-400"
  };
  
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  if (!isMessageActive) {
    return null;
  }
  
  return (
    <Alert className={`mt-2 ${emotion ? alertStyles[emotion] : 'bg-gray-100/20 border-gray-300'}`}>
      <Heart className="h-4 w-4 mr-2" />
      <AlertDescription className="text-sm">
        {displayMessage}
        <div className="flex items-center mt-2 text-xs text-muted-foreground">
          <Timer className="h-3 w-3 mr-1" /> 
          {formatTimeRemaining()}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default EmotionSupportMessage;
