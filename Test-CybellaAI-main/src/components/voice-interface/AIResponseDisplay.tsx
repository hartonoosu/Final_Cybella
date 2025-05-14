
import React from 'react';
import VoicePlayback from '../VoicePlayback';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AIResponseDisplayProps {
  processingInput: boolean;
  aiResponse: string;
  shouldPlayVoice: boolean;
  sessionActive: boolean;
}

const AIResponseDisplay: React.FC<AIResponseDisplayProps> = ({
  processingInput,
  aiResponse,
  shouldPlayVoice,
  sessionActive
}) => {
  return (
    <div className="flex flex-col space-y-3">
      {(processingInput || aiResponse) && (
        <div className="flex items-start gap-2">
          <Avatar className="border border-primary bg-primary/10 h-8 w-8">
            <AvatarFallback className="text-primary text-xs">AI</AvatarFallback>
          </Avatar>
          
          <div className="bg-muted/30 rounded-lg rounded-tl-none p-2 max-w-[90%]">
            {processingInput && !aiResponse ? (
              <p className="text-sm text-muted-foreground">
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse mr-1"></span>
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse mx-1"></span>
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse ml-1"></span>
              </p>
            ) : aiResponse ? (
              <div>
                <p className="text-sm">{aiResponse}</p>
                {shouldPlayVoice && (
                  <div className="mt-2 flex justify-end">
                    <VoicePlayback 
                      text={aiResponse}
                      autoplay={shouldPlayVoice}
                    />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {!processingInput && !aiResponse && sessionActive && (
        <div className="text-center py-2">
          <p className="text-sm text-muted-foreground">Say something to start the conversation</p>
        </div>
      )}
      
      {!sessionActive && (
        <div className="text-center py-2">
          <p className="text-sm text-muted-foreground">Start a session to chat with Cybella</p>
        </div>
      )}
    </div>
  );
};

export default AIResponseDisplay;
