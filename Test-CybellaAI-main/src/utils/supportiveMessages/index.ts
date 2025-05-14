
import { Emotion } from '@/components/EmotionDisplay';
import { englishMessages } from './englishMessages';
import { enhanceMessageWithPreferences } from './messageUtils';

export function useSupportiveMessages() {
  const getRandomMessageForEmotion = (emotion: Emotion): string => {
    const messages = englishMessages[emotion];
    
    // Check if messages array exists and has items
    if (!messages || messages.length === 0) {
      return `I notice your emotional state appears to be ${emotion}.`;
    }
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return {
    getRandomMessageForEmotion,
    enhanceMessageWithPreferences
  };
}

// Re-export for compatibility with existing code
export { enhanceMessageWithPreferences } from './messageUtils';
