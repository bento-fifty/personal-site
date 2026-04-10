'use client';

import { motion } from 'framer-motion';

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
    >
      <span className="font-label text-white/25 text-[0.625rem]">↓ scroll_down.exe</span>
      <motion.div
        animate={{ scaleY: [1, 0.4, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent origin-top"
      />
    </motion.div>
  );
}
