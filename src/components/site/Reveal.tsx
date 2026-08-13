"use client";

import { useReveal } from "@/hooks/use-reveal";

/**
 * Activates the page-wide reveal system. Renders nothing.
 *
 * Mounting this once at the page root keeps every section a server component: sections opt into
 * motion with plain `data-rise` / `data-reveal` attributes and never need `"use client"` of their
 * own.
 */
export function Reveal() {
  useReveal();
  return null;
}
