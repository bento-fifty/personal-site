'use client';

import ShaderCanvas from '@/components/lab/ShaderCanvas';
import { dithered } from '@/components/lab/shaders';

export default function HomeAmbientBg() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.55 }}
    >
      <ShaderCanvas frag={dithered} className="block w-full h-full" />
      <div className="absolute inset-0 bg-[#080808]/30" />
    </div>
  );
}
