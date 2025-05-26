
import React, { useEffect, useRef, useState } from 'react';
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
import { useEmotionData, EmotionDataPoint } from '@/hooks/dashboard/useEmotionData';

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceGender, setVoiceGender] = useState<"male" | "female">("male");
  const isMobile = useIsMobile();
  const { isOnline, connectionQuality } = useNetworkStatus();
  const navigate = useNavigate();
  
  // Session tracking for dashboard
  const sessionStartTimeRef = useRef<number>(0);
  const allSessionEmotionsRef = useRef<EmotionDataPoint[]>([]);
  const { saveSession } = useEmotionData();
  
  // Reference for tracking session state changes
  const sessionActiveRef = React.useRef(sessionActive);
  React.useEffect(() => {
    sessionActiveRef.current = sessionActive;
    
    // When session becomes active, start tracking
    if (sessionActive) {
      sessionStartTimeRef.current = Date.now();
      allSessionEmotionsRef.current = [];
    }
    // When session becomes inactive, save session data
    else if (sessionStartTimeRef.current > 0) {
      const endTime = Date.now();
      const duration = endTime - sessionStartTimeRef.current;
      
      // Only save sessions that are at least 1 second long
      if (duration > 1000 && allSessionEmotionsRef.current.length > 0) {
        // Save session to dashboard data
        saveSession({
          startTime: sessionStartTimeRef.current,
          endTime,
          duration,
          emotionData: allSessionEmotionsRef.current,
        });
      }
      
      // Reset emotion states
      setFaceEmotion(null);
      setVoiceEmotion(null);
    }
  }, [sessionActive, saveSession]);

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
      
      // Save facial emotion data point
      const dataPoint: EmotionDataPoint = {
        emotion,
        confidence,
        timestamp: Date.now(),
        type: 'facial'
      };
      
      allSessionEmotionsRef.current.push(dataPoint);
    }
  };

  const handleVoiceEmotionDetected = (emotion: Emotion, confidence: number, top3?: { emotion: Emotion; confidence: number }[]) => {
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
      
      // Save voice emotion data point
      const dataPoint: EmotionDataPoint = {
        emotion,
        confidence, 
        timestamp: Date.now(),
        type: 'voice'
      };
      
      allSessionEmotionsRef.current.push(dataPoint);
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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#8B5CF6] to-[#C4B5FD]">
      <Header />
      <ConnectivityWarning onNetworkIssue={(hasIssue) => {
        // End session on severe network issues
        if (hasIssue && sessionActive) {
          setSessionActive(false);
        }
      }} />
      
      <main className="flex-1 container py-8 px-4 mx-auto mt-20 md:mt-28 mt-10 md:mt-16 lg:mt-28">
        <div className="space-y-2 md:space-y-8 max-w-[1200px] mx-auto">
          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="text-white hover:bg-white/20 h-6 px-1.5 py-0.5 text-xs md:h-10 md:px-4 md:py-2 md:text-base"
            >
              <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-5 md:w-5" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-2">
              {/* Theme Toggle Button - Now with text instead of icons */}
              <Button 
                variant="ghost" 
                onClick={toggleTheme} 
                className="text-white hover:bg-white/20 h-6 px-2 text-xs md:h-10 md:px-3 md:text-sm font-medium"
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Button>
              
              {/* Dashboard Button */}
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="text-white bg-white/10 hover:bg-white/20 border-white/30 h-6 px-1.5 py-0.5 text-xs md:h-10 md:px-4 md:py-2 md:text-base"
              >
                View Dashboard
              </Button>
            </div>
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
                voiceGender={voiceGender}
                setVoiceGender={setVoiceGender}
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
              
              {/* Compact emotion info box for mobile */}
              {isMobile && sessionActive && (
                <div className="bg-purple-400/20 backdrop-blur-md p-2 rounded-lg border border-purple-400 shadow">
                  <p className="text-2xs text-white/90">
                    {sessionActive 
                      ? "Emotions analyzed in real-time"
                      : "Start session for emotion analysis"}
                  </p>
                </div>
              )}
              
              {/* Full emotion info box for desktop */}
              {!isMobile && (
                <div className="bg-purple-400/20 backdrop-blur-md p-3 md:p-4 rounded-lg border-2 border-purple-400 shadow-lg">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">Real-time Emotion Analysis</h3>
                  <p className="text-white/90 text-xs md:text-sm mb-2 md:mb-3">
                    {sessionActive 
                      ? "Your emotions are being analyzed in real-time to provide better support"
                      : "Start a session to begin emotion analysis"}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Emotion display and visualizer for mobile */}
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