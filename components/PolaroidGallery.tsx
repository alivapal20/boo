import React, { useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

type Photo = { src: string; alt: string }

const images: Photo[] = Array.from({ length: 6 }).map((_, i) => ({
  // Use the existing images in public/images (img1.jpg..img6.jpg)
  src: `/images/img${i + 1}.jpg`,
  alt: `Polaroid ${i + 1}`,
}))

export default function PolaroidGallery() {
  const items = useMemo(() =>
    images.map((img, idx) => ({
      ...img,
      rotation: Math.round((Math.random() * 16 - 8) * 10) / 10, // -8 to 8
      zIndex: 10 + idx,
    })),
  [])

  const variants = {
    initial: (custom: any) => ({ rotate: custom.rotation, zIndex: custom.zIndex }),
    hover: {
      scale: 1.06,
      rotate: 0,
      zIndex: 999,
      boxShadow: '0 30px 60px rgba(255,120,160,0.28), 0 6px 18px rgba(0,0,0,0.12)',
    },
  }

  return (
    <div className="w-full flex justify-center">
      <div className="relative mt-20 w-full max-w-6xl px-12">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-white/95">Our Memories 📸</h2>
        <p className="mt-2 text-center text-sm text-white/80">Six moments that mean everything to me.</p>

        <div className="
          mt-14
          flex
          flex-wrap
          justify-center
          gap-x-28
          gap-y-36
          max-w-6xl
          mx-auto
        ">
          {items.map((it, idx) => (
            <motion.figure
              key={idx}
              custom={it}
              initial="initial"
              whileHover="hover"
              variants={variants}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 22 }}
              className="cursor-pointer select-none"
              style={{ width: 180 }}
            >
              <div
                className="bg-white rounded-lg p-3 pb-6 shadow-sm"
                style={{ transform: `rotate(${it.rotation}deg)`, borderBottomWidth: 6, borderBottomColor: 'rgba(255,182,193,0.25)' }}
              >
                <div className="relative rounded-md overflow-hidden" style={{ height: 160 }}>
                  <Image src={it.src} alt={it.alt} fill sizes="(max-width: 640px) 160px, 180px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </div>
  )
}
