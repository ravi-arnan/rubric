import { BRAND } from "@/lib/brand";

/**
 * The mark: a rubric is a grid of marks where not everything is earned. Three squares filled,
 * one still open — the same pass/fail vocabulary the report and the hero diagram already use.
 *
 * Four shapes and nothing else, because this has to survive being 16px in a browser tab. The
 * ink squares take `currentColor` so the mark inverts with its surroundings; only the first
 * one is accent.
 */
export function Mark({ className = "size-[17px]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={`block shrink-0 ${className}`}
    >
      <rect width="7" height="7" fill="var(--color-bx-accent)" />
      <rect x="9" width="7" height="7" fill="currentColor" />
      <rect y="9" width="7" height="7" fill="currentColor" />
      <rect x="9.5" y="9.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/**
 * Mark plus name. Every call site passes only a size class for the text; the mark scales with
 * it through `em` so the two never drift apart.
 */
export function Wordmark({ className = "text-[19px]" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.55em] text-bx-ink ${className}`}>
      <Mark className="size-[0.95em]" />
      <span className="font-mono font-bold tracking-[0.08em] whitespace-nowrap">
        {BRAND.nameUpper}
      </span>
    </span>
  );
}
