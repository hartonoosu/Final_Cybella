import { useState, useEffect, useRef, useCallback } from "react";
import { Emotion } from "@/components/EmotionDisplay";
import { toast } from "@/hooks/use-toast";
import { speechRecognition } from "@/utils/recognition";
import { useLanguage } from "@/contexts/LanguageContext";
import { recordVoice } from "../utils/voiceRecorder";
import { getRealVoiceEmotion } from "@/utils/emotionAPI";
import { useSpeechRecognition } from "@/hooks/voice/useSpeechRecognition";

// Import the global context that stores segment-wise emotion predictions
import { useVoiceEmotionContext } from "@/contexts/VoiceEmotionContext";

// Audio visualization hook
export function useAudioVisualization(isListening: boolean) {
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    let visualizerInterval: NodeJS.Timeout | null = null;

    if (isListening) {
      visualizerInterval = setInterval(() => {
        const data = speechRecognition.getAudioData();
        if (data) {
          setAudioData(data);
        }
      }, 100);
    } else {
      setAudioData(null);
    }

    return () => {
      if (visualizerInterval) {
        clearInterval(visualizerInterval);
      }
    };
  }, [isListening]);

  return audioData;
}

// AI Response Hook

export function useAIResponse() {
  const [aiResponse, setAiResponse] = useState<string>("");
  const [shouldPlayVoice, setShouldPlayVoice] = useState<boolean>(false);
  const [processingInput, setProcessingInput] = useState<boolean>(false);

  // Generate AI response based on user input
  const generateAIResponse = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;
    setProcessingInput(true);

    try {
      // Simple rule-based responses
      const lowercaseInput = userInput.toLowerCase();
      let response = "";

      if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
        response = "Hello there! How are you feeling today?";
      } else if (
        lowercaseInput.includes("sad") ||
        lowercaseInput.includes("depress")
      ) {
        response =
          "I'm sorry to hear you're feeling down. Remember that it's okay to experience these emotions. Would you like to talk more about what's making you feel this way?";
      } else if (
        lowercaseInput.includes("happy") ||
        lowercaseInput.includes("good")
      ) {
        response =
          "I'm glad to hear you're feeling positive! What's contributed to your good mood today?";
      } else if (
        lowercaseInput.includes("stress") ||
        lowercaseInput.includes("anxious") ||
        lowercaseInput.includes("worry")
      ) {
        response =
          "Stress and anxiety can be challenging. Taking deep breaths and focusing on the present moment might help. Would you like to try a brief relaxation exercise together?";
      } else if (
        lowercaseInput.includes("angry") ||
        lowercaseInput.includes("mad") ||
        lowercaseInput.includes("frustrat")
      ) {
        response =
          "I understand that feeling angry can be intense. It might help to identify what triggered this emotion. Would you like to explore this together?";
      } else if (lowercaseInput.includes("thank")) {
        response =
          "You're very welcome! I'm here to support you whenever you need someone to talk to.";
      } else if (
        lowercaseInput.includes("bye") ||
        lowercaseInput.includes("goodbye")
      ) {
        response =
          "It was nice talking with you. Remember to be kind to yourself. I'll be here when you need me again!";
      } else {
        response =
          "Thank you for sharing that with me. Would you like to tell me more about how that makes you feel?";
      }

      setAiResponse(response);
      setShouldPlayVoice(true);
      return response;
    } catch (error) {
      console.error("Error generating AI response:", error);
      setAiResponse(
        "I'm having trouble processing your request. Could you try again?"
      );
      setShouldPlayVoice(true);
    } finally {
      setProcessingInput(false);
    }
  }, []);

  return {
    aiResponse,
    shouldPlayVoice,
    processingInput,
    generateAIResponse,
    setAiResponse,
    setShouldPlayVoice,
  };
}

// Session management hook
export function useVoiceSession({
  onSessionStart,
  onSessionEnd,
}: {
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
}) {
  const [sessionActive, setSessionActive] = useState<boolean>(false);

  // Destructure the context function to set segment data globally
  const { setSegmentEmotions } = useVoiceEmotionContext();

  const startSession = () => {
    setSessionActive(true);

    if (onSessionStart) onSessionStart();

    toast({
      title: "Session started",
      description:
        "Your Cybella AI therapy session has begun. Click the microphone and speak when you're ready.",
    });

    return "Hello, I'm Cybella, your AI therapy assistant. I'm here to listen and help you with whatever you're going through. How are you feeling today?";
  };

  const endSession = () => {
    setSessionActive(false);
    speechRecognition.stop();

    toast({
      title: "Session ended",
      description:
        "Your Cybella AI therapy session has ended. Thank you for using our service.",
    });

    if (onSessionEnd) onSessionEnd();
  };

  const toggleSession = () => {
    if (sessionActive) {
      endSession();
      return null;
    } else {
      return startSession();
    }
  };

  return {
    sessionActive,
    toggleSession,
    startSession,
    endSession,
  };
}

// Main hook that combines all voice processing functionality
export function useVoiceProcessing({
  sessionActive,
  onVoiceEmotionDetected,
}: {
  sessionActive: boolean;
  onVoiceEmotionDetected?: (
    emotion: Emotion,
    confidence: number,
    top3?: { emotion: Emotion; confidence: number }[]
  ) => void;
}) {
  const [transcription, setTranscription] = useState<string>("");
  const [detectedEmotion, setDetectedEmotion] = useState<Emotion | null>(null);
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  const [isPredictingEmotion, setIsPredictingEmotion] = useState(false);
  const [topEmotions, setTopEmotions] = useState<
    { emotion: Emotion; confidence: number }[]
  >([]);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);

  const { setSegmentEmotions } = useVoiceEmotionContext();

  const {
    aiResponse,
    shouldPlayVoice,
    processingInput,
    generateAIResponse,
    setAiResponse,
    setShouldPlayVoice,
  } = useAIResponse();

  /**
   * Set Voice Emotion
   */
  const setVoiceEmotion = (emotion: Emotion, confidence: number) => {
    setDetectedEmotion(emotion);
    setEmotionConfidence(confidence);

    if (onVoiceEmotionDetected) {
      onVoiceEmotionDetected(emotion, confidence);
    }
  };

  /**
   * Detect Emotion from Voice
   */
  const detectVoiceEmotion = useCallback(
    async (blob: Blob) => {
      if (!sessionActive || !onVoiceEmotionDetected || isPredictingEmotion) {
        console.log("Emotion prediction already running — skipping");
        return;
      }

      if (blob.size < 10000) {
        const fallbackEmotion = "too short" as Emotion;
        console.warn("Recording too short — skipping prediction");

        onVoiceEmotionDetected(fallbackEmotion, 0);
        setDetectedEmotion(fallbackEmotion);
        setEmotionConfidence(0);
        await generateAIResponse(fallbackEmotion);
        return;
      }

      setIsPredictingEmotion(true);

      try {
        type EmotionAPIResult = {
          emotion: string;
          confidence: number;
          top3?: { emotion: Emotion; confidence: number }[];
        };

        const result = await getRealVoiceEmotion(blob) as EmotionAPIResult & { segments?: any[] };

        // Store segment-wise emotion results in global context so all pages can access
        if (result.segments) {
          setSegmentEmotions(result.segments);
          console.log(" Segment Emotions stored in context:", result.segments);
        }

        // Console log each segment to verify
        if ("segments" in result && Array.isArray(result.segments)) {
        console.log("Voice Emotion Segments (every 3s):");
        result.segments.forEach((seg, i) => {
          console.log(
            `Segment ${i + 1}: ${seg.start}s – ${seg.end}s → ${seg.emotion} (${seg.confidence})`
          );
        });
      }

        if (result.top3) {
          setTopEmotions(result.top3);
        } else {
          setTopEmotions([]);
        }

        if (
          result.emotion === "too_short" ||
          result.emotion === "too_soft" ||
          result.emotion === "too_noisy"
        ) {
          const fallbackEmotion = result.emotion.replace("_", " ") as Emotion;
          setTopEmotions([]);

          onVoiceEmotionDetected(fallbackEmotion, 0);
          setDetectedEmotion(fallbackEmotion);
          setEmotionConfidence(0);
          await generateAIResponse(fallbackEmotion);
          return;
        }

        onVoiceEmotionDetected(result.emotion as Emotion, result.confidence, result.top3);
        setDetectedEmotion(result.emotion as Emotion);
        setEmotionConfidence(result.confidence);

      } catch (err) {
        console.error("Emotion prediction failed:", err);
      } finally {
        setIsPredictingEmotion(false);
      }
    },
    [sessionActive, isPredictingEmotion, onVoiceEmotionDetected, generateAIResponse]
  );

  /**
   * Process User Input
   */
  const processUserInput = async (input: string) => {
    if (!input.trim()) return;
    setTranscription(input);
    setChatHistory((prev) => [...prev, { role: "user", text: input }]);

    const response = await generateAIResponse(input);
    if (response) {
      setChatHistory((prev) => [...prev, { role: "ai", text: response }]);
    }

    setTranscription("");
  };

  const speechRecognition = useSpeechRecognition({
    sessionActive,
    onTranscriptionComplete: processUserInput,
  }) as ReturnType<typeof useSpeechRecognition>;

  const audioData = useAudioVisualization(speechRecognition.isListening);

  return {
    isListening: speechRecognition.isListening,
    stopListening: speechRecognition.stopListening,
    transcription,
    interimTranscript: speechRecognition.interimTranscript,
    aiResponse,
    shouldPlayVoice,
    audioData,
    processingInput,
    sessionActive,
    speechRecognitionSupported: speechRecognition.speechRecognitionSupported,
    toggleListening: speechRecognition.toggleListening,
    setAiResponse,
    setShouldPlayVoice,
    chatHistory,
    setChatHistory,
    processUserInput,
    detectedEmotion,
    emotionConfidence,
    isPredictingEmotion,
    detectVoiceEmotion,
    generateAIResponse,
    topEmotions,
    setTranscription,
    setInterimTranscript: speechRecognition.setInterimTranscript,
    setVoiceEmotion,
  };
}
