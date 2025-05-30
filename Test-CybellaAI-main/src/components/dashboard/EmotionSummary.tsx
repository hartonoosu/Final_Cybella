import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BarChart, Calendar } from 'lucide-react';
import { EmotionDataState } from '@/hooks/dashboard/useEmotionData';

interface EmotionSummaryProps {
  emotionData: EmotionDataState;
}

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ emotionData }) => {
  const { sessions, totalSessions, totalDuration } = emotionData;
  
  // Calculate average duration in minutes
  const avgDurationMin = totalSessions > 0 
    ? Math.round((totalDuration / totalSessions) / 60000) 
    : 0;
  
  // Count total emotions detected across all sessions
  const totalEmotionsDetected = sessions.reduce((sum, session) => sum + session.emotionCount, 0);
  
  // Format the total duration as minutes and seconds
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSessions}</div>
          <p className="text-xs text-muted-foreground">
            {totalSessions === 1 ? 'Session' : 'Sessions'} tracked
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDuration(totalDuration)}</div>
          <p className="text-xs text-muted-foreground">
            Average: {avgDurationMin} {avgDurationMin === 1 ? 'minute' : 'minutes'} per session
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Emotions</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"> 8 </div>
          <p className="text-xs text-muted-foreground">
            Cybella gently detects 8 emotions through voice and facial cues.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionSummary;
