import type { CSSProperties, ReactNode } from "react";

import { HeroArt } from "./HeroArt";
import { SpotlightGrid } from "./SpotlightGrid";

/** Entrance delay for a `data-rise` element, in seconds. */
export const riseDelay = (seconds: number): CSSProperties =>
  ({ "--bx-rise-delay": `${seconds}s` }) as CSSProperties;

/**
 * The faint hairline rails behind a section. Two vertical rules on the content gutter, plus an
 * optional rule along the section's top edge. `bx-rails` already supplies
 * `position:absolute; inset:0; pointer-events:none`.
 */
export function SectionRails({ topRule = false, z = "z-[1]" }: { topRule?: boolean; z?: string }) {
  return (
    <div className={`bx-rails flex justify-center ${z}`} aria-hidden="true" data-reveal>
      <div className="relative box-border h-full w-full max-w-[var(--bx-frame)] px-[var(--bx-gutter)]">
        <span className="bx-rail-v left-[var(--bx-gutter)]" />
        <span className="bx-rail-v right-[var(--bx-gutter)]" />
        {topRule && (
          <span className="bx-rail-h top-0 left-[var(--bx-gutter)] right-[var(--bx-gutter)]" />
        )}
      </div>
    </div>
  );
}

/**
 * Wrapper for the hero + stats + marquee. Above 900px the three together fill exactly one
 * viewport (`100svh`): the hero takes the slack, the other two sit at their natural height.
 */
export function FirstFold({ children }: { children: ReactNode }) {
  return (
    <div className="min-[901px]:flex min-[901px]:min-h-[100svh] min-[901px]:flex-col">{children}</div>
  );
}

// One <span> per word, exactly as the target ships it — the split is what makes the 70ms
// per-word entrance possible.
const HEADLINE = ["Every", "page", "gets", "a", "grade."];

export function HeroSection() {
  return (
    <section
      id="top"
      // `padding-top` clears the 65px fixed header; `flex` (row) + `self-center` on the content
      // is what vertically centres the copy in the leftover space.
      className="relative min-h-[min(70svh,36rem)] overflow-hidden min-[901px]:flex min-[901px]:flex-auto min-[901px]:pt-[4.0625rem]"
    >
      {/* Orange on near-black. Measured off the target — see SpotlightGrid. */}
      <SpotlightGrid rgb="34 211 238" centre={0.85} orthogonal={0.12} diagonal={0.01} />
      <SectionRails />

      <div className="bx-frame relative z-[5] pt-22 pb-0 min-[901px]:self-center min-[901px]:py-12">
        <div className="grid items-center gap-[clamp(2rem,3vw,3rem)] min-[901px]:grid-cols-[minmax(0,1fr)_minmax(0,44vw)]">
          <div>
            <div
              data-rise
              style={riseDelay(0.05)}
              className="mb-[1.375rem] inline-flex items-center gap-2.5"
            >
              <span className="inline-block size-[0.5625rem] bg-bx-accent" />
              <span className="font-mono text-[0.8125rem] font-bold tracking-[0.14em] text-bx-dim">
                A REPORT CARD FOR ANY URL
              </span>
            </div>

            <h1 className="m-0 font-sans text-[clamp(2.75rem,4.4vw,4.25rem)] leading-[0.95] font-medium tracking-[-0.015em] text-bx-ink">
              {HEADLINE.map((word, i) => (
                <span
                  key={word}
                  data-rise
                  style={riseDelay(0.2 + i * 0.07)}
                  className="mr-[0.26em] inline-block"
                >
                  {word}
                </span>
              ))}
            </h1>

            <p
              data-rise
              style={riseDelay(0.55)}
              className="mt-[1.125rem] max-w-[33.75rem] font-display text-[clamp(1.125rem,1.65vw,1.3125rem)] leading-[1.25] font-medium text-bx-dim"
            >
              Rubric reads the response headers, then opens the page in a real browser at the
              edge. Thirteen checks, two categories, a score for each. No account, no config.
            </p>

            <div
              data-rise
              style={riseDelay(0.7)}
              className="mt-[1.375rem] flex items-center gap-4"
            >
              <a
                href="#audit"
                className="inline-flex items-center gap-3 rounded-full bg-bx-ink px-[1.625rem] py-4 font-mono text-[0.9375rem] font-bold tracking-[0.06em] text-[#1f2326] transition-[filter] duration-200 hover:brightness-[0.93]"
              >
                RUN AN AUDIT
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="block"
                  aria-hidden="true"
                >
                  <path d="M3 0H16V12H12V4H3V0Z" fill="#1F2326" />
                  <path d="M8.00005 8L8 4H12V8H8.00005Z" fill="#1F2326" />
                  <path d="M4.00005 12L4 8H8.00005L8 12H4.00005Z" fill="#1F2326" />
                  <path d="M0 16V12H4.00005L4 16H0Z" fill="#1F2326" />
                </svg>
              </a>
              <a
                href="#how"
                className="inline-flex items-center rounded-full border-[1.5px] border-white/22 bg-transparent px-[1.875rem] py-4 font-mono text-[0.9375rem] font-bold tracking-[0.06em] text-bx-ink transition-[border-color] duration-200 hover:border-bx-ink"
              >
                EXPLORE
              </a>
            </div>
          </div>

          <div data-rise style={riseDelay(0.5)}>
            <HeroArt />
          </div>
        </div>
      </div>
    </section>
  );
}
