import { Fragment } from "react";

import { CopyButton } from "@/components/site/CopyButton";

import { SectionRails } from "./HeroSection";

/**
 * The API split that closes the models section. The model table above it is a separate
 * component.
 */

/** A run of code text. Plain strings render in the base colour; `{ ink }` renders highlighted. */
type Token = string | { readonly ink: string };

/**
 * The curl sample, one array per rendered line. The target highlights with exactly two colours —
 * base `#c7cacb` and `bx-ink` — so a boolean-ish token is all the "syntax highlighting" needed.
 */
const CURL_LINES: readonly (readonly Token[])[] = [
  [{ ink: "curl" }, " -sS \\"],
  ["  ", { ink: "'https://edgeone-site-auditor.edgeone.dev/audit?url=https://example.com'" }, " \\"],
  ["  -H ", { ink: "'makers-conversation-id: your-session-id'" }],
];

/** Same sample as flat text, for the clipboard. Derived so the two can never drift apart. */
const CURL_TEXT = CURL_LINES.map((line) =>
  line.map((token) => (typeof token === "string" ? token : token.ink)).join(""),
).join("\n");

const BULLETS: readonly string[] = [
  "GET or POST · the target goes in ?url=",
  "makers-conversation-id is required by the runtime",
  "JSON in, JSON out · no key, no account",
  "Private and loopback addresses are refused",
];

export function CodeSection() {
  return (
    <section id="api" className="relative pt-[110px] pb-[120px]">
      {/* This was the one section without rails, so the page's vertical hairlines broke here
          and picked up again below. */}
      <SectionRails />

      <div className="bx-frame relative z-[2] grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[70px]">
        <div data-rise>
          {/* .bx-h3, not .bx-h2 — the target renders this in the condensed display face.
              Archivo at the same size overflows and re-wraps after "three". */}
          <h3 className="bx-h3 m-0">One request, no key.</h3>

          <p className="bx-body mt-[22px] mb-[30px] max-w-[400px] text-[22px] leading-[1.25]">
            The same endpoint the form above calls. The one header that is not obvious is
            required by the agent runtime itself — leave it out and you get a 400 before the
            handler ever runs.
          </p>

          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {BULLETS.map((bullet) => (
              <li
                key={bullet}
                className="bx-meta flex items-center gap-3.5 text-sm text-bx-ink"
              >
                {/* The target uses a grey square here, not the orange eyebrow marker. */}
                <span aria-hidden="true" className="size-[7px] shrink-0 bg-bx-dim" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* Terminal. Sits *above* the page surface in value (#1a1a1a on #080808), not below it. */}
        <div className="overflow-hidden bg-[#1a1a1a] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] lg:mr-4">
          <div className="flex items-center gap-2 border-b border-white/[0.08] px-5 py-4">
            <span aria-hidden="true" className="size-[11px] rounded-full bg-[#4a4f52]" />
            <span aria-hidden="true" className="size-[11px] rounded-full bg-[#4a4f52]" />
            <span
              aria-hidden="true"
              className="size-[11px] animate-[bx-pulse_2.2s_ease-out_infinite] rounded-full bg-bx-dim motion-reduce:animate-none"
            />
            <span className="ml-3 font-mono text-xs tracking-[0.06em] text-bx-faint">curl</span>
            <CopyButton value={CURL_TEXT} />
          </div>

          <pre className="bx-thin-scroll m-0 overflow-x-auto px-7 py-[30px] font-mono text-[15px] leading-[1.85] text-[#c7cacb]">
            <code>
              {/* Indices are safe keys: this list is a static constant, never reordered. */}
              {CURL_LINES.map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {line.map((token, tokenIndex) =>
                    typeof token === "string" ? (
                      token
                    ) : (
                      <span key={tokenIndex} className="text-bx-ink">
                        {token.ink}
                      </span>
                    ),
                  )}
                  {"\n"}
                </Fragment>
              ))}
              <span
                aria-hidden="true"
                className="ml-[3px] inline-block h-[17px] w-[9px] animate-[bx-blink_1.1s_steps(1)_infinite] bg-bx-ink align-text-bottom motion-reduce:animate-none"
              />
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
