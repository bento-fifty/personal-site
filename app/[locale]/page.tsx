'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import UniverseCanvas from '@/components/shared/UniverseCanvas';
import HookScreen from '@/components/home/HookScreen';
import Hero from '@/components/home/Hero';
import ActiveSystemsToolbelt from '@/components/home/ActiveSystemsToolbelt';
import CaseShowcase3D from '@/components/home/CaseShowcase3D';

export default function HomePage() {
  const [entered, setEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    setEntered(true);
  }, []);

  // Snap scroll on homepage after entering
  useEffect(() => {
    if (!entered || !containerRef.current) return;
    containerRef.current.style.scrollSnapType = 'y mandatory';
    return () => {
      if (containerRef.current) containerRef.current.style.scrollSnapType = '';
    };
  }, [entered]);

  return (
    <>
      <UniverseCanvas phase="ambient" />

      {/* Hook screen overlay */}
      {!entered && <HookScreen onEnter={handleEnter} />}

      {/* Main content with snap scroll */}
      {entered && (
        <div
          ref={containerRef}
          className="fixed inset-0 overflow-y-auto overflow-x-hidden"
          style={{ scrollSnapType: 'y mandatory', zIndex: 1 }}
        >
          {/* Section 1: Hero */}
          <section className="min-h-screen" style={{ scrollSnapAlign: 'start' }}>
            <Hero />
          </section>

          {/* Marquee divider */}
          <div className="bg-[#0A0A0C] py-4 overflow-hidden" style={{ scrollSnapAlign: 'none' }}>
            <div className="flex whitespace-nowrap animate-marquee">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="inline-block px-8"
                  style={{
                    fontFamily: 'var(--font-heading), Georgia, serif',
                    fontSize: 'clamp(16px, 2vw, 24px)',
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

          {/* Section 2: Active Systems */}
          <section className="min-h-screen" style={{ scrollSnapAlign: 'start', background: 'transparent' }}>
            <ActiveSystemsToolbelt />
          </section>

          {/* Section 3: Showcase */}
          <section className="min-h-screen" style={{ scrollSnapAlign: 'start', background: 'transparent' }}>
            <CaseShowcase3D />
          </section>

          {/* Section 4: Case Wall — placeholder */}
          <section
            className="min-h-screen flex items-center justify-center"
            style={{ scrollSnapAlign: 'start', background: 'transparent' }}
          >
            <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '12px', color: 'rgba(20,20,19,0.3)', letterSpacing: '0.2em' }}>
              [ CASE WALL — COMING NEXT ]
            </p>
          </section>

          {/* Section 5: Consult — textured bg */}
          <section
            className="min-h-screen flex items-center justify-center relative"
            style={{ scrollSnapAlign: 'start', background: '#0A0A0C' }}
          >
            {/* Grain texture */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '128px 128px',
              }}
            />
            <div className="relative z-10 text-center px-8 max-w-[600px]">
              <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(250,250,248,0.3)', textTransform: 'uppercase', marginBottom: 24 }}>
                [ Contact ]
              </p>
              <h2 style={{ fontFamily: 'var(--font-heading), Georgia, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: '#FAFAF8', lineHeight: 1.3 }}>
                Have a project worth remembering?
              </h2>
              <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '11px', color: 'rgba(250,250,248,0.4)', marginTop: 20, letterSpacing: '0.1em' }}>
                evanchang818@gmail.com
              </p>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
