// import React, { useEffect, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Play, Square, WifiOff } from 'lucide-react';

// interface SessionControlsProps {
//   sessionActive: boolean;
//   toggleSession: () => void;
//   disabled?: boolean;
//   isOnline?: boolean;
// }

// const SessionControls: React.FC<SessionControlsProps> = ({
//   sessionActive,
//   toggleSession,
//   disabled = false,
//   isOnline = true
// }) => {
//   // More reliable button state handling
//   const [buttonDisabled, setButtonDisabled] = React.useState(false);
//   const sessionStateRef = useRef(sessionActive);
  
//   // Track session state changes
//   useEffect(() => {
//     sessionStateRef.current = sessionActive;
//   }, [sessionActive]);
  
//   const handleButtonClick = () => {
//     if (buttonDisabled) return;
    
//     setButtonDisabled(true);
    
//     try {
//       // Simply call toggleSession without showing toast messages
//       toggleSession();
//     } catch (error) {
//       console.error("Error toggling session:", error);
//     }
    
//     // Use different timeout durations for start/end
//     const timeoutDuration = sessionActive ? 300 : 600;
//     setTimeout(() => setButtonDisabled(false), timeoutDuration);
//   };

//   return (
//     <div className="mb-4 flex justify-center">
//       <Button
//         onClick={handleButtonClick}
//         variant={sessionActive ? "destructive" : "default"}
//         className="w-full md:w-auto"
//         disabled={buttonDisabled || (!sessionActive && (disabled || !isOnline))}
//         data-state={buttonDisabled ? "loading" : "idle"}
//       >
//         {sessionActive ? (
//           <>
//             <Square className="mr-2" size={16} />
//             End Session
//           </>
//         ) : (
//           <>
//             {!isOnline || disabled ? <WifiOff className="mr-2" size={16} /> : <Play className="mr-2" size={16} />}
//             Start Session
//           </>
//         )}
//       </Button>
//     </div>
//   );
// };

// export default SessionControls;

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, WifiOff } from "lucide-react";
import { useEmotionBuffer } from "@/hooks/facial-recognition/useEmotionBuffer";

interface SessionControlsProps {
  sessionActive: boolean;
  toggleSession: () => void;
  disabled?: boolean;
  isOnline?: boolean;
}

const SessionControls: React.FC<SessionControlsProps> = ({
  sessionActive,
  toggleSession,
  disabled = false,
  isOnline = true,
}) => {
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const sessionStateRef = useRef(sessionActive);

  const { processEmotionBuffer, resetBuffer } = useEmotionBuffer();

  useEffect(() => {
    sessionStateRef.current = sessionActive;
  }, [sessionActive]);

  const handleProcessEmotion = (emotion: string, confidence: number) => {
    console.log(`Stable Emotion Detected: ${emotion} with confidence: ${confidence}`);
  };

  const handleButtonClick = () => {
    if (buttonDisabled) return;

    setButtonDisabled(true);

    try {
      toggleSession();

      if (sessionActive) {
        processEmotionBuffer(handleProcessEmotion); // Pass the callback function
        resetBuffer();
      }
    } catch (error) {
      console.error("Error toggling session:", error);
    }

    const timeoutDuration = sessionActive ? 300 : 600;
    setTimeout(() => setButtonDisabled(false), timeoutDuration);
  };

  return (
    <div className="mb-4 flex justify-center">
      <Button
        onClick={handleButtonClick}
        variant={sessionActive ? "destructive" : "default"}
        className="w-full md:w-auto"
        disabled={buttonDisabled || (!sessionActive && (disabled || !isOnline))}
        data-state={buttonDisabled ? "loading" : "idle"}
      >
        {sessionActive ? (
          <>
            <Square className="mr-2" size={16} />
            End Session
          </>
        ) : (
          <>
            {!isOnline || disabled ? (
              <WifiOff className="mr-2" size={16} />
            ) : (
              <Play className="mr-2" size={16} />
            )}
            Start Session
          </>
        )}
      </Button>
    </div>
  );
};

export default SessionControls;
