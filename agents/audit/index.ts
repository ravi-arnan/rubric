/**
 * Site auditor — runs on EdgeOne Makers.
 *
 * POST /audit  { "url": "https://example.com" }
 * GET  /audit?url=https://example.com
 *
 * Two passes over the target: a plain fetch for response headers, and a real browser in
 * `context.sandbox` for what only a rendered page can tell you. The sandbox is the reason
 * this lives in `agents/` — `context.sandbox` is not injected into `cloud-functions/`.
 */

import {
  auditHeaders,
  auditPage,
  checkUrl,
  grade,
  score,
  type CheckResult,
  type PageFacts,
} from "./checks";

/** Only the parts of the injected context this handler touches. */
interface SandboxBrowser {
  goto(url: string): Promise<unknown>;
  evaluate(script: string): Promise<unknown>;
  close(): Promise<unknown>;
}
interface AgentContext {
  request: Request;
  sandbox?: { browser?: SandboxBrowser };
}

const FETCH_TIMEOUT_MS = 15_000;

/**
 * Runs inside the target page. Returns the facts `auditPage` scores.
 *
 * Kept as a string because that is what `browser.evaluate` takes — so it cannot import
 * anything and must stay self-contained.
 */
const PAGE_PROBE = `(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  const images = Array.from(document.images);
  return {
    title: document.title || "",
    metaDescription:
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
    h1Count: document.querySelectorAll("h1").length,
    imageCount: images.length,
    imagesMissingAlt: images.filter((img) => !img.hasAttribute("alt")).length,
    hasLangAttr: Boolean(document.documentElement.getAttribute("lang")),
    hasViewportMeta: Boolean(document.querySelector('meta[name="viewport"]')),
    domContentLoadedMs: nav ? nav.domContentLoadedEventEnd : null,
  };
})()`;

/**
 * The landing page is a static export and calls this from the browser, which may sit on a
 * different origin than the agent. Without these the browser drops the response.
 *
 * `*` is deliberate: the endpoint is public, takes no credentials, and reads nothing
 * user-specific — so there is no cross-origin secret for a permissive policy to leak.
 */
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, makers-conversation-id",
} as const;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...CORS },
  });
}

/**
 * Accepts the target from a query string or a JSON body.
 *
 * `request.json()` came back empty on the deployed agent runtime — the platform appears to
 * read the body before the handler sees it — so `text()` is tried as well. The query string
 * is checked first because it is the one path proven to work end to end.
 */
async function readTarget(request: Request): Promise<string | null> {
  const fromQuery = new URL(request.url).searchParams.get("url");
  if (fromQuery) return fromQuery;
  if (request.method !== "POST") return null;

  // One read only: a Request body is a stream, so trying json() and then text() would fail
  // on the second call regardless of what the platform did.
  try {
    const raw = await request.text();
    if (!raw) return null;
    const body = JSON.parse(raw) as { url?: unknown };
    return typeof body.url === "string" ? body.url : null;
  } catch {
    return null;
  }
}

/** Response headers, lowercased, as the plain map `auditHeaders` expects. */
async function fetchHeaders(url: URL): Promise<Record<string, string>> {
  const response = await fetch(url.href, {
    method: "GET",
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });
  return headers;
}

/**
 * Unwrap whatever `browser.evaluate` hands back.
 *
 * The deployed runtime does not return the bare value: the first live call produced an object
 * with no `title`, so the result is wrapped. Rather than guess the wrapper name, unwrap the
 * common ones and — if none fit — throw with the keys that actually arrived, so one failed
 * request is enough to learn the real shape.
 */
function asPageFacts(raw: unknown): PageFacts {
  let value: unknown = typeof raw === "string" ? JSON.parse(raw) : raw;

  for (const key of ["result", "value", "data", "output", "returnValue"]) {
    if (looksLikeFacts(value)) break;
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    }
  }

  if (!looksLikeFacts(value)) {
    throw new Error(`evaluate() returned an unexpected shape: ${describe(raw)}`);
  }
  return value as PageFacts;
}

function looksLikeFacts(value: unknown): boolean {
  return typeof value === "object" && value !== null && typeof (value as PageFacts).title === "string";
}

/** A short, safe rendering of an unknown payload — enough to identify it, not enough to flood. */
function describe(value: unknown): string {
  if (value === null || value === undefined) return String(value);
  if (typeof value !== "object") return `${typeof value} ${JSON.stringify(value)?.slice(0, 120)}`;
  const keys = Object.keys(value as object);
  return `object with keys [${keys.join(", ")}] :: ${JSON.stringify(value).slice(0, 300)}`;
}

async function probePage(browser: SandboxBrowser, url: URL): Promise<PageFacts> {
  try {
    await browser.goto(url.href);
    return asPageFacts(await browser.evaluate(PAGE_PROBE));
  } finally {
    // The sandbox is billed per session; a browser left open outlives the request.
    await browser.close().catch(() => undefined);
  }
}

function category(name: string, checks: CheckResult[]) {
  const value = score(checks);
  return { name, score: value, grade: grade(value), checks };
}

export async function onRequest(context: AgentContext): Promise<Response> {
  // The browser sends this before any POST carrying a content-type header.
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const target = await readTarget(context.request);
  if (!target) {
    return json({ error: "Provide a url, as ?url= or a JSON body { url }" }, 400);
  }

  const checked = checkUrl(target);
  if (!checked.ok) {
    return json({ error: `Refused: ${checked.reason}`, url: target }, 400);
  }
  const { url } = checked;

  let headers: Record<string, string>;
  try {
    headers = await fetchHeaders(url);
  } catch (error) {
    // A target that will not respond is a result, not a crash — say which step failed.
    return json({ error: "Could not fetch the target", detail: String(error), url: url.href }, 502);
  }

  const categories = [category("Security headers", auditHeaders(headers))];

  const browser = context.sandbox?.browser;
  if (browser) {
    try {
      categories.push(category("Page quality", auditPage(await probePage(browser, url))));
    } catch (error) {
      // The header audit already succeeded; report the partial result rather than losing it.
      categories.push({
        name: "Page quality",
        score: 0,
        grade: grade(0),
        checks: [],
        error: `Browser probe failed: ${String(error)}`,
      } as ReturnType<typeof category> & { error: string });
    }
  }

  const overall = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0) / Math.max(categories.length, 1),
  );

  return json({
    url: url.href,
    overall: { score: overall, grade: grade(overall) },
    categories,
    // No Date.now() drift concerns here — this is the report's own timestamp.
    generatedAt: new Date().toISOString(),
  });
}

// The agents docs show `export default async function(context)`; the Pages Functions
// convention is `onRequest`. Exporting both costs one line and removes the guess.
export default onRequest;
