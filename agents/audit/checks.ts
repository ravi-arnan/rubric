/**
 * Pure audit logic. No EdgeOne APIs in here on purpose — everything in this file runs
 * under plain `node --test`, so the scoring and the URL guard can be verified without
 * a deploy.
 */

/* --------------------------------------------------------------- URL guard */

/** Hostnames that must never be fetched, whatever the caller asks for. */
const BLOCKED_HOSTS = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.goog",
]);

/** Suffixes that resolve inside a private network. */
const BLOCKED_SUFFIXES = [".localhost", ".local", ".internal", ".home.arpa"];

/**
 * IPv4 literals that live in a private, loopback, link-local or carrier-NAT range.
 * Cloud metadata endpoints (169.254.169.254) are covered by the link-local rule.
 */
function isPrivateIPv4(host: string): boolean {
  const parts = host.split(".");
  if (parts.length !== 4) return false;

  const octets = parts.map((part) => Number(part));
  if (octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;

  const [a, b] = octets as [number, number, number, number];
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function isPrivateIPv6(host: string): boolean {
  // URL parsing hands IPv6 hosts back wrapped in brackets.
  const addr = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (addr === "::1" || addr === "::") return true;
  if (/^f[cd][0-9a-f]{2}:/.test(addr)) return true; // fc00::/7 unique-local
  if (/^fe[89ab][0-9a-f]:/.test(addr)) return true; // fe80::/10 link-local
  return false;
}

export type UrlCheck = { ok: true; url: URL } | { ok: false; reason: string };

/**
 * Gate for every user-supplied target.
 *
 * This is a trust boundary: the agent fetches whatever it is handed, from inside
 * EdgeOne's network. Without this, anyone could point the auditor at a private address
 * and read the response back out of the report.
 *
 * Known limit: the check runs on the hostname as written. A public name that resolves
 * to a private address (DNS rebinding) still gets through — closing that needs
 * resolve-then-pin, which the edge runtime does not expose.
 */
export function checkUrl(raw: string): UrlCheck {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: "Not a valid URL" };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: `Unsupported scheme: ${url.protocol}` };
  }

  const host = url.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host)) return { ok: false, reason: "Blocked host" };
  if (BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
    return { ok: false, reason: "Blocked host suffix" };
  }
  if (isPrivateIPv4(host) || isPrivateIPv6(host)) {
    return { ok: false, reason: "Private address range" };
  }

  return { ok: true, url };
}

/* ------------------------------------------------------------- header audit */

export interface CheckResult {
  readonly id: string;
  readonly label: string;
  /** Weight toward the category score. */
  readonly weight: number;
  readonly passed: boolean;
  /** What the site actually sent, for the report. `null` when the header is absent. */
  readonly value: string | null;
  readonly note: string;
}

interface HeaderRule {
  readonly id: string;
  readonly header: string;
  readonly label: string;
  readonly weight: number;
  readonly note: string;
  /** Extra condition beyond "the header exists". */
  readonly accept?: (value: string) => boolean;
}

const HEADER_RULES: readonly HeaderRule[] = [
  {
    id: "hsts",
    header: "strict-transport-security",
    label: "Strict-Transport-Security",
    weight: 20,
    note: "Forces HTTPS on repeat visits.",
    accept: (v) => /max-age=\s*(\d+)/.test(v) && Number(/max-age=\s*(\d+)/.exec(v)![1]) > 0,
  },
  {
    id: "csp",
    header: "content-security-policy",
    label: "Content-Security-Policy",
    weight: 25,
    note: "The main defence against injected scripts.",
  },
  {
    id: "frame",
    header: "x-frame-options",
    label: "X-Frame-Options",
    weight: 15,
    note: "Blocks clickjacking via framing. A CSP frame-ancestors rule also covers this.",
  },
  {
    id: "nosniff",
    header: "x-content-type-options",
    label: "X-Content-Type-Options",
    weight: 15,
    note: "Stops MIME sniffing.",
    accept: (v) => v.trim().toLowerCase() === "nosniff",
  },
  {
    id: "referrer",
    header: "referrer-policy",
    label: "Referrer-Policy",
    weight: 15,
    note: "Controls how much URL data leaks to third parties.",
  },
  {
    id: "permissions",
    header: "permissions-policy",
    label: "Permissions-Policy",
    weight: 10,
    note: "Switches off browser features the page does not use.",
  },
];

/** `headers` is a plain lowercase-keyed map so this stays testable without a Response. */
export function auditHeaders(headers: Readonly<Record<string, string>>): CheckResult[] {
  return HEADER_RULES.map((rule) => {
    const value = headers[rule.header] ?? null;
    const passed = value !== null && (rule.accept?.(value) ?? true);
    return {
      id: rule.id,
      label: rule.label,
      weight: rule.weight,
      passed,
      value,
      note: rule.note,
    };
  });
}

/* --------------------------------------------------------------- page audit */

/** What the browser sandbox is asked to report back about the rendered page. */
export interface PageFacts {
  readonly title: string;
  readonly metaDescription: string | null;
  readonly h1Count: number;
  readonly imagesMissingAlt: number;
  readonly imageCount: number;
  readonly hasLangAttr: boolean;
  readonly hasViewportMeta: boolean;
  /** Milliseconds from navigation start to DOM content loaded. */
  readonly domContentLoadedMs: number | null;
}

export function auditPage(facts: PageFacts): CheckResult[] {
  return [
    {
      id: "title",
      label: "Page title",
      weight: 15,
      passed: facts.title.trim().length > 0 && facts.title.length <= 70,
      value: facts.title || null,
      note: "Present and under 70 characters.",
    },
    {
      id: "description",
      label: "Meta description",
      weight: 10,
      passed: (facts.metaDescription ?? "").trim().length > 0,
      value: facts.metaDescription,
      note: "Used verbatim by search engines and link previews.",
    },
    {
      id: "h1",
      label: "Single H1",
      weight: 10,
      passed: facts.h1Count === 1,
      value: String(facts.h1Count),
      note: "Exactly one top-level heading.",
    },
    {
      id: "alt",
      label: "Image alt text",
      weight: 20,
      passed: facts.imagesMissingAlt === 0,
      value: `${facts.imagesMissingAlt} of ${facts.imageCount} missing`,
      note: "Every image needs alt text, empty for decorative ones.",
    },
    {
      id: "lang",
      label: "html lang attribute",
      weight: 15,
      passed: facts.hasLangAttr,
      value: facts.hasLangAttr ? "present" : null,
      note: "Tells screen readers which language to speak.",
    },
    {
      id: "viewport",
      label: "Viewport meta",
      weight: 15,
      passed: facts.hasViewportMeta,
      value: facts.hasViewportMeta ? "present" : null,
      note: "Without it the page renders at desktop width on phones.",
    },
    {
      id: "dcl",
      label: "DOM content loaded",
      weight: 15,
      // 2s is the threshold below which a page feels responsive on a mid-tier connection.
      passed: facts.domContentLoadedMs !== null && facts.domContentLoadedMs < 2000,
      value: facts.domContentLoadedMs === null ? null : `${Math.round(facts.domContentLoadedMs)}ms`,
      note: "Under 2 seconds.",
    },
  ];
}

/* ----------------------------------------------------------------- scoring */

export type Grade = "A" | "B" | "C" | "D" | "F";

/** Percentage of the available weight that passed. Empty check list scores 0, not NaN. */
export function score(checks: readonly CheckResult[]): number {
  const total = checks.reduce((sum, check) => sum + check.weight, 0);
  if (total === 0) return 0;
  const earned = checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0);
  return Math.round((earned / total) * 100);
}

export function grade(value: number): Grade {
  if (value >= 90) return "A";
  if (value >= 75) return "B";
  if (value >= 60) return "C";
  if (value >= 40) return "D";
  return "F";
}
