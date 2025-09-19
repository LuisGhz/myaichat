import { useMicrophone } from "features/Chat/hooks/useMicrophone";
import { Microphone20SolidIcon } from "icons/Microphone20SolidIcon";
import { useRef, useEffect } from "react";
import { useChatStore, useChatStoreActions } from "store/app/ChatStore";

type Props = {
  buttonClassName?: string;
  onTranscription: (transcription: string) => void;
};

export const MicrophoneButton = ({
  buttonClassName,
  onTranscription,
}: Props) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isRecordingAudio, isSendingAudio } = useChatStore();
  const { setIsRecordingAudio } = useChatStoreActions();
  const { transcribeAudio } = useMicrophone();

  useEffect(() => {
    return () => {
      cleanStreamRef();
      cleanMediaRecorderRef();
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
    await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        streamRef.current = stream;
      });
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
      if (res) onTranscription(res.content);
      cleanStreamRef();
      cleanMediaRecorderRef();
    };
  };

  const cleanStreamRef = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const cleanMediaRecorderRef = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
    }
  };

  return (
    <button
      className={`${buttonClassName}`}
      type="button"
      aria-label="Voice input"
      title="Voice input"
      ref={buttonRef}
      onClick={handleRecording}
    >
      <Microphone20SolidIcon className="w-6 h-6 fill-gray-700 dark:fill-gray-200" />
    </button>
  );
};
