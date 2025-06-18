import { MicrophoneIcon } from "assets/icons/MicrophoneIcon";
import { useState, useEffect, useRef } from "react";
import "./Microphone.css";

type Props = {
  onTranscription: (text: string) => void;
};

export const Microphone = ({ onTranscription }: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ");

        if (event.results[0].isFinal && onTranscription) {
          onTranscription(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscription]);

  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      className={`text-white transition-all delay-150 duration-200 ${
        isRecording
          ? "bg-red-600 hover:bg-red-700 recording-button"
          : "hover:bg-cop-6"
      } p-2 rounded-full cursor-pointer`}
      aria-label={
        isRecording ? "Recording in progress" : "Activate voice input"
      }
      type="button"
      onClick={handleRecording}
      ref={buttonRef}
    >
      <MicrophoneIcon className="size-6" />
      {isRecording && <span className="sr-only">Recording...</span>}
    </button>
  );
};
