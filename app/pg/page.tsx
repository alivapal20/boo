"use client";

import React from "react";
import FloatingHearts from "../../components/FloatingHearts";
import PolaroidGallery from '@/components/PolaroidGallery';
import { useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

export default function Page() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothMouseX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const smoothMouseY = useSpring(rawY, { stiffness: 60, damping: 20 });

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      onMouseMove={(e) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Scale normalized offsets so parallax motion is noticeable (match dashboard magnitude)
        const scale = 500; // increase to make hearts move more
        rawX.set(((e.clientX - w / 2) / (w / 2)) * scale);
        rawY.set(((e.clientY - h / 2) / (h / 2)) * scale);
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#061428] via-[#041427] to-[#021022]" />

      <div
        aria-hidden
        className="absolute -inset-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px 300px at 50% 45%, rgba(12,178,170,0.18), rgba(12,178,170,0.06) 12%, transparent 35%), radial-gradient(400px 260px at 18% 70%, rgba(19,94,116,0.08), transparent 30%)",
          filter: "blur(48px)",
          mixBlendMode: "screen",
        }}
      />

      <div className="absolute inset-0">
        {/* increase count and intensity on this page for a denser, livelier background */}
        <FloatingHearts smoothMouseX={smoothMouseX} smoothMouseY={smoothMouseY} count={30} intensity={1.4} />
      </div>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 space-y-12">
        <div className="w-full max-w-2xl">
          <div className="mx-auto rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-2xl p-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center leading-tight">
              Welcome to Your
              <span className="block text-teal-400">PG Gallery</span>
            </h1>

            <p className="mt-6 text-center text-gray-200/80">
              Explore a curated collection of stickers and artwork. Move your mouse to watch the
              background come alive.
            </p>

            <div className="mt-8 flex justify-center">
              <Link href="/dashboard" className="inline-flex items-center px-6 py-3 rounded-full bg-teal-400 text-black font-semibold shadow-md hover:opacity-95">Explore</Link>
            </div>
          </div>
        </div>

        <PolaroidGallery />
      </section>
    </div>
  );
}
