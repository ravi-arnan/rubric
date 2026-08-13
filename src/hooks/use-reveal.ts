"use client";

import { useEffect } from "react";

/**
 * Drives the two reveal mechanisms defined in globals.css.
 *
 * Elements opt in declaratively — no refs, no per-component wiring:
 *   <div data-rise>                 rises 28px into place, once
 *   <div data-rise-group>           staggers its direct children by 80ms each
 *   <div className="bx-rails" data-reveal>   fades in
 *
 * The observer stamps `data-risen` / `data-shown` when the element crosses the
 * threshold, which is what the CSS animations key off. Both are one-way: an element
 * that has been revealed stays revealed when it scrolls back out of view.
 */
export function useReveal(): void {
  useEffect(() => {
    // Bail on reduced motion — the CSS already forces everything visible, and stamping
    // attributes would be pointless work.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = document.querySelectorAll<HTMLElement>("[data-rise], [data-reveal]");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          if (el.hasAttribute("data-reveal")) el.setAttribute("data-shown", "");
          else el.setAttribute("data-risen", "");
          observer.unobserve(el); // one-way: never re-animate
        }
      },
      // Fire slightly before the element is fully on screen so the motion reads as
      // "already in progress" by the time the user looks at it.
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
