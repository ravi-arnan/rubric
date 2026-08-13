import type { CSSProperties } from "react";

import { BRAND } from "@/lib/brand";

import { SpotlightGrid } from "./SpotlightGrid";

/**
 * The one bright section on a near-black page: full-bleed `bx-accent` with dark ink on top —
 * the inverse of every other section, buttons included.
 */

/** Rails here are a dark hairline rather than the page-wide white one. */
const ACCENT_RAILS = { "--bx-rail": "rgb(31 35 38 / 0.24)" } as CSSProperties;

export function CtaSection() {
  return (
    <section id="build" className="relative overflow-hidden bg-bx-accent-surface py-[130px]">
      <div className="bx-rails" style={ACCENT_RAILS} aria-hidden="true" data-reveal>
        <div className="bx-frame relative h-full">
          <span className="bx-rail-v left-[var(--bx-gutter)]" />
          <span className="bx-rail-v right-[var(--bx-gutter)]" />
          <span className="bx-rail-h top-0 left-[var(--bx-gutter)] right-[var(--bx-gutter)]" />
        </div>
      </div>

      {/* The fragment's second absolute layer. Every cell is `background: transparent` in the
          static markup, so it looks like it paints nothing — but the cells are the cursor
          spotlight's targets. Dark ink here rather than the hero's orange, since the ground
          is already orange. */}
      <SpotlightGrid rgb="12 12 12" centre={0.16} orthogonal={0.024} diagonal={0.004} />

      <div className="bx-frame relative z-[2]">
        <div className="relative z-[5] max-w-[1140px]" data-rise-group>
          <div data-rise>
            <div className="mb-7 flex items-center gap-3">
              <span className="inline-block size-[9px] bg-[#1f2326]" aria-hidden="true" />
              <span className="bx-eyebrow text-[13px] text-[#1f2326]">
                No account, no config, no API key
              </span>
            </div>
            <h2 className="m-0 font-sans text-[clamp(56px,7.6vw,110px)] leading-[0.95] font-semibold tracking-[-0.02em] text-[#1f2326]">
              Grade a page.
              <br />
              It takes one request.
            </h2>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4" data-rise>
            <a
              href="#audit"
              className="inline-flex items-center gap-3 rounded-full bg-[#1f2326] px-[30px] py-[18px] font-mono text-[15px] font-bold tracking-[0.06em] text-bx-accent no-underline transition-colors duration-200 ease-out hover:bg-[#0b0d0e]"
            >
              RUN AN AUDIT
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="block size-4"
                aria-hidden="true"
              >
                <path d="M3 0H16V12H12V4H3V0Z" fill="currentColor" />
                <path d="M8.00005 8L8 4H12V8H8.00005Z" fill="currentColor" />
                <path d="M4.00005 12L4 8H8.00005L8 12H4.00005Z" fill="currentColor" />
                <path d="M0 16V12H4.00005L4 16H0Z" fill="currentColor" />
              </svg>
            </a>
            <a
              href={BRAND.docsUrl}
              className="inline-flex items-center rounded-full border-[1.5px] border-[rgb(31_35_38_/_0.4)] px-[30px] py-[18px] font-mono text-[15px] font-bold tracking-[0.06em] text-[#1f2326] no-underline transition-colors duration-200 ease-out hover:border-[#1f2326] hover:bg-[rgb(31_35_38_/_0.08)]"
            >
              READ THE CODE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
