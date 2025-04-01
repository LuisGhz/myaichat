import { MicrophoneIcon } from "assets/icons/MicrophoneIcon";
import { ScreensWidth } from "consts/ScreensWidth";
import { useState, useEffect, useRef } from "react";

type Props = {
  onTranscription: (text: string) => void;
  isTextAreaFocused: boolean;
};

export const Microphone = ({ onTranscription, isTextAreaFocused }: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
    <div
      className={`${
        isTextAreaFocused && window.innerWidth < ScreensWidth.tablet
          ? "ms-0"
          : "ms-4"
      }`}
    >
      <button
        className={`text-white ${
          isRecording ? "bg-red-500 hover:bg-red-600" : "hover:bg-cop-6"
        } md:py-2 md:px-3 my-2 md:my-0 rounded-lg transition-all duration-300 cursor-pointer absolute right-4 md:relative md:right-0`}
        aria-label={
          isRecording ? "Recording in progress" : "Activate voice input"
        }
        type="button"
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={isRecording ? stopRecording : undefined}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
      >
        <MicrophoneIcon />
        {isRecording && <span className="sr-only">Recording...</span>}
      </button>
    </div>
  );
};
