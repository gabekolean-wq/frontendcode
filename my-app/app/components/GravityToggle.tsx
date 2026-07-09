"use client";

import { useEffect, useRef, useState } from "react";

type Body = {
  el: HTMLElement;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  ang: number;
  va: number;
  orig: string;
};

/* Selectors for the content pieces that should fall. These match text,
   headings, links, buttons and the section cards — but NOT the fixed toys
   (aquarium / panic / bubble trail / this button), which use other classes. */
const SELECTORS = [
  "main > section > div",
  "main h1",
  "main h2",
  "main p",
  "main li",
  "main header a",
  "main .rounded-full",
  "#contact .space-y-2 > div",
  "main footer > div",
].join(", ");

const G = 0.6;
const REST = 0.5;
const FRICTION = 0.98;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function GravityToggle() {
  const [on, setOn] = useState(false);
  const sim = useRef<{ raf: number; bodies: Body[] }>({ raf: 0, bodies: [] });

  function activate() {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(SELECTORS)
    ).filter((el) => !el.closest(".aq-root, .panic-btn, .gravity-btn, .trail-layer"));

    // Read ALL geometry first (before mutating anything, to avoid reflow skew).
    const bodies: Body[] = targets.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        el,
        x: r.left,
        y: r.top,
        w: r.width,
        h: r.height,
        vx: rand(-2.5, 2.5),
        vy: rand(-1, 1),
        ang: 0,
        va: (rand(-6, 6) * Math.PI) / 180,
        orig: el.style.cssText,
      };
    });

    // Then freeze each element in place as a fixed, absolutely-sized body.
    for (const b of bodies) {
      const s = b.el.style;
      s.position = "fixed";
      s.left = "0";
      s.top = "0";
      s.margin = "0";
      s.width = `${b.w}px`;
      s.height = `${b.h}px`;
      s.zIndex = "45";
      s.transformOrigin = "center";
      s.willChange = "transform";
      s.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.ang}rad)`;
    }

    sim.current.bodies = bodies;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // No animation — just drop everything to the floor.
      const H = window.innerHeight;
      for (const b of bodies) {
        b.y = H - b.h;
        b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
      }
      return;
    }

    const step = () => {
      const H = window.innerHeight;
      const W = window.innerWidth;
      for (const b of bodies) {
        b.vy += G;
        b.x += b.vx;
        b.y += b.vy;
        b.ang += b.va;

        if (b.y + b.h > H) {
          b.y = H - b.h;
          b.vy *= -REST;
          b.vx *= FRICTION;
          b.va *= FRICTION;
          if (Math.abs(b.vy) < 1) b.vy = 0;
        }
        if (b.x < 0) {
          b.x = 0;
          b.vx *= -REST;
        }
        if (b.x + b.w > W) {
          b.x = W - b.w;
          b.vx *= -REST;
        }

        b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.ang}rad)`;
      }
      sim.current.raf = requestAnimationFrame(step);
    };
    sim.current.raf = requestAnimationFrame(step);
  }

  function reset() {
    cancelAnimationFrame(sim.current.raf);
    for (const b of sim.current.bodies) {
      b.el.style.cssText = b.orig;
    }
    sim.current.bodies = [];
  }

  function toggle() {
    if (on) {
      reset();
      setOn(false);
    } else {
      activate();
      setOn(true);
    }
  }

  // Make sure we never leave the page frozen if this unmounts mid-fall.
  useEffect(() => {
    return () => {
      if (sim.current.bodies.length) reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      type="button"
      className="gravity-btn"
      data-on={on}
      aria-pressed={on}
      aria-label={on ? "Restore the page" : "Drop everything with gravity"}
      onClick={toggle}
    >
      {on ? "↺ Reset" : "🌍 Gravity"}
    </button>
  );
}
