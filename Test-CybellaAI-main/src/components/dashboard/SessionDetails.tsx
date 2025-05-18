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
      
      <Card>
        <CardHeader>
          <CardTitle>Emotion Timeline</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {processedData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No emotion data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  name="Time" 
                  label={{ value: 'Seconds', position: 'bottom' }} 
                  type="number"
                />
                <YAxis 
                  dataKey="emotionValue" 
                  name="Emotion" 
                  domain={[-1, 11]}
                  tickFormatter={(value) => {
                    // Map numeric values back to emotion names
                    const entries = Object.entries(emotionValueMap);
                    for (const [emotion, val] of entries) {
                      if (val === value) {
                        return emotion === 'null' ? '' : emotion;
                      }
                    }
                    return '';
                  }}
                />
                <ZAxis dataKey="confidence" range={[30, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Scatter 
                  name="Facial Emotions" 
                  data={processedData.filter(d => d.type === 'facial')} 
                  fill={sourceColors.facial}
                  shape="circle"
                />
                <Scatter 
                  name="Voice Emotions" 
                  data={processedData.filter(d => d.type === 'voice')} 
                  fill={sourceColors.voice}
                  shape="triangle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Facial Emotions</CardTitle>
          </CardHeader>
          <CardContent>
            {session.primaryEmotions.facial.length === 0 ? (
              <div className="text-muted-foreground">No facial emotions detected</div>
            ) : (
              <div className="space-y-2">
                {session.primaryEmotions.facial.map(({ emotion, count }) => (
                  <div key={`facial-${emotion}`} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: sourceColors.facial }}
                      />
                      <span>{emotion || 'Unknown'}</span>
                    </div>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Voice Emotions</CardTitle>
          </CardHeader>
          <CardContent>
            {session.primaryEmotions.voice.length === 0 ? (
              <div className="text-muted-foreground">No voice emotions detected</div>
            ) : (
              <div className="space-y-2">
                {session.primaryEmotions.voice.map(({ emotion, count }) => (
                  <div key={`voice-${emotion}`} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: sourceColors.voice }}
                      />
                      <span>{emotion || 'Unknown'}</span>
                    </div>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionDetails;