'use client';

import { motion } from 'framer-motion';

interface Props {
  number: string;
  label: string;
  bg: string;
  labelColor: string;
  accentColor?: string;
  variant?: 'thin' | 'hero';
}

/**
 * ChapterBar — visual punctuation between home sections.
 *
 * `thin`  = 48–64px strip with small mono label (use between same-color sections).
 * `hero`  = 100vh full-bleed color block with XL chapter title (use for color-flip
 *           transitions: black→white, white→black).
 */
export default function ChapterBar({
  number,
  label,
  bg,
  labelColor,
  accentColor,
  variant = 'thin',
}: Props) {
  if (variant === 'hero') {
    return (
      <section
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
        style={{ background: bg, scrollSnapAlign: 'start' }}
      >
        {/* Accent rule left */}
        {accentColor && (
          <div
            aria-hidden
            className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2"
            style={{ width: 2, height: 48, background: accentColor }}
          />
        )}

        <div className="flex flex-col items-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '11px',
              letterSpacing: '0.4em',
              color: labelColor,
              opacity: 0.6,
              textTransform: 'uppercase',
              marginBottom: 28,
            }}
          >
            [ {number} / CHAPTER ]
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-heading), Georgia, serif',
              fontSize: 'clamp(44px, 10vw, 140px)',
              fontWeight: 400,
              color: labelColor,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
            }}
          >
            {label}
          </motion.h3>
        </div>
      </section>
    );
  }

  return (
    <div
      className="relative flex items-center justify-start px-8 md:px-16"
      style={{
        background: bg,
        height: 64,
        borderTop: '1px solid rgba(250,250,248,0.06)',
        borderBottom: '1px solid rgba(250,250,248,0.06)',
      }}
    >
      {accentColor && (
        <div
          aria-hidden
          style={{ width: 18, height: 2, background: accentColor, marginRight: 14 }}
        />
      )}
      <span
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '10px',
          letterSpacing: '0.35em',
          color: labelColor,
          textTransform: 'uppercase',
        }}
      >
        [ {number} / {label} ]
      </span>
    </div>
  );
}
