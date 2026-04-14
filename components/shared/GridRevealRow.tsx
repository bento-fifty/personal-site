'use client';

import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * GridRevealRow — archive row entrance.
 *
 * clip-path from inset(0 100% 0 0) → inset(0 0 0 0), 500ms ease-out-expo.
 * Fires once when 30% visible. Honors prefers-reduced-motion.
 */

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function GridRevealRow({ children, className = '', delay = 0 }: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay,
        opacity: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  );
}
