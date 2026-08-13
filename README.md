# Rubric — a report card for any URL

Point it at a URL. A browser opens the page inside Tencent EdgeOne's sandbox, and you get a
report card: security headers, page quality, a score per category. No account, no API key.

**Live: https://edgeone-site-auditor.edgeone.dev** · built for DevHandal 2026 Batch 2.

Thirteen checks in two categories, each independently weighted, each category graded on its
own — so a site with immaculate headers and a broken page cannot hide behind one average.
Verified against real sites: `github.com` scores 95 A, `example.com` 45 D.

## Why it needs EdgeOne specifically

The audit runs two passes over the target:

1. **Response headers** — a plain `fetch`. Any serverless function could do this.
2. **Rendered page** — a real browser in `context.sandbox`, reporting title, meta description,
   heading structure, missing image alt text, `lang`, viewport meta and load timing.

The second pass is the reason this is an agent. **`context.sandbox` is injected into `agents/`
only — `cloud-functions/` does not get it.** That single fact decided the layout of this repo.

## Layout

```
agents/audit/index.ts        handler — fetch headers, drive the browser, assemble the report
agents/audit/checks.ts       pure logic: URL guard, header rules, page rules, scoring
agents/audit/checks.test.ts  12 tests, no EdgeOne needed
agents/audit/stub.ts         local stand-in for the agent, so the UI can be seen pre-deploy
src/lib/audit.ts             client half of the wire contract
src/components/site/         the landing page
```

## Run it

```bash
npm install
npm run dev          # http://localhost:3000

npm run audit:stub   # terminal 2 — fake agent on :3002
npm run dev:stub     # terminal 1 instead of `dev` — points the UI at the stub
```

Without the stub the form still works; it just reports that the auditor is unreachable.

```bash
npm run check        # lint + typecheck + test + build
```

## Notes for anyone reading the code

**The URL guard is a trust boundary, not a formality.** The agent fetches whatever it is
handed, from inside EdgeOne's network. `checks.ts` blocks loopback, private ranges, CGNAT,
IPv6 unique-local and cloud metadata endpoints — with tests that also assert public addresses
which merely *look* private (172.32.x, 11.x) are not blocked. Its known limit is written down
in the source: a public hostname that resolves to a private address still gets through, and
closing that needs resolve-then-pin, which the edge runtime does not expose.

**The wire contract is deliberately duplicated** between `agents/audit/` and `src/lib/audit.ts`.
They are two programs on opposite sides of a network, not one module. `stub.ts` builds its
payload with the agent's own functions, so a drift between the two shows up locally.

**CORS is set on the agent.** The page is a static export calling the agent from the browser;
without the headers and an `OPTIONS` handler, the browser silently drops the response.

## What the runtime does that the docs do not say

Six things this project only learned by deploying. They are the reason the repo is laid out
the way it is:

1. `context.sandbox` is injected into `agents/` only — a `cloud-functions/` handler never gets it.
2. Every request to an agent must carry a `makers-conversation-id` header (6–36 chars). Without
   it the platform answers 400 before the handler runs, which makes a healthy endpoint look dead.
3. A POST body does not reach the handler. The target goes in `?url=`.
4. `browser.evaluate()` returns a wrapped value, not the raw one.
5. `<project>-<deploymentId>.edgeone.dev` is pinned to one deployment; the production alias is
   `<project>.edgeone.dev`. Testing the first makes a new deploy look like it never landed.
6. `nodeVersion: "24"` is accepted, the build takes about 73 seconds, and the agent is routed at
   `/audit` with no extra configuration.

## Credits

Scaffolded from [ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template)
by JCodesMore (MIT, see LICENSE). The landing page began as a study rebuild of another site's
layout and has since been stripped of that branding, its copy, its assets and its claims — what
remains is structure and typography.
