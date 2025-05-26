
import React, { useEffect, useState, useRef } from 'react';

interface AudioVisualizerProps {
  isListening: boolean;
  audioData?: Uint8Array;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isListening, audioData }) => {
  const [barHeights, setBarHeights] = useState<number[]>(Array(10).fill(3));
  
  // Update the visualization when the listening state or audio data changes
  useEffect(() => {
    if (!isListening) {
      setBarHeights(Array(10).fill(3));
      return;
    }
    
    if (audioData) {
      // Use actual audio data if available
      const bars = Array(10).fill(0).map((_, i) => {
        const index = Math.floor(i * (audioData.length / 10));
        // Scale the value to a reasonable bar height (3-20px)
        return Math.max(3, Math.min(20, 3 + (audioData[index] / 255) * 17));
      });
      setBarHeights(bars);
    } else {
      // Fallback to simulation if no audio data
      const interval = setInterval(() => {
        setBarHeights(
          Array(10).fill(0).map(() => 
            isListening 
              ? Math.max(3, Math.floor(Math.random() * 20))
              : 3
          )
        );
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isListening, audioData]);

  return (
    <div className="audio-wave">
      {barHeights.map((height, index) => (
        <div
          key={index}
          className="audio-wave-bar"
          style={{ 
            height: `${height}px`,
            opacity: isListening ? 1 : 0.5,
            backgroundColor: isListening ? '#4f46e5' : '#a8a8a8',
            transition: 'height 0.2s ease-in-out, background-color 0.3s ease'
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        .audio-wave {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          height: 30px;
        }
        .audio-wave-bar {
          width: 4px;
          border-radius: 2px;
          transform-origin: bottom;
        }
      `}} />
    </div>
  );
};

export default AudioVisualizer;
