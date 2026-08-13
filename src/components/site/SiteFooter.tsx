import {
  FOOTER_ADDRESS,
  FOOTER_COLUMNS,
  FOOTER_COPYRIGHT,
  FOOTER_LEGAL_LINKS,
  FOOTER_TAGLINE,
} from "./footer-data";
import { Wordmark } from "./Wordmark";

/* `text-[14px] leading-normal`, not `text-sm`: Tailwind's `text-sm` ships a paired
   line-height of 20px, while the target sets font-size alone and inherits `normal`
   (~18.5px here). Over seven rows per column that compounds into a visibly taller
   footer. */
const LINK_CLASS =
  "font-mono text-[14px] leading-normal text-bx-soft transition-colors duration-200 hover:text-bx-accent focus-visible:text-bx-accent";

const HEADING_CLASS =
  "mb-[22px] font-mono text-xs font-bold tracking-[0.1em] text-bx-dim";


export function SiteFooter() {
  return (
    <footer className="relative bg-bx-raised pt-[90px] pb-11">
      <div className="bx-rails flex justify-center" aria-hidden="true" data-reveal>
        <div className="relative h-full w-full max-w-[var(--bx-frame)] box-border px-[var(--bx-gutter)]">
          <span className="bx-rail-v left-[var(--bx-gutter)]" />
          <span className="bx-rail-v right-[var(--bx-gutter)]" />
          <span className="bx-rail-h top-0 left-[var(--bx-gutter)] right-[var(--bx-gutter)]" />
        </div>
      </div>

      <div className="bx-frame relative z-[2]">
        <div className="grid grid-cols-2 gap-10 border-b border-white/10 pb-[70px] min-[900px]:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 min-[900px]:col-span-1">
            <Wordmark className="text-[20px]" />
            <p className="mt-[26px] max-w-[320px] font-display text-[26px] leading-[1.2] font-medium text-bx-ink">
              {FOOTER_TAGLINE}
            </p>
            <address className="mt-[26px] font-mono text-xs leading-[1.8] tracking-[0.04em] text-bx-dim not-italic">
              {FOOTER_ADDRESS.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <div className={HEADING_CLASS}>{column.heading}</div>
              <div className="flex flex-col gap-[14px]">
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className={LINK_CLASS}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-7">
          <span className="font-mono text-xs tracking-[0.04em] text-bx-dim">
            {FOOTER_COPYRIGHT}
          </span>
          <span className="font-mono text-xs tracking-[0.04em] text-bx-dim">
            {FOOTER_LEGAL_LINKS.map((link, index) => (
              <span key={link.label}>
                {index > 0 ? " · " : null}
                <a
                  href={link.href}
                  className="text-inherit transition-colors duration-200 hover:text-bx-accent"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
