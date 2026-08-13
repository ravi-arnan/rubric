export interface PlatformCardContent {
  /** Two-digit index rendered in the card's top-left corner. */
  readonly index: string;
  readonly title: string;
  readonly description: string;
  /** Monospace terminal-style lines pinned to the bottom of the card. */
  readonly features: readonly string[];
}

/** Mirrors the rules in `agents/audit/checks.ts`. If a rule changes there, change it here. */
export const PLATFORM_CARDS: readonly PlatformCardContent[] = [
  {
    index: "01",
    title: "Response headers",
    description:
      "Six checks on what the server sends, before a byte of HTML is parsed. Presence alone does not pass — an HSTS header with max-age=0 fails, and X-Content-Type-Options only counts if it actually says nosniff.",
    features: [
      "HSTS · CSP · X-Frame-Options",
      "nosniff · Referrer-Policy · Permissions-Policy",
      "The value is reported, not just pass or fail",
    ],
  },
  {
    index: "02",
    title: "The rendered page",
    description:
      "Seven checks a fetch cannot make, because they only exist once the browser has built the document. A real browser opens the page in the sandbox and reports what it found there.",
    features: [
      "Title · meta description · single H1",
      "Missing alt text · lang · viewport",
      "DOM content loaded, measured not estimated",
    ],
  },
  {
    index: "03",
    title: "Scoring",
    description:
      "Each check carries its own weight, and each category scores on its own. A site with immaculate headers and a broken page cannot hide behind a single average.",
    features: [
      "Weighted per check, not counted",
      "A–F per category, then overall",
      "Every failure names what was expected",
    ],
  },
];
