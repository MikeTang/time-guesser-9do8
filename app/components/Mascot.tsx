"use client";

/**
 * Zara the Owl — our friendly mascot.
 *
 * Moods:
 *   "waiting"    – idle float, neutral face
 *   "counting"   – excited bounce, wide eyes
 *   "result"     – celebrate animation, big smile + party hat
 */

export type MascotMood = "waiting" | "counting" | "result";

interface Props {
  mood: MascotMood;
  size?: number;
}

export default function Mascot({ mood, size = 160 }: Props) {
  const animClass =
    mood === "waiting"
      ? "animate-float"
      : mood === "counting"
      ? "animate-bounce-fun"
      : "animate-celebrate";

  return (
    <div className={`inline-block select-none ${animClass}`} aria-hidden="true">
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Zara the owl mascot"
      >
        {/* ── Body ──────────────────────────────────────────────────────── */}
        <ellipse cx="80" cy="100" rx="48" ry="52" fill="#FBBF24" />
        {/* Tummy */}
        <ellipse cx="80" cy="108" rx="30" ry="34" fill="#FEF3C7" />

        {/* ── Wings ─────────────────────────────────────────────────────── */}
        <ellipse
          cx="36"
          cy="104"
          rx="18"
          ry="28"
          fill="#F59E0B"
          transform="rotate(-20 36 104)"
        />
        <ellipse
          cx="124"
          cy="104"
          rx="18"
          ry="28"
          fill="#F59E0B"
          transform="rotate(20 124 104)"
        />

        {/* Wing feather highlights */}
        <ellipse
          cx="36"
          cy="108"
          rx="8"
          ry="14"
          fill="#FCD34D"
          opacity="0.6"
          transform="rotate(-20 36 108)"
        />
        <ellipse
          cx="124"
          cy="108"
          rx="8"
          ry="14"
          fill="#FCD34D"
          opacity="0.6"
          transform="rotate(20 124 108)"
        />

        {/* ── Head ──────────────────────────────────────────────────────── */}
        <circle cx="80" cy="62" r="46" fill="#FBBF24" />

        {/* Ear tufts */}
        <polygon points="48,24 38,8 60,20" fill="#F59E0B" />
        <polygon points="112,24 122,8 100,20" fill="#F59E0B" />

        {/* ── Face ──────────────────────────────────────────────────────── */}

        {/* Eye rings */}
        <circle cx="63" cy="60" r="16" fill="white" />
        <circle cx="97" cy="60" r="16" fill="white" />
        <circle cx="63" cy="60" r="13" fill="#1E3A5F" />
        <circle cx="97" cy="60" r="13" fill="#1E3A5F" />

        {/* Pupils */}
        <circle
          cx={mood === "counting" ? "65" : "64"}
          cy={mood === "counting" ? "58" : "59"}
          r={mood === "counting" ? "6" : "5"}
          fill="white"
        />
        <circle
          cx={mood === "counting" ? "99" : "98"}
          cy={mood === "counting" ? "58" : "59"}
          r={mood === "counting" ? "6" : "5"}
          fill="white"
        />

        {/* Eye shine sparkles */}
        <circle cx="69" cy="55" r="2.5" fill="white" opacity="0.9" />
        <circle cx="103" cy="55" r="2.5" fill="white" opacity="0.9" />

        {/* Beak */}
        <polygon points="80,70 74,80 86,80" fill="#F97316" />
        <line
          x1="74"
          y1="80"
          x2="86"
          y2="80"
          stroke="#EA580C"
          strokeWidth="1.5"
        />

        {/* Mouth / expression */}
        {mood === "waiting" && (
          /* Slight smile */
          <path
            d="M72 86 Q80 92 88 86"
            stroke="#EA580C"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {mood === "counting" && (
          /* Big excited O */
          <ellipse cx="80" cy="88" rx="7" ry="5" fill="#EA580C" />
        )}
        {mood === "result" && (
          /* Big happy smile */
          <path
            d="M68 85 Q80 96 92 85"
            stroke="#EA580C"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* ── Party hat (result only) ────────────────────────────────────── */}
        {mood === "result" && (
          <g>
            <polygon points="80,10 55,40 105,40" fill="#EC4899" />
            <polygon
              points="80,10 55,40 105,40"
              fill="none"
              stroke="#DB2777"
              strokeWidth="2"
            />
            {/* Hat stripes */}
            <line
              x1="67"
              y1="25"
              x2="93"
              y2="25"
              stroke="#FDF2F8"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
            <line
              x1="62"
              y1="34"
              x2="98"
              y2="34"
              stroke="#FDF2F8"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Pom-pom */}
            <circle cx="80" cy="10" r="6" fill="#FCD34D" />
            <circle cx="80" cy="10" r="3.5" fill="#FDE68A" />
            {/* Hat band */}
            <rect x="55" y="37" width="50" height="5" rx="2.5" fill="#F9A8D4" />
          </g>
        )}

        {/* ── Blush cheeks ──────────────────────────────────────────────── */}
        <ellipse cx="48" cy="72" rx="9" ry="6" fill="#FCA5A5" opacity="0.6" />
        <ellipse cx="112" cy="72" rx="9" ry="6" fill="#FCA5A5" opacity="0.6" />

        {/* ── Feet ──────────────────────────────────────────────────────── */}
        <ellipse cx="66" cy="148" rx="12" ry="6" fill="#F97316" />
        <ellipse cx="94" cy="148" rx="12" ry="6" fill="#F97316" />
        {/* Talons */}
        <line
          x1="58"
          y1="148"
          x2="54"
          y2="154"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="66"
          y1="150"
          x2="66"
          y2="156"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="74"
          y1="148"
          x2="78"
          y2="154"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="86"
          y1="148"
          x2="82"
          y2="154"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="94"
          y1="150"
          x2="94"
          y2="156"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="102"
          y1="148"
          x2="106"
          y2="154"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* ── Counting-mode sparkles around body ───────────────────────── */}
        {mood === "counting" && (
          <g>
            <text x="10" y="50" fontSize="18">
              ✨
            </text>
            <text x="128" y="50" fontSize="18">
              ✨
            </text>
            <text x="18" y="115" fontSize="14">
              ⚡
            </text>
            <text x="128" y="115" fontSize="14">
              ⚡
            </text>
          </g>
        )}

        {/* ── Result-mode confetti ──────────────────────────────────────── */}
        {mood === "result" && (
          <g>
            <circle cx="20" cy="30" r="5" fill="#34D399" />
            <circle cx="140" cy="25" r="4" fill="#60A5FA" />
            <circle cx="148" cy="80" r="6" fill="#F472B6" />
            <circle cx="12" cy="90" r="5" fill="#FBBF24" />
            <rect
              x="24"
              y="120"
              width="8"
              height="8"
              rx="2"
              fill="#A78BFA"
              transform="rotate(25 24 120)"
            />
            <rect
              x="130"
              y="118"
              width="8"
              height="8"
              rx="2"
              fill="#FB923C"
              transform="rotate(-15 130 118)"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
