
import { useEffect } from 'react';

interface UseAnimationFrameLoopProps {
  isActive: boolean;
  callback: (timestamp: number) => void;
}

export function useAnimationFrameLoop({ isActive, callback }: UseAnimationFrameLoopProps) {
  useEffect(() => {
    if (!isActive) return;
    
    let animationFrameId: number;
    
    const animate = (timestamp: number) => {
      callback(timestamp);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, callback]);
}
