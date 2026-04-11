'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Scramble-decode text reveal.
 *
 * Cycles random glyphs through each position, resolving left→right until the
 * real text is shown. Used across the site wherever we want the "terminal
 * decoding a signal" feel (Nav logo hover, LoadingIntro boot log,
 * FeaturedWork case subtitle).
 *
 * Props:
 * - text:    the final string to resolve to
 * - trigger: key that forces a re-run (e.g., hover count). Ignored on first mount.
 * - speed:   ms between reveal steps (default 22)
 * - once:    if true, only scramble on first mount and ignore trigger changes
 */
interface Props {
  text: string;
  trigger?: number | string | boolean;
  speed?: number;
  once?: boolean;
  className?: string;
  preserveSpaces?: boolean;
}

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#$%&';

export default function GlitchText({
  text,
  trigger,
  speed = 22,
  once = false,
  className,
  preserveSpaces = true,
}: Props) {
  const [display, setDisplay] = useState(text);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (once && hasRunRef.current) return;
    hasRunRef.current = true;

    let step = 0;
    const id = setInterval(() => {
      step += 1;
      const out = text
        .split('')
        .map((ch, idx) => {
          if (preserveSpaces && ch === ' ') return ' ';
          if (idx < step) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join('');
      setDisplay(out);
      if (step >= text.length) {
        clearInterval(id);
        setDisplay(text);
      }
    }, speed);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger, speed, once]);

  return <span className={className}>{display}</span>;
}
