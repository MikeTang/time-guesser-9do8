"use client";

import { useRouter } from "next/navigation";
import Mascot from "./Mascot";

interface Duration {
  seconds: number;
  label: string;
  emoji: string;
  cue: string;
  /** Tailwind gradient classes for the card */
  gradient: string;
  /** Tailwind ring colour for focus */
  ring: string;
  /** Text colour for the label */
  labelColour: string;
}

const DURATIONS: Duration[] = [
  {
    seconds: 60,
    label: "1 min",
    emoji: "🍎",
    cue: "Quick snack",
    gradient: "from-orange-300 to-amber-400",
    ring: "focus-visible:outline-orange-500",
    labelColour: "text-orange-900",
  },
  {
    seconds: 120,
    label: "2 min",
    emoji: "🦷",
    cue: "Brush teeth",
    gradient: "from-sky-300 to-cyan-400",
    ring: "focus-visible:outline-cyan-500",
    labelColour: "text-sky-900",
  },
  {
    seconds: 300,
    label: "5 min",
    emoji: "📺",
    cue: "Short show",
    gradient: "from-violet-300 to-purple-400",
    ring: "focus-visible:outline-purple-500",
    labelColour: "text-violet-900",
  },
];

/** Decorative background blobs */
function BgBlobs() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Top-left blob */}
      <div
        className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-pink-200 opacity-40 blur-3xl"
        style={{ animationDelay: "0s" }}
      />
      {/* Top-right blob */}
      <div className="absolute -top-10 right-0 h-56 w-56 rounded-full bg-sky-200 opacity-40 blur-3xl" />
      {/* Bottom-left blob */}
      <div className="absolute bottom-10 -left-10 h-64 w-64 rounded-full bg-violet-200 opacity-35 blur-3xl" />
      {/* Bottom-right blob */}
      <div className="absolute -bottom-16 right-0 h-72 w-72 rounded-full bg-amber-200 opacity-40 blur-3xl" />
      {/* Centre accent */}
      <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-200 opacity-25 blur-3xl" />
    </div>
  );
}

export default function DurationPicker() {
  const router = useRouter();

  function handlePick(duration: Duration) {
    sessionStorage.setItem("tg_duration_seconds", String(duration.seconds));
    sessionStorage.setItem("tg_duration_label", duration.label);
    router.push("/game");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-50 px-6 py-10">
      <BgBlobs />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex flex-col items-center gap-3 text-center">
        {/* Mascot */}
        <Mascot mood="waiting" size={160} />

        <h1
          className="text-5xl font-black tracking-tight text-amber-700 drop-shadow-sm"
          style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
        >
          Time Guesser!
        </h1>
        <p
          className="max-w-xs text-xl font-bold text-amber-600"
          style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
        >
          Pick a time and see if you can feel it! ⏰
        </p>
      </header>

      {/* ── Duration cards ──────────────────────────────────────────────── */}
      <ul
        className="relative z-10 flex w-full max-w-md flex-col gap-5"
        role="list"
      >
        {DURATIONS.map((d) => (
          <li key={d.seconds}>
            <button
              type="button"
              onClick={() => handlePick(d)}
              className={`
                bg-gradient-to-r ${d.gradient}
                flex w-full cursor-pointer items-center gap-5
                rounded-3xl px-7 py-6
                shadow-lg shadow-black/10
                transition-all duration-150
                hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15
                active:scale-95 active:translate-y-0
                focus-visible:outline-4 focus-visible:outline-offset-4 ${d.ring}
              `}
              aria-label={`${d.cue} — ${d.label}`}
            >
              {/* Emoji in a white pill */}
              <span
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-5xl shadow-sm"
                aria-hidden="true"
              >
                {d.emoji}
              </span>

              {/* Text */}
              <span className="flex flex-col items-start">
                <span
                  className={`text-2xl font-black ${d.labelColour}`}
                  style={{
                    fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif",
                  }}
                >
                  {d.cue}
                </span>
                <span
                  className={`text-lg font-bold ${d.labelColour} opacity-75`}
                  style={{
                    fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif",
                  }}
                >
                  {d.label}
                </span>
              </span>

              {/* Arrow hint */}
              <span
                className={`ml-auto text-3xl ${d.labelColour} opacity-60`}
                aria-hidden="true"
              >
                →
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* ── Footer whisper ──────────────────────────────────────────────── */}
      <p
        className="relative z-10 text-center text-base font-semibold text-amber-500"
        style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
      >
        No peeking — trust your tummy! 🦉
      </p>
    </div>
  );
}
