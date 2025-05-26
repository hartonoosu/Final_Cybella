import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Trigger words for Beyond Blue
const LEVEL_1_TRIGGERS = ["anxious", "depressed", "overwhelmed", "hopeless", "sad", "stressed", "too much", "scared"];

// Trigger words for Lifeline
const LEVEL_2_TRIGGERS = ["suicide", "want to die", "wanna die", "kill myself", "end it", "can't go on", "don't want to live", "don't wanna live", "don't wanna leave", "don't want to leave"];

interface UserMessageProps {
  text: string;
}

const getSupportInfo = (text: string): "beyondblue" | "lifeline" | null => {
  const lower = text.toLowerCase();

  if (LEVEL_2_TRIGGERS.some((word) => lower.includes(word))) return "lifeline";
  if (LEVEL_1_TRIGGERS.some((word) => lower.includes(word))) return "beyondblue";

  return null;
};

const UserMessage: React.FC<UserMessageProps> = ({ text }) => {
  const support = getSupportInfo(text);

  // To return a new Warning card after Speech-To-Text card
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3 justify-end">
        <div className="bg-primary/90 text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-[90%] shadow-sm">
          <p className="text-sm">{text}</p>
        </div>

        <Avatar className="border border-primary/50 bg-background">
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      </div>

      {/* Beyondblue card  */}
      {support === "beyondblue" && (
        <div className="bg-blue-50 border border-blue-300 text-blue-900 p-3 rounded-md text-sm max-w-md mx-auto shadow-sm text-center">
          <strong>It’s okay to feel this way.</strong> I’m here with you.
          <br />
          You can also talk to someone at:<br />
          <a
            href="https://www.beyondblue.org.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 font-semibold text-base underline mt-1 inline-block"
          >
            www.beyondblue.org.au
          </a>
          <div className="mt-1 text-sm">
            or call{" "}
            <a
              href="tel:1300224636"
              className="text-blue-700 font-semibold text-base underline"
            >
              1300 22 4636
            </a>
          </div>
        </div>
      )}
      {/* Lifeline card */}
      {support === "lifeline" && (
       <div className="bg-red-50 border border-red-300 text-red-800 p-3 rounded-md text-sm max-w-md mx-auto shadow-sm text-center">
        <strong>You are not alone.</strong> I'm really glad you reached out.
        <br />
        If you're in crisis, please talk to someone right now:<br />
        <a
          href="https://www.lifeline.org.au/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 font-semibold text-base underline mt-1 inline-block"
        >
          www.lifeline.org.au
        </a>
        <div className="mt-1 text-sm">
          or call{" "}
          <a
            href="tel:131114"
            className="text-blue-700 font-semibold text-base underline"
          >
            13 11 14
          </a>
        </div>
      </div>
      )}
    </div>
  );
};

export default UserMessage;