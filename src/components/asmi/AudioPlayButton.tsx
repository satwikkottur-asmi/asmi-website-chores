import { useEffect, useRef, useState } from "react";

type Props = { src?: string; color?: string };

// Silent placeholder mp3 (base64). Swap `src` prop with real recordings later.
const PLACEHOLDER =
  "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAACgAB//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAoAv4nMAAAAAAAAAAAAAAAAAAAAA";

export function AudioPlayButton({ src = PLACEHOLDER, color = "var(--color-terracotta)" }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio(src);
    a.preload = "none";
    audioRef.current = a;
    const onEnd = () => setPlaying(false);
    a.addEventListener("ended", onEnd);
    return () => { a.pause(); a.removeEventListener("ended", onEnd); };
  }, [src]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.currentTime = 0; a.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <button
        onClick={toggle}
        aria-label={playing ? "Pause call recording" : "Play call recording"}
        className="relative flex items-center justify-center rounded-full transition-all"
        style={{
          width: 44, height: 44,
          border: `1.5px solid ${color}`,
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(194,91,63,0.08)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {playing ? (
          <span className="flex gap-[3px]">
            <span style={{ width: 3, height: 12, background: color, display: "block" }} />
            <span style={{ width: 3, height: 12, background: color, display: "block" }} />
          </span>
        ) : (
          <span
            style={{
              width: 0, height: 0,
              borderLeft: `10px solid ${color}`,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              marginLeft: 2,
            }}
          />
        )}
        {playing && (
          <span className="absolute left-full ml-3 flex items-end gap-[2px]" style={{ height: 16 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                style={{
                  width: 2,
                  background: color,
                  display: "block",
                  height: 16,
                  transformOrigin: "center bottom",
                  animation: `wave-bar 0.9s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </span>
        )}
      </button>
      <span
        className="font-mono"
        style={{ fontSize: 10, color: "var(--color-stone-dim)", letterSpacing: "0.12em", textTransform: "uppercase" }}
      >
        Listen
      </span>
    </div>
  );
}
