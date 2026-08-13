import { BRAND } from "@/lib/brand";

import { PlatformCard } from "./PlatformCard";
import { PLATFORM_CARDS } from "./platform-data";

export function PlatformSection() {
  return (
    <section id="how" className="relative pt-[130px] pb-[110px]">
      <div className="bx-rails z-[1] flex justify-center" aria-hidden="true" data-reveal>
        <div className="relative h-full w-full max-w-[var(--bx-frame)] px-[var(--bx-gutter)]">
          <span className="bx-rail-v left-[var(--bx-gutter)]" />
          <span className="bx-rail-v right-[var(--bx-gutter)]" />
          <span className="bx-rail-h top-0 right-[var(--bx-gutter)] left-[var(--bx-gutter)]" />
        </div>
      </div>

      <div className="bx-frame relative z-[2]">
        <div
          data-rise
          className="mb-16 flex items-end justify-between gap-10 max-[900px]:flex-col max-[900px]:items-start"
        >
          <div>
            <div className="mb-[22px] inline-flex items-center gap-[10px]">
              <span className="inline-block size-[9px] bg-bx-accent" aria-hidden="true" />
              <span className="bx-eyebrow text-[13px] text-bx-dim">THE PLATFORM</span>
            </div>
            <h2 className="bx-h2 max-w-[720px]">Two passes over the page.</h2>
            <p className="bx-body mt-[26px] max-w-[640px] text-[clamp(19px,1.9vw,24px)] leading-[1.25]">
              The first pass is a plain request — any serverless function could do it. The second
              needs a browser, which is why this runs as an agent rather than a function.
            </p>
          </div>

          <a
            href={BRAND.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bx-wipe inline-flex shrink-0 items-center gap-[10px] font-mono text-sm font-bold tracking-[0.06em] text-bx-ink"
          >
            VIEW DOCS
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="block size-3"
              aria-hidden="true"
            >
              <path d="M3 0H16V12H12V4H3V0Z" fill="currentColor" />
              <path d="M8.00005 8L8 4H12V8H8.00005Z" fill="currentColor" />
              <path d="M4.00005 12L4 8H8.00005L8 12H4.00005Z" fill="currentColor" />
              <path d="M0 16V12H4.00005L4 16H0Z" fill="currentColor" />
            </svg>
          </a>
        </div>

        <div
          data-rise-group
          className="grid grid-cols-3 gap-[18px] max-[1080px]:grid-cols-2 max-[620px]:grid-cols-1"
        >
          {PLATFORM_CARDS.map((card) => (
            <PlatformCard key={card.index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
