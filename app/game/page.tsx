"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const GRACE_MS = 2_000; // 2-second grace — STOP is inactive during this window

type Phase = "grace" | "active" | "result";

interface Result {
  /** Seconds the user actually waited */
  elapsed: number;
  /** Target seconds */
  target: number;
}

/** Star rating: 3 = within 10 %, 2 = within 25 %, 1 = within 50 %, 0 = missed */
function rateGuess(elapsed: number, target: number): 0 | 1 | 2 | 3 {
  const ratio = elapsed / target;
  if (ratio >= 0.9 && ratio <= 1.1) return 3;
  if (ratio >= 0.75 && ratio <= 1.25) return 2;
  if (ratio >= 0.5 && ratio <= 1.5) return 1;
  return 0;
}

const MESSAGES: Record<0 | 1 | 2 | 3, string> = {
  3: "Almost perfect! ⭐⭐⭐",
  2: "So close! ⭐⭐",
  1: "Nice try! ⭐",
  0: "Keep practising! 🙌",
};

export default function GamePage() {
  const router = useRouter();

  // Read duration written by DurationPicker via sessionStorage
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [durationLabel, setDurationLabel] = useState<string>("");

  const [phase, setPhase] = useState<Phase>("grace");
  const [result, setResult] = useState<Result | null>(null);

  // Timestamp when the hidden countdown actually started (after grace)
  const startRef = useRef<number | null>(null);

  // ── Read sessionStorage on mount (client-only) ──────────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("tg_duration_seconds");
    const label = sessionStorage.getItem("tg_duration_label") ?? "";

    if (!raw || isNaN(Number(raw))) {
      // Landed here directly without picking — send back to picker
      router.replace("/");
      return;
    }

    setDurationSeconds(Number(raw));
    setDurationLabel(label);
  }, [router]);

  // ── Grace period → active ───────────────────────────────────────────────────
  useEffect(() => {
    if (durationSeconds === null) return;

    const graceTimer = window.setTimeout(() => {
      startRef.current = performance.now();
      setPhase("active");
    }, GRACE_MS);

    return () => clearTimeout(graceTimer);
  }, [durationSeconds]);

  // ── User taps STOP ───────────────────────────────────────────────────────────
  function handleStop() {
    if (phase !== "active" || startRef.current === null) return;

    const elapsed = (performance.now() - startRef.current) / 1_000;
    setResult({ elapsed, target: durationSeconds! });
    setPhase("result");
  }

  // ── Play again ───────────────────────────────────────────────────────────────
  function handlePlayAgain() {
    router.replace("/");
  }

  // ── Render: loading / redirecting ───────────────────────────────────────────
  if (durationSeconds === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-yellow-50">
        <span className="text-2xl">Loading…</span>
      </div>
    );
  }

  // ── Render: result screen ───────────────────────────────────────────────────
  if (phase === "result" && result !== null) {
    const stars = rateGuess(result.elapsed, result.target);
    const message = MESSAGES[stars];

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-yellow-50 p-6">
        <p className="text-center text-4xl font-extrabold text-neutral-800">
          {message}
        </p>
        <p className="text-center text-lg text-neutral-500">
          You waited{" "}
          <strong>{Math.round(result.elapsed)}s</strong> out of{" "}
          <strong>{result.target}s</strong>
        </p>
        <button
          type="button"
          onClick={handlePlayAgain}
          className="rounded-3xl bg-green-400 px-10 py-5 text-2xl font-extrabold text-neutral-900 shadow-md transition-transform active:scale-95"
        >
          Play again 🔄
        </button>
      </div>
    );
  }

  // ── Render: grace / active (STOP button) ────────────────────────────────────
  const isGrace = phase === "grace";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-yellow-50 p-6">
      <p className="text-xl font-semibold text-neutral-500">
        Guessing <strong>{durationLabel}</strong>…
      </p>

      <button
        type="button"
        onClick={handleStop}
        disabled={isGrace}
        aria-label={isGrace ? "Get ready…" : "Stop the timer"}
        className={`
          relative flex aspect-square w-72 flex-col items-center justify-center
          rounded-full shadow-2xl
          transition-transform duration-100
          ${
            isGrace
              ? "cursor-not-allowed bg-red-200 opacity-60"
              : "cursor-pointer bg-red-500 active:scale-95"
          }
        `}
      >
        {/* Pulse ring — only when active */}
        {!isGrace && (
          <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-40" />
        )}
        <span className="relative text-6xl font-black text-white select-none">
          {isGrace ? "⏳" : "STOP"}
        </span>
        {isGrace && (
          <span className="relative mt-2 text-lg font-semibold text-neutral-600">
            Get ready…
          </span>
        )}
      </button>

      <p className="text-sm text-neutral-400">
        {isGrace ? "Hold on a moment!" : "Tap when you think the time is up!"}
      </p>
    </div>
  );
}
