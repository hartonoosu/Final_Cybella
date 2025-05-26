
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isPlaying, onClick }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={`${isPlaying ? "bg-primary text-primary-foreground" : ""}`}
    >
      {isPlaying ? <Square size={16} /> : <Play size={16} />}
    </Button>
  );
};

export default PlayButton;
