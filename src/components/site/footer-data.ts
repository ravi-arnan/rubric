import { BRAND } from "@/lib/brand";

export interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface FooterColumn {
  readonly heading: string;
  readonly links: readonly FooterLink[];
}

export const FOOTER_TAGLINE = "A weighted report card for any URL, measured at the edge.";

export const FOOTER_ADDRESS: readonly string[] = [
  "BUILT FOR DEVHANDAL 2026 BATCH 2",
  "RUNS ON TENCENT EDGEONE MAKERS",
];

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "PRODUCT",
    links: [
      { label: "Run an audit", href: "#audit" },
      { label: "How it works", href: "#how" },
      { label: "API", href: "#api" },
    ],
  },
  {
    heading: "PROJECT",
    links: [
      { label: "Source", href: BRAND.docsUrl, external: true },
      { label: "The checks", href: BRAND.docsUrl + "/blob/main/agents/audit/checks.ts", external: true },
      { label: "DevHandal 2026", href: "https://devhandal2026.codepolitan.com/", external: true },
    ],
  },
];

export const FOOTER_COPYRIGHT = `© 2026 ${BRAND.legalName}`;

export const FOOTER_LEGAL_LINKS: readonly FooterLink[] = [
  { label: "MIT LICENSE", href: BRAND.docsUrl + "/blob/main/LICENSE", external: true },
];
