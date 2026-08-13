import { BRAND } from "@/lib/brand";

import { Wordmark } from "./Wordmark";

/**
 * A single-page tool does not need a mega-menu. The layout this came from carried three, each
 * with a product taxonomy that does not exist here — they are gone, and with them the mobile
 * drill-down and the client state that forced this file to be a client component.
 */
const NAV = [
  { label: "HOW IT WORKS", href: "#how" },
  { label: "API", href: "#api" },
] as const;

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[1000] h-[51px] border-b border-bx-line-soft bg-bx-void lg:h-[65px]">
      <div className="bx-frame flex h-full items-center justify-between">
        <a href="#top" aria-label={`${BRAND.name} home`} className="inline-flex items-center">
          <Wordmark />
        </a>

        <nav className="flex items-center gap-[clamp(1rem,1.75vw,2rem)]">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden font-mono text-[13px] font-bold tracking-[0.1em] text-bx-dim transition-colors duration-200 hover:text-bx-ink sm:inline"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#audit"
            className="inline-flex items-center rounded-full bg-bx-ink px-5 py-2.5 font-mono text-[13px] font-bold tracking-[0.06em] text-bx-ink-dark transition-[filter] duration-200 hover:brightness-[0.93]"
          >
            RUN AN AUDIT
          </a>
        </nav>
      </div>
    </header>
  );
}
