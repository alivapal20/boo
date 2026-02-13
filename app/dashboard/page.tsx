"use client";

// Client component: dashboard page with a static center card and parallax background
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useTransform, useSpring, MotionValue, useMotionValue } from "framer-motion";

import FloatingHearts from "../../components/FloatingHearts";
import Link from "next/link";
// FloatingHearts component
// - Renders a single floating/background card
// - `img.depth` controls parallax strength (larger = moves more)
// - `smoothMouseX` / `smoothMouseY` are Framer Motion MotionValues (no React state)
function FloatingImage({
  img,
  smoothMouseX,
  smoothMouseY,
}: {
  img: { id: number; x: string; y: string; depth: number; color: string; gapX?: number; gapY?: number; src?: string };
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
}) {
  // Deterministic per-image seed (no React state)
  const seed = Math.abs(Math.sin(img.id * 12.9898) * 43758.5453);
  const rand = (n: number) => {
    const s = Math.abs(Math.sin(n * 78.233) * 43758.5453);
    return s - Math.floor(s);
  };

  // Small randomized base offsets (px) so each image has a different resting place
  const baseOffsetX = (rand(img.id) - 0.5) * 36; // +-18px
  const baseOffsetY = (rand(img.id + 31) - 0.5) * 36; // +-18px

  // Primary parallax motion (driven by smooth mouse motion)
  // Clamp depth influence so deep values don't runaway the motion
  const parallaxX = useTransform(smoothMouseX, (value) => value * Math.min(img.depth, 1.0) + baseOffsetX);
  const parallaxY = useTransform(smoothMouseY, (value) => value * Math.min(img.depth, 1.0) + baseOffsetY);

  // Add a tiny image-specific noise source derived from the motion values so
  // movement feels organic and doesn't snap back instantly. Wrap with soft springs
  // so the noise/settling is slow and floating.
  const noiseSourceX = useTransform(smoothMouseX, (v) => Math.sin(v * 0.012 + seed) * (4 + rand(img.id) * 6));
  const noiseSourceY = useTransform(smoothMouseY, (v) => Math.cos(v * 0.014 + seed) * (4 + rand(img.id + 7) * 6));

  const noiseX = useSpring(noiseSourceX, { stiffness: 10, damping: 9, mass: 0.9 });
  const noiseY = useSpring(noiseSourceY, { stiffness: 10, damping: 9, mass: 0.9 });

  // Use parallax directly (smoothed at mouse level) and add a subtle noise layer
  // — avoid double-springing so images remain visible and responsive.
  const x = useTransform([parallaxX, noiseX], (vals) => {
    const [base, noise] = vals as unknown as [number, number];
    return base + noise;
  });

  const y = useTransform([parallaxY, noiseY], (vals) => {
    const [base, noise] = vals as unknown as [number, number];
    return base + noise;
  });

  // Normalize image src: remove leading `public/` if present (Next serves from /)
  const normalizedSrc = img.src ? img.src.replace(/^public\//, '') : `/images/img${img.id}.jpg`;

  // Avoid attaching MotionValues to the server-rendered HTML to prevent
  // hydration mismatches — only include `x`/`y` after mount so the initial
  // client render matches the server markup.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const baseStyle: Record<string, any> = {
    left: img.x,
    top: img.y,
    "--gap-x": `calc(-50% + ${img.gapX ?? 0}px)`,
    "--gap-y": `calc(-50% + ${img.gapY ?? 0}px)`,
  };

  const style = (mounted ? { x, y, ...baseStyle } : baseStyle) as any;

  return (
    <motion.div
      style={style}
      className={`absolute w-64 h-64 translate-x-[var(--gap-x)] translate-y-[var(--gap-y)]`}
    >
      {normalizedSrc ? (
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative">
          <img
            src={normalizedSrc}
            alt={`floating-${img.id}`}
            className="w-full h-full object-cover block"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              // hide broken image so gradient fallback remains visible
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${img.color} mix-blend-overlay opacity-40 pointer-events-none`}
          />
        </div>
      ) : (
        <div
          className={`w-full h-full rounded-3xl bg-gradient-to-br ${img.color} backdrop-blur-sm shadow-2xl`}
        />
      )}
    </motion.div>
  );
}

// Main dashboard page component
// - Center card is static (no parallax)
// - Background cards use Framer Motion motion values for mouse-based parallax
export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // MotionValues track the mouse offsets; using MotionValue avoids React re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth the raw mouse MotionValues with springs for a pleasant easing
  const springConfig = {
    stiffness: 34, // slower acceleration
    damping: 42, // longer settling
    mass: 7.8, // heavier inertia
  };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Compute normalized offsets and set motion values
  // (offset range is approx -1..1; multiplier controls final parallax magnitude)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const offsetX = (e.clientX - rect.left - centerX) / centerX;
    const offsetY = (e.clientY - rect.top - centerY) / centerY;

    // parallax magnitude tuned to Edge-like responsiveness
    const MULTIPLIER = 200; // ← increased speed
    mouseX.set(offsetX * MULTIPLIER);
    mouseY.set(offsetY * MULTIPLIER);
  };

  // Floating image positions (background)
  const floatingImages = [
    // Added gapX/gapY offsets to give clear spacing between boxes
    { id: 1, x: "8%", y: "12%", depth: 1.1, color: "from-teal-400/20 to-cyan-400/20", gapX: -120, gapY: -60 },
    { id: 2, x: "78%", y: "18%", depth: 1.3, color: "from-blue-400/20 to-indigo-400/20", gapX: 120, gapY: -60 },
    { id: 3, x: "14%", y: "72%", depth: 0.9, color: "from-emerald-400/20 to-teal-400/20", gapX: -100, gapY: 80 },
    { id: 4, x: "74%", y: "74%", depth: 1.15, color: "from-cyan-400/20 to-blue-400/20", gapX: 100, gapY: 80 },
    { id: 5, x: "50%", y: "8%", depth: 0.95, color: "from-green-400/20 to-emerald-400/20", gapX: 0, gapY: -120 },
    { id: 6, x: "4%", y: "46%", depth: 1.05, color: "from-blue-500/20 to-cyan-500/20", gapX: -140, gapY: 0 },
    { id: 7, x: "92%", y: "6%", depth: 1.3, color: "from-indigo-400/20 to-purple-400/20", gapX: 140, gapY: -100 },
    { id: 8, x: "94%", y: "82%", depth: 0.9, color: "from-cyan-300/20 to-blue-300/20", gapX: 160, gapY: 100 },
    { id: 9, x: "2%", y: "86%", depth: 0.9, color: "from-emerald-300/20 to-teal-300/20", gapX: -160, gapY: 100 },

    // New spaced images
    { id: 10, x: "30%", y: "6%", depth: 0.95, color: "from-teal-300/20 to-cyan-300/20", gapX: -40, gapY: -140 },
    { id: 11, x: "60%", y: "6%", depth: 1.0, color: "from-green-300/20 to-emerald-300/20", gapX: 40, gapY: -140 },
    { id: 12, x: "86%", y: "36%", depth: 1.1, color: "from-blue-400/20 to-indigo-400/20", gapX: 120, gapY: 0 },
    { id: 13, x: "28%", y: "88%", depth: 0.9, color: "from-emerald-300/20 to-teal-300/20", gapX: -80, gapY: 140 },
    { id: 14, x: "64%", y: "88%", depth: 0.95, color: "from-cyan-300/20 to-blue-300/20", gapX: 80, gapY: 140 },

    // Accent floating image — KEEP CENTERED (50%/50%)
    { id: 15, x: "50%", y: "81%", depth: 0.8, color: "from-green-500/20 to-cyan-500/20", gapX: 0, gapY: 0 },
  ];

  // Content cards data
  const [openCard, setOpenCard] = React.useState<number | null>(null);
  const [burstHearts, setBurstHearts] = React.useState(false);
  const router = useRouter();

  // Protect dashboard on client: redirect to login if not authenticated
  useEffect(() => {
    const isAuth = sessionStorage.getItem("auth");
    if (!isAuth) {
      router.replace("/login"); // Ensure redirection happens on the client side
    }
  }, [router]);
  const contentCards = [
    {
      id: 1,
      title: "How We Met 💫",
      preview:
        "We met when I least expected it, and somehow you became my favorite person.",
      cta: "Our beginning",
      href: "/how-we-met",
    },
    {
      id: 2,
      title: "Why You’re My Person 💖",
      preview: "A few reasons why my heart chose you.",
      cta: "See why it’s you",
    },
    {
      id: 3,
      title: "Our Best Moments 📸",
      preview: "Little moments that became forever memories.",
      cta: "Relive memories",
    },
    {
      id: 4,
      title: "Us, Always ♾️",
      preview: "One promise. One future. One us.",
      cta: "Open my promise",
    },
  ];

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <FloatingHearts smoothMouseX={smoothMouseX} smoothMouseY={smoothMouseY} />
        {floatingImages.map((img) => (
          <FloatingImage key={img.id} img={img as any} smoothMouseX={smoothMouseX} smoothMouseY={smoothMouseY} />
        ))}
      </div>

      <div className="relative z-10">
        <section className="flex items-center justify-center min-h-screen px-4">
          <div className="relative max-w-2xl w-full">
            <div className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-400/10 to-blue-400/10" />
              <div className="relative z-10 text-center space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                  Welcome to Your
                  <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Dashboard</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-lg mx-auto">Experience a new way to visualize and interact with your data</p>
                <Link href="/pg" className="mt-8 inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105 text-center">Get Started</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative min-h-screen px-4 py-20 pb-32">
          <div className="max-w-6xl mx-auto">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-4xl font-bold text-white text-center mb-16">Your Dashboard Overview</motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {contentCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  onClick={() => {
                    if (card.href) {
                      router.push(card.href);
                      return;
                    }
                    if (card.id === 2) {
                      router.push('/why-you');
                    }
                    if (card.id === 3) {
                      router.push('/memories');
                    }
                    if (card.id === 4) {
                      router.push('/future');
                    }
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="
                    group relative cursor-pointer
                    backdrop-blur-xl bg-white/5
                    border border-white/10
                    rounded-2xl p-8
                    transition-all duration-300
                    hover:-translate-y-3 hover:scale-105
                    hover:bg-white/10 hover:border-teal-400/50
                  "
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl">
                      {card.id}
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      {card.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {card.preview}
                    </p>
                    <div className="mt-6 text-teal-400 font-medium">
                      {card.cta} →
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      {/* Logout button moved here */}
      <button
        className="
          fixed top-6 right-6 z-[9999]
          px-4 py-2
          bg-pink-500 text-white
          rounded-md shadow-lg
          hover:bg-pink-400
          transition
        "
        onClick={() => {
          sessionStorage.removeItem("auth");
          router.replace("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
