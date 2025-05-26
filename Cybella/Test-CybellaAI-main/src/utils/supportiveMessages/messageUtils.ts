
import { Emotion } from '@/components/EmotionDisplay';
import { UserPreferences } from '@/contexts/UserPreferencesContext';

/**
 * Enhances a supportive message with personalized suggestions based on user preferences
 */
export function enhanceMessageWithPreferences(
  baseMessage: string, 
  currentEmotion: Emotion, 
  preferences: UserPreferences
): string {
  const hasPreferences = Object.values(preferences).some(arr => arr.length > 0);
  if (!hasPreferences) {
    return baseMessage;
  }
  
  const suggestions = [];
  
  if (preferences.hobbies.length > 0) {
    const hobby = preferences.hobbies[Math.floor(Math.random() * preferences.hobbies.length)];
    suggestions.push(`Why not spend some time ${hobby}? You mentioned enjoying that.`);
  }
  
  if (preferences.favoritePlaces.length > 0) {
    const place = preferences.favoritePlaces[Math.floor(Math.random() * preferences.favoritePlaces.length)];
    suggestions.push(`How about visiting ${place}? That place always seemed special to you.`);
  }
  
  if (preferences.favoriteGames.length > 0) {
    const game = preferences.favoriteGames[Math.floor(Math.random() * preferences.favoriteGames.length)];
    suggestions.push(`Maybe playing ${game} could help you feel better? You mentioned enjoying that game.`);
  }
  
  if (preferences.bestFriends.length > 0) {
    const friend = preferences.bestFriends[Math.floor(Math.random() * preferences.bestFriends.length)];
    suggestions.push(`Have you thought about reaching out to ${friend}? A chat might lift your spirits.`);
  }
  
  if (preferences.favoriteFood.length > 0) {
    const food = preferences.favoriteFood[Math.floor(Math.random() * preferences.favoriteFood.length)];
    suggestions.push(`How about treating yourself to some ${food}? You mentioned it's one of your favorites.`);
  }
  
  if (suggestions.length > 0) {
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    return `${baseMessage} ${suggestion}`;
  }
  
  return baseMessage;
}
