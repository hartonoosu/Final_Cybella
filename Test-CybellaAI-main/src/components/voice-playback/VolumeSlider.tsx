
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";

interface VolumeSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ value, onValueChange }) => {
  const handleChange = (values: number[]) => {
    onValueChange(values[0]);
  };

  // Select the appropriate volume icon based on the current level
  const VolumeIcon = () => {
    if (value === 0) return <VolumeX size={16} />;
    if (value < 0.33) return <Volume size={16} />;
    if (value < 0.66) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  return (
    <div className="flex items-center gap-2 w-32">
      <VolumeIcon />
      <Slider
        defaultValue={[value]}
        value={[value]}
        max={1}
        step={0.01}
        onValueChange={handleChange}
        className="flex-1"
      />
    </div>
  );
};

export default VolumeSlider;
