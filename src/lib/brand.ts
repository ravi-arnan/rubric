/**
 * Single swap point for product identity. Changing these values renames the whole site;
 * nothing else hardcodes a brand.
 *
 * "Rubric" is the ordinary English word, used descriptively: the report is a weighted
 * scoring rubric. Deliberately not "Rubrik" — that is a NYSE-listed data security company
 * (rubrikinc, 134 public repos), and this tool audits security headers, which is close
 * enough to their field to be a problem.
 */
export const BRAND = {
  /** Title case. Used in prose. */
  name: "Rubric",
  /** Uppercase. Used in the wordmark and section labels. */
  nameUpper: "RUBRIC",
  legalName: "RUBRIC",
  /** Outbound links. The repo is the honest destination for both until docs exist. */
  docsUrl: "https://github.com/ravi-arnan/rubric",
  appUrl: "https://github.com/ravi-arnan/rubric",
  /** The EdgeOne project keeps its original name, so the deployed host does not match the brand. */
  siteUrl: "https://edgeone-site-auditor.edgeone.dev",
} as const;
