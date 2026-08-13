/**
 * Client half of the audit contract.
 *
 * Deliberately duplicated from `agents/audit/` rather than imported: the agent is deployed
 * as a separate runtime, so this is a wire format between two programs, not a shared module.
 * If one side changes shape, the other has to be changed on purpose.
 */

export interface AuditCheck {
  readonly id: string;
  readonly label: string;
  readonly weight: number;
  readonly passed: boolean;
  readonly value: string | null;
  readonly note: string;
}

export interface AuditCategory {
  readonly name: string;
  readonly score: number;
  readonly grade: string;
  readonly checks: readonly AuditCheck[];
  /** Present when the category could not be measured; its checks will be empty. */
  readonly error?: string;
}

export interface AuditReport {
  readonly url: string;
  readonly overall: { readonly score: number; readonly grade: string };
  readonly categories: readonly AuditCategory[];
  readonly generatedAt: string;
}

/**
 * Where the agent lives. Same-origin `/audit` by default, which is what a single EdgeOne
 * project gives you; override when the agent is deployed apart from the page.
 */
export const AUDIT_ENDPOINT = process.env.NEXT_PUBLIC_AUDIT_ENDPOINT ?? "/audit";

export class AuditError extends Error {}

/**
 * The agent runtime rejects any request without this header:
 * "Invalid makers-conversation-id: header is missing. Required: 6-36 characters,
 * allowed: [0-9a-zA-Z-_.]". It is how EdgeOne routes a caller back to the same instance.
 *
 * A UUID is 36 characters of hex and hyphens, so it satisfies the rule exactly. One per page
 * load: this auditor keeps no conversation state, it just needs a valid, stable id.
 */
const CONVERSATION_ID =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `audit-${Math.floor(Date.now() / 1000)}`;

/** Narrow enough to catch a wrong endpoint returning HTML or an unrelated JSON body. */
function isReport(value: unknown): value is AuditReport {
  if (typeof value !== "object" || value === null) return false;
  const report = value as Partial<AuditReport>;
  return (
    typeof report.url === "string" &&
    typeof report.overall?.score === "number" &&
    Array.isArray(report.categories)
  );
}

export async function requestAudit(url: string, signal?: AbortSignal): Promise<AuditReport> {
  let response: Response;
  try {
    // The target goes in the query string, not the body: on the deployed runtime the POST
    // body did not reach the handler, while `?url=` worked on the first try.
    const endpoint = `${AUDIT_ENDPOINT}?url=${encodeURIComponent(url)}`;
    response = await fetch(endpoint, {
      method: "GET",
      headers: { "makers-conversation-id": CONVERSATION_ID },
      signal,
    });
  } catch (cause) {
    // A network-level failure here usually means the endpoint is wrong or CORS blocked it —
    // both look identical to fetch, so say so rather than guessing which.
    throw new AuditError(`Could not reach the auditor at ${AUDIT_ENDPOINT}.`, { cause });
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof (body as { error?: unknown })?.error === "string"
        ? (body as { error: string }).error
        : `The auditor returned ${response.status}.`;
    throw new AuditError(message);
  }

  if (!isReport(body)) {
    throw new AuditError("The auditor returned something that is not a report.");
  }

  return body;
}
