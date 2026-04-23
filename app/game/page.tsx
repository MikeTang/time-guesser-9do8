"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ResultScreen from "../components/ResultScreen";

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-yellow-50 p-6">
      <p className="text-xl font-semibold text-neutral-500">
        {isGrace ? "Get ready…" : `Guessing ${durationLabel}`}
      </p>

      {/* Giant STOP button — fills most of the viewport */}
      <button
        type="button"
        onClick={handleStop}
        disabled={isGrace}
        aria-label="Stop — tap when you think the time is up"
        className={`
          flex h-72 w-72 items-center justify-center
          rounded-full text-6xl font-extrabold text-white shadow-2xl
          transition-transform duration-100
          sm:h-96 sm:w-96
          ${
            isGrace
              ? "cursor-not-allowed bg-neutral-300"
              : "cursor-pointer bg-red-500 animate-pulse active:scale-95"
          }
        `}
      >
        {isGrace ? "⏳" : "STOP"}
      </button>

      {isGrace && (
        <p className="text-center text-lg text-neutral-400">
          The button will light up when you can tap…
        </p>
      )}
    </div>
  );
}
