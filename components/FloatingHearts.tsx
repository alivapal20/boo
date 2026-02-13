"use client";

import React, { useEffect, useState } from "react";
import { motion, useTransform, useSpring, MotionValue } from "framer-motion";

type Props = {
  smoothMouseX?: MotionValue<number>;
  smoothMouseY?: MotionValue<number>;
  count?: number;
  intensity?: number;
  speed?: number;
  burst?: boolean;
};

// Deterministic pseudo-random based on id so SSR matches client
const seeded = (n: number) => Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;

import { useMotionValue } from "framer-motion";

export default function FloatingHearts({ smoothMouseX, smoothMouseY, count = 12, intensity = 1, speed = 1.9, burst }: Props) {
  const fallbackMouseX = useMotionValue(0);
  const fallbackMouseY = useMotionValue(0);
  const mx = smoothMouseX ?? fallbackMouseX;
  const my = smoothMouseY ?? fallbackMouseY;
  const hearts = new Array(count).fill(0).map((_, i) => {
    const id = i + 1;
    // use two independent seeded values so X and Y distributions are uncorrelated
    const seedX = seeded(id * 7.231);
    const seedY = seeded(id * 13.997);
    const seed = seeded(id);
    // add small padding so hearts don't sit flush against the viewport edges
    const pad = 3; // percent
    const x = `${pad + Math.round(seedX * (100 - pad * 2))}%`;
    const y = `${pad + Math.round(seedY * (100 - pad * 2))}%`;
    // scale depth and size by an intensity factor so callers can increase motion
    const depth = Math.max(0.5, 0.7 + (seed * 1.1) * intensity); // keep a sensible min depth
    const size = Math.max(10, Math.round(12 + seed * 64 * intensity)); // 10px+ sizes
    return { id, x, y, depth, size, seed };
  });

  

  return (
    <>
      {hearts.map((h) => (
        <Heart key={h.id} heart={h} smoothMouseX={mx} smoothMouseY={my} speed={speed} />
      ))}
    </>
  );
}

function Heart({
  heart,
  smoothMouseX,
  smoothMouseY,
  speed = 1,
}: {
  heart: { id: number; x: string; y: string; depth: number; size: number; seed: number };
  smoothMouseX?: MotionValue<number>;
  smoothMouseY?: MotionValue<number>;
  speed?: number;
}) {
  // fallback for missing motion values
  const fallbackMouseX = useMotionValue(0);
  const fallbackMouseY = useMotionValue(0);
  const mx = smoothMouseX ?? fallbackMouseX;
  const my = smoothMouseY ?? fallbackMouseY;
  const { id, x, y, depth, size, seed } = heart;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Parallax from mouse, scaled by depth (near hearts move more)
  const px = useTransform(mx, (v) => (v * depth) / (12 / Math.max(0.12, speed)));
  const py = useTransform(my, (v) => (v * depth) / (16 / Math.max(0.12, speed)));

  // Subtle idle drift derived from mouse MotionValues (keeps no React state)
  const idleFreq = 0.005 * Math.max(0.5, speed);
  const idleAmpMult = Math.max(0.6, speed);
  const idleX = useTransform(mx, (v) => Math.sin(v * idleFreq + seed * 10) * ((2 + seed * 6) * idleAmpMult));
  const idleY = useTransform(my, (v) => Math.cos(v * (idleFreq * 1.2) + seed * 13) * ((2 + seed * 6) * idleAmpMult));

  // Smooth springs so they drift & settle slowly
  const stiffness = Math.max(8, 40 * Math.max(0.4, speed));
  const damping = Math.max(8, 26 / Math.max(0.5, speed));
  const sx = useSpring(px, { stiffness, damping, mass: 1 });
  const sy = useSpring(py, { stiffness, damping, mass: 1 });
  const ix = useSpring(idleX, { stiffness: Math.max(6, 12 * Math.max(0.5, speed)), damping: Math.max(6, 10 / Math.max(0.5, speed)), mass: 0.9 });
  const iy = useSpring(idleY, { stiffness: Math.max(6, 12 * Math.max(0.5, speed)), damping: Math.max(6, 10 / Math.max(0.5, speed)), mass: 0.9 });

  const tx = useTransform([sx, ix], (vals) => {
    const [a, b] = vals as unknown as [number, number];
    return a + b;
  });
  const ty = useTransform([sy, iy], (vals) => {
    const [a, b] = vals as unknown as [number, number];
    return a + b;
  });

  // scale + rotation for 3D feel
  const scale = 0.7 + (depth - 0.7) * 0.6; // subtle scale by depth
  const rotateX = -6 + (seed * 12); // -6 .. +6 deg
  const rotateY = -8 + (seed * 16); // -8 .. +8 deg
  const blurPx = Math.max(0, (1.6 - depth) * 3); // far = slightly blurrier

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={
        // Avoid attaching MotionValues to the server-rendered HTML to prevent
        // hydration mismatches — only include `x`/`y` after the component
        // has mounted on the client so the initial client render matches SSR.
        mounted ? { left: x, top: y, x: tx, y: ty, width: `${size}px`, height: `${size}px` } : { left: x, top: y, width: `${size}px`, height: `${size}px` }
      }
    >
      <motion.div
        style={{
          transform: `translate3d(-50%,-50%,0) scale(${Number(scale).toFixed(6)}) rotateX(${Number(
            rotateX,
          ).toFixed(6)}deg) rotateY(${Number(rotateY).toFixed(6)}deg)`,
          filter: `blur(${Number(blurPx).toFixed(6)}px) drop-shadow(0 0 ${Number(4 + seed * 6).toFixed(
            6,
          )}px rgba(255, 171, 207, 0.85))`,
          opacity: "0.85",
        }}
        className="w-full h-full flex items-center justify-center will-change-transform"
      >
        <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden>
          <path
            d="M12 21s-7-4.35-9.5-7.09C-0.1 9.9 3 4 7.5 6.5 9.6 7.8 12 10 12 10s2.4-2.2 4.5-3.5C21 4 24.1 9.9 21.5 13.91 19 16.65 12 21 12 21z"
            fill="#ff2fa6"
            style={{ mixBlendMode: 'screen' }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
