import { useMicrophone } from "features/Chat/hooks/useMicrophone";
import { Microphone20SolidIcon } from "icons/Microphone20SolidIcon";
import { SendAltFilledIcon } from "icons/SendAltFilledIcon";
import { TrashOutlineIcon } from "icons/TrashOutlineIcon";
import { useRef, useEffect } from "react";
import { useChatStore, useChatStoreActions } from "store/app/ChatStore";
import { AudioWave } from "./AudioWave";
import { useAudioLevel } from "features/Chat/hooks/useAudioLevel";

type Props = {
  buttonClassName?: string;
  onTranscription: (transcription: string) => void;
};

export const MicrophoneButton = ({
  buttonClassName,
  onTranscription,
}: Props) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canceledRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isRecordingAudio, isSendingAudio } = useChatStore();
  const { setIsRecordingAudio } = useChatStoreActions();
  const { transcribeAudio } = useMicrophone();
  // Live audio level for the wave visualization
  const audioLevel = useAudioLevel(streamRef.current, isRecordingAudio);

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
        // create MediaRecorder and produce small chunks frequently so the
        // AudioWave can react to the audio in near real-time
        mediaRecorderRef.current = new MediaRecorder(stream);
        streamRef.current = stream;
      });
    setIsRecordingAudio(true);
    if (!mediaRecorderRef.current) return;
    // request dataavailable events every 250ms so we can animate
    mediaRecorderRef.current.start(250);

    const audioChunks: Blob[] = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      // keep a full recording array for final transcription
      audioChunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      if (canceledRef.current) {
        canceledRef.current = false;
        cleanStreamRef();
        cleanMediaRecorderRef();
        return;
      }
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

  const cancelRecording = () => {
    canceledRef.current = true;
    stopRecording();
  };

  return (
    <div className="flex items-center gap-2">
      {isRecordingAudio && (
        <button
          className="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200"
          aria-label="Cancel recording"
          title="Cancel recording"
          type="button"
          onClick={cancelRecording}
        >
          <TrashOutlineIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
      )}
      {isRecordingAudio && <AudioWave level={audioLevel} />}
      <button
        className={`${buttonClassName}`}
        type="button"
        aria-label="Voice input"
        title="Voice input"
        ref={buttonRef}
        onClick={handleRecording}
      >
        {isRecordingAudio || isSendingAudio ? (
          <SendAltFilledIcon className="w-6 h-6 cursor-pointer fill-gray-700 dark:fill-gray-200" />
        ) : (
          <Microphone20SolidIcon className="w-6 h-6 fill-gray-700 dark:fill-gray-200" />
        )}
      </button>
    </div>
  );
};
