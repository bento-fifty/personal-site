'use client';

import { ReactNode, ElementType, CSSProperties, MouseEvent } from 'react';

/**
 * MagnetTile — hover primitive for archive tiles + CTA buttons.
 *
 * Hover: translateY(-4px) + color inversion. No scale, no shadow, no spring.
 * Tap on touch: active:translateY(-2px) + instant invert.
 */

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  invertBg?: string;   // hover background (default: flame)
  invertFg?: string;   // hover text color (default: ink)
  cursor?: string;     // data-cursor label
  href?: string;
  onClick?: () => void;
  tabIndex?: number;
  ariaLabel?: string;
}

export default function MagnetTile({
  as: Tag = 'div',
  children,
  className = '',
  style,
  invertBg = '#E63E1F',
  invertFg = '#0B1026',
  cursor,
  href,
  onClick,
  tabIndex,
  ariaLabel,
}: Props) {
  const Component = href ? 'a' : Tag;
  return (
    <Component
      {...(href ? { href } : {})}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      data-cursor={cursor}
      className={`magnet-tile group ${className}`}
      style={{
        display: 'inline-block',
        transition: 'transform 200ms ease-out, background 0ms linear, color 0ms linear',
        willChange: 'transform',
        ...style,
      }}
      onMouseEnter={(e: MouseEvent<HTMLElement>) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-4px)';
        el.style.background = invertBg;
        el.style.color = invertFg;
      }}
      onMouseLeave={(e: MouseEvent<HTMLElement>) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.background = (style?.background as string) || 'transparent';
        el.style.color = (style?.color as string) || 'inherit';
      }}
    >
      {children}
    </Component>
  );
}
