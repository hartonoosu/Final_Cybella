
// Browser's built-in speech synthesis API utility

// Available voices may vary by browser
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
};

// Initialize voices - sometimes needs to be called to populate the voices array
export const initVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    // If voices are already available, return them
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Otherwise, wait for the voiceschanged event
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });
};

// Select a default voice - prioritize female English voices
export const getDefaultVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find a female English voice
  let defaultVoice = voices.find(
    (voice) => 
      voice.lang.includes('en') && 
      voice.name.toLowerCase().includes('female')
  );
  
  // If no female English voice, try any English voice
  if (!defaultVoice) {
    defaultVoice = voices.find((voice) => voice.lang.includes('en'));
  }
  
  // If no English voice, use the first available voice
  return defaultVoice || (voices.length > 0 ? voices[0] : null);
};

// Convert text to speech using browser's built-in API
export const speakText = async (text: string, volume: number = 1): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set the voice to the default voice
    const voice = getDefaultVoice();
    if (voice) {
      utterance.voice = voice;
    }
    
    // Set the rate, pitch, and volume
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = Math.max(0, Math.min(1, volume)); // Ensure volume is between 0 and 1
    
    // Resolve the promise when speech ends
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  });
};

// Check if speech synthesis is supported in this browser
export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};
