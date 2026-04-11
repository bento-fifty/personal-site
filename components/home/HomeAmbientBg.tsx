'use client';

import DataStreams from './DataStreams';

/**
 * Page-level ambient background. Sits fixed behind all home sections so the
 * matrix data streams + dot grid become a single continuous backdrop from
 * Hero all the way to Footer, rather than repeating per section.
 *
 * Uses a large negative z-index so relatively-positioned sections above it
 * naturally stack on top without needing explicit z-index on every child.
 */
export default function HomeAmbientBg() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none bg-[#080808]"
    >
      <div style={{ opacity: 0.5 }}>
        <DataStreams />
      </div>
    </div>
  );
}
