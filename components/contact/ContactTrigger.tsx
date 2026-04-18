'use client';

import { ReactNode } from 'react';
import { useContactCompose } from './ContactComposeContext';

interface Props {
  children: ReactNode;
  className?: string;
  'data-cursor'?: string;
  'data-cursor-variant'?: string;
}

export default function ContactTrigger({
  children,
  className,
  'data-cursor': dc = '▸ CONTACT',
  'data-cursor-variant': dcv = 'action',
}: Props) {
  const { open } = useContactCompose();
  return (
    <button
      type="button"
      onClick={open}
      className={className}
      data-cursor={dc}
      data-cursor-variant={dcv}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit',
        textAlign: 'inherit',
      }}
    >
      {children}
    </button>
  );
}
