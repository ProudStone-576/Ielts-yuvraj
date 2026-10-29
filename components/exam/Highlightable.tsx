"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Lets the candidate highlight words in a passage, like the real computer test.
 * Uses the CSS Custom Highlight API, so the passage DOM is never modified.
 */

function supportsHighlights(): boolean {
  return typeof CSS !== "undefined" && "highlights" in CSS && typeof Highlight !== "undefined";
}

function highlights(): Highlight | undefined {
  if (!supportsHighlights()) return undefined;
  let h = CSS.highlights.get("exam-hl");
  if (!h) {
    h = new Highlight();
    CSS.highlights.set("exam-hl", h);
  }
  return h;
}

export function Highlightable({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; range: Range } | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(supportsHighlights());
    // Each test starts with no highlights.
    highlights()?.clear();
  }, []);

  const onUp = () => {
    if (!supported) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !box.current) return setMenu(null);
    const range = sel.getRangeAt(0);
    if (!box.current.contains(range.commonAncestorContainer)) return setMenu(null);
    const rect = range.getBoundingClientRect();
    const host = box.current.getBoundingClientRect();
    setMenu({ x: rect.left - host.left + rect.width / 2, y: rect.top - host.top, range: range.cloneRange() });
  };

  const highlight = () => {
    if (!menu) return;
    highlights()?.add(menu.range);
    window.getSelection()?.removeAllRanges();
    setMenu(null);
  };

  const clear = () => {
    highlights()?.clear();
    setMenu(null);
  };

  return (
    <div ref={box} className="hl-box" onMouseUp={onUp} onTouchEnd={() => setTimeout(onUp, 50)}>
      {menu && (
        <div className="hl-menu" style={{ left: menu.x, top: menu.y }}>
          <button onMouseDown={(e) => e.preventDefault()} onClick={highlight}>
            Highlight
          </button>
          <button onMouseDown={(e) => e.preventDefault()} onClick={clear}>
            Clear all
          </button>
        </div>
      )}
      {children}
    </div>
  );
}
