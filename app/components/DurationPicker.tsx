"use client";

import { useRouter } from "next/navigation";
import Mascot from "./Mascot";
import { HOME } from "../copy";

interface DurationStyle {
  seconds: number;
  /** Tailwind gradient classes for the card */
  gradient: string;
  /** Tailwind ring colour for focus */
  ring: string;
  /** Text colour for the label */
  labelColour: string;
}

/**
 * Visual styling for each duration card.
 * Copy (cue + label) comes from HOME.durations in copy.ts.
 */
const DURATION_STYLES: DurationStyle[] = [
  {
    seconds: 60,
    gradient: "from-orange-300 to-amber-400",
    ring: "focus-visible:outline-orange-500",
    labelColour: "text-orange-900",
  },
  {
    seconds: 120,
    gradient: "from-sky-300 to-cyan-400",
    ring: "focus-visible:outline-cyan-500",
    labelColour: "text-sky-900",
  },
  {
    seconds: 300,
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

  function handlePick(seconds: number, label: string) {
    sessionStorage.setItem("tg_duration_seconds", String(seconds));
    sessionStorage.setItem("tg_duration_label", label);
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
          {HOME.title}
        </h1>
        <p
          className="max-w-xs text-xl font-bold text-amber-600"
          style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
        >
          {HOME.subtitle}
        </p>
      </header>

      {/* ── Duration cards ──────────────────────────────────────────────── */}
      <ul
        className="relative z-10 flex w-full max-w-md flex-col gap-5"
        role="list"
      >
        {HOME.durations.map((d) => {
          const style = DURATION_STYLES.find((s) => s.seconds === d.seconds)!;
          return (
            <li key={d.seconds}>
              <button
                type="button"
                onClick={() => handlePick(d.seconds, d.label)}
                className={`
                  bg-gradient-to-r ${style.gradient}
                  flex w-full cursor-pointer items-center gap-5
                  rounded-3xl px-7 py-6
                  shadow-lg shadow-black/10
                  transition-all duration-150
                  hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15
                  active:scale-95 active:translate-y-0
                  focus-visible:outline-4 focus-visible:outline-offset-4 ${style.ring}
                `}
                aria-label={`${d.cue} — ${d.label}`}
              >
                {/* Cue text in a white pill (emoji is part of the cue string) */}
                <span
                  className={`flex flex-col items-start`}
                >
                  <span
                    className={`text-2xl font-black ${style.labelColour}`}
                    style={{
                      fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif",
                    }}
                  >
                    {d.cue}
                  </span>
                  <span
                    className={`text-lg font-bold ${style.labelColour} opacity-75`}
                    style={{
                      fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif",
                    }}
                  >
                    {d.label}
                  </span>
                </span>

                {/* Arrow hint */}
                <span
                  className={`ml-auto text-3xl ${style.labelColour} opacity-60`}
                  aria-hidden="true"
                >
                  →
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* ── Footer tip ──────────────────────────────────────────────── */}
      <p
        className="relative z-10 text-center text-base font-semibold text-amber-500"
        style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
      >
        {HOME.footerTip}
      </p>
    </div>
  );
}
