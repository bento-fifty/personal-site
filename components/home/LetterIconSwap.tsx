'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LetterIconSwapProps {
  icons: string[];
  interval?: number;
  className?: string;
}

/**
 * Renders a rotating icon that replaces a letter position in a headline.
 * Icons crossfade every `interval` ms.
 */
export default function LetterIconSwap({
  icons,
  interval = 4000,
  className = '',
}: LetterIconSwapProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % icons.length);
    }, interval);
    return () => clearInterval(timer);
  }, [icons.length, interval]);

  return (
    <span
      className={`inline-block relative ${className}`}
      style={{ width: '0.65em', height: '0.85em', verticalAlign: 'baseline' }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.85, rotate: 8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: 'var(--accent)' }}
        >
          {icons[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
