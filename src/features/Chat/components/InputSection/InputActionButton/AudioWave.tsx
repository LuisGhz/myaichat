type Props = {
  level: number; // 0.0 (silence) to 1.0 (loud)
  className?: string;
  bars?: number; // number of bars to render
};

// A lightweight equalizer-style wave. Heights react to the `level` with subtle
// per-bar variance for a lively look. Decorative only.
export const AudioWave = ({ level, className, bars = 7 }: Props) => {
  const clamped = Math.max(0, Math.min(1, level));
  const min = 0.15; // minimum visible height (as a fraction of full height)
  const max = 1; // maximum height

  return (
    <div
      className={`flex items-end gap-0.5 h-6 select-none ${className ?? ""}`}
      aria-hidden="true"
      role="img"
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Stagger bars for a wave-like feel
        const phase = (i / bars) * Math.PI * 2;
        const variance = 0.25 * Math.sin(phase + clamped * Math.PI * 1.5);
        const heightFactor = Math.max(min, Math.min(max, clamped + variance));

        return (
          <span
            key={i}
            className="w-1 rounded-sm bg-gray-700 dark:bg-gray-200 transition-[height] duration-150 ease-out"
            style={{ height: `${heightFactor * 100}%` }}
          />
        );
      })}
    </div>
  );
};

AudioWave.defaultProps = {
  bars: 7,
};
