import { useState, useRef, useEffect } from "react";
import { MicrophoneIcon } from "assets/icons/MicrophoneIcon";
import { useMicrophone } from "hooks/useMicrophone";
import "./Microphone.css";
import { Counter } from "./Counter";

type Props = {
  onTranscription: (text: string) => void;
};

export const Microphone = ({ onTranscription }: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { transcribeAudio, isSendingAudio } = useMicrophone();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
    });

    return () => {
      if (mediaRecorderRef.current?.state === "recording")
        mediaRecorderRef.current.stop();
    };
  }, []);

  const handleRecording = () => {
    if (isSendingAudio) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.start();

    const audioChunks: Blob[] = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const res = await transcribeAudio(audioBlob);
      if (res) {
        onTranscription(res.content);
      }
    };
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const onTimedOut = () => {
    stopRecording();
  };

  return (
    <div className="relative">
      <Counter isRecording={isRecording} onTimedOut={onTimedOut} />
      <button
        className={`text-white transition-all delay-150 duration-200 ${
          isRecording
            ? "bg-red-600 hover:bg-red-700 recording-button"
            : "hover:bg-cop-6"
        } p-2 rounded-full cursor-pointer z-10 relative bg-cop-1`}
        aria-label={
          isRecording ? "Recording in progress" : "Activate voice input"
        }
        type="button"
        onClick={handleRecording}
        ref={buttonRef}
        disabled={isSendingAudio}
      >
        <MicrophoneIcon className="size-6" />
        {isRecording && <span className="sr-only">Recording...</span>}
      </button>
    </div>
  );
};
