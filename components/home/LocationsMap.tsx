'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { getCasesWithLocation, type Case } from '@/lib/work-data';
import { LOCATIONS, TAIWAN_OUTLINE_PATH, type LocationKey } from '@/lib/locations';

type Pin = {
  key: LocationKey;
  x: number;
  y: number;
  lat: number;
  lng: number;
  labelZh: string;
  labelEn: string;
  cases: Case[];
};

function buildPins(): Pin[] {
  const groups = new Map<LocationKey, Pin>();
  for (const c of getCasesWithLocation()) {
    const loc = LOCATIONS[c.location];
    if (!groups.has(loc.key)) {
      groups.set(loc.key, {
        key:     loc.key,
        x:       loc.x,
        y:       loc.y,
        lat:     loc.lat,
        lng:     loc.lng,
        labelZh: loc.labelZh,
        labelEn: loc.labelEn,
        cases:   [],
      });
    }
    groups.get(loc.key)!.cases.push(c);
  }
  return Array.from(groups.values());
}

export default function LocationsMap() {
  const pins = buildPins();
  const locale = useLocale();
  const [active, setActive] = useState<LocationKey | null>(null);

  return (
    <section id="footprint" className="relative overflow-hidden py-28 md:py-36 px-6 md:px-10">

      <div className="relative max-w-7xl mx-auto">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="font-label text-[0.625rem] text-[#5CE1FF]/75 mb-8 tracking-[0.28em]"
          style={{ textShadow: '0 0 12px rgba(92,225,255,0.45)' }}
        >
          {'// FOOTPRINT / TAIWAN'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10 mb-16"
        >
          <h2 className="font-display text-white text-[33px] md:text-[44px] lg:text-[55px] leading-[1.02] max-w-xl">
            Where the work
            <br />
            has happened.
          </h2>
          <p className="font-label text-[0.6875rem] text-white/45 md:max-w-xs leading-relaxed md:pb-3">
            Live signals across the island. Tap a node to jump into the case.
          </p>
        </motion.div>

        {/* Map + list grid — centered cluster so map hugs the mid-axis
            and the list column doesn't fan into the right-side void */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_520px] gap-12 lg:gap-20 items-start lg:justify-center">
          {/* ── Map column ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-[320px]"
          >
            {/* HUD corners */}
            {(['tl','tr','bl','br'] as const).map((pos) => (
              <span
                key={pos}
                className={[
                  'absolute w-4 h-4 pointer-events-none z-10',
                  pos.includes('t') ? '-top-2' : '-bottom-2',
                  pos.includes('l') ? '-left-2' : '-right-2',
                ].join(' ')}
              >
                <span
                  className="absolute w-full h-px bg-[#5CE1FF]/50"
                  style={{ [pos.includes('t') ? 'top' : 'bottom']: 0, boxShadow: '0 0 6px rgba(92,225,255,0.6)' }}
                />
                <span
                  className="absolute w-px h-full bg-[#5CE1FF]/50"
                  style={{ [pos.includes('l') ? 'left' : 'right']: 0, boxShadow: '0 0 6px rgba(92,225,255,0.6)' }}
                />
              </span>
            ))}

            {/* Readout strip above */}
            <div className="flex items-center justify-between mb-3 font-label text-[0.5rem] text-white/30 tracking-[0.2em]">
              <span>[ TW_GRID ]</span>
              <span className="text-[#5CE1FF]/60">ACTIVE&nbsp;/&nbsp;{pins.length.toString().padStart(2, '0')}</span>
            </div>

            <svg
              viewBox="0 0 400 800"
              className="w-full h-auto block"
              aria-label="Map of Taiwan showing event locations"
            >
              <defs>
                <radialGradient id="pin-gradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#5CE1FF" stopOpacity="1" />
                  <stop offset="60%"  stopColor="#5CE1FF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#5CE1FF" stopOpacity="0" />
                </radialGradient>
                <clipPath id="taiwan-clip">
                  <path d={TAIWAN_OUTLINE_PATH} />
                </clipPath>
              </defs>

              {/* Ambient background grid */}
              <g stroke="rgba(92,225,255,0.04)" strokeWidth="0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={`bh-${i}`} x1="0" y1={i * 100} x2="400" y2={i * 100} />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line key={`bv-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="800" />
                ))}
              </g>

              {/* Dense lat/lng grid INSIDE Taiwan only (clipped) */}
              <g clipPath="url(#taiwan-clip)" stroke="rgba(92,225,255,0.22)" strokeWidth="0.8">
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`lat-${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
                ))}
                {Array.from({ length: 11 }).map((_, i) => (
                  <line key={`lng-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="800" />
                ))}
              </g>

              {/* Taiwan outline */}
              <motion.path
                d={TAIWAN_OUTLINE_PATH}
                fill="rgba(92,225,255,0.04)"
                stroke="#5CE1FF"
                strokeWidth="1.4"
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.95 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ filter: 'drop-shadow(0 0 6px rgba(92,225,255,0.5))' }}
              />

              {/* Pin-to-pin constellation lines */}
              {pins.map((a, i) =>
                pins.slice(i + 1).map((b) => (
                  <motion.line
                    key={`${a.key}-${b.key}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="rgba(92,225,255,0.35)"
                    strokeWidth="0.9"
                    strokeDasharray="4 6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 1.8, ease: 'easeOut' }}
                  />
                )),
              )}

              {/* Pins */}
              {pins.map((pin, i) => {
                const isActive = active === pin.key;
                const primary  = pin.cases[0];
                return (
                  <g key={pin.key}>
                    {/* Pulse ring */}
                    <motion.circle
                      cx={pin.x}
                      cy={pin.y}
                      r="18"
                      fill="url(#pin-gradient)"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
                      viewport={{ once: false }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 1.5 + i * 0.18,
                      }}
                    />
                    {/* Core dot — dramatic contrast between active / inactive */}
                    <Link
                      href={`/work/${primary.slug}`}
                      aria-label={`${pin.labelEn} — ${primary.titleEn}`}
                    >
                      <motion.circle
                        cx={pin.x}
                        cy={pin.y}
                        r={isActive ? 11 : 4}
                        fill={isActive ? '#5CE1FF' : 'rgba(92,225,255,0.45)'}
                        stroke={isActive ? '#FFFFFF' : 'none'}
                        strokeWidth={isActive ? 1.5 : 0}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.6,
                          delay: 1.8 + i * 0.18,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        onMouseEnter={() => setActive(pin.key)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(pin.key)}
                        onBlur={() => setActive(null)}
                        style={{
                          filter: isActive
                            ? 'drop-shadow(0 0 16px rgba(92,225,255,1)) drop-shadow(0 0 6px rgba(92,225,255,1))'
                            : 'drop-shadow(0 0 4px rgba(92,225,255,0.4))',
                          cursor: 'pointer',
                          transition: 'r 0.2s ease-out',
                        }}
                      />
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r="22"
                        fill="transparent"
                        onMouseEnter={() => setActive(pin.key)}
                        onMouseLeave={() => setActive(null)}
                        style={{ cursor: 'pointer' }}
                      />
                    </Link>

                    {/* City label */}
                    <motion.text
                      x={pin.x + 14}
                      y={pin.y - 2}
                      fill={isActive ? '#5CE1FF' : 'rgba(255,255,255,0.8)'}
                      fontFamily="var(--font-mono), monospace"
                      fontSize="14"
                      fontWeight="500"
                      letterSpacing="1.2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 2.1 + i * 0.18 }}
                      style={{
                        textShadow: isActive ? '0 0 10px rgba(92,225,255,0.7)' : 'none',
                        transition: 'fill 0.2s, text-shadow 0.2s',
                        pointerEvents: 'none',
                      }}
                    >
                      {locale === 'zh-TW' ? pin.labelZh : pin.labelEn.toUpperCase()}
                    </motion.text>

                    {/* Coordinate readout under label */}
                    <motion.text
                      x={pin.x + 14}
                      y={pin.y + 13}
                      fill="rgba(92,225,255,0.55)"
                      fontFamily="var(--font-mono), monospace"
                      fontSize="9"
                      letterSpacing="0.6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 2.3 + i * 0.18 }}
                      style={{ pointerEvents: 'none' }}
                    >
                      {pin.lat.toFixed(2)}°N&nbsp;{pin.lng.toFixed(2)}°E
                    </motion.text>
                  </g>
                );
              })}
            </svg>

            {/* Readout strip below */}
            <div className="flex items-center justify-between mt-3 font-label text-[0.5rem] text-white/30 tracking-[0.2em]">
              <span>LAT&nbsp;21.9°–25.3°N</span>
              <span>LNG&nbsp;120.0°–122.0°E</span>
            </div>
          </motion.div>

          {/* ── Case list column ───────────────────── */}
          <div>
            <p className="font-label text-[0.625rem] text-white/30 mb-6 tracking-[0.22em]">
              [ {pins.length.toString().padStart(2, '0')}&nbsp;ACTIVE&nbsp;SIGNALS&nbsp;—&nbsp;TAIWAN ]
            </p>
            <ul className="space-y-px bg-white/[0.04]">
              {pins.map((pin) => {
                const primary = pin.cases[0];
                const isActive = active === pin.key;
                return (
                  <li key={pin.key} className="bg-[#080808]">
                    <Link
                      href={`/work/${primary.slug}`}
                      onMouseEnter={() => setActive(pin.key)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(pin.key)}
                      onBlur={() => setActive(null)}
                      className="group flex items-center gap-5 px-6 py-5 transition-colors hover:bg-[rgba(92,225,255,0.07)]"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-all flex-shrink-0 ${
                          isActive
                            ? 'bg-[#5CE1FF] shadow-[0_0_12px_rgba(92,225,255,0.9)]'
                            : 'bg-[#5CE1FF]/40'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-label text-[0.6875rem] tracking-[0.22em] transition-colors ${
                            isActive
                              ? 'text-[#5CE1FF]'
                              : 'text-white/70 group-hover:text-white'
                          }`}
                        >
                          {locale === 'zh-TW' ? pin.labelZh : pin.labelEn.toUpperCase()}&nbsp;
                          <span className="text-white/25 font-normal">
                            /&nbsp;{pin.lat.toFixed(2)}°N&nbsp;{pin.lng.toFixed(2)}°E
                          </span>
                        </p>
                        <p className="font-display text-white/55 text-sm md:text-base mt-1">
                          {locale === 'zh-TW' ? primary.title : primary.titleEn}
                          <span className="ml-3 font-label text-[0.5625rem] text-white/30 tracking-[0.22em] align-middle">
                            ·&nbsp;{primary.date.slice(0, 4)}
                          </span>
                        </p>
                      </div>
                      <span className="font-label text-[0.5625rem] text-white/25 group-hover:text-[#5CE1FF]/70 transition-colors flex-shrink-0">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="font-label text-[0.5rem] text-white/20 mt-6 tracking-[0.2em] leading-relaxed">
              New signals appear here as case studies are tagged with a location.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
