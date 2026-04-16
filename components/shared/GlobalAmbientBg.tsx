'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AmbientBg, { type AmbientVariant } from './AmbientBg';

function stripLocale(p: string): string {
  return p.replace(/^\/[^/]+/, '') || '/';
}

function variantFor(pathname: string): AmbientVariant {
  const p = stripLocale(pathname);
  if (p === '/') return 'dithered';
  if (/^\/work\/[^/]+/.test(p)) return 'inkPool';
  if (p === '/work') return 'chrome';
  if (p === '/about') return 'ember';
  if (p === '/services') return 'emerald';
  if (p === '/contact') return 'pulse';
  if (/^\/blog(\/|$)/.test(p)) return 'ink';
  return 'dithered';
}

const CROSSFADE_MS = 550;

export default function GlobalAmbientBg() {
  const pathname = usePathname() || '/';
  const variant = variantFor(pathname);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Mobile: single quiet grain variant (less GPU + simpler)
  if (isMobile) {
    return <AmbientBg variant="ink" style={{ opacity: 0.2 }} />;
  }

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={variant}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: CROSSFADE_MS / 1000, ease: 'easeOut' }}
        className="pointer-events-none"
      >
        <AmbientBg variant={variant} />
      </motion.div>
    </AnimatePresence>
  );
}
