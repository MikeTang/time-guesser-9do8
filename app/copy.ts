/**
 * copy.ts — All in-game text for Time Guesser.
 *
 * Keep every user-facing string here so they're easy to review, tweak,
 * or translate without digging through component files.
 *
 * Writing rules for this game (ages 5–8):
 *  • Short sentences. One idea at a time.
 *  • Warm, encouraging tone — never shaming.
 *  • No raw numbers on the result screen (stars tell the story).
 *  • Relatable real-life cues for durations.
 *  • Emojis add energy, but every message works without them too.
 */

// ─── Home / Duration Picker ────────────────────────────────────────────────

export const HOME = {
  /** Big title at the top of the picker screen. */
  title: "Time Guesser!",

  /** Subtitle — one friendly sentence explaining the game. */
  subtitle: "Can you feel when time is up? Give it a try! ⏰",

  /**
   * Each entry = one button on the picker screen.
   * `cue` is a real-life activity kids recognise.
   * `label` is shown smaller, below the cue.
   */
  durations: [
    {
      seconds: 60,
      /** Short, vivid activity the child knows. */
      cue: "Eat a snack 🍎",
      /** Time label shown below the cue. */
      label: "1 minute",
    },
    {
      seconds: 120,
      cue: "Brush your teeth 🦷",
      label: "2 minutes",
    },
    {
      seconds: 300,
      cue: "Watch a cartoon 📺",
      label: "5 minutes",
    },
  ],

  /** Small tip at the very bottom of the picker. */
  footerTip: "Close your eyes and feel it! 🦉",
} as const;

// ─── Game screen (grace period — STOP not yet active) ──────────────────────

export const GRACE = {
  /** Status line shown above the (greyed-out) button. */
  statusText: "Get ready…",

  /** Hint underneath the button during the grace window. */
  hint: "The button will light up — then it's your turn! ✨",
} as const;

// ─── Game screen (active — STOP is tappable) ──────────────────────────────

export const ACTIVE = {
  /**
   * Status line shown while the timer is secretly running.
   * `{label}` is replaced at runtime with e.g. "2 minutes".
   */
  statusText: (label: string) => `Feeling ${label}… 🎯`,

  /** Hint underneath the big STOP button. */
  hint: "Tap STOP when you think the time is up!",

  /** Accessible label for the STOP button (screen readers). */
  stopAriaLabel: "Stop — tap when you think the time is up",
} as const;

// ─── Result screen — star tiers ────────────────────────────────────────────
//
// Stars are based on how close the guess was (see rateGuess() in ResultScreen):
//   3 stars → within 5 s   — "nailed it"
//   2 stars → within 15 s  — "very close"
//   1 star  → within 30 s  — "good effort"
//   0 stars → > 30 s off   — "keep going"

export const RESULT_TIERS = {
  3: {
    /** Large emoji(s) shown as the "stars" display. */
    stars: "⭐⭐⭐",
    /** Big bold headline. */
    headline: "Amazing! You nailed it!",
    /** Encouraging sentence below the headline. */
    detail: "Your brain is a great time-keeper! 🧠",
  },
  2: {
    stars: "⭐⭐",
    headline: "So close!",
    detail: "You were really near! Try again to get all three stars! 🌟",
  },
  1: {
    stars: "⭐",
    headline: "Nice try!",
    detail: "Keep practising — you're getting better every time! 💪",
  },
  0: {
    stars: "🙌",
    headline: "Keep going!",
    detail: "Every guess makes you stronger. You've got this! 🚀",
  },
} as const;

// ─── Result screen — "you peeked!" tab-switch warning ─────────────────────

export const PEEKED = {
  /** First line inside the warning box. */
  heading: "Oops! You looked away! 👀",

  /**
   * Second, reassuring line.
   * Warm, not scolding — invites the child to try again.
   */
  encouragement: "That's okay! Try again and stay on this screen. You can do it! 😊",
} as const;

// ─── Shared / misc ─────────────────────────────────────────────────────────

export const MISC = {
  /** Label on the "play again" button (result screen). */
  playAgain: "Play again! 🔄",

  /** Shown while the page is loading / redirecting. */
  loading: "Loading…",

  /** Accessible label for the disabled button during grace period. */
  graceAriaLabel: "Wait — the timer is warming up",
} as const;
