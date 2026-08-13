"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/**
 * The cursor spotlight — a 12-column grid of square cells that light up around the pointer.
 * Used by the hero (orange on near-black) and the closing CTA (dark ink on orange).
 *
 * The falloff is a 3x3 neighbourhood with a steep drop, not a soft radial glow: the cell
 * under the cursor takes `centre`, its four orthogonal neighbours a small fraction of that,
 * and its four diagonals almost nothing. That cliff is the whole character of the effect.
 * Values are measured per section — the two call sites are not simply scaled versions of
 * each other, so pass them explicitly rather than deriving one from the other.
 *
 * Two details that are easy to get wrong, both verified against the target:
 *
 * 1. The listener belongs on the *section*, not on this grid. The grid is painted behind
 *    the section's copy and artwork, so a listener here only fires in the gaps between
 *    them — the effect appears to work in some places and not others. The target listens
 *    for `mousemove` on the section and lets events bubble up from whatever is on top.
 * 2. Consequently the grid and its cells are `pointer-events: none`. They are purely
 *    presentational and must never intercept a click meant for a button or link.
 *
 * The target animates the ramp in JS with a per-frame lerp (its cells carry
 * `transition-duration: 0s`). A 300ms ease-out transition reaches the same steady state on
 * the same curve without a requestAnimationFrame loop to own — the values hold while the
 * pointer rests, so there is nothing to drive frame by frame.
 */

const COLUMNS = 12;
const CELL_COUNT = 120; // 12 x 10 — the target's count; rows past the fold are clipped.

interface SpotlightGridProps {
  /** Space-separated RGB channels for the highlight, e.g. `"34 211 238"`. */
  rgb: string;
  /** Alpha of the cell under the pointer. */
  centre: number;
  /** Alpha of the four edge-sharing neighbours. */
  orthogonal: number;
  /** Alpha of the four corner-sharing neighbours. */
  diagonal: number;
}

export function SpotlightGrid({ rgb, centre, orthogonal, diagonal }: SpotlightGridProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const section = grid?.parentElement;
    if (!grid || !section) return;

    const handleMove = (event: MouseEvent) => {
      const box = grid.getBoundingClientRect();
      const cell = box.width / COLUMNS; // cells are square, so this is width and height
      const col = Math.floor((event.clientX - box.left) / cell);
      const row = Math.floor((event.clientY - box.top) / cell);
      if (col < 0 || col >= COLUMNS || row < 0) {
        setHovered(null);
        return;
      }
      // Rows past the last one are left as-is rather than clamped: a pointer just below
      // the grid should still bleed light up into the final row, which is what the
      // neighbour maths gives for free.
      const index = row * COLUMNS + col;
      // Only touch state when the pointer crosses into a different cell — otherwise every
      // mouse move would re-render all 120 nodes.
      setHovered((current) => (current === index ? current : index));
    };
    const handleLeave = () => setHovered(null);

    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseleave", handleLeave);
    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  /** Alpha for `index` given the cell currently under the pointer. */
  const alphaFor = (index: number): number => {
    if (hovered === null) return 0;
    if (index === hovered) return centre;

    const dCol = (index % COLUMNS) - (hovered % COLUMNS);
    const dRow = Math.floor(index / COLUMNS) - Math.floor(hovered / COLUMNS);

    // Guard the column delta as well as the row: without it, the first cell of a row would
    // light up as a "neighbour" of the last cell of the row above.
    if (Math.abs(dCol) > 1 || Math.abs(dRow) > 1) return 0;
    return dCol === 0 || dRow === 0 ? orthogonal : diagonal;
  };

  return (
    <div
      ref={gridRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 grid auto-rows-min content-start grid-cols-12"
    >
      {Array.from({ length: CELL_COUNT }, (_, i) => (
        <div
          key={i}
          className="aspect-square transition-colors duration-300 ease-out motion-reduce:transition-none"
          style={{ backgroundColor: `rgb(${rgb} / ${alphaFor(i)})` } as CSSProperties}
        />
      ))}
    </div>
  );
}
