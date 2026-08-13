import type { Metadata } from "next";
import localFont from "next/font/local";

import { BRAND } from "@/lib/brand";

import "./globals.css";

// All three faces are open-licensed (JetBrains Mono / Archivo / Darker Grotesque, all OFL) and
// vendored under public/fonts. The reference site used a commercial family we do not license.

// Functional / UI role: nav, eyebrows, labels, table cells, code. (target: berkeleyMono)
const jetbrainsMono = localFont({
  variable: "--font-functional",
  display: "swap",
  src: [{ path: "../../public/fonts/jetbrains-mono-var.woff2", weight: "400 700", style: "normal" }],
});

// Heading role: h1/h2. (target: berkeleyMonoNumerals -> Archivo)
const archivo = localFont({
  variable: "--font-copy-heading",
  display: "swap",
  src: [{ path: "../../public/fonts/archivo-var.woff2", weight: "500 700", style: "normal" }],
});

// Display + reading role: card titles, stat figures, body paragraphs.
// (target: berkeleyMonoNumeralsDisplay -> Darker Grotesque)
const darkerGrotesque = localFont({
  variable: "--font-reading",
  display: "swap",
  src: [{ path: "../../public/fonts/darker-grotesque-var.woff2", weight: "500 700", style: "normal" }],
});

const TITLE = `${BRAND.name} — a report card for any URL`;
const DESCRIPTION =
  "Point it at a URL. Rubric reads the response headers, then opens the page in a real browser " +
  "at the edge — 13 checks across two categories, each one scored.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(BRAND.siteUrl),
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `bx-motion` gates every reveal animation, matching the target. Removing the class disables
  // all motion site-wide.
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${archivo.variable} ${darkerGrotesque.variable} h-full antialiased bx-motion`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
