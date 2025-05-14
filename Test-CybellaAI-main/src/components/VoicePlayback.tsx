
import React from "react";
import { useSpeechSynthesis } from "@/hooks";
import PlayButton from "./voice-playback/PlayButton";
import MuteButton from "./voice-playback/MuteButton";
import VolumeSlider from "./voice-playback/VolumeSlider";

interface VoicePlaybackProps {
  text: string;
  autoplay?: boolean;
}

const VoicePlayback: React.FC<VoicePlaybackProps> = ({ text, autoplay = false }) => {
  const { isPlaying, isMuted, volume, handlePlay, handleStop, toggleMute, handleVolumeChange } = useSpeechSynthesis({
    text,
    autoplay
  });

  if (!text) return null;

  return (
    <div className="flex items-center gap-2">
      <PlayButton isPlaying={isPlaying} onClick={isPlaying ? handleStop : handlePlay} />
      <MuteButton isMuted={isMuted} onClick={toggleMute} />
      <VolumeSlider value={volume} onValueChange={handleVolumeChange} />
    </div>
  );
};

export default VoicePlayback;
