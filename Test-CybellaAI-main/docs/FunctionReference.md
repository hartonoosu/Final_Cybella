
# Function Reference Guide

This document provides quick reference for all major functions in the application.

## Webcam and Face Detection Functions

### `initializeWebcam()`
**Location**: `src/hooks/facial-recognition/useWebcamSetup.ts`
**Description**: Requests camera access and sets up video stream, handling permissions and errors.

### `stopWebcam()`
**Location**: `src/hooks/facial-recognition/useWebcamSetup.ts`
**Description**: Stops all camera tracks and cleans up resources to prevent memory leaks.

### `loadModels()`
**Location**: `src/hooks/facial-recognition/useFaceDetection.ts`
**Description**: Asynchronously loads face detection and expression models from CDN.

### `detectEmotion()`
**Location**: `src/hooks/facial-recognition/useEmotionDetection.ts`
**Description**: Analyzes video frames to detect faces and classify emotional expressions.

## UI and Component Functions

### `handleEmotionDetected()`
**Location**: `src/components/FacialRecognition.tsx`
**Description**: Processes detected emotions and updates both local and global emotion state.

### `handleRequestCameraAccess()`
**Location**: `src/components/FacialRecognition.tsx`
**Description**: Sets camera request flag and initiates permission request after user interaction.

### `startCamera()`
**Location**: `src/components/facial-recognition/FacialRecognitionCard.tsx`
**Description**: Directly accesses camera API and attaches stream to video element.

## Voice Processing Functions

### `startListening()`
**Location**: `src/hooks/useVoiceProcessing.ts`
**Description**: Activates browser's speech recognition API to begin converting speech to text.

### `processUserInput()`
**Location**: `src/hooks/useVoiceProcessing.ts`
**Description**: Takes transcribed text, analyzes emotion, and sends to AI for response generation.

### `generateAIResponse()`
**Location**: `src/hooks/useVoiceProcessing.ts`
**Description**: Creates contextual therapeutic responses based on user's transcribed speech.

## Speech Synthesis Functions

### `handlePlay()`
**Location**: `src/hooks/useSpeechSynthesis.ts`
**Description**: Converts AI text response to spoken audio using browser's speech synthesis.

### `toggleMute()`
**Location**: `src/hooks/useSpeechSynthesis.ts`
**Description**: Enables or disables audio output for AI responses.
