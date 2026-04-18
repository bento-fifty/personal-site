'use client';

import ShaderCanvas from '@/components/lab/ShaderCanvas';
import { dithered } from '@/components/lab/shaders';
import {
  voidStar as liquidChrome,
  aperture as inkPool,
  emberMap,
  blueprint as emeraldFerrofluid,
  pulse,
  ink,
  obsidianPour,
} from '@/components/lab/ambientShaders';

export type AmbientVariant =
  | 'dithered'
  | 'chrome'
  | 'inkPool'
  | 'ember'
  | 'emerald'
  | 'pulse'
  | 'ink'
  | 'obsidian';

const SHADER: Record<AmbientVariant, string> = {
  dithered,
  chrome: liquidChrome,
  inkPool,
  ember: emberMap,
  emerald: emeraldFerrofluid,
  pulse,
  ink,
  obsidian: obsidianPour,
};

// Per-variant opacity + mask tuning so none overpowers content
const TUNE: Record<AmbientVariant, { opacity: number; mask: number }> = {
  dithered: { opacity: 0.55, mask: 0.3 },
  chrome:   { opacity: 0.42, mask: 0.4 },
  inkPool:  { opacity: 0.55, mask: 0.35 },
  ember:    { opacity: 0.45, mask: 0.4 },
  emerald:  { opacity: 0.40, mask: 0.45 },
  pulse:    { opacity: 0.40, mask: 0.45 },
  ink:      { opacity: 0.45, mask: 0.4 },
  obsidian: { opacity: 0.42, mask: 0.38 },
};

export default function AmbientBg({
  variant,
  style,
}: {
  variant: AmbientVariant;
  style?: React.CSSProperties;
}) {
  const { opacity, mask } = TUNE[variant];
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity, ...style }}
    >
      <ShaderCanvas frag={SHADER[variant]} className="block w-full h-full" />
      <div
        className="absolute inset-0"
        style={{ background: `rgba(11, 16, 38, ${mask})` }}
      />
    </div>
  );
}
