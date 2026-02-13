"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const memories = [
  { src: "/pvt/img1.jpg", title: "Cute Couple" },
  { src: "/pvt/img2.jpg", title: "After Jhamela Day" },
  { src: "/pvt/img3.jpg", title: "Continuation of Jhamela Day" },
  { src: "/pvt/img4.jpg", title: "Honeymoon Bliss? Cute" },
  { src: "/pvt/img5.jpg", title: "Honeymoon Memories naki? Cuties " },
  { src: "/pvt/img6.jpg", title: "Makeup by YOU" },
  { src: "/pvt/img7.jpg", title: "Too Sleepy" },
  { src: "/pvt/img8.jpg", title: "Cozy Evenings" },
  { src: "/pvt/img9.jpg", title: "Dessert Date Night" },
  { src: "/pvt/img10.jpg", title: "Chup Chap Kotha Shon" },
  { src: "/pvt/img11.jpg", title: "Just moment before jhmela" },
  { src: "/pvt/img12.jpg", title: "Me graduated yaa" },
  { src: "/pvt/img13.jpg", title: "Us GRADUATEDDDD YAAA" },
  { src: "/pvt/img14.jpg", title: "Air Kiss?" },
  { src: "/pvt/img15.jpg", title: "Happly Argued" },
  { src: "/pvt/img16.jpg", title: "About to kiss" },
  { src: "/pvt/img17.jpg", title: "Road Trip Fun?" },
  { src: "/pvt/img18.jpg", title: "My fvt" },
  { src: "/pvt/img20.jpg", title: "Somewhere in US" },
  { src: "/pvt/img19.jpg", title: "THE BEST ONE" },
];

function HeartBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const hearts: any[] = [];

    const colors = [
      "rgba(255,20,147,0.9)",   // Deep Pink
      "rgba(255,20,147,0.6)",
      "rgba(255,20,147,0.4)",
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createHeart = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * canvas.height,
      size: Math.random() * 6 + 3,
      speed: Math.random() * 0.6 + 0.3,
      drift: Math.random() * 0.6 - 0.3,
      opacity: Math.random() * 0.5 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const drawHeart = (h: any) => {
      ctx.save();
      ctx.globalAlpha = h.opacity;
      ctx.fillStyle = h.color;
      ctx.beginPath();
      ctx.moveTo(h.x, h.y);
      ctx.bezierCurveTo(
        h.x - h.size,
        h.y - h.size,
        h.x - h.size * 1.5,
        h.y + h.size / 2,
        h.x,
        h.y + h.size
      );
      ctx.bezierCurveTo(
        h.x + h.size * 1.5,
        h.y + h.size / 2,
        h.x + h.size,
        h.y - h.size,
        h.x,
        h.y
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      hearts.forEach((h, i) => {
        h.y -= h.speed;
        h.x += h.drift;
        h.opacity -= 0.0015;

        if (h.y < -20 || h.opacity <= 0) {
          hearts[i] = createHeart();
        }

        drawHeart(h);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    for (let i = 0; i < 60; i++) hearts.push(createHeart());
    animate();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function MemoriesPage() {
  const [active, setActive] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const enableAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(() => {});
      }

      // Remove listeners after first interaction
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };

    document.addEventListener("click", enableAudio);
    document.addEventListener("touchstart", enableAudio);
    document.addEventListener("keydown", enableAudio);

    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };
  }, []);

  const next = () => {
    setActive((prev) => (prev + 1) % memories.length);
  };

  const prev = () => {
    setActive((prev) => (prev - 1 + memories.length) % memories.length);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <HeartBackground />

      <div className="relative z-10">
        <div className="relative w-75 h-105 sm:w-90 sm:h-120">
          {memories.map((item, index) => {
            const pos =
              (index - active + memories.length) % memories.length;

            return (
              <div
                key={index}
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500"
                style={{
                  transform: `
                    translateX(${pos === 1 ? -20 : pos === 2 ? 20 : 0}px)
                    translateY(${pos * 14}px)
                    rotate(${pos === 1 ? -4 : pos === 2 ? 4 : 0}deg)
                    scale(${1 - pos * 0.06})
                  `,
                  zIndex: memories.length - pos,
                  opacity: pos > 3 ? 0 : 1,
                }}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={pos === 0}
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-5 left-5 text-white">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-xs text-white/70">Our Best Moments</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={next}
          className="absolute -bottom-20 right-0 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-xl shadow-xl hover:scale-110 transition"
        >
          →
        </button>

        <button
          onClick={prev}
          className="absolute -bottom-20 left-0 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-xl shadow-xl hover:scale-110 transition"
        >
          ←
        </button>
      </div>

      <audio
        ref={audioRef}
        src="/music/leja.mp3"
        loop
        preload="auto"
      />

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
