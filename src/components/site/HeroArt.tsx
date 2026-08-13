import type { CSSProperties } from "react";

/**
 * The hero diagram: a URL enters, forks into the two passes the auditor actually makes, and
 * both converge on a score.
 *
 * The geometry is the message. The earlier version of this file drew a datacenter — a GPU
 * rack, tenant boxes, a token stream — and renaming its labels did not make it describe an
 * audit. Every shape here maps to something in `agents/audit/checks.ts`: six header rows,
 * seven page rows, two category bars.
 *
 * Dashed "flow" paths reuse the shared `bx-dash` keyframe and vary only `--bx-travel` and
 * duration. The `bx-flow-*` / `bx-gpu` class names are the hooks globals.css uses to kill all
 * motion under `prefers-reduced-motion`, so they must survive any refactor even though the
 * animation itself is declared with Tailwind utilities.
 */
const travel = (px: string): CSSProperties => ({ "--bx-travel": px }) as CSSProperties;

/** The diagram's tiny labels render at monospace metrics, not the site's functional font. */
const LABEL = "monospace";

const DIM = "#7e8285";
const FAINT = "rgba(255,255,255,0.22)";
const ACCENT = "var(--color-bx-accent)";

/** One header check: a marker plus a rule. Filled marker = passed. */
function HeaderRow({ y, passed }: { y: number; passed: boolean }) {
  return (
    <g>
      <rect
        x={166}
        y={y}
        width={7}
        height={7}
        fill={passed ? ACCENT : "none"}
        stroke={passed ? "none" : DIM}
        strokeWidth={1}
      />
      <path d={`M182 ${y + 3.5}h${passed ? 128 : 92}`} stroke={passed ? DIM : FAINT} strokeWidth={1} />
    </g>
  );
}

export function HeroArt() {
  return (
    <div
      role="img"
      aria-label="Diagram: a URL enters at the edge and forks into two passes. The first reads six response headers. The second opens the page in a browser sandbox and inspects the rendered document. Both feed a scoring block that returns a grade."
      className="mx-auto aspect-[560/480] w-full max-w-[35rem] bg-bx-void [contain-intrinsic-size:560px_480px] [content-visibility:auto]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 560 480"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="block h-full w-full"
      >
        <defs>
          <pattern id="bx-heroart-dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1" height="1" fill="#ffffff" fillOpacity="0.12" />
          </pattern>
        </defs>

        <rect x="24" y="24" width="512" height="432" fill="url(#bx-heroart-dots)" />

        {/* corner brackets */}
        <g stroke={DIM} strokeWidth="1.5" fill="none">
          <path d="M16 30V16h14M544 30V16h-14M16 450v14h14M544 450v14h-14" />
        </g>

        {/* EDGE.01 status matrix */}
        <g>
          <rect x="492" y="40" width="7" height="7" fill={DIM} />
          <rect x="503" y="40" width="7" height="7" fill={DIM} />
          <rect x="514" y="40" width="7" height="7" fill={ACCENT} />
          <rect x="492" y="51" width="7" height="7" fill={DIM} />
          <rect x="503" y="51" width="7" height="7" fill={DIM} />
          <rect x="514" y="51" width="7" height="7" fill={DIM} />
          <text x="492" y="74" fontFamily={LABEL} fontSize="8" letterSpacing="1" fill={DIM}>
            EDGE.01
          </text>
        </g>

        {/* ---------------------------------------------------------- URL in */}
        <text x="40" y="86" fontFamily={LABEL} fontSize="9" letterSpacing="1" fill={ACCENT}>
          URL IN
        </text>
        <rect x="40" y="96" width="4" height="4" fill={ACCENT} />
        <path
          d="M46 98h74"
          stroke={ACCENT}
          strokeWidth="1.2"
          strokeDasharray="4 4"
          className="bx-flow-in animate-[bx-dash_1.6s_linear_infinite]"
          style={travel("-16px")}
        />

        {/* the fork: one request, two passes */}
        <path d="M120 98v206" stroke={DIM} strokeWidth="1" />
        <rect x="117" y="95" width="6" height="6" fill={ACCENT} />

        {/* --------------------------------------------- pass 01: headers */}
        <path
          d="M120 98h30"
          stroke={DIM}
          strokeWidth="1"
          strokeDasharray="3 3"
          className="bx-flow-a animate-[bx-dash_1.4s_linear_infinite]"
          style={travel("-12px")}
        />
        <rect x="150" y="66" width="176" height="122" stroke={DIM} strokeWidth="1" />
        <text x="150" y="58" fontFamily={LABEL} fontSize="9" letterSpacing="1" fill={DIM}>
          RESPONSE HEADERS
        </text>

        {/* Six rows, one per rule in checks.ts. Three pass, three do not — the same mixed
            result a real site returns, so the diagram is not a green wall. */}
        <HeaderRow y={82} passed />
        <HeaderRow y={100} passed={false} />
        <HeaderRow y={118} passed={false} />
        <HeaderRow y={136} passed />
        <HeaderRow y={154} passed />
        <HeaderRow y={172} passed={false} />

        <text x="150" y="204" fontFamily={LABEL} fontSize="8" letterSpacing="1" fill={FAINT}>
          6 CHECKS · NO RENDER NEEDED
        </text>

        {/* ------------------------------------- pass 02: the browser sandbox */}
        <path
          d="M120 304h30"
          stroke={ACCENT}
          strokeWidth="1"
          strokeDasharray="3 3"
          className="bx-flow-b animate-[bx-dash_1.4s_linear_infinite]"
          style={travel("-12px")}
        />
        <rect
          x="150"
          y="236"
          width="204"
          height="150"
          stroke={ACCENT}
          strokeWidth="1"
          strokeDasharray="5 4"
          className="bx-flow-boundary animate-[bx-dash_4s_linear_infinite]"
          style={travel("-18px")}
        />
        <text x="150" y="228" fontFamily={LABEL} fontSize="9" letterSpacing="1" fill={ACCENT}>
          BROWSER SANDBOX
        </text>

        {/* a browser window, drawn as one: chrome bar, then the rendered document */}
        <rect x="166" y="252" width="172" height="118" stroke={DIM} strokeWidth="1" />
        <path d="M166 272h172" stroke={DIM} strokeWidth="1" />
        <circle cx="176" cy="262" r="3" fill={FAINT} />
        <circle cx="186" cy="262" r="3" fill={FAINT} />
        <circle
          cx="196"
          cy="262"
          r="3"
          fill={ACCENT}
          className="bx-gpu animate-[bx-gpu_2.2s_ease-in-out_infinite]"
        />

        {/* the document the checks read: heading, copy, an image without alt */}
        <rect x="178" y="284" width="76" height="9" fill={DIM} />
        <path
          d="M178 306h148M178 316h124M178 326h140"
          stroke={FAINT}
          strokeWidth="1"
        />
        <rect x="178" y="338" width="42" height="24" stroke={DIM} strokeWidth="1" />
        <path d="M178 338l42 24M220 338l-42 24" stroke={FAINT} strokeWidth="1" />
        <text x="228" y="355" fontFamily={LABEL} fontSize="8" letterSpacing="1" fill={DIM}>
          ALT MISSING
        </text>

        <text x="150" y="402" fontFamily={LABEL} fontSize="8" letterSpacing="1" fill={FAINT}>
          7 CHECKS · TITLE, LANG, VIEWPORT, TIMING
        </text>

        {/* ------------------------------------------------- converge on a score */}
        {/* Both routes end at the scoring box's left edge (x=414). Drawn as right-down-right and
            right-up-right so the two never overlap on the shared vertical channel at x=390. */}
        <path
          d="M326 127h64v103h24"
          stroke={DIM}
          strokeWidth="1"
          strokeDasharray="3 3"
          className="bx-flow-join-a animate-[bx-dash_2s_linear_infinite]"
          style={travel("-12px")}
        />
        <path
          d="M354 311h36v-61h24"
          stroke={ACCENT}
          strokeWidth="1"
          strokeDasharray="3 3"
          className="bx-flow-join-b animate-[bx-dash_2s_linear_infinite]"
          style={travel("-12px")}
        />

        <rect x="414" y="190" width="102" height="100" stroke={DIM} strokeWidth="1.5" />
        <text x="414" y="182" fontFamily={LABEL} fontSize="9" letterSpacing="1" fill={DIM}>
          SCORING
        </text>

        {/* one bar per category, weighted — the same two the report returns */}
        <text x="426" y="216" fontFamily={LABEL} fontSize="7" letterSpacing="1" fill={FAINT}>
          HEADERS
        </text>
        <rect x="426" y="222" width="78" height="8" fill="rgba(255,255,255,0.08)" />
        <rect x="426" y="222" width="39" height="8" fill={DIM} />

        <text x="426" y="250" fontFamily={LABEL} fontSize="7" letterSpacing="1" fill={FAINT}>
          PAGE
        </text>
        <rect x="426" y="256" width="78" height="8" fill="rgba(255,255,255,0.08)" />
        <rect x="426" y="256" width="70" height="8" fill={ACCENT} />

        <text x="426" y="280" fontFamily={LABEL} fontSize="11" letterSpacing="2" fill={ACCENT}>
          A–F
        </text>

        {/* ------------------------------------------------------- report out */}
        <path
          d="M465 290v46"
          stroke={ACCENT}
          strokeWidth="1.2"
          strokeDasharray="4 4"
          className="bx-flow-out animate-[bx-dash_0.9s_linear_infinite]"
          style={travel("-16px")}
        />
        <rect x="462" y="336" width="6" height="6" fill={ACCENT} />
        <text x="404" y="360" fontFamily={LABEL} fontSize="9" letterSpacing="1" fill={ACCENT}>
          REPORT OUT
        </text>
        <text x="404" y="376" fontFamily={LABEL} fontSize="8" letterSpacing="1" fill={FAINT}>
          13 CHECKS · JSON
        </text>

        {/* --------------------------------------------------------- base axis */}
        <path d="M24 428h512" stroke={FAINT} strokeWidth="1" strokeDasharray="2 4" />
        <g fontFamily={LABEL} fontSize="8" letterSpacing="1" fill={DIM}>
          <text x="34" y="446">
            01 HEADERS
          </text>
          <text x="248" y="446">
            02 RENDER
          </text>
          <text x="452" y="446">
            03 SCORE
          </text>
        </g>
      </svg>
    </div>
  );
}
