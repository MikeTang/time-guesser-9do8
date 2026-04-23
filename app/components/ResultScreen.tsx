"use client";

interface Props {
  elapsed: number; // seconds the user actually waited
  target: number;  // target seconds
  peeked: boolean; // true if the kid switched tabs
  onPlayAgain: () => void;
}

/**
 * Classify the guess into a star rating using absolute-second thresholds
 * that are age-appropriate for 5–8 year olds (not percentage-based).
 *
 * ≤5 s off → 3 stars, ≤15 s off → 2 stars, ≤30 s off → 1 star, else 0
 */
export function rateGuess(elapsed: number, target: number): 0 | 1 | 2 | 3 {
  const diff = Math.abs(elapsed - target);
  if (diff <= 5) return 3;
  if (diff <= 15) return 2;
  if (diff <= 30) return 1;
  return 0;
}

/**
 * Plain-English description of how close the guess was.
 * Rounds to the nearest whole second so kids see a clean number.
 * "right on time!" is used for ≤1 s so the wording always makes sense.
 */
function buildDescription(elapsed: number, target: number): string {
  const diff = elapsed - target; // positive = too slow, negative = too fast
  const absSec = Math.round(Math.abs(diff));

  if (absSec <= 1) return "Right on time! 🎯";
  const dir = diff > 0 ? "too slow" : "too fast";
  return `${absSec} second${absSec !== 1 ? "s" : ""} ${dir}!`;
}

const STAR_CONFIG: Record<
  0 | 1 | 2 | 3,
  { stars: string; headline: string; bg: string }
> = {
  3: { stars: "⭐⭐⭐", headline: "Almost perfect!", bg: "bg-yellow-100" },
  2: { stars: "⭐⭐",   headline: "So close!",       bg: "bg-blue-100"   },
  1: { stars: "⭐",     headline: "Nice try!",        bg: "bg-orange-100" },
  0: { stars: "🙌",     headline: "Keep practising!", bg: "bg-pink-100"   },
};

export default function ResultScreen({ elapsed, target, peeked, onPlayAgain }: Props) {
  const stars = peeked ? (0 as const) : rateGuess(elapsed, target);
  const config = STAR_CONFIG[stars];
  const description = buildDescription(elapsed, target);

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center gap-8 ${config.bg} p-8`}
    >
      {/* Star / icon display */}
      <div
        aria-label={`${stars} star${stars !== 1 ? "s" : ""}`}
        className="text-center text-6xl leading-tight"
      >
        {config.stars}
      </div>

      {/* Headline */}
      <p className="text-center text-4xl font-extrabold text-neutral-800">
        {config.headline}
      </p>

      {/* Plain-English description — hidden when peeked to keep focus on the warning */}
      {!peeked && (
        <p className="text-center text-2xl font-semibold text-neutral-600">
          {description}
        </p>
      )}

      {/* Peeked warning */}
      {peeked && (
        <p className="max-w-xs text-center text-xl text-neutral-500">
          No sneaking — you switched tabs! Try again with your eyes away 🙈
        </p>
      )}

      {/* Play Again */}
      <button
        type="button"
        onClick={onPlayAgain}
        className="mt-4 rounded-3xl bg-green-400 px-12 py-6 text-3xl font-extrabold text-neutral-900 shadow-md transition-transform active:scale-95 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        Play again 🔄
      </button>
    </div>
  );
}
