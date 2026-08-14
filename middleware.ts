/**
 * Security response headers for the deployed site.
 *
 * These cannot live in `next.config.ts`. The site is `output: "export"`, and Next drops
 * `headers()` for static exports — there is no server left to run them. EdgeOne middleware
 * is the only mechanism the platform documents that stays inside the repo, so it goes here.
 *
 * Rubric scored its own deployment 0/F on exactly these checks. CSP carries the largest
 * weight (25, see `agents/audit/checks.ts`) and is deliberately left out: the static export
 * still ships inline hydration scripts, and a policy without 'unsafe-inline' would break the
 * RUN AN AUDIT button. That one needs its own change, tested against a real deployment.
 */
const SECURITY_HEADERS: Record<string, string> = {
  /** One year, the usual floor for preload eligibility. */
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  /** Nothing here is meant to be framed. */
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  /** Origin only across sites, full path within this one. */
  "Referrer-Policy": "strict-origin-when-cross-origin",
  /** An auditor needs none of these. */
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

/** The subset of EdgeOne's middleware context this file uses. */
interface MiddlewareContext {
  readonly next: (init?: { headers?: Record<string, string> }) => Response | Promise<Response>;
}

export function middleware(context: MiddlewareContext): Response | Promise<Response> {
  return context.next({ headers: SECURITY_HEADERS });
}

// No `config.matcher`: EdgeOne defaults to every route, which is what the headers want.
