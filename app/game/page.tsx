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
  /** True when the kid switched tabs during the countdown */
  peeked: boolean;
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

  /**
   * Timestamp (Date.now()) when the hidden countdown started — after grace.
   * Using a ref (not state) keeps it out of the render cycle and avoids
   * any batching/closure skew that could distort the measured duration.
   */
  const startRef = useRef<number | null>(null);

  /**
   * Tracks whether the user hid the tab during the countdown.
   * Ref so the visibilitychange handler always sees the latest value
   * without needing to be re-registered.
   */
  const peekedRef = useRef(false);

  /**
   * Guard against double-taps: flipped to true the moment STOP is pressed.
   * Using a ref (not state) means the check is synchronous — no re-render
   * required before the flag is effective.
   */
  const stoppedRef = useRef(false);

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
      // Record start time with Date.now() for wall-clock accuracy.
      // performance.now() is relative to page load and can drift when
      // the tab is throttled; Date.now() gives a stable epoch baseline.
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
    // Guard: wrong phase or timer not started
    if (phase !== "active" || startRef.current === null) return;

    // Guard: disable immediately on first press — prevents double-taps.
    // Checking + setting in the same synchronous call means a rapid second
    // tap (within the same JS microtask queue flush) is harmless.
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
      <div className="flex min-h-screen items-center justify-center bg-yellow-50">
        <span className="text-2xl">Loading…</span>
      </div>
    );
  }

  // ── Render: result screen ───────────────────────────────────────────────────
  if (phase === "result" && result !== null) {
    const stars = rateGuess(result.elapsed, result.target);
    const message = result.peeked ? "You peeked! 👀" : MESSAGES[stars];

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-yellow-50 p-6">
        <p className="text-center text-4xl font-extrabold text-neutral-800">
          {message}
        </p>
        {result.peeked && (
          <p className="text-center text-lg text-neutral-500">
            No sneaking — you switched tabs! Try again with your eyes away 🙈
          </p>
        )}
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

      {/*
       * The button is disabled during grace AND after the first STOP press.
       * `stoppedRef.current` is a ref so it can't drive JSX re-renders directly;
       * phase transition to "result" handles the visual change instead.
       * Disabling during grace (isGrace) gives the correct cursor/opacity.
       */}
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
