<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Rubric

A URL auditor running on Tencent EdgeOne Makers. A static Next.js landing page calls an agent
that fetches the target's response headers, then opens the page in EdgeOne's browser sandbox
and reports what it finds there. Thirteen checks, two categories, a weighted score per category.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict), static export
- **UI:** Tailwind CSS v4 with oklch tokens, Base UI primitives, `cn()` utility
- **Runtime:** EdgeOne Makers agent (`agents/audit/`), Node 24
- **Fonts:** four self-hosted woff2 files in `public/fonts` — do not add a network font

## Commands

- `npm run dev` — dev server on :3000
- `npm run audit:stub` — fake agent on :3002, so the report UI can be seen without deploying
- `npm run dev:stub` — dev server pointed at the stub instead of production
- `npm run check` — lint + typecheck + test + build. Run before every push.

## Structure

```
agents/audit/index.ts        handler — fetch headers, drive the browser, assemble the report
agents/audit/checks.ts       pure logic: URL guard, header rules, page rules, scoring
agents/audit/checks.test.ts  tests that run without EdgeOne
agents/audit/stub.ts         local stand-in for the agent
src/lib/brand.ts             single swap point for product identity — nothing else hardcodes it
src/lib/audit.ts             client half of the wire contract
src/components/site/         the landing page
```

## Rules specific to this project

- **`context.sandbox` exists only in `agents/`.** Moving the handler to `cloud-functions/`
  silently removes the browser and half the audit with it.
- **The URL guard in `checks.ts` is a trust boundary.** The agent fetches whatever it is handed
  from inside a cloud network. Do not loosen it without adding tests, and keep the tests that
  assert public addresses which merely look private (172.32.x, 11.x) are still allowed through.
- **The wire contract is duplicated on purpose** between `agents/audit/` and `src/lib/audit.ts`.
  They are two programs on opposite sides of a network. `stub.ts` builds its payload with the
  agent's own functions so drift shows up locally.
- **CORS is set on the agent.** The page is a static export calling the agent from the browser;
  without the headers and an `OPTIONS` handler the browser drops the response silently.
- **Brand name is "Rubric" with a c.** Never "Rubrik" — that is a NYSE-listed data security
  company, and this tool audits security headers.
- The page reveals sections with IntersectionObserver, so a full-page screenshot looks half
  empty. Judge layout per viewport while scrolling.

## Code Style

- TypeScript strict, no `any`
- Named exports, PascalCase components, camelCase utils
- Tailwind utilities, no inline styles, 2-space indent, mobile-first
