import { useEffect, useRef } from "react";

/**
 * Runs `callback(dt)` on every animation frame while `active` is true.
 * `dt` is the delta time in seconds since the previous frame.
 *
 * This is the shared animation primitive every live playground builds on,
 * so timing logic lives in exactly one place.
 */
export function useAnimationFrame(callback: (dt: number) => void, active: boolean) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); // clamp to avoid huge jumps
      last = now;
      cbRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}
