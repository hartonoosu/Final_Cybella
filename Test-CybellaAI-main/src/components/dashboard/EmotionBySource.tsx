import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmotionDataState } from '@/hooks/dashboard/useEmotionData';

interface VoiceEmotionProps {
  emotionData: EmotionDataState;
  showDetailed?: boolean;
}

const VOICE_COLOR = '#06b6d4';

const VoiceEmotion: React.FC<VoiceEmotionProps> = ({
  emotionData,
  showDetailed = false
}) => {
  const voiceEmotions = new Map<string, number>();

  const voiceTotal = emotionData.mostFrequentEmotions.voice.reduce(
    (sum, { count }) => sum + count,
    0
  );

  // Per-session voice emotion breakdown
  const sessionChartData = emotionData.sessions.map((session) => {
    const emotionCounts: Record<string, number> = {};

    session.emotionData.forEach((entry) => {
      if (entry.type === 'voice' && entry.emotion) {
        emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
      }
    });

    return {
      session: new Date(session.startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      ...emotionCounts
    };
  });

  const allVoiceEmotions = Array.from(
    new Set(
      emotionData.sessions.flatMap(s =>
        s.emotionData.filter(e => e.type === 'voice' && e.emotion).map(e => e.emotion as string)
      )
    )
  );

  return (
    <div className="space-y-6">

      {/* Per-session voice emotion breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Voice Emotions Per Session</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {sessionChartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No session data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                {allVoiceEmotions.map((emotion, idx) => (
                  <Bar
                    key={emotion}
                    dataKey={emotion}
                    stackId="a"
                    fill={`hsl(${idx * 50}, 70%, 60%)`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceEmotion;
