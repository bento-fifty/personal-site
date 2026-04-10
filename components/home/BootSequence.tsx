'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  '> INIT EVAN_CHANG.SYS',
  '> LOADING EVENTS_DB ............. OK',
  '> PROJECTS ...................... 50+',
  '> AUDIENCE .............. 100,000+',
  '> BRAND_PARTNERS .... ACTIVE',
  '> SIGNAL_ARCHITECTURE ........ RUN',
];

const LINE_INTERVAL = 300; // ms between each line appearing
const EXIT_DELAY    = 650; // ms pause after last line before fade-out

interface Props {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visibleLines < BOOT_LINES.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), LINE_INTERVAL);
      return () => clearTimeout(t);
    }
    // All lines shown — wait, then begin exit
    const t = setTimeout(() => setExiting(true), EXIT_DELAY);
    return () => clearTimeout(t);
  }, [visibleLines]);

  return (
    // onExitComplete fires after the exit animation finishes, then hero content fades in
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {!exiting && (
        <motion.div
          key="boot"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute bottom-16 left-10 z-20 font-label space-y-[0.35rem]"
        >
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
            const isActive = i === visibleLines - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={isActive ? 'text-white' : 'text-white/45'}
              >
                {line}
                {isActive && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="ml-1 text-[#C8A96E]"
                  >
                    █
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
