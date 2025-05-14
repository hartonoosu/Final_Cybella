import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMessageProps {
  text: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ text }) => {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="bg-primary/90 text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-[90%] shadow-sm">
        <p className="text-sm">{text}</p>
      </div>

      <Avatar className="border border-primary/50 bg-background">
        <AvatarFallback>You</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserMessage;