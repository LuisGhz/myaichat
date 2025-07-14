import { useRef, useEffect } from "react";
import { Spin } from "antd";
import { MicrophoneIcon } from "assets/icons/MicrophoneIcon";
import { useMicrophone } from "hooks/useMicrophone";
import {
  useCurrentChatStoreGetIsRecordingAudio,
  useCurrentChatStoreSetIsRecordingAudio,
  useCurrentChatStoreGetIsSendingAudio,
} from "store/features/chat/useCurrentChatStore";
import "./Microphone.css";
import { Counter } from "./Counter";

type Props = {
  onTranscription: (text: string) => void;
};

export const Microphone = ({ onTranscription }: Props) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const isRecordingAudio = useCurrentChatStoreGetIsRecordingAudio();
  const setIsRecordingAudio = useCurrentChatStoreSetIsRecordingAudio();
  const isSendingAudio = useCurrentChatStoreGetIsSendingAudio();
  const { transcribeAudio } = useMicrophone();

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
    if (isRecordingAudio) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    setIsRecordingAudio(true);
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
      setIsRecordingAudio(false);
    }
  };

  const onTimedOut = () => {
    stopRecording();
  };

  return (
    <div className="relative">
      <Counter isRecording={isRecordingAudio} onTimedOut={onTimedOut} />
      <div className="relative inline-block">
        <button
          className={`text-white transition-all delay-150 duration-200 ${
            isRecordingAudio
              ? "bg-red-600 hover:bg-red-700 recording-button"
              : "hover:bg-cop-6"
          } p-2 rounded-full cursor-pointer z-10 relative bg-cop-1`}
          aria-label={
            isRecordingAudio ? "Recording in progress" : "Activate voice input"
          }
          type="button"
          onClick={handleRecording}
          ref={buttonRef}
          disabled={isSendingAudio}
        >
          <MicrophoneIcon className="size-6" />
          {isRecordingAudio && <span className="sr-only">Recording...</span>}
        </button>
        {isSendingAudio && (
          <span className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-30 rounded-full">
            <Spin size="small" />
          </span>
        )}
      </div>
    </div>
  );
};
