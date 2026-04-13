'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import UniverseCanvas from '@/components/shared/UniverseCanvas';
import HookScreen from '@/components/home/HookScreen';
import Hero from '@/components/home/Hero';
import ActiveSystemsToolbelt from '@/components/home/ActiveSystemsToolbelt';
import CaseShowcase3D from '@/components/home/CaseShowcase3D';
import CaseWall from '@/components/home/CaseWall';
import HomeMenuButton from '@/components/home/HomeMenuButton';
import FooterCard from '@/components/home/FooterCard';

export default function HomePage() {
  const [entered, setEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    setEntered(true);
  }, []);

  // Snap scroll on homepage after entering
  useEffect(() => {
    if (!entered || !containerRef.current) return;
    containerRef.current.style.scrollSnapType = 'y proximity';
    return () => {
      if (containerRef.current) containerRef.current.style.scrollSnapType = '';
    };
  }, [entered]);

  return (
    <>
      {/* Inject marquee keyframes directly to avoid Tailwind purge issues */}
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      {/* Main content — always mounted so clip-path reveals it */}
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-y-auto overflow-x-hidden"
        style={{ scrollSnapType: entered ? 'y proximity' : 'none', zIndex: 1 }}
      >
          {/* UniverseCanvas INSIDE snap container so it's visible */}
          <UniverseCanvas phase="ambient" />

          {/* Star dust texture — fixed overlay inside snap container */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 0,
              opacity: 0.35,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cdefs%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' seed='42' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0 0 0 0 0 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3C/defs%3E%3Crect width='300' height='300' filter='url(%23s)' opacity='0.3'/%3E%3C/svg%3E")`,
              backgroundSize: '300px 300px',
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Section 1: Hero + bottom marquee */}
          <section className="relative overflow-hidden" style={{ scrollSnapAlign: 'start', height: '100dvh' }}>
            <Hero />
            {/* Marquee pinned to bottom of hero */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ background: '#0A0A0C', padding: '6px 0', zIndex: 2 }}>
              <div className="flex whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite', width: 'max-content' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <span
                    key={i}
                    className="inline-block px-6"
                    style={{
                      fontFamily: 'var(--font-heading), Georgia, serif',
                      fontSize: 'clamp(14px, 1.8vw, 20px)',
                      fontWeight: 600,
                      color: '#FAFAF8',
                      letterSpacing: '0.15em',
                    }}
                  >
                    THE LEVEL STUDIO ·
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Active Systems */}
          <section className="min-h-screen" style={{ scrollSnapAlign: 'start', background: 'transparent' }}>
            <ActiveSystemsToolbelt />
          </section>

          {/* Section 3: Showcase */}
          <section className="min-h-screen" style={{ scrollSnapAlign: 'start', background: 'transparent' }}>
            <CaseShowcase3D />
          </section>

          {/* Section 4: Case Wall — gradient color shift */}
          <section
            className="min-h-screen flex items-center relative"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,12,0.5) 25%, rgba(10,10,12,0.85) 60%, #0A0A0C 100%)',
              }}
            />
            <div className="relative z-10 w-full">
              <CaseWall />
            </div>
          </section>

          {/* Section 5: Footer card — Utopia-style pop-up */}
          <section
            className="min-h-screen flex items-end relative"
            style={{ scrollSnapAlign: 'start', background: '#0A0A0C' }}
          >
            <FooterCard />
          </section>
        </div>

      {/* Glass hamburger menu — only after entering */}
      {entered && <HomeMenuButton />}

      {/* Hook screen overlay — on top of everything */}
      {!entered && <HookScreen onEnter={handleEnter} />}
    </>
  );
}
