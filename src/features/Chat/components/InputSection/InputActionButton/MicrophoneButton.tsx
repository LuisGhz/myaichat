import { useMicrophone } from "features/Chat/hooks/useMicrophone";
import { Microphone20SolidIcon } from "icons/Microphone20SolidIcon";
import { SendAltFilledIcon } from "icons/SendAltFilledIcon";
import { TrashOutlineIcon } from "icons/TrashOutlineIcon";
import { useRef, useEffect, useState } from "react";
import { useChatStore, useChatStoreActions } from "store/app/ChatStore";
import { AudioWave } from "./AudioWave";

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
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Float32Array | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const { isRecordingAudio, isSendingAudio } = useChatStore();
  const { setIsRecordingAudio } = useChatStoreActions();
  const { transcribeAudio } = useMicrophone();

  useEffect(() => {
    return () => {
      cleanStreamRef();
      cleanMediaRecorderRef();
      cleanAudioAnalysis();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Kick off live audio level analysis using Web Audio API
    if (streamRef.current) {
      setupAudioAnalysis(streamRef.current);
      startLevelMeter();
    }

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
        cleanAudioAnalysis();
        return;
      }
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const res = await transcribeAudio(audioBlob);
      if (res) onTranscription(res.content);
      cleanStreamRef();
      cleanMediaRecorderRef();
      cleanAudioAnalysis();
    };
  };

  const setupAudioAnalysis = (stream: MediaStream) => {
    // Prefer standard, fallback to prefixed if available
    type W = Window & { webkitAudioContext?: typeof AudioContext };
    const AC =
      typeof AudioContext !== "undefined"
        ? AudioContext
        : (window as W).webkitAudioContext;
    if (!AC) {
      // No AudioContext available; skip wave
      audioContextRef.current = null;
      analyserRef.current = null;
      sourceNodeRef.current = null;
      dataArrayRef.current = null;
      return;
    }

    const audioContext = new AC();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024; // granularity
    analyser.smoothingTimeConstant = 0.85; // smoothness

    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceNodeRef.current = source;
    dataArrayRef.current = new Float32Array(analyser.fftSize);
  };

  const startLevelMeter = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    const analyser = analyserRef.current;
    const dataArray =
      dataArrayRef.current as unknown as Float32Array<ArrayBuffer>;

    const tick = () => {
      analyser.getFloatTimeDomainData(dataArray);
      // Compute RMS of centered signal (values already in -1..1)
      let sumSquares = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i];
        sumSquares += v * v;
      }
      const rms = Math.sqrt(sumSquares / dataArray.length); // 0..1
      // Apply a slight gain and clamp
      const level = Math.max(0, Math.min(1, rms * 1.5));
      setAudioLevel(level);
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);
  };

  const stopLevelMeter = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setAudioLevel(0);
  };

  const cleanAudioAnalysis = () => {
    stopLevelMeter();
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {
        /* ignore disconnect errors */
      }
      sourceNodeRef.current = null;
    }
    if (analyserRef.current) {
      try {
        analyserRef.current.disconnect();
      } catch {
        /* ignore disconnect errors */
      }
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      const ctx = audioContextRef.current;
      audioContextRef.current = null;
      void ctx.close();
    }
    dataArrayRef.current = null;
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
      stopLevelMeter();
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
