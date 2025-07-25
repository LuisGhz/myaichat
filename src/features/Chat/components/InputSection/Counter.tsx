import { useEffect, useState } from "react";

type Props = {
  isRecording: boolean;
  onTimedOut: () => void;
  duration?: number; // duration in seconds, optional, defaults to 60
};

export const DURATION = 60; // Default duration in seconds

export const Counter = ({ isRecording, onTimedOut }: Props) => {
  const [time, setTime] = useState<number>(DURATION);

  useEffect(() => {
    let interval: number | undefined;

    if (isRecording) {
      setTime(DURATION); // Reset to duration when recording starts
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            // Time has reached 1, so next tick will be 0
            clearInterval(interval);
            onTimedOut();
            return 0;
          }
        });
      }, 1000);
    } else {
      setTimeout(() => setTime(DURATION), 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  // Format time as M:SS
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div
      className={`bg-cop-7 rounded-full w-10 h-10 absolute -top-0 
          z-0 flex justify-center items-top pt-1 text-white bottom-10 transition-all duration-100 ${
            isRecording ? "h-16 -top-7" : ""
          }`}
    >
      <span>{formattedTime}</span>
    </div>
  );
};
