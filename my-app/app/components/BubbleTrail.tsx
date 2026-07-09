"use client";

import { useEffect, useRef } from "react";

/** Spawns a rising bubble at the cursor as it moves across the page. */
export default function BubbleTrail() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let lastSpawn = 0;

    function spawn(x: number, y: number) {
      const b = document.createElement("span");
      b.className = "trail-bubble";
      const size = 6 + Math.random() * 14;
      b.style.left = `${x}px`;
      b.style.top = `${y}px`;
      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.setProperty("--dx", `${Math.random() * 40 - 20}px`);
      layer!.appendChild(b);

      const remove = () => b.remove();
      b.addEventListener("animationend", remove);
      // Fallback cleanup in case animationend never fires.
      window.setTimeout(remove, 1400);
    }

    function onMove(e: PointerEvent) {
      const now = performance.now();
      if (now - lastSpawn < 40) return; // throttle so we don't flood the DOM
      lastSpawn = now;
      spawn(e.clientX, e.clientY);
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      layer.querySelectorAll(".trail-bubble").forEach((n) => n.remove());
    };
  }, []);

  return <div ref={layerRef} className="trail-layer" aria-hidden="true" />;
}
