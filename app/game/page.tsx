"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ResultScreen from "../components/ResultScreen";
import Mascot from "../components/Mascot";

const GRACE_MS = 2_000; // 2-second grace — STOP is inactive during this window

type Phase = "grace" | "active" | "result";

interface Result {
  /** Seconds the user actually waited */
  elapsed: number;
  /** Target seconds */
  target: number;
  /** True when the kid switched tabs during the countdown */
  peeked: boolean;
}

/** Decorative background blobs */
function BgBlobs({ active }: { active: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={`absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl transition-colors duration-700 ${
          active ? "bg-red-200 opacity-50" : "bg-yellow-200 opacity-40"
        }`}
      />
      <div
        className={`absolute -bottom-20 right-0 h-72 w-72 rounded-full blur-3xl transition-colors duration-700 ${
          active ? "bg-pink-200 opacity-50" : "bg-amber-200 opacity-40"
        }`}
      />
      <div
        className={`absolute top-1/3 -right-20 h-64 w-64 rounded-full blur-3xl transition-colors duration-700 ${
          active ? "bg-orange-200 opacity-40" : "bg-sky-200 opacity-30"
        }`}
      />
    </div>
  );
}

export default function GamePage() {
  const router = useRouter();

  // Read duration written by DurationPicker via sessionStorage
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [durationLabel, setDurationLabel] = useState<string>("");

  const [phase, setPhase] = useState<Phase>("grace");
  const [result, setResult] = useState<Result | null>(null);

  /**
   * Timestamp (Date.now()) when the hidden countdown started — after grace.
   */
  const startRef = useRef<number | null>(null);

  /**
   * Tracks whether the user hid the tab during the countdown.
   */
  const peekedRef = useRef(false);

  /**
   * Guard against double-taps.
   */
  const stoppedRef = useRef(false);

  // ── Read sessionStorage on mount (client-only) ──────────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("tg_duration_seconds");
    const label = sessionStorage.getItem("tg_duration_label") ?? "";

    if (!raw || isNaN(Number(raw))) {
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
      startRef.current = Date.now();
      peekedRef.current = false;
      stoppedRef.current = false;
      setPhase("active");
    }, GRACE_MS);

    return () => clearTimeout(graceTimer);
  }, [durationSeconds]);

  // ── Tab-switch detection ─────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "active") return;

    function onVisibilityChange() {
      if (document.hidden) {
        peekedRef.current = true;
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [phase]);

  // ── User taps STOP ───────────────────────────────────────────────────────────
  function handleStop() {
    if (phase !== "active" || startRef.current === null) return;
    if (stoppedRef.current) return;
    stoppedRef.current = true;

    const elapsed = (Date.now() - startRef.current) / 1_000;

    setResult({
      elapsed,
      target: durationSeconds!,
      peeked: peekedRef.current,
    });
    setPhase("result");
  }

  // ── Play again ───────────────────────────────────────────────────────────────
  function handlePlayAgain() {
    router.replace("/");
  }

  // ── Render: loading / redirecting ───────────────────────────────────────────
  if (durationSeconds === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-yellow-50 to-amber-50">
        <span
          className="text-2xl font-bold text-amber-600"
          style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
        >
          Loading…
        </span>
      </div>
    );
  }

  // ── Render: result screen ───────────────────────────────────────────────────
  if (phase === "result" && result !== null) {
    return (
      <ResultScreen
        elapsed={result.elapsed}
        target={result.target}
        peeked={result.peeked}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  // ── Render: grace / active (STOP button) ────────────────────────────────────
  const isGrace = phase === "grace";

  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 py-10 transition-colors duration-700 ${
        isGrace
          ? "bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-50"
          : "bg-gradient-to-b from-red-50 via-rose-50 to-pink-50"
      }`}
    >
      <BgBlobs active={!isGrace} />

      {/* Mascot */}
      <div className="relative z-10">
        <Mascot mood={isGrace ? "waiting" : "counting"} size={160} />
      </div>

      {/* Status text */}
      <p
        className={`relative z-10 text-center text-2xl font-black transition-colors duration-500 ${
          isGrace ? "text-amber-600" : "text-rose-600"
        }`}
        style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
      >
        {isGrace ? "Get ready…" : `Guessing ${durationLabel} 🎯`}
      </p>

      {/* Giant STOP / waiting button */}
      <div className="relative z-10">
        <button
          type="button"
          onClick={handleStop}
          disabled={isGrace}
          aria-label={
            isGrace
              ? "Wait — the timer is not ready yet"
              : "Stop — tap when you think the time is up"
          }
          className={`
            relative flex items-center justify-center
            rounded-full font-black text-white shadow-2xl
            transition-all duration-200
            h-64 w-64 text-5xl
            sm:h-80 sm:w-80 sm:text-6xl
            ${
              isGrace
                ? "cursor-not-allowed bg-neutral-300 shadow-neutral-200"
                : "cursor-pointer bg-red-500 active:scale-95 animate-ring-pulse"
            }
          `}
          style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
        >
          {/* Inner circle highlight */}
          <span
            className={`absolute inset-4 rounded-full ${
              isGrace ? "bg-neutral-200/50" : "bg-red-400/40"
            }`}
            aria-hidden="true"
          />
          {/* Label */}
          <span className="relative z-10 flex flex-col items-center gap-1">
            {isGrace ? (
              <>
                <span className="animate-wobble inline-block text-6xl sm:text-7xl">
                  ⏳
                </span>
              </>
            ) : (
              <>
                <span>STOP</span>
                <span className="text-2xl sm:text-3xl">👋</span>
              </>
            )}
          </span>
        </button>
      </div>

      {/* Hint text */}
      <p
        className={`relative z-10 max-w-xs text-center text-lg font-bold transition-opacity duration-500 ${
          isGrace ? "text-amber-500" : "text-rose-400 opacity-80"
        }`}
        style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
      >
        {isGrace
          ? "The button will glow when you can tap!"
          : "Tap STOP when you feel the time is up!"}
      </p>
    </div>
  );
}
