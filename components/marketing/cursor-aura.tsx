"use client";

import { type CSSProperties, useEffect, useState } from "react";

export function CursorAura() {
  const [position, setPosition] = useState({ x: -240, y: -240, visible: false });

  useEffect(() => {
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
      style={
        {
          "--cursor-x": `${position.x}px`,
          "--cursor-y": `${position.y}px`
        } as CSSProperties
      }
    />
  );
}
