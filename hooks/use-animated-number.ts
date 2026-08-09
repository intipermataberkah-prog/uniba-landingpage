"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Rolls a figure toward its new value on a critically-damped spring, so money
 * settles rather than snapping or easing mechanically. When the visitor prefers
 * reduced motion the target is returned directly, with no animation frames.
 */
export function useAnimatedNumber(target: number, { stiffness = 140, damping = 22 } = {}) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(target);
  const stateRef = useRef({ current: target, velocity: 0 });

  useEffect(() => {
    if (reduceMotion) return;

    let frameId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      // Clamp dt so a backgrounded tab does not launch the spring.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const state = stateRef.current;
      const force = (target - state.current) * stiffness;
      state.velocity += (force - state.velocity * damping) * dt;
      state.current += state.velocity * dt;

      if (Math.abs(target - state.current) < 0.5 && Math.abs(state.velocity) < 0.5) {
        state.current = target;
        state.velocity = 0;
        setValue(target);
        return;
      }

      setValue(Math.round(state.current));
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, reduceMotion, stiffness, damping]);

  return reduceMotion ? target : value;
}
