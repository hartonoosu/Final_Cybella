import React from 'react';
import { SessionData } from '@/hooks/dashboard/useEmotionData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Calendar, Clock } from 'lucide-react';

interface SessionDetailsProps {
  session: SessionData;
}

// Map emotions to numeric values for the chart
const emotionValueMap: Record<string, number> = {
  'happy': 11,
  'surprised': 10,
  'neutral': 9,
  'confused': 8,
  'anxious': 7,
  'stressed': 6,
  'sad': 5,
  'contempt': 4,
  'fearful': 3,
  'disgusted': 2,
  'depressed': 1,
  'angry': 0,
  'null': -1,
  'undefined': -1,
};

// Colors for each emotion source
const sourceColors = {
  facial: '#8b5cf6', // Purple
  voice: '#06b6d4'   // Cyan
};

const SessionDetails: React.FC<SessionDetailsProps> = ({ session }) => {
  // Format session date and time
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Format duration
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes} min ${seconds} sec`;
  };
  
  // Process emotion data for the charts
  const processedData = session.emotionData.map(point => {
    const timestamp = point.timestamp;
    const relativeTime = (timestamp - session.startTime) / 1000; // seconds since start
    
    return {
      time: relativeTime.toFixed(1),
      timeFormatted: `${Math.floor(relativeTime / 60)}:${(Math.floor(relativeTime) % 60).toString().padStart(2, '0')}`,
      emotion: point.emotion,
      emotionValue: point.emotion ? emotionValueMap[point.emotion] : -1,
      confidence: point.confidence,
      type: point.type,
      timestamp
    };
  }).sort((a, b) => a.timestamp - b.timestamp);
  
  // Custom tooltip for the timeline chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border shadow-md rounded-md">
          <p className="font-medium">{`Time: ${data.timeFormatted}`}</p>
          <p>{`Emotion: ${data.emotion || 'None'}`}</p>
          <p>{`Confidence: ${Math.round(data.confidence * 100)}%`}</p>
          <p>{`Source: ${data.type}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formatDate(session.startTime)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Start: {formatTime(session.startTime)}</span>
              </div>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>End: {formatTime(session.endTime)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Duration & Emotions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p>{formatDuration(session.duration)}</p>
            <p className="mt-1">{session.emotionCount} unique emotions detected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionDetails;