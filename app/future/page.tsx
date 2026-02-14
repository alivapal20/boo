'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HEARTS = Array.from({ length: 16 });
const loveNotes = [
  "You make me feel safe 💞",
  "You make me laugh 😄",
  "You choose me every day ❤️",
];

type Stage = "initial" | "hearts" | "modal"; // Explicitly define Stage type

export default function FuturePage() {
  const [stage, setStage] = useState<Stage>("initial");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.45; // soft romantic volume
      audioRef.current.play().catch(() => {
        // autoplay may wait for user interaction (mobile-safe)
      });
    }
  }, []);

  const openJar = () => {
    if (stage !== "initial") return;
    setStage("hearts");
    setTimeout(() => setStage("modal"), 5500); // Increased delay for cinematic timing
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <audio
        ref={audioRef}
        src="/music/ARZ.mp3"
        loop
        preload="auto"
      />

      {/* ───────────── JAR STAGE ───────────── */}
      {stage === "initial" && (
        <div onClick={openJar} className="cursor-pointer relative">

          {/* LID */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-30 h-6.5
                          rounded-full bg-white/25 border border-white/30 backdrop-blur-md z-20" />

          {/* NECK */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-22.5 h-7
                          rounded-md bg-white/15 border border-white/25 backdrop-blur-md z-10" />

          {/* BODY */}
          <motion.div
            className="relative w-65 h-90
                       rounded-t-[120px] rounded-b-[90px]
                       bg-white/10 backdrop-blur-2xl
                       border border-white/25
                       shadow-[0_0_50px_rgba(255,105,180,0.25)]
                       overflow-hidden"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >

            {/* GLASS HIGHLIGHT */}
            <div className="absolute left-6 top-6 w-9 h-[80%]
                            bg-white/10 rounded-full blur-md" />

            {/* HEARTS INSIDE */}
            {HEARTS.map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-400"
                style={{
                  left: `${20 + (i % 4) * 18}%`,
                  bottom: `${20 + Math.floor(i / 4) * 14}%`,
                  fontSize: `${16 + (i % 3) * 6}px`,
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3 + i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                💗
              </motion.div>
            ))}
          </motion.div>

          <p className="mt-6 text-center text-white/70 italic">
            Tap the jar 💞
          </p>
        </div>
      )}

      {/* Glass crack glow */}
      <AnimatePresence>
        {stage === "hearts" && (
          <motion.div
            className="absolute inset-0 rounded-t-[120px] rounded-b-[90px]
                       bg-pink-400/20 blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.4] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* ───────────── HEARTS → TEXT ───────────── */}
      <AnimatePresence>
        {stage === "hearts" && (
          <motion.div className="pointer-events-none absolute inset-0">
            {loveNotes.map((text, i) => (
              <motion.div
                key={text}
                className="absolute left-1/2 bottom-1/3
                           text-pink-300 text-lg font-medium"
                initial={{ opacity: 0, y: 0, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: -260 - i * 60,
                  x: (i - 1) * 120,
                  scale: 1,
                }}
                transition={{
                  delay: i * 0.9, // Slower appearance for each message
                  duration: 3, // Slower rise duration
                  ease: "easeInOut", // Romantic float effect
                }}
              >
                {text}
              </motion.div>
            ))}

            {/* Wrap heart-text container for fade-out */}
            <AnimatePresence>
              {stage === "hearts" && (
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                >
                  {/* heart → text items */}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────── MODAL ───────────── */}
      <AnimatePresence>
        {stage === "modal" && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-xl bg-[#fffaf3] p-10 rounded-3xl
                         shadow-[0_30px_80px_rgba(0,0,0,0.4)]
                         text-[#3b2f2f] font-serif relative"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-lg leading-relaxed text-left">
                BAL,
                <br /><br />
                I don’t know when it happened exactly,
                but somewhere between the small moments,
                you became my my boyfriend.
                <br /><br />
                You make me laugh on my worst days and make fun of me,
                you calm me without trying but first you make me stormy,
                and every day you choose me because I hate you—
                just like I choose you(keno j korlm).
                <br /><br />
                No matter where life takes us,
                I want it to be with you because tui pichon charchis nah!!!.
              </p>

              <p className="mt-8 text-right italic text-pink-500">
                —me 💖
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
