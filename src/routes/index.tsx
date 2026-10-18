import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import bg from "@/assets/floral-bg.jpg";
import peony from "@/assets/peony.png";
import rose from "@/assets/rose.png";
import { SongPlayer } from "@/components/SongPlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Para Pilar — un pequeño jardín" },
      { name: "description", content: "Una carta y una canción nacidas de la admiración, la nostalgia y la posibilidad." },
      { property: "og:title", content: "Para Pilar — un pequeño jardín" },
      { property: "og:description", content: "Una carta nacida de la admiración, la nostalgia y la posibilidad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const LINES = [
  "Hay personas que no necesitan intentarlo para dejar una huella.",
  "Tú eres así: llegas con tu manera de mirar, de reír, de estar… y algo cambia.",
  "Admiro tu fuerza, incluso cuando dudas.",
  "Admiro tu sensibilidad, esa forma tuya de sentir el mundo sin hacer demasiado ruido.",
  "Admiro tus imperfecciones, porque son parte de lo que te hace verdadera.",
  "No eres perfecta. Pero a veces pareces acercarte peligrosamente a serlo.",
  "Y quizá por eso me nació escribirte una canción.",
  "Porque en cada nota cabía algo que no sabía decir de otra manera.",
  "Una melodía de nostalgia, de noches largas y de un deseo que, tal vez, puede ser real.",
  "Cada acorde guarda una impresión tuya: una sonrisa, una conversación, la calma que dejas cuando te vas.",
  "No es una promesa ni una confesión.",
  "Es solo una canción que encontró en ti su razón de existir.",
  "Y si alguna vez la escuchas con los ojos cerrados, quizá descubras todo lo increíble que alguien puede ver en ti.",
];
// steps: 0 title, 1..13 lines, 14 sign-off
const TOTAL = LINES.length + 2;
const WORD_MS = 85;

function stepDuration(i: number) {
  if (i === 0) return 1800;
  if (i === TOTAL - 1) return 2600;
  return 1300 + (LINES[i - 1] ?? "").split(" ").length * WORD_MS + 900;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const h = () => setR(m.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);
  return r;
}

function Petals({ count = 14 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 73) % 100,
        size: 8 + ((i * 7) % 10),
        dur: 14 + ((i * 5) % 12),
        delay: -((i * 3.1) % 20),
        drift: ((i % 2 ? 1 : -1) * (40 + ((i * 13) % 80))) + "px",
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}%`, width: p.size, height: p.size * 1.3,
            animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
            ["--drift" as string]: p.drift, opacity: 0.8,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

function Bloom({ src, className, label }: { src: string; className: string; label: string }) {
  const [sparks, setSparks] = useState<number[]>([]);
  const [bloom, setBloom] = useState(false);
  const fire = () => {
    setBloom(true);
    const id = Date.now();
    setSparks((s) => [...s, id]);
    setTimeout(() => setSparks((s) => s.filter((x) => x !== id)), 900);
    setTimeout(() => setBloom(false), 600);
  };
  return (
    <button
      type="button"
      aria-label={label}
      onMouseEnter={fire}
      onClick={fire}
      className={`absolute z-20 rounded-full focus-visible:outline-2 focus-visible:outline-ring ${className}`}
    >
      <img
        src={src}
        alt=""
        width={1024}
        height={1024}
        className="sway h-full w-full object-contain drop-shadow-[0_10px_20px_oklch(0.38_0.12_15/0.25)] transition-transform duration-500 ease-out"
        style={{ transform: bloom ? "scale(1.08) rotate(3deg)" : undefined }}
      />
      {sparks.map((id) =>
        Array.from({ length: 8 }, (_, k) => {
          const a = (k / 8) * Math.PI * 2;
          return (
            <span
              key={`${id}-${k}`}
              aria-hidden
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-gold"
              style={{
                animation: "sparkle 0.9s ease-out forwards",
                ["--dx" as string]: `${Math.cos(a) * 60}px`,
                ["--dy" as string]: `${Math.sin(a) * 60}px`,
                boxShadow: "0 0 8px var(--gold)",
              } as CSSProperties}
            />
          );
        }),
      )}
    </button>
  );
}

function Words({ text, instant }: { text: string; instant: boolean }) {
  if (instant) return <>{text}</>;
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="word-in inline" style={{ animationDelay: `${i * WORD_MS}ms` }}>
          {w}{" "}
        </span>
      ))}
    </>
  );
}

function Index() {
  const [opened, setOpened] = useState(false);
  const [step, setStep] = useState(0); // number of revealed steps
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotion();
  const endRef = useRef<HTMLDivElement>(null);
  const done = step >= TOTAL;

  useEffect(() => {
    if (!opened || !playing || done) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 600 : reduced ? 900 : stepDuration(step - 1));
    return () => clearTimeout(t);
  }, [opened, playing, step, done, reduced]);

  useEffect(() => {
    if (opened && step > 1) endRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "end" });
  }, [step, opened, reduced]);

  const replay = () => { setStep(0); setPlaying(true); window.scrollTo({ top: 0 }); };
  const progress = Math.min(100, (step / TOTAL) * 100);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div aria-hidden className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,var(--background)_25%,transparent_75%)] opacity-80" />
      {!reduced && <Petals count={opened ? 12 : 18} />}

      {!opened ? (
        <section className="scene-in relative z-20 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <Bloom src={peony} label="Flor de peonía" className="left-[4%] top-[8%] h-32 w-32 md:h-52 md:w-52" />
          <Bloom src={rose} label="Rosa" className="right-[4%] bottom-[8%] h-32 w-32 md:h-52 md:w-52" />
          <p className="font-display text-sm uppercase tracking-[0.4em] text-muted-foreground">un pequeño jardín para</p>
          <h1 className="mt-4 font-script text-7xl text-primary md:text-9xl">Pilar</h1>
          <div className="gold-rule my-8 w-48" />
          <p className="max-w-md font-display text-xl italic text-muted-foreground">
            Algunas palabras crecen despacio. Estas esperaron su momento.
          </p>
          <button
            onClick={() => setOpened(true)}
            className="group relative mt-10 rounded-full bg-primary px-8 py-4 font-display text-lg tracking-wide text-primary-foreground shadow-[0_15px_40px_-10px_oklch(0.38_0.12_15/0.6)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-10px_oklch(0.74_0.11_80/0.7)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <span className="absolute inset-0 rounded-full ring-1 ring-gold/60 glow-pulse" aria-hidden />
            Abrir este pequeño jardín ✿
          </button>
        </section>
      ) : (
        <section className="scene-in relative z-20 flex min-h-screen justify-center px-4 py-16 md:py-24">
          <Bloom src={rose} label="Rosa" className="left-[-2rem] top-6 hidden h-44 w-44 md:block lg:left-[6%]" />
          <Bloom src={peony} label="Peonía" className="right-[-2rem] bottom-10 hidden h-48 w-48 md:block lg:right-[6%]" />

          <article
            aria-live="polite"
            className="paper-card relative w-full max-w-2xl rounded-[2rem] px-7 pb-28 pt-12 md:px-14 md:pt-16"
          >
            <div className="-mx-2 mb-10 md:-mx-6">
              <SongPlayer />
            </div>
            {step >= 1 && (
              <h2 className="word-in text-center font-display text-5xl font-bold text-primary md:text-6xl">Pilar</h2>
            )}
            {step >= 1 && <div className="gold-rule mx-auto my-8 w-32 word-in" />}

            <div className="space-y-5 font-body text-[1.05rem] leading-relaxed md:text-lg">
              {LINES.map((l, i) =>
                step >= i + 2 ? (
                  <p key={i} className={i === 5 || i === 12 ? "font-display text-xl italic text-primary md:text-2xl" : ""}>
                    <Words text={l} instant={reduced || step > i + 2 + 1} />
                  </p>
                ) : null,
              )}
            </div>

            {step >= TOTAL && (
              <footer className="word-in mt-12 text-center">
                <div className="gold-rule mx-auto mb-6 w-40" />
                <p className="font-display text-3xl font-bold text-primary">Para Pilar</p>
                <p className="mt-2 font-display text-lg italic text-muted-foreground">
                  Una canción nacida de la admiración, la nostalgia y la posibilidad.
                </p>
                <div aria-hidden className="mt-6 text-3xl text-gold glow-pulse">✿ ❀ ✿</div>
              </footer>
            )}
            <div ref={endRef} />
          </article>

          {done && !reduced && <Finale />}

          <div className="fixed inset-x-0 bottom-4 z-30 mx-auto flex w-[min(92%,34rem)] items-center gap-4 rounded-full paper-card px-5 py-3">
            <button
              onClick={() => (done ? replay() : setPlaying((p) => !p))}
              aria-label={done ? "Volver a leer" : playing ? "Pausar" : "Continuar"}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {done ? "↺" : playing ? "❚❚" : "▶"}
            </button>
            <div className="flex-1">
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label="Progreso de la carta"
                className="h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div className="h-full rounded-full bg-gradient-to-r from-blush via-primary to-gold transition-[width] duration-1000 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>
            {!done && (
              <button onClick={() => setStep(TOTAL)} className="font-display text-sm italic text-muted-foreground hover:text-primary">
                Leer todo
              </button>
            )}
            {done && step > 0 && (
              <button onClick={replay} className="font-display text-sm italic text-muted-foreground hover:text-primary">Volver a leer</button>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function Finale() {
  const bits = useMemo(() => Array.from({ length: 28 }, (_, i) => i), []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {bits.map((i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${(i * 37) % 100}%`, width: 10, height: 13,
            animationDuration: `${5 + (i % 5)}s`, animationDelay: `${(i % 7) * 0.2}s`,
            animationIterationCount: 1,
            ["--drift" as string]: `${(i % 2 ? 1 : -1) * 80}px`,
            background: i % 3 === 0 ? "var(--gold)" : undefined,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
