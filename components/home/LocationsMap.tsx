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

/**
 * Section 06 · GEO SCAN
 *
 * Round 2 polish rewrite: replaces the old map-list split with a
 * **terminal stream log** for active nodes + a **picture-in-picture
 * mini map** anchored in the terminal window's top-right corner.
 * Hover a log row → pin highlights. Same terminal language as
 * Mission Log (section 03) but as a live geo scan readout rather
 * than a case brief. Fits comfortably inside one viewport.
 */
export default function LocationsMap() {
  const pins = buildPins();
  const locale = useLocale();
  const [active, setActive] = useState<LocationKey | null>(null);

  return (
    <section
      id="footprint"
      className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden py-14 md:py-16"
    >
      <div className="hud-grid">
        {/* Section header */}
        <div className="col-span-12 mb-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="font-label text-[11px] text-[#5CE1FF]/80 mb-4 tracking-[0.28em]"
            style={{ textShadow: '0 0 12px rgba(92,225,255,0.5)' }}
          >
            {'// 06 // GEO SCAN'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-[28px] md:text-[40px] lg:text-[50px] leading-[1.05] max-w-3xl"
            style={{
              fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
              fontWeight:          500,
              letterSpacing:       '-0.015em',
              WebkitFontSmoothing: 'antialiased',
              textShadow:          '0 0 22px rgba(5,5,5,0.9)',
            }}
          >
            Where the work has happened.
          </motion.h2>
        </div>

        {/* Terminal stream window */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="col-span-12 relative border border-white/[0.12] bg-[#070707]/85 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
          style={{
            backdropFilter: 'blur(6px)',
            fontFamily:     'var(--font-mono), ui-monospace, monospace',
          }}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="block w-2.5 h-2.5 rounded-full bg-[#ff4f5a]/70" />
              <span className="block w-2.5 h-2.5 rounded-full bg-[#ffbf33]/70" />
              <span className="block w-2.5 h-2.5 rounded-full bg-[#3cd66d]/70" />
            </div>
            <span className="text-[10px] text-white/45 tracking-[0.14em]">
              geoscan.term — taiwan/live
            </span>
            <span className="text-[10px] text-white/25 tracking-[0.14em]">
              ⌘M
            </span>
          </div>

          {/* Body grid: stream + larger map (map is co-star not PIP) */}
          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_340px] min-h-[520px]">
            {/* Stream column */}
            <div className="p-5 md:p-6 text-[11px] md:text-[12px] leading-[1.7]">
              <div className="text-[#5CE1FF]/85 mb-1">
                $ geoscan --stream --region=taiwan
              </div>
              <div className="text-white/35 mb-4">
                &gt; INIT: 3 nodes resolved · last sync 2024-11
              </div>

              <div className="border-t border-white/[0.06]">
                {pins.map((pin, i) => {
                  const c = pin.cases[0];
                  const isActive = active === pin.key;
                  const year = c.date.slice(0, 4);
                  return (
                    <div
                      key={pin.key}
                      onMouseEnter={() => setActive(pin.key)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(pin.key)}
                      onBlur={() => setActive(null)}
                      className={
                        'group relative py-3 md:py-4 border-b border-white/[0.06] transition-colors ' +
                        (isActive
                          ? 'bg-[#5CE1FF]/[0.05]'
                          : 'hover:bg-white/[0.02]')
                      }
                    >
                      {/* Active left bar */}
                      {isActive && (
                        <span
                          aria-hidden
                          className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#5CE1FF]"
                          style={{
                            boxShadow:
                              '0 0 8px rgba(92,225,255,0.9), 0 0 2px rgba(92,225,255,1)',
                          }}
                        />
                      )}

                      {/* Row 1 — node metadata */}
                      <div className="pl-4 tabular-nums">
                        <span className="text-[#5CE1FF]/90">[OK]</span>
                        <span className="text-white/20">&nbsp;&nbsp;</span>
                        <span className="text-white/85">
                          NODE-{(i + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="text-white/20">&nbsp;|&nbsp;</span>
                        <span className="text-[#5CE1FF]/85">
                          {pin.labelEn.toUpperCase()}
                        </span>
                        <span className="text-white/20">&nbsp;|&nbsp;</span>
                        <span className="text-white/55">
                          {pin.lat.toFixed(4)}°N&nbsp;&nbsp;{pin.lng.toFixed(4)}°E
                        </span>
                      </div>

                      {/* Row 2 — case header */}
                      <div className="pl-10 mt-0.5 text-[11px]">
                        <span className="text-white/35">└─</span>
                        <span className="text-white/75 ml-2">
                          {c.id} / {c.titleEn.toUpperCase()}
                        </span>
                        <span className="text-white/20">&nbsp;·&nbsp;</span>
                        <span className="text-white/45">{year}</span>
                        <span className="text-white/20">&nbsp;·&nbsp;</span>
                        <span className="font-label text-[9px] text-[#5CE1FF]/75 tracking-[0.22em]">
                          [{c.type}]
                        </span>
                      </div>

                      {/* Row 3 — stats rollup */}
                      <div className="pl-10 mt-0.5 text-[11px] text-white/50">
                        <span className="text-white/35">└─</span>
                        <span className="ml-2">
                          {c.stats
                            .map(
                              (s) =>
                                `${s.value} ${s.labelEn.toUpperCase()}`,
                            )
                            .join('  |  ')}
                        </span>
                      </div>

                      {/* Row 4 — open link */}
                      <div className="pl-10 mt-1 text-[11px]">
                        <span className="text-white/35">└─</span>
                        <Link
                          href={`/work/${c.slug}`}
                          className="ml-2 text-[#5CE1FF]/75 hover:text-[#5CE1FF] transition-colors"
                          style={{
                            textShadow: isActive
                              ? '0 0 8px rgba(92,225,255,0.55)'
                              : 'none',
                          }}
                        >
                          OPEN CASE FILE →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Terminal footer status */}
              <div className="pt-4 text-[10px] text-white/40 leading-[1.85]">
                <div>
                  <span className="text-[#5CE1FF]/75">STATUS:</span>{' '}
                  {pins.length}/{pins.length} NODES ACTIVE
                </div>
                <div className="text-white/25">
                  &gt; awaiting next brief to resolve new nodes_
                </div>
              </div>
            </div>

            {/* Right column — larger featured Taiwan map with plate lines */}
            <div className="hidden md:flex items-center justify-center p-5 border-l border-white/[0.06] bg-[#050505]/40 relative">
              <div className="relative w-full max-w-[260px] aspect-[400/800]">
                {(['tl', 'tr', 'bl', 'br'] as const).map((cr) => {
                  const style: React.CSSProperties = {
                    position: 'absolute',
                    width:    '8px',
                    height:   '8px',
                  };
                  if (cr.includes('t')) style.top = '-2px';
                  else style.bottom = '-2px';
                  if (cr.includes('l')) style.left = '-2px';
                  else style.right = '-2px';
                  return (
                    <span key={cr} aria-hidden style={style}>
                      <span
                        className="absolute bg-[#5CE1FF]/55"
                        style={{
                          width:  '100%',
                          height: '1px',
                          [cr.includes('t') ? 'top' : 'bottom']: 0,
                        }}
                      />
                      <span
                        className="absolute bg-[#5CE1FF]/55"
                        style={{
                          width:  '1px',
                          height: '100%',
                          [cr.includes('l') ? 'left' : 'right']: 0,
                        }}
                      />
                    </span>
                  );
                })}

                <svg
                  viewBox="0 0 400 800"
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-full block"
                  aria-label="Taiwan scan map"
                >
                  <defs>
                    <clipPath id="tw-clip-mini">
                      <path d={TAIWAN_OUTLINE_PATH} />
                    </clipPath>
                  </defs>
                  {/* Ambient background grid — outside island bounds */}
                  <g stroke="rgba(92,225,255,0.05)" strokeWidth="0.8">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line key={`bh-${i}`} x1="0" y1={i * 100} x2="400" y2={i * 100} />
                    ))}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <line key={`bv-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="800" />
                    ))}
                  </g>
                  {/* Dense lat/lng grid INSIDE Taiwan only (clipped) */}
                  <g
                    clipPath="url(#tw-clip-mini)"
                    stroke="rgba(92,225,255,0.26)"
                    strokeWidth="1.3"
                  >
                    {Array.from({ length: 20 }).map((_, i) => (
                      <line key={`lt-${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
                    ))}
                    {Array.from({ length: 11 }).map((_, i) => (
                      <line key={`ln-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="800" />
                    ))}
                  </g>
                  {/* Central mountain spine — 中央山脈 as dashed cyan bezier */}
                  <path
                    d="M 200 80 Q 215 200 225 360 Q 238 520 228 680 L 220 740"
                    fill="none"
                    stroke="rgba(92,225,255,0.55)"
                    strokeWidth="2.2"
                    strokeDasharray="6 8"
                    strokeLinecap="round"
                    clipPath="url(#tw-clip-mini)"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(92,225,255,0.5))' }}
                  />
                  {/* Region boundary lines — north / central / south */}
                  <g
                    clipPath="url(#tw-clip-mini)"
                    stroke="rgba(92,225,255,0.4)"
                    strokeWidth="1.4"
                    strokeDasharray="3 5"
                  >
                    <line x1="0" y1="265" x2="400" y2="265" />
                    <line x1="0" y1="515" x2="400" y2="515" />
                  </g>
                  {/* Region labels */}
                  <g
                    fill="rgba(92,225,255,0.55)"
                    fontSize="18"
                    fontFamily="var(--font-mono), monospace"
                    letterSpacing="2"
                  >
                    <text x="280" y="180" opacity="0.7">NORTH</text>
                    <text x="300" y="410" opacity="0.7">MID</text>
                    <text x="290" y="680" opacity="0.7">SOUTH</text>
                  </g>
                  {/* Coastal tick marks — short dashes around outline */}
                  <path
                    d={TAIWAN_OUTLINE_PATH}
                    fill="none"
                    stroke="rgba(92,225,255,0.3)"
                    strokeWidth="4"
                    strokeDasharray="2 10"
                    strokeLinecap="round"
                  />
                  {/* Outline */}
                  <motion.path
                    d={TAIWAN_OUTLINE_PATH}
                    fill="rgba(92,225,255,0.04)"
                    stroke="#5CE1FF"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.95 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(92,225,255,0.5))' }}
                  />
                  {/* Pins */}
                  {pins.map((pin) => {
                    const isActive = active === pin.key;
                    return (
                      <g key={pin.key}>
                        {isActive && (
                          <circle
                            cx={pin.x}
                            cy={pin.y}
                            r={26}
                            fill="rgba(92,225,255,0.18)"
                          />
                        )}
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={isActive ? 12 : 8}
                          fill={isActive ? '#5CE1FF' : 'rgba(92,225,255,0.55)'}
                          style={{
                            filter: isActive
                              ? 'drop-shadow(0 0 12px rgba(92,225,255,1))'
                              : 'drop-shadow(0 0 6px rgba(92,225,255,0.5))',
                            transition: 'all 200ms ease',
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-1.5 text-[9px] text-white/30 tracking-[0.16em]">
            <div className="flex items-center gap-3">
              <span>
                SCAN:&nbsp;
                <span className="text-[#5CE1FF]/80">ACTIVE</span>
              </span>
              <span className="text-white/15">|</span>
              <span>{pins.length} NODES</span>
              <span className="text-white/15">|</span>
              <span>UTF-8</span>
            </div>
            <span className="hidden md:inline">
              HOVER ROW TO PING MAP
            </span>
          </div>
        </motion.div>
      </div>
      {/* suppress unused locale warning for zh-TW preview */}
      <span className="hidden">{locale}</span>
    </section>
  );
}
