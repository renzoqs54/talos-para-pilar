import { useEffect, useRef, useState } from "react";
import { publicAssetPath } from "@/lib/public-assets";

export const SONG_SRC = publicAssetPath("audio/natsunokiri.mp3");

function fmt(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function SongPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(0.8);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (audio.current) audio.current.volume = vol;
  }, [vol]);

  const toggle = async () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      try { await a.play(); } catch { setError(true); }
    } else a.pause();
  };

  const pct = dur ? (time / dur) * 100 : 0;

  return (
    <div className="paper-card relative mx-auto w-full max-w-2xl rounded-[1.5rem] px-5 py-4 md:px-7">
      <audio
        ref={audio}
        src={SONG_SRC}
        preload="metadata"
        onPlay={() => { setPlaying(true); setError(false); }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onError={() => setError(true)}
      />
      <p className="text-center font-display text-base italic text-muted-foreground md:text-lg">
        La canción que nació de estas palabras
      </p>
      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar canción" : "Reproducir canción"}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground shadow-[0_10px_30px_-8px_oklch(0.38_0.12_15/0.6)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {playing && <span aria-hidden className="absolute inset-0 rounded-full ring-2 ring-gold/60 glow-pulse" />}
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="min-w-0 flex-1">
          <div className="relative h-5">
            <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-blush via-primary to-gold" style={{ width: `${pct}%` }} />
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-primary"
              style={{ left: `${pct}%` }}
            >
              ✿
            </span>
            <input
              type="range"
              min={0}
              max={dur || 0}
              step={0.1}
              value={time}
              aria-label="Posición de la canción"
              aria-valuetext={`${fmt(time)} de ${fmt(dur)}`}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (audio.current) audio.current.currentTime = v;
                setTime(v);
              }}
              className="absolute inset-0 w-full cursor-pointer opacity-0"
            />
          </div>
          <div className="mt-1 flex justify-between font-display text-xs tabular-nums text-muted-foreground">
            <span>{fmt(time)}</span>
            <span>{fmt(dur)}</span>
          </div>
        </div>
        <label className="hidden items-center gap-2 text-muted-foreground sm:flex">
          <span aria-hidden className="text-sm">♪</span>
          <span className="sr-only">Volumen</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={vol}
            onChange={(e) => setVol(Number(e.target.value))}
            className="w-20 accent-primary"
          />
        </label>
      </div>
      {error && (
        <p role="status" className="mt-2 text-center text-xs italic text-muted-foreground">
          No se pudo cargar la canción. Comprueba que el archivo original natsunokiri.mp3 esté en public/audio y vuelve a cargar la página.
        </p>
      )}
    </div>
  );
}
