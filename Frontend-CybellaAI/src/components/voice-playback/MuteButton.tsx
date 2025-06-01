
import React from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface MuteButtonProps {
  isMuted: boolean;
  onClick: () => void;
}

const MuteButton: React.FC<MuteButtonProps> = ({ isMuted, onClick }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
    >
      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </Button>
  );
};

export default MuteButton;
