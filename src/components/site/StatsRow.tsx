import { SectionRails } from "./HeroSection";

// Every figure here is a property of the code, not a measurement or a marketing claim:
// 6 header rules + 7 page rules in checks.ts, two categories, and no configuration surface.
const STATS = [
  { figure: "13", caption: "CHECKS, EACH INDEPENDENTLY WEIGHTED" },
  { figure: "2", caption: "PASSES · HEADERS, THEN A REAL BROWSER" },
  { figure: "0", caption: "SIGNUP, CONFIG, OR API KEY" },
  { figure: "A–F", caption: "GRADED PER CATEGORY, NOT ONE NUMBER" },
] as const;

/**
 * Four proof figures directly under the hero. `data-rise-group` on the grid gives each cell the
 * 80ms stagger for free — no per-cell delay needed.
 */
export function StatsRow() {
  return (
    <section className="relative">
      <SectionRails topRule />

      <div className="bx-frame relative z-[2]">
        <div data-rise-group className="grid grid-cols-2 min-[901px]:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.caption}
              data-rise
              // ≤900px: stacked 2×2, so cells divide with a bottom rule and no right rule.
              className="border-b border-white/10 px-5 py-7 min-[901px]:border-r min-[901px]:border-b-0 min-[901px]:px-6 min-[901px]:py-[1.125rem] min-[901px]:last:border-r-0"
            >
              <div className="font-display text-[clamp(2.5rem,3.9vw,3.125rem)] leading-none font-normal tracking-[-0.04em] text-bx-ink">
                {stat.figure}
              </div>
              <div className="mt-2.5 font-mono text-xs font-bold tracking-[0.1em] text-bx-dim">
                {stat.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
