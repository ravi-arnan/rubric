"use client";

import { useRef, useState } from "react";

import { AuditError, requestAudit, type AuditCategory, type AuditReport } from "@/lib/audit";

import { SectionRails } from "./HeroSection";

type State =
  | { status: "idle" }
  | { status: "running" }
  | { status: "done"; report: AuditReport }
  | { status: "failed"; message: string };

/** Bar fill and ink follow the grade, so a bad score is legible without reading the number. */
function gradeTone(grade: string): { bar: string; ink: string } {
  if (grade === "A" || grade === "B") return { bar: "bg-bx-accent", ink: "text-bx-accent" };
  if (grade === "C") return { bar: "bg-bx-ink", ink: "text-bx-ink" };
  return { bar: "bg-[#52555A]", ink: "text-bx-mute" };
}

function CategoryBlock({ category }: { category: AuditCategory }) {
  const tone = gradeTone(category.grade);

  return (
    <div className="border-t border-white/10 pt-6">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <span className="font-mono text-xs font-bold tracking-[0.12em] text-bx-dim">
          {category.name}
        </span>
        <span className={`font-display text-[30px] leading-none font-bold ${tone.ink}`}>
          {category.score}
          <span className="ml-2 font-mono text-sm">{category.grade}</span>
        </span>
      </div>

      <div className="mb-6 h-[10px] w-full overflow-hidden bg-white/[0.06]">
        <div
          className={`h-full transition-[width] duration-700 ease-out ${tone.bar}`}
          style={{ width: `${category.score}%` }}
        />
      </div>

      {category.error ? (
        <p className="bx-body text-[15px] text-bx-mute">{category.error}</p>
      ) : (
        <ul className="m-0 flex list-none flex-col p-0">
          {category.checks.map((check) => (
            <li
              key={check.id}
              className="grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-white/10 py-3"
            >
              <span
                aria-hidden="true"
                className={`inline-block size-[9px] ${check.passed ? "bg-bx-accent" : "bg-[#52555A]"}`}
              />
              <span className="bx-body text-[15px] leading-[1.5]">
                {check.label}
                <span className="sr-only">{check.passed ? " — passed" : " — failed"}</span>
                <span className="mt-1 block font-mono text-xs text-bx-mute">{check.note}</span>
              </span>
              {/* A real CSP runs to hundreds of characters. Unbounded, it crushes the label
                  column to one word per line — so the value is clamped and the full string
                  moves to the title attribute. */}
              <span
                title={check.value ?? undefined}
                className="max-w-[14rem] truncate text-right font-mono text-xs text-bx-dim"
              >
                {check.value ?? "absent"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Three sites that score differently, so the first thing a visitor sees is not all green. */
const EXAMPLES = ["https://example.com", "https://github.com", "https://developer.mozilla.org"];

export function AuditPanel() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });
  // Lets a second submit cancel the first rather than racing it into setState.
  const pending = useRef<AbortController | null>(null);

  async function run(target: string) {
    const trimmed = target.trim();
    if (trimmed === "") return;

    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;

    setUrl(trimmed);
    setState({ status: "running" });
    try {
      const report = await requestAudit(trimmed, controller.signal);
      setState({ status: "done", report });
    } catch (error) {
      if (controller.signal.aborted) return;
      setState({
        status: "failed",
        message: error instanceof AuditError ? error.message : "The audit failed.",
      });
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(url);
  }

  return (
    <section id="audit" className="relative bg-bx-raised py-[110px]">
      <SectionRails topRule />

      <div className="bx-frame relative z-[2]">
        <div className="mb-[22px] inline-flex items-center gap-[10px]">
          <span className="inline-block size-[9px] bg-bx-accent" aria-hidden="true" />
          <span className="bx-eyebrow text-[13px] text-bx-dim">RUN AN AUDIT</span>
        </div>

        <h2 className="bx-h2 m-0 max-w-[620px]">Point it at a URL.</h2>

        <form onSubmit={onSubmit} className="mt-9 flex flex-wrap items-center gap-3">
          <label htmlFor="audit-url" className="sr-only">
            URL to audit
          </label>
          <input
            id="audit-url"
            name="url"
            type="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            className="min-w-0 flex-1 border border-bx-line bg-bx-void px-5 py-4 font-mono text-[15px] text-bx-ink placeholder:text-bx-mute focus-visible:border-bx-accent"
          />
          <button
            type="submit"
            disabled={state.status === "running"}
            className="inline-flex items-center gap-3 rounded-full bg-bx-ink px-[1.625rem] py-4 font-mono text-[0.9375rem] font-bold tracking-[0.06em] text-bx-ink-dark transition-[filter] duration-200 hover:brightness-[0.93] disabled:opacity-60"
          >
            {state.status === "running" ? "AUDITING…" : "AUDIT"}
          </button>
        </form>

        {/* Idle used to render nothing, leaving the section's bottom padding as a void under
            the form. Three one-click examples fill it with something to actually do, and they
            double as a hint of what a URL here looks like. */}
        {state.status === "idle" && (
          <div className="mt-9">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="font-mono text-xs font-bold tracking-[0.12em] text-bx-dim">
                OR TRY
              </span>
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => void run(example)}
                  className="border border-bx-line px-4 py-2 font-mono text-[13px] text-bx-mute transition-colors duration-200 hover:border-bx-accent hover:text-bx-ink"
                >
                  {example.replace("https://", "")}
                </button>
              ))}
            </div>
            <p className="mt-6 max-w-[560px] font-mono text-xs leading-[1.7] text-bx-mute">
              Nothing is stored and no account is involved. Each run fetches the response
              headers, then opens the page in a browser sandbox at the edge — about six seconds.
            </p>
          </div>
        )}

        {/* One live region for every outcome, so a screen reader hears the result without
            the form stealing focus back. */}
        <div aria-live="polite">
          {state.status === "running" && (
            <p className="bx-body mt-10 text-[15px] text-bx-mute">
              Loading the page in a browser sandbox. This takes a few seconds.
            </p>
          )}

          {state.status === "failed" && (
            <p className="bx-body mt-10 max-w-[560px] text-[15px] text-bx-ink">{state.message}</p>
          )}

          {state.status === "done" && (
            <div className="mt-10">
              {/* The score and the URL used to sit in opposite corners with a void between
                  them, and the URL simply repeated the input directly above. One centred block
                  instead: the grade leads, and the URL below it is a caption — worth keeping
                  because it is the resolved address, which a redirect can make differ from
                  what was typed. */}
              <div className="mb-12 border-b border-white/10 pb-10 text-center">
                <div className="bx-eyebrow text-[13px] text-bx-dim">OVERALL</div>
                <div
                  className={`mt-4 font-display text-[clamp(3.5rem,7vw,5rem)] leading-none font-bold ${
                    gradeTone(state.report.overall.grade).ink
                  }`}
                >
                  {state.report.overall.score}
                  <span className="ml-3 font-mono text-2xl">{state.report.overall.grade}</span>
                </div>
                <div className="mt-5 font-mono text-xs tracking-[0.04em] text-bx-dim break-all">
                  {state.report.url}
                </div>
              </div>

              {/* The frame is 1536px. Stacked in one column the report used half of it and read
                  as though the page had been cut off, so the categories sit side by side once
                  there is genuinely room for two. At lg the value column collides with the rail,
                  so the split waits for xl.

                  `pr-6` keeps right-aligned values off the vertical rail SectionRails draws at
                  the gutter. Left-aligned headings sitting on that line is the page's rhythm;
                  numbers ending on it reads as clipped. */}
              <div className="grid gap-x-16 gap-y-12 pr-6 xl:grid-cols-2">
                {state.report.categories.map((category) => (
                  <CategoryBlock key={category.name} category={category} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
