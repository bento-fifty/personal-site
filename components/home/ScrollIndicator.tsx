'use client';

import { motion } from 'framer-motion';

/**
 * Quiet scroll indicator: static label + track, with a slow periodic packet
 * drop. The packet only travels once every ~4s (2s travel + 2s pause), so
 * there's a rhythm of motion → stillness rather than constant jitter.
 */
export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
    >
      <span className="font-label text-[0.625rem] text-white/55 tracking-[0.22em]">
        SCROLL_DOWN
      </span>

      {/* Track with periodic packet drop */}
      <div className="relative w-px h-12 bg-gradient-to-b from-white/30 via-white/10 to-transparent overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 w-[3px] h-2 rounded-[1px] bg-[#5CE1FF]"
          style={{
            boxShadow: '0 0 10px rgba(92,225,255,0.95), 0 0 2px rgba(92,225,255,1)',
          }}
          animate={{
            top:     ['-20%', '110%', '110%'],
            opacity: [0, 1, 1, 0, 0],
          }}
          transition={{
            duration: 4,
            repeat:   Infinity,
            ease:     'easeIn',
            times:    [0, 0.5, 1],
          }}
        />
      </div>

      <motion.span
        className="font-label text-[0.625rem] text-[#5CE1FF]/70"
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ▼
      </motion.span>
    </motion.div>
  );
}
