import { PROOF_CARDS } from "@/components/site/proof-data";

/**
 * "Check it yourself." — three outbound proof cards on the sunken surface.
 *
 */

/** The site-wide "leaves this page" glyph: a four-path arrow, drawn stepped rather than diagonal. */
function ArrowOut({ size }: { readonly size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
      aria-hidden="true"
    >
      <path d="M3 0H16V12H12V4H3V0Z" fill="currentColor" />
      <path d="M8.00005 8L8 4H12V8H8.00005Z" fill="currentColor" />
      <path d="M4.00005 12L4 8H8.00005L8 12H4.00005Z" fill="currentColor" />
      <path d="M0 16V12H4.00005L4 16H0Z" fill="currentColor" />
    </svg>
  );
}

export function ProofSection() {
  return (
    <section className="relative bg-bx-sunken py-[110px]">
      <div className="bx-rails" aria-hidden="true" data-reveal>
        <div className="bx-frame relative h-full">
          <span className="bx-rail-v left-[var(--bx-gutter)]" />
          <span className="bx-rail-v right-[var(--bx-gutter)]" />
          <span className="bx-rail-h top-0 left-[var(--bx-gutter)] right-[var(--bx-gutter)]" />
        </div>
      </div>

      <div className="bx-frame relative z-[2]">
        <div className="mb-[22px] inline-flex items-center gap-2.5" data-rise>
          <span aria-hidden="true" className="size-[9px] bg-bx-accent" />
          <span className="bx-eyebrow text-[13px] text-bx-dim">PROOF</span>
        </div>

        <h2 className="bx-h2 m-0 mb-12" data-rise>
          Check it yourself.
        </h2>

        <div
          className="grid grid-cols-1 gap-[18px] min-[620px]:grid-cols-2 lg:grid-cols-3"
          data-rise-group
        >
          {PROOF_CARDS.map((card) => (
            <a
              key={card.title}
              href={card.href}
              {...(card.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              data-rise
              /* border-bx-line-soft composites to exactly #262626 over the bx-tile card surface. */
              className="flex flex-col border border-bx-line-soft bg-bx-tile px-7 pt-7 pb-[26px] no-underline transition-[transform,box-shadow] duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgb(0_0_0/0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
            >
              <span className="font-mono text-xs font-bold tracking-[0.12em] text-bx-mute">
                {card.category}
              </span>
              <span className="mt-[18px] font-display text-[28px] leading-[1.05] font-semibold tracking-[-0.01em] text-bx-ink">
                {card.title}
              </span>
              <span className="mt-3 mb-[22px] font-display text-lg leading-[1.3] font-medium text-bx-dim">
                {card.description}
              </span>
              <span className="mt-auto inline-flex items-center gap-2.5 font-mono text-[13px] font-bold tracking-[0.08em] text-bx-ink">
                {card.cta}
                <ArrowOut size={11} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
