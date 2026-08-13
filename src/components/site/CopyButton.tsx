"use client";

import { useState } from "react";

/**
 * The terminal chrome's COPY pill. The only interactive atom in `CodeSection`, split out so the
 * section itself stays a server component (see the design contract, "Code rules").
 */
export function CopyButton({ value }: { readonly value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access is denied outside secure contexts. Say so rather than fake success.
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="ml-auto cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.1em] text-bx-faint transition-[color,border-color,background-color,transform] duration-200 hover:border-white/25 hover:bg-white/10 hover:text-bx-ink active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}
