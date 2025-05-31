import { useState, useEffect, useCallback } from 'react';
import { Emotion } from '@/components/EmotionDisplay';

// Centralized type definitions for emotion tracking
export interface EmotionDataPoint {
  emotion: Emotion | null;
  confidence: number;
  timestamp: number;
  type: 'facial' | 'voice'; // Required property for data source
}

export interface SessionData {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  emotionData: EmotionDataPoint[];
  emotionCount: number; // Count of distinct emotions detected
  primaryEmotions: {
    facial: { emotion: Emotion | null; count: number }[];
    voice: { emotion: Emotion | null; count: number }[];
  };
}

export interface EmotionDataState {
  sessions: SessionData[];
  totalSessions: number;
  totalDuration: number;
  mostFrequentEmotions: {
    facial: { emotion: Emotion | null; count: number }[];
    voice: { emotion: Emotion | null; count: number }[];
  };
}

// Local storage key
const EMOTION_DATA_STORAGE_KEY = 'emotion-tracker-data';

export function useEmotionData() {
  const [emotionData, setEmotionData] = useState<EmotionDataState>({
    sessions: [],
    totalSessions: 0,
    totalDuration: 0,
    mostFrequentEmotions: {
      facial: [],
      voice: []
    }
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem(EMOTION_DATA_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setEmotionData(parsedData);
      } catch (error) {
        console.error('Error parsing stored emotion data:', error);
      }
    }
  }, []);

  // Save session data to localStorage
  const saveSession = useCallback((sessionData: Omit<SessionData, 'id' | 'emotionCount' | 'primaryEmotions'>) => {
    setEmotionData(prevData => {
      // Generate a unique ID for the session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Analyze emotion data to get distinct emotions
      const facialEmotions = new Map<Emotion | null, number>();
      const voiceEmotions = new Map<Emotion | null, number>();
      
      sessionData.emotionData.forEach(dataPoint => {
        if (dataPoint.type === 'facial' && dataPoint.emotion) {
          facialEmotions.set(dataPoint.emotion, (facialEmotions.get(dataPoint.emotion) || 0) + 1);
        } else if (dataPoint.type === 'voice' && dataPoint.emotion) {
          voiceEmotions.set(dataPoint.emotion, (voiceEmotions.get(dataPoint.emotion) || 0) + 1);
        }
      });
      
      // Convert Maps to sorted arrays
      const primaryFacial = Array.from(facialEmotions.entries())
        .map(([emotion, count]) => ({ emotion, count }))
        .sort((a, b) => b.count - a.count);
      
      const primaryVoice = Array.from(voiceEmotions.entries())
        .map(([emotion, count]) => ({ emotion, count }))
        .sort((a, b) => b.count - a.count);
      
      // Count distinct emotions (combined from both sources)
      const distinctEmotions = new Set([
        ...Array.from(facialEmotions.keys()).filter(e => e !== null),
        ...Array.from(voiceEmotions.keys()).filter(e => e !== null)
      ]);
      
      const emotionCount = distinctEmotions.size;
      
      // Create the new session with additional metadata
      const newSession: SessionData = {
        ...sessionData,
        id: sessionId,
        emotionCount,
        primaryEmotions: {
          facial: primaryFacial,
          voice: primaryVoice
        }
      };
      
      // Update the overall stats
      const newSessions = [newSession, ...prevData.sessions];
      const totalDuration = newSessions.reduce((sum, session) => sum + session.duration, 0);
      
      // Calculate most frequent emotions across all sessions
      const allFacialEmotions = new Map<Emotion | null, number>();
      const allVoiceEmotions = new Map<Emotion | null, number>();
      
      newSessions.forEach(session => {
        session.primaryEmotions.facial.forEach(({ emotion, count }) => {
          if (emotion) {
            allFacialEmotions.set(emotion, (allFacialEmotions.get(emotion) || 0) + count);
          }
        });
        
        session.primaryEmotions.voice.forEach(({ emotion, count }) => {
          if (emotion) {
            allVoiceEmotions.set(emotion, (allVoiceEmotions.get(emotion) || 0) + count);
          }
        });
      });
      
      const topFacial = Array.from(allFacialEmotions.entries())
        .map(([emotion, count]) => ({ emotion, count }))
        .sort((a, b) => b.count - a.count);
      
      const topVoice = Array.from(allVoiceEmotions.entries())
        .map(([emotion, count]) => ({ emotion, count }))
        .sort((a, b) => b.count - a.count);
      
      // Prepare the updated state
      const updatedData = {
        sessions: newSessions,
        totalSessions: newSessions.length,
        totalDuration,
        mostFrequentEmotions: {
          facial: topFacial,
          voice: topVoice
        }
      };
      
      // Save to localStorage
      try {
        localStorage.setItem(EMOTION_DATA_STORAGE_KEY, JSON.stringify(updatedData));
      } catch (error) {
        console.error('Error saving emotion data to localStorage:', error);
      }
      
      return updatedData;
    });
  }, []);

  // Clear all stored data
  const clearData = useCallback(() => {
    localStorage.removeItem(EMOTION_DATA_STORAGE_KEY);
    setEmotionData({
      sessions: [],
      totalSessions: 0,
      totalDuration: 0,
      mostFrequentEmotions: {
        facial: [],
        voice: []
      }
    });
  }, []);

  return {
    emotionData,
    saveSession,
    clearData
  };
}
