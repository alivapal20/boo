'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

export default function PolaroidImage({
  src,
  caption,
  rotate = 0,
  motionProps,
  className,
}: {
  src: string;
  caption: string;
  rotate?: number;
  motionProps?: HTMLMotionProps<'div'>;
  className?: string;
}) {
  return (
    <motion.div
      {...motionProps}
      whileHover={{
        scale: 1.08,
        rotate: rotate + 2,
        y: -12,
      }}
      className={`bg-white rounded-xl shadow-2xl p-4 pb-8 w-65 cursor-pointer ${className}`}
    >
      <img
        src={src}
        alt={caption}
        className="w-full h-57.5 object-cover rounded-md"
      />

      <p className="mt-4 text-center text-sm text-gray-700 italic font-handwriting">
        {caption}
      </p>
    </motion.div>
  );
}