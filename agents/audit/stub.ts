/**
 * Local stand-in for the deployed agent, so the report UI can be seen before EdgeOne exists.
 *
 * It builds the payload with the agent's own pure functions rather than a hand-written
 * fixture — if the client and the agent ever disagree about the wire shape, this catches it.
 *
 *   npm run audit:stub
 */
import { createServer } from "node:http";

import {
  auditHeaders,
  auditPage,
  grade,
  score,
} from "./checks.ts";

// A deliberately mixed result: some passes, some failures, so every visual state renders.
const HEADERS = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
};

const PAGE = {
  title: "Example Domain",
  metaDescription: null,
  h1Count: 1,
  imagesMissingAlt: 2,
  imageCount: 6,
  hasLangAttr: true,
  hasViewportMeta: false,
  domContentLoadedMs: 640,
};

function category(name: string, checks: ReturnType<typeof auditHeaders>) {
  const value = score(checks);
  return { name, score: value, grade: grade(value), checks };
}

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, makers-conversation-id",
};

createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS).end();
    return;
  }

  const categories = [
    category("Security headers", auditHeaders(HEADERS)),
    category("Page quality", auditPage(PAGE)),
  ];
  const overall = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length,
  );

  res.writeHead(200, { "content-type": "application/json", ...CORS }).end(
    JSON.stringify({
      url: "https://example.com/",
      overall: { score: overall, grade: grade(overall) },
      categories,
      generatedAt: new Date().toISOString(),
    }),
  );
}).listen(3002, () => console.log("audit stub on http://localhost:3002"));
