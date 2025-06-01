import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { EmotionDataState } from '@/hooks/dashboard/useEmotionData';
import { Emotion } from '@/components/EmotionDisplay';

interface EmotionDistributionProps {
  emotionData: EmotionDataState;
  showDetailed?: boolean;
}

// Colors for different emotions
const EMOTION_COLORS: Record<Emotion | string, string> = {
  'happy': '#4ade80',
  'sad': '#60a5fa',
  'neutral': '#94a3b8',
  'angry': '#ef4444',
  'surprised': '#c084fc',
  'fearful': '#fb923c',
  'disgusted': '#a855f7',
  'contempt': '#f97316',
  'confused': '#facc15',
  'anxious': '#8b5cf6',
  'stressed': '#ec4899',
  'depressed': '#64748b',
  'unknown': '#d1d5db'
};

const EmotionDistribution: React.FC<EmotionDistributionProps> = ({ 
  emotionData, 
  showDetailed = false 
}) => {
  // Combine facial and voice emotions to get total distribution
  const combinedEmotions = new Map<Emotion | string, number>();
  
  // Process facial emotions
  emotionData.mostFrequentEmotions.facial.forEach(({ emotion, count }) => {
    const key = emotion || 'unknown';
    combinedEmotions.set(key, (combinedEmotions.get(key) || 0) + count);
  });
  
  // Process voice emotions
  emotionData.mostFrequentEmotions.voice.forEach(({ emotion, count }) => {
    const key = emotion || 'unknown';
    combinedEmotions.set(key, (combinedEmotions.get(key) || 0) + count);
  });
  
  // Calculate total count for percentage calculation
  const totalCount = Array.from(combinedEmotions.values()).reduce((sum, count) => sum + count, 0);
  
  // Convert to array for chart
  const chartData = Array.from(combinedEmotions.entries())
    .map(([emotion, count]) => ({
      name: emotion,
      value: count,
      percentage: totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0.0'
    }))
    .sort((a, b) => b.value - a.value);
  
  // For detailed view, show all emotions
  // For overview, only show top 5
  const displayData = showDetailed ? chartData : chartData.slice(0, 5);
  
  // Custom tooltip component for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-md rounded-md">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p>{`${payload[0].payload.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Emotion Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {totalCount === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No emotion data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={showDetailed ? 40 : 0}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percentage }) => `${name} (${percentage}%)`}
              >
                {displayData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={EMOTION_COLORS[entry.name] || EMOTION_COLORS.unknown} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionDistribution;