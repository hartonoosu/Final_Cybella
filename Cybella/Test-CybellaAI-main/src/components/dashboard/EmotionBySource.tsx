import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmotionDataState } from '@/hooks/dashboard/useEmotionData';
import { Emotion } from '@/components/EmotionDisplay';

interface EmotionBySourceProps {
  emotionData: EmotionDataState;
  showDetailed?: boolean;
}

// Colors for different emotions
const EMOTION_COLORS = {
  facial: '#8b5cf6', // Purple
  voice: '#06b6d4'   // Cyan
};

const EmotionBySource: React.FC<EmotionBySourceProps> = ({ 
  emotionData, 
  showDetailed = false 
}) => {
  // Process the data for comparison between facial and voice
  const facialEmotions = new Map<string, number>();
  const voiceEmotions = new Map<string, number>();
  
  // Get totals for percentage calculation
  const facialTotal = emotionData.mostFrequentEmotions.facial.reduce(
    (sum, { count }) => sum + count, 0
  );
  
  const voiceTotal = emotionData.mostFrequentEmotions.voice.reduce(
    (sum, { count }) => sum + count, 0
  );
  
  // Process facial emotions
  emotionData.mostFrequentEmotions.facial.forEach(({ emotion, count }) => {
    const key = emotion || 'unknown';
    facialEmotions.set(key.toString(), count);
  });
  
  // Process voice emotions
  emotionData.mostFrequentEmotions.voice.forEach(({ emotion, count }) => {
    const key = emotion || 'unknown';
    voiceEmotions.set(key.toString(), count);
  });
  
  // Combine both maps to get all unique emotion keys
  const allEmotions = new Set([
    ...Array.from(facialEmotions.keys()),
    ...Array.from(voiceEmotions.keys())
  ]);
  
  // Create chart data
  const chartData = Array.from(allEmotions).map(emotion => {
    const facialCount = facialEmotions.get(emotion) || 0;
    const voiceCount = voiceEmotions.get(emotion) || 0;
    
    return {
      name: emotion,
      facial: facialCount,
      facialPercentage: facialTotal > 0 ? ((facialCount / facialTotal) * 100).toFixed(1) : '0.0',
      voice: voiceCount,
      voicePercentage: voiceTotal > 0 ? ((voiceCount / voiceTotal) * 100).toFixed(1) : '0.0',
    };
  }).sort((a, b) => {
    // Sort by combined count, descending
    return (b.facial + b.voice) - (a.facial + a.voice);
  });
  
  // Limit to top emotions for non-detailed view
  const displayData = showDetailed ? chartData : chartData.slice(0, 5);

  // Custom tooltip to show percentages
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-md rounded-md">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} (${entry.name === 'facial' ? 
                 payload[0].payload.facialPercentage : 
                 payload[0].payload.voicePercentage}%)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Emotions by Source</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No emotion data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="facial" name="Facial" fill={EMOTION_COLORS.facial} />
              <Bar dataKey="voice" name="Voice" fill={EMOTION_COLORS.voice} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionBySource;