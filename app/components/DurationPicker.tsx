"use client";

import { useRouter } from "next/navigation";

interface Duration {
  seconds: number;
  label: string;
  emoji: string;
  cue: string;
  /** Tailwind background colour for the card */
  colour: string;
}

const DURATIONS: Duration[] = [
  {
    seconds: 60,
    label: "1 min",
    emoji: "🍎",
    cue: "Quick snack",
    colour: "bg-orange-300",
  },
  {
    seconds: 120,
    label: "2 min",
    emoji: "🦷",
    cue: "Brush teeth",
    colour: "bg-blue-300",
  },
  {
    seconds: 300,
    label: "5 min",
    emoji: "📺",
    cue: "Short show",
    colour: "bg-purple-300",
  },
];

export default function DurationPicker() {
  const router = useRouter();

  function handlePick(duration: Duration) {
    // Store chosen duration so the game screen can read it without URL params
    sessionStorage.setItem("tg_duration_seconds", String(duration.seconds));
    sessionStorage.setItem("tg_duration_label", duration.label);
    router.push("/game");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-yellow-50 p-6">
      <header className="flex flex-col items-center gap-2">
        <span className="text-6xl">⏱️</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-800">
          Time Guesser
        </h1>
        <p className="text-lg text-neutral-500">
          Pick a time — then guess when it&rsquo;s up!
        </p>
      </header>

      <ul className="flex w-full max-w-sm flex-col gap-5" role="list">
        {DURATIONS.map((d) => (
          <li key={d.seconds}>
            <button
              type="button"
              onClick={() => handlePick(d)}
              className={`
                ${d.colour}
                flex w-full cursor-pointer items-center gap-5
                rounded-3xl px-7 py-6
                shadow-md
                transition-transform duration-100
                active:scale-95
                focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-500
              `}
              aria-label={`${d.cue} — ${d.label}`}
            >
              <span className="text-6xl leading-none" aria-hidden="true">
                {d.emoji}
              </span>
              <span className="flex flex-col items-start">
                <span className="text-2xl font-extrabold text-neutral-900">
                  {d.cue}
                </span>
                <span className="text-lg font-semibold text-neutral-700">
                  {d.label}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
