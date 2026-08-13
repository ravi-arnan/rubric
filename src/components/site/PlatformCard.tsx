import type { PlatformCardContent } from "./platform-data";

/**
 * One product card from the platform grid. The motif in the top-right corner is a 2x2
 * grid of 7px squares with the fourth square ghosted; on card hover it blinks.
 * `motion-safe:` is the reduced-motion guard for that blink — globals.css only covers
 * the shared reveal animations, not per-component hover motion.
 */
export function PlatformCard({ index, title, description, features }: PlatformCardContent) {
  return (
    <article
      data-rise
      className="group relative flex min-h-[380px] flex-col border border-[#262626] bg-bx-tile px-8 pt-[34px] pb-[30px] transition-colors duration-300 hover:border-bx-line hover:bg-[#1a1a1a]"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[13px] leading-none font-bold tracking-[0.1em] text-bx-mute transition-colors duration-300 group-hover:text-bx-accent">
          {index}
        </span>
        <div className="grid auto-rows-[7px] grid-cols-[repeat(2,7px)] gap-[3px]" aria-hidden="true">
          <span className="bg-bx-ink" />
          <span className="bg-bx-ink" />
          <span className="bg-bx-ink" />
          {/* The fourth cell is an empty grid slot at rest — the target paints no
              background on it. It only becomes visible when the card is hovered. */}
          <span className="bg-transparent motion-safe:group-hover:animate-[bx-blink_1.1s_ease-in-out_infinite] motion-safe:group-hover:bg-white/20" />
        </div>
      </div>

      <h3 className="mt-[60px] font-display text-[46px] leading-none font-semibold tracking-[-0.01em] text-bx-ink">
        {title}
      </h3>
      <p className="mt-4 font-display text-[22px] leading-[1.2] font-medium text-bx-dim">
        {description}
      </p>

      {/* Spacer rather than `mt-auto` so the 28px gap survives when the copy fills the card. */}
      <div className="flex-1" />

      <div className="mt-[28px] flex flex-col border-t border-white/12 pt-[14px]">
        {features.map((feature, index) => (
          <div
            // Placeholder copy repeats, so the string is not a stable key. This list is a
            // static constant and is never reordered.
            key={index}
            className="bx-meta border-b border-white/12 py-[7px] text-[13px] text-bx-mute"
          >
            {feature}
          </div>
        ))}
      </div>
    </article>
  );
}
