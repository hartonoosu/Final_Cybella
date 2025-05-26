import React from "react";
import VoicePlayback from "../VoicePlayback";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AIMessageProps {
  text: string;
  autoplay?: boolean;
  showControls?: boolean;
  voiceGender: "male" | "female";
}

const AIMessage: React.FC<AIMessageProps> = ({ text, autoplay = false, showControls = false,voiceGender }) => {
  return (
    <div className="flex items-start gap-2">
      <Avatar className="border border-primary bg-primary/10 h-8 w-8">
        <AvatarFallback className="text-primary text-xs">AI</AvatarFallback>
      </Avatar>

      <div className="bg-muted/30 rounded-lg rounded-tl-none p-2 max-w-[90%]">
        <p className="text-sm">{text}</p>
        {showControls && (
          <div className="mt-2 flex justify-end">
            <VoicePlayback text={text} autoplay={true} voiceGender={voiceGender} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMessage;