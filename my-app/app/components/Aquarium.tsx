"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* Tropical hue palette (HSL hue values) for the fish. */
const HUES = [22, 38, 48, 145, 178, 200, 208, 275, 330];

type FishConfig = {
  hue: number;
  /** body length in px */
  size: number;
  /** cruising speed in px/frame @60fps */
  speed: number;
};

type Fish = FishConfig & {
  el: HTMLDivElement;
  w: number;
  h: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** slowly-varying wander heading (radians) */
  wander: number;
  /** brief post-feeding excitement */
  boost: number;
  facing: number;
};

type Pellet = {
  el: HTMLDivElement;
  x: number;
  y: number;
  vy: number;
  settled: boolean;
  life: number;
  eaten: boolean;
};

type KelpConfig = { x: number; h: number; delay: number };
type BubbleConfig = { left: number; top: number; size: number; delay: number; dur: number };

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Build the school: a run of small fish plus a few larger ones. */
function makeFishConfigs(): FishConfig[] {
  const configs: FishConfig[] = [];
  for (let i = 0; i < 7; i++) {
    configs.push({
      hue: HUES[Math.floor(Math.random() * HUES.length)],
      size: rand(20, 27),
      speed: rand(0.7, 1.1),
    });
  }
  for (let i = 0; i < 3; i++) {
    configs.push({
      hue: HUES[Math.floor(Math.random() * HUES.length)],
      size: rand(34, 44),
      speed: rand(0.45, 0.72),
    });
  }
  return configs;
}

export default function Aquarium() {
  const rootRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const foodLayerRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"day" | "night">("day");
  const [fed, setFed] = useState(false);
  const fedRef = useRef(false);

  /* Fish colors/sizes are random, so they must be generated on the client
     only — generating them during render would desync SSR and hydration. */
  const [fishConfigs, setFishConfigs] = useState<FishConfig[]>([]);
  useEffect(() => {
    setFishConfigs(makeFishConfigs());
  }, []);

  const kelp = useMemo<KelpConfig[]>(
    () => [
      { x: 12, h: 3.4, delay: 0 },
      { x: 30, h: 2.6, delay: -1.2 },
      { x: 62, h: 3.1, delay: -0.6 },
      { x: 74, h: 2.3, delay: -1.8 },
      { x: 88, h: 2.9, delay: -0.3 },
    ],
    []
  );

  const bubbles = useMemo<BubbleConfig[]>(
    () => [
      { left: 20, top: 70, size: 0.45, delay: 0, dur: 5 },
      { left: 46, top: 62, size: 0.3, delay: 1.4, dur: 4.2 },
      { left: 47, top: 66, size: 0.38, delay: 2.6, dur: 4.8 },
      { left: 78, top: 74, size: 0.5, delay: 0.8, dur: 5.4 },
      { left: 64, top: 58, size: 0.28, delay: 3.1, dur: 4 },
    ],
    []
  );

  /* The simulation. Lives entirely in refs / imperative DOM so React never
     re-renders per frame. */
  useEffect(() => {
    const water = waterRef.current;
    const foodLayer = foodLayerRef.current;
    const root = rootRef.current;
    if (!water || !foodLayer || !root) return;
    if (fishConfigs.length === 0) return; // wait until fish are generated

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fishEls = Array.from(
      root.querySelectorAll<HTMLDivElement>(".aq-fish")
    );

    let bounds = { w: water.clientWidth, h: water.clientHeight };
    /** fish stay above the sand and below the surface */
    const topPad = () => bounds.h * 0.08;
    const floor = () => bounds.h * 0.74;

    const fish: Fish[] = fishEls.map((el, i) => {
      const cfg = fishConfigs[i];
      const w = cfg.size;
      const h = cfg.size * 0.44;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      const dir = Math.random() < 0.5 ? 1 : -1;
      return {
        ...cfg,
        el,
        w,
        h,
        x: rand(w, bounds.w - w),
        y: rand(topPad() + h, floor() - h),
        vx: dir * cfg.speed,
        vy: rand(-0.2, 0.2),
        wander: Math.random() * Math.PI * 2,
        boost: 0,
        facing: dir,
      };
    });

    const pellets: Pellet[] = [];
    const pointer = { x: 0, y: 0, active: false };

    function place(f: Fish) {
      const tilt = Math.max(-22, Math.min(22, (f.vy / Math.max(0.2, Math.abs(f.vx))) * 14));
      f.el.style.transform =
        `translate3d(${f.x - f.w / 2}px, ${f.y - f.h / 2}px, 0)` +
        ` rotate(${tilt}deg) scaleX(${f.facing})`;
    }

    if (reduce) {
      // Static, evenly-spread scene — no animation loop.
      const band = floor() - topPad();
      fish.forEach((f, i) => {
        f.x = ((i + 1) / (fish.length + 1)) * bounds.w;
        f.y = topPad() + (((i % 3) + 1) / 4) * band;
        f.facing = i % 2 === 0 ? 1 : -1;
        place(f);
      });
      return;
    }

    function addPellet(x: number, y: number) {
      const el = document.createElement("div");
      el.className = "aq-pellet";
      foodLayer!.appendChild(el);
      const p: Pellet = { el, x, y, vy: 0, settled: false, life: 1, eaten: false };
      p.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      pellets.push(p);
    }

    function nearestPellet(f: Fish): Pellet | null {
      let best: Pellet | null = null;
      let bestD = Infinity;
      for (const p of pellets) {
        if (p.eaten) continue;
        const d = Math.hypot(p.x - f.x, p.y - f.y);
        if (d < bestD) {
          bestD = d;
          best = p;
        }
      }
      return best;
    }

    let raf = 0;
    let last = performance.now();

    function frame(now: number) {
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      const { w, h } = bounds;
      const top = topPad();
      const bottom = floor();

      // --- pellets ---
      for (let i = pellets.length - 1; i >= 0; i--) {
        const p = pellets[i];
        if (!p.settled) {
          p.vy = Math.min(2.4, p.vy + 0.05 * dt);
          p.y += p.vy * dt;
          if (p.y >= bottom + h * 0.06) {
            p.y = bottom + h * 0.06;
            p.settled = true;
          }
        } else {
          p.life -= 0.0016 * dt; // slowly dissolves if uneaten
        }
        if (p.eaten || p.life <= 0) {
          p.el.remove();
          pellets.splice(i, 1);
          continue;
        }
        p.el.style.opacity = `${Math.max(0, Math.min(1, p.life))}`;
        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }

      // --- fish ---
      for (const f of fish) {
        let ax = 0;
        let ay = 0;

        // wander
        f.wander += rand(-0.3, 0.3) * dt;
        ax += Math.cos(f.wander) * 0.02;
        ay += Math.sin(f.wander) * 0.015;

        // seek nearest food
        const target = nearestPellet(f);
        if (target) {
          const dx = target.x - f.x;
          const dy = target.y - f.y;
          const d = Math.hypot(dx, dy) || 1;
          const pull = 0.09;
          ax += (dx / d) * pull;
          ay += (dy / d) * pull;
          if (d < f.w * 0.6) {
            target.eaten = true;
            f.boost = 12;
          }
        }

        // mild curiosity toward the cursor
        if (pointer.active) {
          const dx = pointer.x - f.x;
          const dy = pointer.y - f.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < bounds.w * 0.5) {
            ax += (dx / d) * 0.02;
            ay += (dy / d) * 0.02;
          }
        }

        // soft wall avoidance
        const m = f.w * 0.6;
        if (f.x < m) ax += (m - f.x) * 0.004;
        if (f.x > w - m) ax -= (f.x - (w - m)) * 0.004;
        if (f.y < top) ay += (top - f.y) * 0.01;
        if (f.y > bottom) ay -= (f.y - bottom) * 0.01;

        f.vx += ax * dt;
        f.vy += ay * dt;

        // clamp to a speed envelope (boosted briefly after eating)
        const maxV = f.speed * (f.boost > 0 ? 2.4 : 1.5);
        const sp = Math.hypot(f.vx, f.vy) || 1;
        if (sp > maxV) {
          f.vx = (f.vx / sp) * maxV;
          f.vy = (f.vy / sp) * maxV;
        }
        // keep a minimum cruise so nobody stalls
        const minV = f.speed * 0.5;
        if (sp < minV) {
          f.vx = (f.vx / sp) * minV;
          f.vy = (f.vy / sp) * minV;
        }
        if (f.boost > 0) f.boost -= dt;

        f.x += f.vx * dt;
        f.y += f.vy * dt;

        // hard clamp inside the tank
        f.x = Math.max(f.w * 0.5, Math.min(w - f.w * 0.5, f.x));
        f.y = Math.max(top * 0.5, Math.min(bottom + h * 0.04, f.y));

        if (Math.abs(f.vx) > 0.05) f.facing = f.vx < 0 ? -1 : 1;
        place(f);
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    // --- interaction ---
    function localPoint(e: PointerEvent) {
      const r = water!.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function onDown(e: PointerEvent) {
      const { x, y } = localPoint(e);
      addPellet(x, Math.min(y, bounds.h * 0.2));
      if (!fedRef.current) {
        fedRef.current = true;
        setFed(true);
      }
    }
    function onMove(e: PointerEvent) {
      const { x, y } = localPoint(e);
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    }
    function onLeave() {
      pointer.active = false;
    }

    water.addEventListener("pointerdown", onDown);
    water.addEventListener("pointermove", onMove);
    water.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(() => {
      bounds = { w: water.clientWidth, h: water.clientHeight };
    });
    ro.observe(water);

    return () => {
      cancelAnimationFrame(raf);
      water.removeEventListener("pointerdown", onDown);
      water.removeEventListener("pointermove", onMove);
      water.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      pellets.forEach((p) => p.el.remove());
    };
  }, [fishConfigs]);

  return (
    <div
      ref={rootRef}
      className="aq-root pointer-events-auto fixed bottom-4 right-4 z-30 sm:bottom-6 sm:right-6"
    >
      <div className="aq-shell" data-mode={mode}>
        <div ref={waterRef} className="aq-water">
          <div className="aq-rays" />
          <div className="aq-surface" />
          <div className="aq-plankton" />

          {kelp.map((k, i) => (
            <span
              key={`kelp-${i}`}
              className="aq-kelp"
              style={
                {
                  "--x": `${k.x}%`,
                  "--h": `${k.h}rem`,
                  "--delay": `${k.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}

          <div className="aq-rock aq-rock--one" />
          <div className="aq-rock aq-rock--two" />
          <div className="aq-coral aq-coral--one" />
          <div className="aq-coral aq-coral--two" />

          <div className="aq-chest">
            <div className="aq-chest__base" />
            <div className="aq-chest__gold" />
            <div className="aq-chest__lid" />
          </div>

          <div className="aq-crab">
            <div className="aq-crab__claw aq-crab__claw--l" />
            <div className="aq-crab__claw aq-crab__claw--r" />
            <div className="aq-crab__body" />
          </div>

          <div className="aq-jelly">
            <div className="aq-jelly__bell" />
            <div className="aq-jelly__tentacles" />
          </div>

          {bubbles.map((b, i) => (
            <span
              key={`bubble-${i}`}
              className="aq-bubble"
              style={{
                left: `${b.left}%`,
                top: `${b.top}%`,
                width: `${b.size}rem`,
                height: `${b.size}rem`,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.dur}s`,
              }}
            />
          ))}

          {fishConfigs.map((cfg, i) => (
            <div
              key={`fish-${i}`}
              className="aq-fish"
              style={{ "--hue": cfg.hue } as React.CSSProperties}
            >
              <div className="aq-fish__body" />
            </div>
          ))}

          <div ref={foodLayerRef} className="aq-food" />
        </div>

        <button
          type="button"
          className="aq-toggle"
          aria-label={mode === "day" ? "Switch to night" : "Switch to day"}
          onClick={() => setMode((m) => (m === "day" ? "night" : "day"))}
        >
          {mode === "day" ? "🌙" : "☀️"}
        </button>

        <div className="aq-hint" data-hidden={fed}>
          tap to feed 🐟
        </div>
      </div>
    </div>
  );
}
