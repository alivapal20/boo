'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PolaroidImage from '../../components/PolaroidImage';
import { useRef } from 'react';
import seedrandom from 'seedrandom';
import { useEffect, useState } from 'react';

export default function WhyYouPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Set initial volume to 50%
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  }, []);

  /* ------------------ MOUSE MOTION ------------------ */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Edge-like smooth inertia
  const smoothX = useSpring(mouseX, {
    stiffness: 45,
    damping: 30,
    mass: 2,
  });
  const smoothY = useSpring(mouseY, {
    stiffness: 45,
    damping: 30,
    mass: 2,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    const SPEED = 240; // 💗 tuned for romantic but visible motion

    mouseX.set(x * SPEED);
    mouseY.set(y * SPEED);
  };

  /* ------------------ HEART DATA ------------------ */
  const rng = seedrandom('why-you-page'); // Seeded RNG for consistent values
  const hearts = Array.from({ length: 14 }).map((_, i) => {
    const depth = 0.6 + i * 0.05;

    return {
      id: i,
      left: `${rng() * 100}%`,
      top: `${rng() * 100}%`,
      size: 18 + rng() * 24,
      x: useTransform(smoothX, (v) => v * depth),
      y: useTransform(smoothY, (v) => v * depth),
      float: {
        y: [0, -20 - i * 2, 0],
      },
    };
  });

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      className="relative min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-pink-950 overflow-hidden flex flex-col items-center justify-center px-6"
    >
      <audio ref={audioRef} src="/music/tm.mp3" autoPlay loop />

      {/* Image Preview Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClosePreview}
        >
          <motion.img
            src={selectedImage}
            alt="Preview"
            className="max-w-[85vw] max-h-[85vh] object-contain rounded-lg shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      )}

      {/* 💗 FLOATING HEART BACKGROUND (ONLY HERE) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            style={{
              left: h.left,
              top: h.top,
              x: h.x,
              y: h.y,
              fontSize: `${h.size}px`,
            }}
            animate={h.float}
            transition={{
              duration: 6 + h.id,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute text-pink-400 opacity-60"
          >
            💖
          </motion.div>
        ))}
      </div>

      {/* ------------------ HEADER ------------------ */}
      <div className="absolute top-0 left-0 w-full bg-transparent text-center py-6">
        <div className="text-4xl md:text-5xl font-bold text-white">
          Why You 💖
        </div>
        <div className="text-slate-300 mt-2">
          Every little thing about you feels like home.
        </div>
      </div>

     

      {/* ------------------ POLAROIDS ------------------ */}
      <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
        <PolaroidImage
          src="/images/us.jpg"
          caption="Your smile made me stay."
          rotate={-6}
          className="scale-120 cursor-pointer"
          motionProps={{
            initial: { scale: 0.82, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: {
              duration: 1.8,
              ease: [0.16, 1, 0.3, 1],
            },
            onClick: () => handleImageClick('/images/us.jpg'),
          }}
        />

        <div className="h-8"></div> {/* Added space between images */}

        <PolaroidImage
          src="/images/him.jpg"
          caption="You feel like peace."
          rotate={3}
          className="scale-145 cursor-pointer"
          motionProps={{
            initial: { y: 60, rotate: -6, opacity: 0 },
            animate: { y: 0, rotate: 0, opacity: 1 },
            transition: {
              duration: 1.6,
              ease: 'easeOut',
            },
            onClick: () => handleImageClick('/images/him.jpg'),
          }}
        />

        <div className="h-8"></div> {/* Added space between images */}

        <PolaroidImage
          src="/images/puja.jpg"
          caption="I choose you, always."
          rotate={-2}
          className="scale-120 cursor-pointer"
          motionProps={{
            initial: { opacity: 0 },
            animate: { opacity: 1, y: [0, -14, 0] },
            transition: {
              opacity: { duration: 1 },
              y: {
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            },
            onClick: () => handleImageClick('/images/puja.jpg'),
          }}
        />
      </div>
    </div>
  );
}
