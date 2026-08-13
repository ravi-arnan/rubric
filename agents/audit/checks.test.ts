import assert from "node:assert/strict";
import { test } from "node:test";

import { auditHeaders, auditPage, checkUrl, grade, score, type PageFacts } from "./checks.ts";

test("accepts an ordinary public https url", () => {
  const result = checkUrl("https://example.com/path?q=1");
  assert.equal(result.ok, true);
});

test("rejects non-http schemes", () => {
  for (const raw of ["file:///etc/passwd", "ftp://example.com", "javascript:alert(1)"]) {
    assert.equal(checkUrl(raw).ok, false, `should reject ${raw}`);
  }
});

test("rejects loopback, private and link-local addresses", () => {
  const blocked = [
    "http://localhost/",
    "http://127.0.0.1/",
    "http://10.0.0.5/",
    "http://192.168.1.1/",
    "http://172.16.0.1/",
    "http://172.31.255.255/",
    "http://169.254.169.254/latest/meta-data/", // cloud metadata
    "http://100.64.0.1/",
    "http://0.0.0.0/",
    "http://[::1]/",
    "http://[fd00::1]/",
    "http://metadata.google.internal/",
    "http://db.internal/",
    "http://printer.local/",
  ];
  for (const raw of blocked) {
    assert.equal(checkUrl(raw).ok, false, `should reject ${raw}`);
  }
});

test("does not over-block public addresses that look private", () => {
  // 172.32.x is outside the 172.16–31 private block, 11.x is public.
  for (const raw of ["http://172.32.0.1/", "http://11.0.0.1/", "http://100.128.0.1/"]) {
    assert.equal(checkUrl(raw).ok, true, `should allow ${raw}`);
  }
});

test("header audit passes only on a valid value, not mere presence", () => {
  const weak = auditHeaders({ "x-content-type-options": "maybe", "strict-transport-security": "max-age=0" });
  assert.equal(weak.find((c) => c.id === "nosniff")?.passed, false);
  assert.equal(weak.find((c) => c.id === "hsts")?.passed, false);

  const strong = auditHeaders({
    "x-content-type-options": "nosniff",
    "strict-transport-security": "max-age=31536000; includeSubDomains",
  });
  assert.equal(strong.find((c) => c.id === "nosniff")?.passed, true);
  assert.equal(strong.find((c) => c.id === "hsts")?.passed, true);
});

test("missing headers report a null value rather than an empty string", () => {
  const checks = auditHeaders({});
  assert.equal(checks.every((c) => !c.passed), true);
  assert.equal(checks.every((c) => c.value === null), true);
});

const goodPage: PageFacts = {
  title: "A reasonable page title",
  metaDescription: "A description.",
  h1Count: 1,
  imagesMissingAlt: 0,
  imageCount: 4,
  hasLangAttr: true,
  hasViewportMeta: true,
  domContentLoadedMs: 800,
};

test("a clean page scores 100 and a bare one scores 0", () => {
  assert.equal(score(auditPage(goodPage)), 100);

  const bare: PageFacts = {
    title: "",
    metaDescription: null,
    h1Count: 0,
    imagesMissingAlt: 3,
    imageCount: 3,
    hasLangAttr: false,
    hasViewportMeta: false,
    domContentLoadedMs: 9000,
  };
  assert.equal(score(auditPage(bare)), 0);
});

test("two h1s fail the single-h1 check", () => {
  const checks = auditPage({ ...goodPage, h1Count: 2 });
  assert.equal(checks.find((c) => c.id === "h1")?.passed, false);
});

test("a page with no images passes the alt check", () => {
  const checks = auditPage({ ...goodPage, imageCount: 0, imagesMissingAlt: 0 });
  assert.equal(checks.find((c) => c.id === "alt")?.passed, true);
});

test("an unmeasurable load time fails rather than passing by default", () => {
  const checks = auditPage({ ...goodPage, domContentLoadedMs: null });
  assert.equal(checks.find((c) => c.id === "dcl")?.passed, false);
});

test("score of an empty check list is 0, not NaN", () => {
  assert.equal(score([]), 0);
});

test("grade boundaries", () => {
  assert.equal(grade(100), "A");
  assert.equal(grade(90), "A");
  assert.equal(grade(89), "B");
  assert.equal(grade(75), "B");
  assert.equal(grade(60), "C");
  assert.equal(grade(40), "D");
  assert.equal(grade(39), "F");
});
