import axios from "axios"; 
import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import SessionControls from "./voice-interface/SessionControls";
import UserTranscription from "./voice-interface/UserTranscription";
import AIResponseDisplay from "./voice-interface/AIResponseDisplay";
import VoiceControls from "./voice-interface/VoiceControls";
import { useVoiceProcessing } from "@/hooks/useVoiceProcessing";
import { useVoiceSession } from "@/hooks/voice/useVoiceSession";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useConnectionStatus } from "@/hooks/facial-recognition/useConnectionStatus";
import { Emotion } from "@/components/EmotionDisplay";
import { useAuth } from "@/contexts/AuthContext";
import UserMessage from "./voice-interface/UserMessage";
import AIMessage from "./voice-interface/AIMessage";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

interface DetectedEmotion {
  emotion: Emotion;
  confidence: number;
}

interface VoiceInterfaceProps {
  onVoiceEmotionDetected?: (emotion: Emotion, confidence: number) => void;
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
  onVoiceLoadingChange?: (isLoading: boolean) => void;
  isOnline?: boolean;
  sessionActive?: boolean;
  voiceGender: "male" | "female";
  setVoiceGender: (gender: "male" | "female") => void;
}

const MAX_FRAMES = 15;
const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onVoiceEmotionDetected,
  onSessionStart,
  onSessionEnd,
  onVoiceLoadingChange,
  isOnline = true,
  sessionActive: externalSessionActive,
  voiceGender,
  setVoiceGender
}) => {
  const { user } = useAuth();
  const isControlledComponent = externalSessionActive !== undefined;
  const session = useVoiceSession({ onSessionStart, onSessionEnd });
  const actualSessionActive = isControlledComponent ? externalSessionActive : session.sessionActive;

  const voice = useVoiceProcessing({
    sessionActive: actualSessionActive,
    onVoiceEmotionDetected,
  });

  const isMobile = useIsMobile();
  const { connectionQuality } = useNetworkStatus();
  const { connectionIssue } = useConnectionStatus({
    externalConnectionIssue: !isOnline || connectionQuality === "poor",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [emotionFrames, setEmotionFrames] = useState<DetectedEmotion[]>([]);
  const [emotionSummary, setEmotionSummary] = useState<string>("");
  const [emotionData, setEmotionData] = useState<any[]>([]);

  /**
   * Scroll to Bottom
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Greeting Implementation
   */
  useEffect(() => {
    if (actualSessionActive) {
      const aiName = user?.aiName || "Cybella";
      const userName = user?.fullName || "there";
      const greeting = `Hi ${userName}! I'm ${aiName}. Thanks for creating me. I am very excited to assist you today.`;

      voice.setAiResponse(greeting);
      voice.setShouldPlayVoice(true);

      if (voice.chatHistory.length === 0) {
        voice.setChatHistory((prev) => [...prev, { role: "ai", text: greeting }]);
      }

    } else {
      voice.setAiResponse("");
      voice.setShouldPlayVoice(false);
      voice.setTranscription("");
      voice.setInterimTranscript("");
      
      if (voice.isListening && voice.stopListening) {
        voice.stopListening();
      }

      if (emotionFrames.length > 0) {
        calculateEmotionSummary();
      }
    }
  }, [actualSessionActive, voice, user, voiceGender]);

  /**
   * Store Emotion Frames (Up to 15 Frames)
   */
  const storeEmotionFrame = (emotion: Emotion, confidence: number) => {
    setEmotionFrames((prevFrames) => {
      const updatedFrames = [...prevFrames, { emotion, confidence }];

      if (updatedFrames.length > MAX_FRAMES) {
        updatedFrames.shift();
      }

      calculateEmotionSummary(updatedFrames);
      return updatedFrames;
    });
  };

  /**
   * Calculate Emotion Summary
   */
  const calculateEmotionSummary = (frames: DetectedEmotion[] = emotionFrames) => {
    const emotionCount: Record<Emotion, number> = {
      happy: 0,
      sad: 0,
      neutral: 0,
      angry: 0,
      fearful: 0,
      surprised: 0,
      stressed: 0,
      anxious: 0,
      depressed: 0,
      disgusted: 0,
      contempt: 0,
      confused: 0,
      calm: 0,
      disgust:0,
      "too short": 0,
      "too soft": 0,
      "too noisy": 0,
    };

    frames.forEach(({ emotion }) => {
      emotionCount[emotion]++;
    });

    const totalFrames = frames.length;
    const data = Object.entries(emotionCount)
      .filter(([_, count]) => count > 0)
      .map(([emotion, count]) => ({
        name: emotion,
        value: parseFloat(((count / totalFrames) * 100).toFixed(1)),
      }));

    setEmotionData(data);

    const summary = data
      .map(({ name, value }) => `${name}: ${value}%`)
      .join(", ");

    setEmotionSummary(summary);
  };

  /**
   * Handle Emotion Detection
   */
  useEffect(() => {
    const detectedEmotion = voice.detectedEmotion as unknown;

    if (
      typeof detectedEmotion === "object" &&
      detectedEmotion !== null &&
      "emotion" in detectedEmotion &&
      "confidence" in detectedEmotion
    ) {
      const { emotion, confidence } = detectedEmotion as DetectedEmotion;

      if (typeof emotion === "string" && typeof confidence === "number") {
        storeEmotionFrame(emotion as Emotion, confidence);
      }
    }
  }, [storeEmotionFrame, voice.detectedEmotion]);

  /**
   * Scroll to bottom when messages update
   */
  useEffect(() => {
    scrollToBottom();
  }, [voice.chatHistory, voice.transcription]);

  return (
    <Card className="p-2 md:p-4">
      <SessionControls
        sessionActive={actualSessionActive}
        toggleSession={isControlledComponent ? onSessionStart || (() => {}) : session.toggleSession}
        disabled={!isOnline}
        isOnline={isOnline}
      />

      <div className="overflow-y-auto h-[300px] pr-1 md:pr-2">
        <div className="space-y-3 md:space-y-4">
          {voice.chatHistory.map((msg, i) => {
            const isLastAI =
              msg.role === "ai" &&
              i === voice.chatHistory
                .map((m, idx) => (m.role === "ai" ? idx : -1))
                .filter((idx) => idx !== -1)
                .pop();

            return msg.role === "user" ? (
              <UserMessage key={i} text={msg.text} />
            ) : (
              <AIMessage
                key={i}
                text={msg.text}
                autoplay={isLastAI} // only autoplay the last AI message
                showControls={isLastAI} // only show play/stop buttons for the last one
                voiceGender={voiceGender}
              />
            );
          })}
          <UserTranscription
            transcription={voice.transcription}
            interimTranscript={voice.interimTranscript}
            isListening={voice.isListening}
            sessionActive={actualSessionActive}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-2 pt-2 md:mt-3 md:pt-3 border-t">
        <VoiceControls
          isListening={voice.isListening}
          audioData={voice.audioData}
          sessionActive={actualSessionActive}
          processingInput={voice.processingInput}
          toggleListening={voice.toggleListening}
          connectionIssue={connectionIssue}
          setVoiceEmotion={voice.setVoiceEmotion}
          stopListening={voice.stopListening}
          voiceGender={voiceGender}
          setVoiceGender={setVoiceGender}
        />
      </div>
    </Card>
  );
};

export default VoiceInterface;
