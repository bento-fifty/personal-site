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
import ChapterBar from '@/components/shared/ChapterBar';

export default function HomePage() {
  const [entered, setEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    setEntered(true);
  }, []);

  useEffect(() => {
    if (!entered || !containerRef.current) return;
    containerRef.current.style.scrollSnapType = 'y proximity';
    return () => {
      if (containerRef.current) containerRef.current.style.scrollSnapType = '';
    };
  }, [entered]);

  return (
    <>
      {/* Marquee keyframes */}
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      <div
        ref={containerRef}
        className="fixed inset-0 overflow-y-auto overflow-x-hidden"
        style={{ scrollSnapType: entered ? 'y proximity' : 'none', zIndex: 1, background: '#0A0A0C' }}
      >
        {/* Dust canvas — subtle texture overlay; zones adapt color by scroll position */}
        <UniverseCanvas phase="ambient" />

        {/* Section 1: Hero — ink */}
        <section className="relative" style={{ scrollSnapAlign: 'start', height: '100dvh', zIndex: 2 }}>
          <Hero />
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ background: '#0A0A0C', padding: '6px 0', zIndex: 20, borderTop: '1px solid rgba(250,250,248,0.08)' }}>
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

        {/* Chapter divider: Hero → Active (ink / ice bar) */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          <ChapterBar number="02" label="WHAT WE BUILD" bg="#0A0A0C" labelColor="rgba(250,250,248,0.75)" accentColor="#5DD3E3" variant="thin" />
        </div>

        {/* Section 2: Active Systems — ink extended */}
        <section style={{ scrollSnapAlign: 'start', position: 'relative', zIndex: 2 }}>
          <ActiveSystemsToolbelt />
        </section>

        {/* Chapter wipe: Active → Showcase (FLAME — the big moment) */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          <ChapterBar number="03" label="Selected Work." bg="#E63E1F" labelColor="#0A0A0C" accentColor="#0A0A0C" variant="hero" />
        </div>

        {/* Section 3: Showcase 3D — PAPER INVERSION */}
        <section style={{ scrollSnapAlign: 'start', background: '#FAFAF8', position: 'relative', zIndex: 2 }}>
          <CaseShowcase3D />
        </section>

        {/* Chapter wipe: Showcase → Wall (INK inverse) */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          <ChapterBar number="04" label="Archive." bg="#0A0A0C" labelColor="#FAFAF8" accentColor="#E63E1F" variant="hero" />
        </div>

        {/* Section 4: Case Wall — ink continues */}
        <section style={{ scrollSnapAlign: 'start', background: '#0A0A0C', position: 'relative', zIndex: 2 }}>
          <CaseWall />
        </section>

        {/* Chapter divider: Wall → Footer (ink / flame bar) */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          <ChapterBar number="05" label="CONTACT" bg="#0A0A0C" labelColor="rgba(250,250,248,0.75)" accentColor="#E63E1F" variant="thin" />
        </div>

        {/* Section 5: Footer — flame close */}
        <section
          className="flex items-end"
          style={{ scrollSnapAlign: 'start', background: '#0A0A0C', position: 'relative', zIndex: 2 }}
        >
          <FooterCard />
        </section>
      </div>

      {entered && <HomeMenuButton />}
      {!entered && <HookScreen onEnter={handleEnter} />}
    </>
  );
}
