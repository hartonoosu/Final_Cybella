
// Central export file for hooks
export * from './use-mobile';
export * from './use-toast';
export * from './useSpeechSynthesis';
export * from './useFacialRecognition';
export * from './useVoiceProcessing';
export * from './useNetworkStatus';
// export * from './voice';
// Import useAIResponse only from its origin file to avoid duplicate exports
export { useAIResponse } from './useAIResponse';
