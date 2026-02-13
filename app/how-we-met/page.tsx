"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "../../components/FloatingHearts";
import Image from "next/image";
import seedrandom from "seedrandom"; // Import seedrandom for deterministic random numbers

type Photo = { src: string; alt: string };

const images: Photo[] = Array.from({ length: 6 }).map((_, i) => ({
  // Use the existing images in public/images (img1.jpg..img6.jpg)
  src: `/images/img${i + 1}.jpg`,
  alt: `Polaroid ${i + 1}`,
}));

export default function HowWeMetPage() {
  const [stage, setStage] = useState(1);
  const song1 = useRef<HTMLAudioElement>(null);
  const song2 = useRef<HTMLAudioElement>(null);
  const [started, setStarted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    // Try autoplay; if blocked, we'll start on user interaction
    song1.current
      ?.play()
      .then(() => setStarted(true))
      .catch(() => setAutoplayBlocked(true));

    // set sensible default volumes
    if (song1.current) song1.current.volume = 0.65;
    if (song2.current) song2.current.volume = 0.75;
  }, []);

  const handleNext = () => {
    // Ensure audio starts on first user gesture (works around autoplay blocks)
    if (!started) {
      song1.current?.play().catch(() => {});
      setStarted(true);
      setAutoplayBlocked(false);
    }

    if (stage === 1) {
      setStage(2);
    } else if (stage === 2) {
      setStage(3);
      song1.current?.pause();
      song2.current?.play().catch(() => {});
    }
  };

  const rng = seedrandom("fixed-seed"); // Use a fixed seed for deterministic random numbers

  const items = useMemo(
    () =>
      images.map((img, idx) => ({
        ...img,
        rotation: Math.round((rng() * 16 - 8) * 10) / 10, // Use seeded random number generator
        zIndex: 10 + idx,
      })),
    []
  );

  const variants = {
    initial: (custom: any) => ({
      rotate: custom.rotation,
      zIndex: custom.zIndex,
    }),
    hover: {
      scale: 1.06,
      rotate: 0,
      zIndex: 999,
      boxShadow: "0 30px 60px rgba(255, 120, 160, 0.28), 0 6px 18px rgba(0, 0, 0, 0.12)",
    },
  };

  return (
    <div
      onClick={handleNext}
      className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 overflow-x-hidden flex items-center justify-center"
    >
      {/* Floating hearts background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <FloatingHearts />
      </div>

      {/* Audio tags */}
      <audio ref={song1} src="/music/kk.mp3" loop />
      <audio ref={song2} src="/music/pi.mp3" loop />

      {/* Hint for browsers that block autoplay */}
      {!started && autoplayBlocked && (
        <div className="absolute bottom-8 text-sm text-white/80 z-20 pointer-events-none">
          Tap anywhere to enable audio
        </div>
      )}

      {/* Stage-based cinematic experience */}
      <AnimatePresence mode="wait">
        {/* STAGE 1 – FIRST MEMORY */}
        {stage === 1 && (
          <motion.img
            key="memory-1"
            src="/images/how.jpg"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="w-[380px] rounded-3xl shadow-2xl z-10"
          />
        )}

        {/* STAGE 2 – SECOND MEMORY */}
        {stage === 2 && (
          <motion.img
            key="memory-2"
            src="/images/met.jpg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="w-[420px] rounded-3xl shadow-2xl z-10"
          />
        )}

        {/* STAGE 3 – YOUR LETTER (REUSES YOUR EXISTING DESIGN) */}
        {stage === 3 && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 max-w-xl w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              How We Met 💫
            </h2>

            <p className="text-slate-200 leading-relaxed mb-6">
              <span className="text-pink-500 text-5xl font-extrabold">Babe??</span> <br />
              <span className="text-yellow-100 font-semibold">
                No bro jeibhabei met korechi icha nei r bal.
              </span> <br />
              <span className="text-blue-100">jokhon dekhi tokhon eirkm reaction,</span> <br />
              <span className="text-amber-200 font-medium">
                photo tolar icha nei toh bara tulbi na nekachoda bara dekhechis nij k?
              </span> <br />
              <span className="text-purple-300 font-bold">Friends der sathei thak bara ora e bhalo tor jono! Dhemna!!!! ❤️</span>
            </p>

            <p className="text-slate-400 italic">
              📍 BAL <br />
              🗓 2nd year of vday!!!
            </p>

            <img
              src="/pvt/fuk.jpg"
              alt="A memorable moment"
              className="mt-6 rounded-3xl shadow-2xl w-[300px] mx-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
