import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from '@/hooks/use-mobile';

interface UserTranscriptionProps {
  transcription: string;
  interimTranscript: string;
  isListening: boolean;
  sessionActive: boolean;
}

const UserTranscription: React.FC<UserTranscriptionProps> = ({
  transcription,
  interimTranscript,
  isListening,
  sessionActive
}) => {
  const hasTranscription = Boolean(transcription || interimTranscript);
  const isMobile = useIsMobile();
  
  if (!sessionActive || !hasTranscription) {
    return null;
  }
  
  return (
    <div className="flex items-start gap-1.5 md:gap-3 justify-end">
      <div className="bg-purple-600/90 text-white rounded-lg rounded-tr-none p-1.5 md:p-3 max-w-[90%] shadow-sm">
        <p className="text-2xs md:text-sm">
          {transcription || interimTranscript}
          {isListening && <span className="animate-pulse">...</span>}
        </p>
      </div>
      
      <Avatar className="border border-purple-400 bg-purple-100/50 h-5 w-5 md:h-8 md:w-8">
        <AvatarFallback className="text-2xs md:text-xs text-purple-800">You</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserTranscription;
