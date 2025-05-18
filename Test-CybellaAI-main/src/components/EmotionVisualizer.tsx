import React, { useEffect, useMemo } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { EmotionDataPoint } from '@/hooks/dashboard/useEmotionData';
import { Emotion } from '@/components/EmotionDisplay';

// Map emotions to consistent color values with purple theme
const emotionColorMap: Record<Emotion, string> = {
  happy: '#9b87f5',      // primary purple
  sad: '#a78bfa',        // lavender
  neutral: '#9ca3af',    // gray
  angry: '#f87171',      // soft red
  surprised: '#c084fc',  // bright purple
  fearful: '#d8b4fe',    // light purple
  stressed: '#fb923c',   // orange
  anxious: '#c084fc',    // purple
  depressed: '#7e69ab',  // dark purple
  disgusted: '#9333ea',  // deep purple
  contempt: '#e879f9',   // pink purple
  confused: '#d8b4fe',   // light purple
  calm:'',
  disgust:'',
  "too short":'',
  "too soft":'',
  "too noisy":'',
};

// Mapping emotions to numeric values for the chart
const emotionValueMap: Record<Emotion, number> = {
  "too noisy":16,
  "too soft":15,
  "too short":14,
  disgust:13,
  calm:12,
  happy: 11,
  surprised: 10,
  neutral: 9,
  confused: 8,
  anxious: 7,
  stressed: 6,
  sad: 5,
  contempt: 4,
  fearful: 3,
  disgusted: 2,
  depressed: 1,
  angry: 0,
};

// Format timestamp to readable time
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

// Format emotion data for chart display
const formatEmotionData = (data: EmotionDataPoint[]) => {
  return data.map((point) => ({
    timestamp: point.timestamp,
    timeFormatted: formatTimestamp(point.timestamp),
    emotionValue: point.emotion ? emotionValueMap[point.emotion] : null,
    emotion: point.emotion,
    confidence: point.confidence
  }));
};

interface EmotionVisualizerProps {
  emotionData: EmotionDataPoint[];
  animationActive?: boolean;
  title?: string;
  height?: number | string;
}

const EmotionVisualizer: React.FC<EmotionVisualizerProps> = ({ 
  emotionData, 
  animationActive = true,
  title = "Voice Emotion Over Time",
  height = 200
}) => {
  const isMobile = useIsMobile();
  const chartHeight = isMobile ? 150 : height;
  
  const formattedData = useMemo(() => formatEmotionData(emotionData), [emotionData]);
  
  // Determine color for the line based on the most recent emotion
  const lineColor = useMemo(() => {
    if (emotionData.length === 0 || !emotionData[emotionData.length - 1].emotion) {
      return emotionColorMap.neutral;
    }
    return emotionColorMap[emotionData[emotionData.length - 1].emotion];
  }, [emotionData]);

  return (
    <div className="w-full p-2 md:p-4 bg-purple-100/60 backdrop-blur-sm rounded-lg border border-purple-200 shadow-purple-glow">
      {title && <h3 className="text-sm md:text-base font-medium mb-2 text-center text-purple-900">{title}</h3>}
      
      <div style={{ width: '100%', height: chartHeight }}>
        <ChartContainer 
          config={{
            voiceEmotion: {
              label: "Voice Emotion",
              color: lineColor,
            }
          }}
        >
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 10,
              left: -20, // Reduce left margin to save space
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            
            <XAxis 
              dataKey="timeFormatted" 
              tick={{ fontSize: isMobile ? 8 : 10 }}
              tickLine={false}
              axisLine={{ opacity: 0.3 }}
              interval="preserveStartEnd"
              height={20}
              scale="time"
            />
            
            <YAxis
              dataKey="emotionValue"
              domain={[0, 11]}
              tickFormatter={(value) => {
                // Convert back to emotion names for y-axis labels
                const emotions = Object.entries(emotionValueMap);
                for (const [emotion, val] of emotions) {
                  if (val === value) {
                    return emotion.slice(0, 3); // Show first 3 letters only
                  }
                }
                return '';
              }}
              tick={{ fontSize: isMobile ? 8 : 10 }}
              tickLine={false}
              axisLine={{ opacity: 0.3 }}
              width={30}
            />
            
            <ReferenceLine y={9} stroke="#9ca3af" strokeDasharray="3 3" />
            
            <ChartTooltip 
              content={<ChartTooltipContent 
                formatter={(value, name, props) => {
                  const emotion = props.payload.emotion;
                  return emotion ? `${emotion} (${Math.round(props.payload.confidence * 100)}%)` : 'None';
                }}
              />} 
            />
            
            <Line
              type="monotone"
              dataKey="emotionValue"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ stroke: lineColor, strokeWidth: 1, r: 2, fill: '#fff' }}
              activeDot={{ r: 6 }}
              animationDuration={500}
              isAnimationActive={animationActive}
            />
          </LineChart>
        </ChartContainer>
      </div>
      
      <div className="flex justify-center mt-1 md:mt-2">
        <div className="flex flex-wrap justify-center gap-1 md:gap-2 text-2xs md:text-xs max-w-full">
          {Object.entries(emotionColorMap).map(([emotion, color]) => (
            <div key={emotion} className="flex items-center">
              <div 
                className="w-2 h-2 md:w-3 md:h-3 rounded-full mr-1" 
                style={{ backgroundColor: color }} 
              />
              <span className="text-purple-900">{emotion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionVisualizer;