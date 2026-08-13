import { BRAND } from "@/lib/brand";

/**
 * The three "Check it yourself." link cards.
 *
 * All placeholder copy.
 */
export type ProofCard = {
  /** Small uppercase mono label above the title. */
  readonly category: string;
  readonly title: string;
  readonly description: string;
  /** CTA text at the foot of the card; the ↗ glyph is drawn as an SVG, not part of this string. */
  readonly cta: string;
  readonly href: string;
  /** Opens in a new tab. */
  readonly isExternal?: boolean;
};

export const PROOF_CARDS: readonly ProofCard[] = [
  {
    category: "SOURCE",
    title: "Read the code",
    description:
      "The scoring and the URL guard are pure functions with 12 tests that run without EdgeOne. Nothing about the grade is hidden.",
    cta: "OPEN THE REPO",
    href: BRAND.docsUrl,
    isExternal: true,
  },
  {
    category: "SAFETY",
    title: "What it refuses to fetch",
    description:
      "The agent fetches whatever it is handed, from inside a cloud network. Loopback, private ranges, CGNAT and cloud metadata endpoints are blocked before the request is made.",
    cta: "SEE THE GUARD",
    href: BRAND.docsUrl + "/blob/main/agents/audit/checks.ts",
    isExternal: true,
  },
  {
    category: "RUNTIME",
    title: "Why it is an agent",
    description:
      "The browser pass needs context.sandbox, which EdgeOne injects into agents only — an ordinary serverless function never receives it.",
    cta: "SEE THE HANDLER",
    href: BRAND.docsUrl + "/blob/main/agents/audit/index.ts",
    isExternal: true,
  },
];
