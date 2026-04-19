"use client";

/**
 * ===================================
 * CURSOR AURA
 * ===================================
 *
 * Purpose:
 * Creates the soft glow that follows the pointer on desktop devices.
 *
 * UX note:
 * The effect is intentionally disabled on coarse pointers like phones,
 * because mobile users do not have a hover cursor and the effect would be wasted.
 */
import { type CSSProperties, useEffect, useState } from "react";

export function CursorAura() {
  /* Tracks pointer position plus whether the aura should be visible.
     Starting off-screen prevents a flash in the corner on first render. */
  const [position, setPosition] = useState({ x: -240, y: -240, visible: false });

  useEffect(() => {
    /* Only enable the effect when a fine pointer exists, such as a mouse or trackpad. */
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) {
      return;
    }

    const handleMove = (event: PointerEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
        visible: true
      });
    };

    /* Hide the aura when the pointer leaves the browser window. */
    const handleLeave = () => {
      setPosition((current) => ({
        ...current,
        visible: false
      }));
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`cursor-aura ${position.visible ? "is-visible" : ""}`.trim()}
      /* CSS variables let the stylesheet position the glow without a hard-coded transform
         calculation in React on every render. */
      style={
        {
          "--cursor-x": `${position.x}px`,
          "--cursor-y": `${position.y}px`
        } as CSSProperties
      }
    />
  );
}
