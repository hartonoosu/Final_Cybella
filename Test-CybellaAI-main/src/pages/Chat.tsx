// import React from 'react';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import VoiceInterface from '@/components/VoiceInterface';
// import FacialRecognition from '@/components/FacialRecognition';
// import EmotionDisplay, { Emotion } from '@/components/EmotionDisplay';
// import { useIsMobile } from '@/hooks/use-mobile';
// import { useNetworkStatus } from '@/hooks/useNetworkStatus';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import ConnectivityWarning from '@/components/ConnectivityWarning';

// const Chat = () => {
//   const [faceEmotion, setFaceEmotion] = React.useState<Emotion | null>(null);
//   const [voiceEmotion, setVoiceEmotion] = React.useState<Emotion | null>(null);
//   const [sessionActive, setSessionActive] = React.useState<boolean>(false);
//   const [sessionCount, setSessionCount] = React.useState<number>(0);
//   const isMobile = useIsMobile();
//   const { isOnline, connectionQuality } = useNetworkStatus();
//   const navigate = useNavigate();
  
//   // Reference for tracking session state changes
//   const sessionActiveRef = React.useRef(sessionActive);
//   React.useEffect(() => {
//     sessionActiveRef.current = sessionActive;
    
//     // When session becomes inactive, clear emotion states
//     if (!sessionActive) {
//       setFaceEmotion(null);
//       setVoiceEmotion(null);
//     }
//   }, [sessionActive]);

//   // Force end session on network issues
//   React.useEffect(() => {
//     if ((!isOnline || connectionQuality === 'poor') && sessionActiveRef.current) {
//       console.log("Network issues detected - ending session automatically");
//       setSessionActive(false);
//     }
//   }, [isOnline, connectionQuality]);

//   const handleFaceEmotionDetected = (emotion: Emotion) => {
//     // Only update emotions when session is active
//     if (sessionActive) {
//       setFaceEmotion(emotion);
//     }
//   };

//   const handleVoiceEmotionDetected = (emotion: Emotion) => {
//     // Only update emotions when session is active
//     if (sessionActive) {
//       setVoiceEmotion(emotion);
//     }
//   };

//   const toggleSession = () => {
//     const newSessionState = !sessionActive;
//     setSessionActive(newSessionState);
    
//     if (newSessionState) {
//       setSessionCount(prev => prev + 1);
//     } else {
//       // Clear emotions when ending session
//       setFaceEmotion(null);
//       setVoiceEmotion(null);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1E90FF] to-[#87CEEB]">
//       <Header />
//       <ConnectivityWarning onNetworkIssue={(hasIssue) => {
//         // End session on severe network issues
//         if (hasIssue && sessionActive) {
//           setSessionActive(false);
//         }
//       }} />
      
//       <main className="flex-1 container py-8 px-3 mx-auto mt-16 md:mt-28">
//         <div className="space-y-8 max-w-[1200px] mx-auto">
//           {/* Back button */}
//           <div className="flex">
//             <Button 
//               variant="ghost" 
//               onClick={() => navigate('/')} 
//               className="text-white hover:bg-white/20"
//             >
//               <ArrowLeft className="mr-2" />
//               Back to Home
//             </Button>
//           </div>
          
//           <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-8'}`}>
//             <div className="space-y-6">
//               <VoiceInterface
//                 onVoiceEmotionDetected={handleVoiceEmotionDetected}
//                 onSessionStart={toggleSession}
//                 onSessionEnd={() => setSessionActive(false)}
//                 isOnline={isOnline}
//                 sessionActive={sessionActive}
//                 key={`voice-${sessionCount}`}
//               />
//               {!isMobile && null /* Empty spacer for desktop layout */}
//             </div>
//             <div className={`space-y-6 ${isMobile ? 'order-first' : ''}`}>
//               <FacialRecognition
//                 onEmotionDetected={handleFaceEmotionDetected}
//                 isActive={sessionActive}
//                 connectionIssue={!isOnline || connectionQuality === 'poor'}
//                 key={`face-${sessionCount}`}
//               />
              
//               {/* Dedicated emotion results area with highlighting */}
//             </div>
//           </div>
          
//           {/* Emotion display only shown when session active */}
//           {sessionActive && (
//             <div className="pt-2 md:pt-6">
//               <EmotionDisplay
//                 faceEmotion={faceEmotion}
//                 voiceEmotion={voiceEmotion}
//               />
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Chat;

import React, {useState} from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VoiceInterface from '@/components/VoiceInterface';
import FacialRecognition from '@/components/FacialRecognition';
import EmotionDisplay, { Emotion } from '@/components/EmotionDisplay';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConnectivityWarning from '@/components/ConnectivityWarning';

const Chat = () => {
  const [faceEmotion, setFaceEmotion] = React.useState<Emotion | null>(null);
  const [voiceEmotion, setVoiceEmotion] = React.useState<Emotion | null>(null);
  const [topEmotions, setTopEmotions] = useState<
    { emotion: Emotion; confidence: number }[]
  >([]);
  const [faceConfidence, setFaceConfidence] = React.useState<number>(0);
  const [voiceConfidence, setVoiceConfidence] = React.useState<number>(0);
  const [sessionActive, setSessionActive] = React.useState<boolean>(false);
  const [sessionCount, setSessionCount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const { isOnline, connectionQuality } = useNetworkStatus();
  const navigate = useNavigate();
  
  // Reference for tracking session state changes
  const sessionActiveRef = React.useRef(sessionActive);
  React.useEffect(() => {
    sessionActiveRef.current = sessionActive;
    
    // When session becomes inactive, clear emotion states
    if (!sessionActive) {
      setFaceEmotion(null);
      setVoiceEmotion(null);
    }
  }, [sessionActive]);

  // Force end session on network issues
  React.useEffect(() => {
    if ((!isOnline || connectionQuality === 'poor') && sessionActiveRef.current) {
      console.log("Network issues detected - ending session automatically");
      setSessionActive(false);
    }
  }, [isOnline, connectionQuality]);

  const handleFaceEmotionDetected = (emotion: Emotion, confidence: number) => {
    // Only update emotions when session is active
    if (sessionActive) {
      setFaceEmotion(emotion);
      setFaceConfidence(confidence);
    }
  };

  const handleVoiceEmotionDetected = (emotion: Emotion, confidence: number,  top3?: { emotion: Emotion; confidence: number }[]) => {
    // Only update emotions when session is active
    if (sessionActive) {
      setVoiceEmotion(emotion);
      setVoiceConfidence(confidence);
       if (
        emotion === "too short" ||
        emotion === "too soft" ||
        emotion === "too noisy"
      ) {
        setTopEmotions([]); // clear
      } else if (top3) {
        setTopEmotions(top3);
      }
    }
  };

  const toggleSession = () => {
    const newSessionState = !sessionActive;
    setSessionActive(newSessionState);
    
    if (newSessionState) {
      setSessionCount(prev => prev + 1);
    } else {
      // Clear emotions when ending session
      setFaceEmotion(null);
      setVoiceEmotion(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1E90FF] to-[#87CEEB]">
      <Header />
      <ConnectivityWarning onNetworkIssue={(hasIssue) => {
        // End session on severe network issues
        if (hasIssue && sessionActive) {
          setSessionActive(false);
        }
      }} />
      
      <main className="flex-1 container py-2 md:py-8 px-1 md:px-3 mx-auto mt-10 md:mt-16 lg:mt-28">
        <div className="space-y-2 md:space-y-8 max-w-[1200px] mx-auto">
          {/* Back button */}
          <div className="flex">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="text-white hover:bg-white/20 h-6 px-1.5 py-0.5 text-xs md:h-10 md:px-4 md:py-2 md:text-base"
            >
              <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-5 md:w-5" />
              Back
            </Button>
          </div>
          
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-8'}`}>
            <div className="space-y-2 md:space-y-6">
              <VoiceInterface
                onVoiceEmotionDetected={handleVoiceEmotionDetected}
                onSessionStart={toggleSession}
                onSessionEnd={() => setSessionActive(false)}
                isOnline={isOnline}
                sessionActive={sessionActive}
                key={`voice-${sessionCount}`}
                onVoiceLoadingChange={setIsLoading}
              />
              {!isMobile && null /* Empty spacer for desktop layout */}
            </div>
            <div className={`space-y-2 md:space-y-6 ${isMobile ? 'order-first' : ''}`}>
              <FacialRecognition
                onEmotionDetected={handleFaceEmotionDetected}
                isActive={sessionActive}
                connectionIssue={!isOnline || connectionQuality === 'poor'}
                key={`face-${sessionCount}`}
              />
              
              {/* Full emotion info box for desktop */}

            </div>
          </div>
          
          {/* Emotion display only shown when session active */}
          {sessionActive && (
            <div className="pt-1 md:pt-6">
              <EmotionDisplay
                faceEmotion={faceEmotion}
                voiceEmotion={voiceEmotion}
                confidence={{
                  face: faceConfidence,
                  voice: voiceConfidence
                }}
                isLoading={isLoading}
                topEmotions={topEmotions}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
