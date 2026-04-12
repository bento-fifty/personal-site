'use client';

import HyperspaceField from './HyperspaceField';

/**
 * Page-level ambient background. Sits fixed behind all home sections so
 * the hyperspace particle field becomes a single continuous backdrop from
 * Hero all the way to Footer.
 *
 * Round 2.1 v2 swapped FlowField → HyperspaceField — from "crowd flow"
 * curves (read as organic / bio) to "hyperspace jump" radial streaks
 * (read as sci-fi / cosmic). Base color darkened from #080808 to #050505
 * to match the deeper-space feel.
 */
export default function HomeAmbientBg() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none bg-[#050505]"
    >
      <HyperspaceField />
      {/* Vignette overlay — darkens centre a touch so readable content
          lives in a softer "safe zone" rather than fighting streak glare */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 50%, rgba(5,5,5,0.5) 0%, rgba(5,5,5,0.15) 45%, transparent 80%)',
        }}
      />
    </div>
  );
}
