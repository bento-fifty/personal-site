'use client';

import { motion } from 'framer-motion';

export default function FooterCard() {
  return (
    <motion.div
      className="w-full relative overflow-hidden"
      initial={{ y: 80, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: '#E63E1F',
        minHeight: '70vh',
        borderRadius: '8px 8px 0 0',
      }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Top info bar */}
      <div
        className="relative z-10 flex justify-between items-center px-8 md:px-12 py-5 border-b"
        style={{ borderColor: 'rgba(0,0,0,0.15)' }}
      >
        <span style={{
          fontFamily: 'var(--font-departure-mono), monospace',
          fontSize: '9px',
          letterSpacing: '0.2em',
          color: 'rgba(10,10,12,0.5)',
        }}>
          25.03°N 121.57°E
        </span>
        <span style={{
          fontFamily: 'var(--font-departure-mono), monospace',
          fontSize: '9px',
          letterSpacing: '0.3em',
          color: 'rgba(10,10,12,0.5)',
          textTransform: 'uppercase',
        }}>
          Contact
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-between px-8 md:px-12" style={{ minHeight: 'calc(70vh - 50px)' }}>
        {/* Question */}
        <div className="pt-12 md:pt-16 max-w-[700px]">
          <p style={{
            fontFamily: 'var(--font-departure-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: 'rgba(10,10,12,0.4)',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            [ Have a project? ]
          </p>
          <h2 style={{
            fontFamily: 'var(--font-heading), Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 56px)',
            fontWeight: 400,
            color: '#0A0A0C',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            Events crafted to be remembered.
          </h2>

          {/* Blue accent line */}
          <div style={{ width: 48, height: 2, background: '#5DD3E3', marginTop: 28 }} />

          {/* Credits grid */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-[500px]">
            <div>
              <p style={{ fontFamily: 'var(--font-departure-mono), monospace', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(10,10,12,0.35)', marginBottom: 4, textTransform: 'uppercase' }}>
                Principal
              </p>
              <p style={{ fontFamily: 'var(--font-departure-mono), monospace', fontSize: '11px', color: '#0A0A0C', letterSpacing: '0.05em' }}>
                Evan Chang
              </p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-departure-mono), monospace', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(10,10,12,0.35)', marginBottom: 4, textTransform: 'uppercase' }}>
                Email
              </p>
              <p style={{ fontFamily: 'var(--font-departure-mono), monospace', fontSize: '11px', color: '#0A0A0C', letterSpacing: '0.05em' }}>
                evanchang818@gmail.com
              </p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-departure-mono), monospace', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(10,10,12,0.35)', marginBottom: 4, textTransform: 'uppercase' }}>
                Location
              </p>
              <p style={{ fontFamily: 'var(--font-departure-mono), monospace', fontSize: '11px', color: '#0A0A0C', letterSpacing: '0.05em' }}>
                Taipei, Taiwan
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: Large brand name */}
        <div className="pb-8 md:pb-12 pt-12">
          <h3 style={{
            fontFamily: 'var(--font-heading), Georgia, serif',
            fontSize: 'clamp(36px, 8vw, 120px)',
            fontWeight: 400,
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(10,10,12,0.7)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}>
            THE LEVEL
          </h3>
          <h3 style={{
            fontFamily: 'var(--font-heading), Georgia, serif',
            fontSize: 'clamp(36px, 8vw, 120px)',
            fontWeight: 400,
            color: '#0A0A0C',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}>
            STUDIO.
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
