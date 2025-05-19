// import React, { useEffect, useRef } from 'react';
// import { Card } from '@/components/ui/card';
// import SessionControls from './voice-interface/SessionControls';
// import UserTranscription from './voice-interface/UserTranscription';
// import AIResponseDisplay from './voice-interface/AIResponseDisplay';
// import VoiceControls from './voice-interface/VoiceControls';
// import { useVoiceProcessing } from '@/hooks/useVoiceProcessing';
// import { useVoiceSession } from '@/hooks/voice/useVoiceSession';
// import { useIsMobile } from '@/hooks/use-mobile';
// import { useNetworkStatus } from '@/hooks/useNetworkStatus';
// import { useConnectionStatus } from '@/hooks/facial-recognition/useConnectionStatus';
// import { Emotion } from '@/components/EmotionDisplay';
// import { useAuth } from '@/contexts/AuthContext';

// /**
//  * Voice Interface Component (no translations, no multi-language)
//  */
// interface VoiceInterfaceProps {
//   onVoiceEmotionDetected?: (emotion: Emotion, confidence: number) => void;
//   onSessionStart?: () => void;
//   onSessionEnd?: () => void;
//   isOnline?: boolean;
//   sessionActive?: boolean;
// }

// const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
//   onVoiceEmotionDetected,
//   onSessionStart,
//   onSessionEnd,
//   isOnline = true,
//   sessionActive: externalSessionActive
// }) => {
//   const isMobile = useIsMobile();
//   const { connectionQuality } = useNetworkStatus();
//   const { connectionIssue } = useConnectionStatus({
//     externalConnectionIssue: !isOnline || connectionQuality === 'poor'
//   });

//   const { isAuthenticated, user } = useAuth(); // User auth data

//   // Use the external session state if provided, otherwise use internal state
//   const isControlledComponent = externalSessionActive !== undefined;

//   const session = useVoiceSession({
//     onSessionStart,
//     onSessionEnd
//   });

//   // Determine the actual session state
//   const actualSessionActive = isControlledComponent ? externalSessionActive : session.sessionActive;

//   const voice = useVoiceProcessing({
//     sessionActive: actualSessionActive,
//     onVoiceEmotionDetected
//   });

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // End session on network issues
//   useEffect(() => {
//     if (!isOnline && session.sessionActive && !isControlledComponent) {
//       session.endSession();
//     }
//   }, [isOnline, session, isControlledComponent]);

//   useEffect(() => {
//     if (actualSessionActive) {
//       const aiName = user?.aiName || "Cybella";
//       voice.setAiResponse(`Hi, I'm ${aiName}, Thanks for creating me. I’m so excited to assist you?`);
//       voice.setShouldPlayVoice(true);
//     } else {
//       voice.setAiResponse("");
//       if (voice.setTranscription) {
//         voice.setTranscription("");
//       }
//       if (voice.setInterimTranscript) {
//         voice.setInterimTranscript("");
//       }
//       voice.setShouldPlayVoice(false);
//       if (voice.isListening && voice.stopListening) {
//         voice.stopListening();
//       }
//     }
//   }, [actualSessionActive, voice, user]);
  
//   // Scroll to bottom when messages update
//   useEffect(() => {
//     scrollToBottom();
//   }, [voice.aiResponse, voice.transcription]);

//   // Adjusted height for better mobile experience
//   const contentHeight = isMobile ? "h-[220px]" : "h-[300px]";

//   return (
//     <Card className="p-2 md:p-4">
//       <SessionControls
//         sessionActive={actualSessionActive}
//         toggleSession={isControlledComponent ? onSessionStart || (() => {}) : session.toggleSession}
//         disabled={!isOnline}
//         isOnline={isOnline}
//       />

//       <div className={`overflow-y-auto ${contentHeight} pr-1 md:pr-2`}>
//         <div className="space-y-3 md:space-y-4">
//           <AIResponseDisplay
//             processingInput={voice.processingInput}
//             aiResponse={voice.aiResponse}
//             shouldPlayVoice={voice.shouldPlayVoice}
//             sessionActive={actualSessionActive}
//           />

//           <UserTranscription
//             transcription={voice.transcription}
//             interimTranscript={voice.interimTranscript}
//             isListening={voice.isListening}
//             sessionActive={actualSessionActive}
//           />
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       <div className="mt-2 pt-2 md:mt-3 md:pt-3 border-t">
//         <VoiceControls
//           isListening={voice.isListening}
//           audioData={voice.audioData}
//           sessionActive={actualSessionActive}
//           processingInput={voice.processingInput}
//           toggleListening={voice.toggleListening}
//           connectionIssue={connectionIssue}
//         />
//       </div>
//     </Card>
//   );
// };

// export default VoiceInterface;
// --------------------------------------------------------------------------------------------------------------------------------------
// import axios from "axios";
// import React, { useEffect, useRef, useState } from "react";
// import { Card } from "@/components/ui/card";
// import SessionControls from "./voice-interface/SessionControls";
// import UserTranscription from "./voice-interface/UserTranscription";
// import AIResponseDisplay from "./voice-interface/AIResponseDisplay";
// import VoiceControls from "./voice-interface/VoiceControls";
// import { useVoiceProcessing } from "@/hooks/useVoiceProcessing";
// import { useVoiceSession } from "@/hooks/voice/useVoiceSession";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useNetworkStatus } from "@/hooks/useNetworkStatus";
// import { useConnectionStatus } from "@/hooks/facial-recognition/useConnectionStatus";
// import { Emotion } from "@/components/EmotionDisplay";
// import { useAuth } from "@/contexts/AuthContext";
// import { getBackendUrl } from "@/utils/getBackendUrl";

// interface VoiceInterfaceProps {
//   onVoiceEmotionDetected?: (emotion: Emotion, confidence: number) => void;
//   onSessionStart?: () => void;
//   onSessionEnd?: () => void;
//   isOnline?: boolean;
//   sessionActive?: boolean;
// }

// const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
//   onVoiceEmotionDetected,
//   onSessionStart,
//   onSessionEnd,
//   isOnline = true,
//   sessionActive: externalSessionActive,
// }) => {
//   const [backendUrl, setBackendUrl] = useState<string>("http://localhost:5000");
//   const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

//   const isMobile = useIsMobile();
//   const { connectionQuality } = useNetworkStatus();
//   const { connectionIssue } = useConnectionStatus({
//     externalConnectionIssue: !isOnline || connectionQuality === "poor",
//   });

//   const { user } = useAuth();
//   const isControlledComponent = externalSessionActive !== undefined;
//   const session = useVoiceSession({ onSessionStart, onSessionEnd });
//   const actualSessionActive = isControlledComponent ? externalSessionActive : session.sessionActive;

//   const voice = useVoiceProcessing({
//     sessionActive: actualSessionActive,
//     onVoiceEmotionDetected,
//   });

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [voice.aiResponse, voice.transcription]);

//   /**
//    * Dynamic IP Detection and Backend URL Setup
//    */
//   useEffect(() => {
//     const setDynamicBackendUrl = async () => {
//       try {
//         const url = await getBackendUrl();
//         setBackendUrl(url);
//         console.log("Backend URL set to:", url);
//       } catch (error) {
//         console.error("Error setting backend URL:", error);
//       }
//     };

//     setDynamicBackendUrl();
//   }, []);

//   /**
//    * Backend Connection Check
//    */
//   const checkBackendConnection = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/ping`);
//       console.log("Backend Connection:", response.data.message);
//       setIsBackendConnected(true);
//     } catch (error) {
//       console.error("Backend Connection Error:", error.message);
//       setIsBackendConnected(false);
//     }
//   };

//   useEffect(() => {
//     if (backendUrl) {
//       checkBackendConnection();
//     }
//   }, [backendUrl]);

//   /**
//    * Function to send audio data to backend
//    */
//   const sendAudioToBackend = async (audioBlob: Blob) => {
//     if (!isBackendConnected) {
//       console.warn("Backend is not connected. Skipping audio processing.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", audioBlob, "audio.webm");

//     try {
//       const response = await axios.post(`${backendUrl}/predict/`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       const { emotion, confidence } = response.data;
//       console.log("Emotion:", emotion, "Confidence:", confidence);

//       if (onVoiceEmotionDetected) {
//         onVoiceEmotionDetected(emotion, confidence);
//       }
//     } catch (error) {
//       console.error("Error sending audio to backend:", error.message);
//     }
//   };

//   return (
//     <Card className="p-2 md:p-4">
//       <SessionControls
//         sessionActive={actualSessionActive}
//         toggleSession={isControlledComponent ? onSessionStart || (() => {}) : session.toggleSession}
//         disabled={!isOnline}
//         isOnline={isOnline}
//       />

//       <div className="overflow-y-auto h-[300px] pr-1 md:pr-2">
//         <div className="space-y-3 md:space-y-4">
//           <AIResponseDisplay
//             processingInput={voice.processingInput}
//             aiResponse={voice.aiResponse}
//             shouldPlayVoice={voice.shouldPlayVoice}
//             sessionActive={actualSessionActive}
//           />

//           <UserTranscription
//             transcription={voice.transcription}
//             interimTranscript={voice.interimTranscript}
//             isListening={voice.isListening}
//             sessionActive={actualSessionActive}
//           />
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       <div className="mt-2 pt-2 md:mt-3 md:pt-3 border-t">
//         <VoiceControls
//           isListening={voice.isListening}
//           audioData={voice.audioData}
//           sessionActive={actualSessionActive}
//           processingInput={voice.processingInput}
//           toggleListening={voice.toggleListening}
//           connectionIssue={connectionIssue}
//         />
//       </div>

//       <div className="mt-4 text-center text-sm">
//         Backend Status:{" "}
//         <span className={isBackendConnected ? "text-green-500" : "text-red-500"}>
//           {isBackendConnected ? "Connected" : "Not Connected"}
//         </span>
//       </div>
//     </Card>
//   );
// };

// export default VoiceInterface;


// import axios from "axios";
// import React, { useEffect, useRef, useState } from "react";
// import { Card } from "@/components/ui/card";
// import SessionControls from "./voice-interface/SessionControls";
// import UserTranscription from "./voice-interface/UserTranscription";
// import AIResponseDisplay from "./voice-interface/AIResponseDisplay";
// import VoiceControls from "./voice-interface/VoiceControls";
// import { useVoiceProcessing } from "@/hooks/useVoiceProcessing";
// import { useVoiceSession } from "@/hooks/voice/useVoiceSession";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useNetworkStatus } from "@/hooks/useNetworkStatus";
// import { useConnectionStatus } from "@/hooks/facial-recognition/useConnectionStatus";
// import { Emotion } from "@/components/EmotionDisplay";
// import { useAuth } from "@/contexts/AuthContext";
// import { getBackendUrl } from "@/utils/getBackendUrl";
// import UserMessage from "./voice-interface/UserMessage";
// import AIMessage from "./voice-interface/AIMessage";
// import { useLanguage } from "@/contexts/LanguageContext";

// interface VoiceInterfaceProps {
//   onVoiceEmotionDetected?: (emotion: Emotion, confidence: number, top3?: { emotion: Emotion; confidence: number }[]) => void;
//   onSessionStart?: () => void;
//   onSessionEnd?: () => void;
//   onVoiceLoadingChange?: (isLoading: boolean) => void;
//   isOnline?: boolean;
//   sessionActive?: boolean;
// }

// const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
//   onVoiceEmotionDetected,
//   onSessionStart,
//   onSessionEnd,
//   onVoiceLoadingChange,
//   isOnline = true,
//   sessionActive: externalSessionActive,
// }) => {
//   const [backendUrl, setBackendUrl] = useState<string>("http://localhost:5000");
//   const [backendStatus, setBackendStatus] = useState<string>("Checking...");
//   const [mongoStatus, setMongoStatus] = useState<string>("Checking...");
//   const [publicIp, setPublicIp] = useState<string>("");

//   const isMobile  = useIsMobile();
//   const { connectionQuality } = useNetworkStatus();
//   const { connectionIssue } = useConnectionStatus({
//     externalConnectionIssue: !isOnline || connectionQuality === "poor",
//   });

//   const { user } = useAuth();
//   const isControlledComponent = externalSessionActive !== undefined;
//   const session = useVoiceSession({ onSessionStart, onSessionEnd });
//   const actualSessionActive = isControlledComponent ? externalSessionActive : session.sessionActive;

//   const voice = useVoiceProcessing({
//     sessionActive: actualSessionActive,
//     onVoiceEmotionDetected,
//   });

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   /**
//    * Merged Greeting Implementation
//    */
//   useEffect(() => {
//     if (actualSessionActive) {
//       const aiName = user?.aiName || "Cybella";
//       const userName = user?.fullName || "there"; // Fallback to "there" if name is unavailable

//       // Merged Greeting
//       const mergedGreeting = `Hi ${userName}! I'm ${aiName}. Thanks for creating me. I am very excited to assist you today.`;

//       // Set the AI response
//       voice.setAiResponse(mergedGreeting);
//       voice.setShouldPlayVoice(true);

//       // Add to chat history only if it's the first message in the session
//       if (voice.chatHistory.length === 0) {
//         voice.setChatHistory(prev => [...prev, { role: "ai", text: mergedGreeting }]);
//       }

//     } else {
//       // Reset all voice-related states when session ends
//       voice.setAiResponse("");
//       if (voice.setTranscription) {
//         voice.setTranscription("");
//       }
//       if (voice.setInterimTranscript) {
//         voice.setInterimTranscript("");
//       }
//       voice.setShouldPlayVoice(false);

//       if (voice.isListening && voice.stopListening) {
//         voice.stopListening();
//       }
//     }
//   }, [actualSessionActive, voice, user]);

//   // Scroll to bottom when messages update
//   useEffect(() => {
//     scrollToBottom();
//   }, [voice.chatHistory, voice.transcription]);

//   /**
//    * Backend and MongoDB Connection Check
//    */
//   const checkBackendConnection = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/ping`);
//       const { message, mongo_status, ip } = response.data;

//       setBackendStatus(message);
//       setMongoStatus(mongo_status);
//       setPublicIp(ip);

//     } catch (error) {
//       console.error("Backend Connection Error:", error.message);
//       setBackendStatus("Not Connected");
//       setMongoStatus("Not Connected");
//     }
//   };

//   useEffect(() => {
//     if (backendUrl) {
//       checkBackendConnection();
//     }
//   }, [backendUrl]);

//   return (
//     <Card className="p-2 md:p-4">
//       <SessionControls
//         sessionActive={actualSessionActive}
//         toggleSession={isControlledComponent ? onSessionStart || (() => {}) : session.toggleSession}
//         disabled={!isOnline}
//         isOnline={isOnline}
//       />

//       <div className="overflow-y-auto h-[300px] pr-1 md:pr-2">
//         <div className="space-y-3 md:space-y-4">
//           {/* Chat history */}
//           {voice.chatHistory.map((msg, i) => {
//             const isLastAI =
//               msg.role === "ai" &&
//               i === voice.chatHistory
//                 .map((m, idx) => (m.role === "ai" ? idx : -1))
//                 .filter((idx) => idx !== -1)
//                 .pop();

//             return msg.role === "user" ? (
//               <UserMessage key={i} text={msg.text} />
//             ) : (
//               <AIMessage key={i} text={msg.text} autoplay={false} showControls={isLastAI} />
//             );
//           })}

//           {/* Live transcription bubble */}
//           <UserTranscription
//             transcription={voice.transcription}
//             interimTranscript={voice.interimTranscript}
//             isListening={voice.isListening}
//             sessionActive={actualSessionActive}
//           />
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       <div className="mt-2 pt-2 md:mt-3 md:pt-3 border-t">
//         <VoiceControls
//           isListening={voice.isListening}
//           audioData={voice.audioData}
//           sessionActive={actualSessionActive}
//           processingInput={voice.processingInput}
//           toggleListening={voice.toggleListening}
//           connectionIssue={connectionIssue}
//           setVoiceEmotion={onVoiceEmotionDetected}
//           stopListening={voice.stopListening}
//         />
//       </div>

//       <div className="mt-4 text-center text-sm">
//         <div>
//           Public IP: <span className="text-blue-500">{publicIp || "Unknown"}</span>
//         </div>
//         <div>
//           Backend Status:{" "}
//           <span className={backendStatus === "Backend is connected and running!" ? "text-green-500" : "text-red-500"}>
//             {backendStatus}
//           </span>
//         </div>
//         <div>
//           MongoDB Status:{" "}
//           <span className={mongoStatus === "Connected" ? "text-green-500" : "text-red-500"}>
//             {mongoStatus}
//           </span>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default VoiceInterface;

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
  }, [actualSessionActive, voice, user]);

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
  }, [voice.detectedEmotion]);

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
        />
      </div>
    </Card>
  );
};

export default VoiceInterface;
