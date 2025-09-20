import { useEffect, useRef, useState } from "react";

type Options = {
  fftSize?: number; // must be power of 2, default 1024
  smoothingTimeConstant?: number; // 0..1, default 0.85
  gain?: number; // visual scaling, default 1.5
};

// Computes a normalized audio level (0..1) from a MediaStream when active.
// Manages AudioContext/AnalyserNode lifetime and cleans up automatically.
export function useAudioLevel(
  stream: MediaStream | null,
  active: boolean,
  opts: Options = {}
) {
  const { fftSize = 1024, smoothingTimeConstant = 0.85, gain = 1.5 } = opts;
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Float32Array | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!active || !stream) {
      stopLevelMeter();
      cleanAudioAnalysis();
      setLevel(0);
      return;
    }

    // Prefer standard, fallback to prefixed if available
    type W = Window & { webkitAudioContext?: typeof AudioContext };
    const AC =
      typeof AudioContext !== "undefined"
        ? AudioContext
        : (window as W).webkitAudioContext;
    if (!AC) {
      // No AudioContext available; skip visualization
      return;
    }

    const audioContext = new AC();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = smoothingTimeConstant;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceNodeRef.current = source;
  const arrBuf = new ArrayBuffer(analyser.fftSize * 4); // float32 bytes
  dataArrayRef.current = new Float32Array(arrBuf);

    startLevelMeter(gain);

    return () => {
      stopLevelMeter();
      cleanAudioAnalysis();
      setLevel(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stream, fftSize, smoothingTimeConstant]);

  const startLevelMeter = (visualGain: number) => {
    if (!analyserRef.current || !dataArrayRef.current) return;
  const analyser = analyserRef.current;
  const dataArray = dataArrayRef.current!;

    const tick = () => {
      analyser.getFloatTimeDomainData(
        dataArray as unknown as Float32Array<ArrayBuffer>
      );
      let sumSquares = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i]; // already in -1..1
        sumSquares += v * v;
      }
      const rms = Math.sqrt(sumSquares / dataArray.length); // 0..1
      const next = Math.max(0, Math.min(1, rms * visualGain));
      setLevel(next);
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);
  };

  const stopLevelMeter = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  const cleanAudioAnalysis = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {
        /* ignore */
      }
      sourceNodeRef.current = null;
    }
    if (analyserRef.current) {
      try {
        analyserRef.current.disconnect();
      } catch {
        /* ignore */
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

  return level;
}
