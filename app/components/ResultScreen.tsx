"use client";

import Mascot from "./Mascot";

interface Props {
  elapsed: number; // seconds the user actually waited
  target: number; // target seconds
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
  {
    stars: string;
    headline: string;
    bg: string;
    blobA: string;
    blobB: string;
    headlineColour: string;
    btnGradient: string;
  }
> = {
  3: {
    stars: "⭐⭐⭐",
    headline: "Almost perfect!",
    bg: "from-yellow-50 via-amber-50 to-orange-50",
    blobA: "bg-yellow-200",
    blobB: "bg-amber-300",
    headlineColour: "text-amber-700",
    btnGradient: "from-green-400 to-emerald-500",
  },
  2: {
    stars: "⭐⭐",
    headline: "So close!",
    bg: "from-sky-50 via-cyan-50 to-blue-50",
    blobA: "bg-sky-200",
    blobB: "bg-cyan-200",
    headlineColour: "text-sky-700",
    btnGradient: "from-green-400 to-emerald-500",
  },
  1: {
    stars: "⭐",
    headline: "Nice try!",
    bg: "from-orange-50 via-amber-50 to-yellow-50",
    blobA: "bg-orange-200",
    blobB: "bg-yellow-200",
    headlineColour: "text-orange-700",
    btnGradient: "from-green-400 to-emerald-500",
  },
  0: {
    stars: "🙌",
    headline: "Keep practising!",
    bg: "from-pink-50 via-rose-50 to-fuchsia-50",
    blobA: "bg-pink-200",
    blobB: "bg-fuchsia-200",
    headlineColour: "text-pink-700",
    btnGradient: "from-green-400 to-emerald-500",
  },
};

/** Star pills rendered individually so each can pop in */
function StarDisplay({ stars }: { stars: string }) {
  const chars = [...stars]; // split into individual emoji chars
  return (
    <div className="flex gap-3" role="presentation">
      {chars.map((char, i) => (
        <span
          key={i}
          className="animate-star-pop inline-block text-6xl sm:text-7xl"
          style={{ animationDelay: `${i * 0.12}s` }}
          aria-hidden="true"
        >
          {char}
        </span>
      ))}
    </div>
  );
}

/** Background decorative blobs */
function ResultBlobs({ blobA, blobB }: { blobA: string; blobB: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={`absolute -top-20 -left-20 h-72 w-72 rounded-full ${blobA} opacity-50 blur-3xl`}
      />
      <div
        className={`absolute -bottom-16 -right-10 h-80 w-80 rounded-full ${blobB} opacity-45 blur-3xl`}
      />
      {/* Floating confetti shapes */}
      <div
        className="absolute top-16 right-12 h-8 w-8 rounded-full bg-pink-400 opacity-60"
        style={{ animation: "confetti-drift 4s ease-in 2s infinite" }}
      />
      <div
        className="absolute top-32 left-10 h-6 w-6 rounded-sm bg-violet-400 opacity-50"
        style={{
          animation: "confetti-drift 3.5s ease-in 0.5s infinite",
          transform: "rotate(30deg)",
        }}
      />
      <div
        className="absolute top-10 left-1/3 h-5 w-5 rounded-full bg-amber-400 opacity-60"
        style={{ animation: "confetti-drift 5s ease-in 1s infinite" }}
      />
      <div
        className="absolute top-20 right-1/3 h-4 w-10 rounded-full bg-sky-400 opacity-50"
        style={{ animation: "confetti-drift 4.5s ease-in 3s infinite" }}
      />
    </div>
  );
}

export default function ResultScreen({
  elapsed,
  target,
  peeked,
  onPlayAgain,
}: Props) {
  const stars = peeked ? (0 as const) : rateGuess(elapsed, target);
  const config = STAR_CONFIG[stars];
  const description = buildDescription(elapsed, target);

  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-center gap-7 overflow-hidden bg-gradient-to-b ${config.bg} px-8 py-10`}
    >
      <ResultBlobs blobA={config.blobA} blobB={config.blobB} />

      {/* Mascot celebrating */}
      <div className="relative z-10">
        <Mascot mood="result" size={160} />
      </div>

      {/* Stars / trophy emoji */}
      <div
        className="relative z-10"
        aria-label={`${stars} star${stars !== 1 ? "s" : ""}`}
      >
        <StarDisplay stars={config.stars} />
      </div>

      {/* Headline */}
      <p
        className={`relative z-10 text-center text-4xl font-black sm:text-5xl ${config.headlineColour} drop-shadow-sm`}
        style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
      >
        {config.headline}
      </p>

      {/* Plain-English description */}
      {!peeked && (
        <p
          className="relative z-10 text-center text-2xl font-bold text-neutral-600"
          style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
        >
          {description}
        </p>
      )}

      {/* Peeked warning — kept positive and playful */}
      {peeked && (
        <div className="relative z-10 max-w-xs rounded-3xl bg-white/70 px-6 py-4 text-center shadow-md backdrop-blur-sm">
          <p
            className="text-xl font-bold text-pink-600"
            style={{
              fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif",
            }}
          >
            Oops — you switched tabs! 🙈
          </p>
          <p
            className="mt-1 text-lg font-semibold text-neutral-500"
            style={{
              fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif",
            }}
          >
            Try again and keep your eyes away!
          </p>
        </div>
      )}

      {/* Play Again button */}
      <button
        type="button"
        onClick={onPlayAgain}
        className={`
          relative z-10 mt-2
          bg-gradient-to-r ${config.btnGradient}
          cursor-pointer rounded-3xl px-12 py-6
          text-3xl font-black text-white
          shadow-lg shadow-green-300/50
          transition-all duration-150
          hover:-translate-y-1 hover:shadow-xl
          active:scale-95 active:translate-y-0
          focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-green-500
        `}
        style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
      >
        Play again! 🔄
      </button>
    </div>
  );
}
