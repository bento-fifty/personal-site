'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UniversePhase } from '@/components/shared/UniverseCanvas';

const BOOT_LINES = [
  'INIT THE_LEVEL_STUDIO.SYS',
  'CALIBRATING NAV ............ OK',
  'LOADING MISSION_DB ......... OK',
  'ESTABLISHING UPLINK ........ OK',
  'COORD 25.03N 121.57E ....... LOCK',
  'ALL SYSTEMS NOMINAL',
];

interface Props {
  onPhaseChange: (phase: UniversePhase) => void;
  onComplete: () => void;
}

export default function LoadingOverlay({ onPhaseChange, onComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const [bootIdx, setBootIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'boot' | 'ready' | 'warp' | 'done'>('boot');

  useEffect(() => {
    onPhaseChange('loading');
    const timers = [
      setTimeout(() => { setPhase('ready'); }, 3600),
      setTimeout(() => { setPhase('warp'); onPhaseChange('warp'); }, 4200),
      setTimeout(() => {
        setPhase('done');
        setVisible(false);
        onPhaseChange('ambient');
        onComplete();
      }, 5800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onPhaseChange, onComplete]);

  // Boot lines
  useEffect(() => {
    if (phase === 'done') return;
    if (bootIdx >= BOOT_LINES.length) return;
    const timer = setTimeout(() => setBootIdx((i) => i + 1), 420);
    return () => clearTimeout(timer);
  }, [phase, bootIdx]);

  // Progress
  useEffect(() => {
    if (phase === 'done') return;
    const target = phase === 'ready' || phase === 'warp' ? 100 : Math.min((bootIdx / BOOT_LINES.length) * 80, 80);
    const timer = setInterval(() => {
      setProgress((p) => {
        const step = phase === 'ready' || phase === 'warp' ? 4 : 1.5;
        return p >= target ? target : Math.min(p + step, target);
      });
    }, 30);
    return () => clearInterval(timer);
  }, [phase, bootIdx]);

  const isWarp = phase === 'warp';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60]"
          style={{ background: '#060804' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── Warp flash overlay ── */}
          {isWarp && (
            <motion.div
              className="absolute inset-0 z-10"
              initial={{ background: '#060804' }}
              animate={{ background: '#FAFAF8' }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          )}

          {/* ── Cockpit panel overlay ── */}
          <motion.div
            className="absolute inset-0 flex flex-col"
            animate={{ opacity: isWarp ? 0 : 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Panel frame with gaps for stars */}
            <div className="flex-1 flex">
              {/* Left instruments */}
              <div className="w-[22%] p-3 md:p-4 flex flex-col gap-3">
                <div className="flex-1 border border-[rgba(92,225,255,0.15)] bg-[rgba(6,8,4,0.75)] backdrop-blur-sm rounded-sm p-3 flex flex-col justify-center items-center">
                  <GaugeCircle value={progress / 100 * 0.78} label="NAV" />
                </div>
                <div className="flex-1 border border-[rgba(92,225,255,0.15)] bg-[rgba(6,8,4,0.75)] backdrop-blur-sm rounded-sm p-3 flex flex-col justify-center items-center">
                  <GaugeCircle value={progress / 100 * 0.65} label="SIG" size="sm" />
                </div>
              </div>

              {/* Center terminal */}
              <div className="flex-1 p-3 md:p-4">
                <div className="h-full border border-[rgba(92,225,255,0.15)] bg-[rgba(6,8,4,0.8)] backdrop-blur-sm rounded-sm p-4 md:p-6 flex flex-col">
                  {/* Header */}
                  <div className="mb-3 pb-2 border-b border-[rgba(92,225,255,0.1)]">
                    <p className="text-[rgba(92,225,255,0.85)] text-[11px] md:text-[13px] font-bold" style={{ fontFamily: 'var(--font-departure-mono), monospace', textShadow: '0 0 10px rgba(92,225,255,0.3)' }}>
                      THE LEVEL STUDIO
                    </p>
                    <p className="text-[rgba(92,225,255,0.3)] text-[9px]" style={{ fontFamily: 'var(--font-departure-mono), monospace' }}>
                      MISSION CONTROL // v1.0
                    </p>
                  </div>

                  {/* Boot log */}
                  <div className="flex-1 overflow-hidden">
                    {BOOT_LINES.slice(0, bootIdx).map((line, i) => {
                      const isLast = i === bootIdx - 1;
                      const hasOK = line.includes('OK') || line.includes('LOCK');
                      return (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: 6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15 }}
                          className="mb-1"
                          style={{
                            fontFamily: 'var(--font-departure-mono), monospace',
                            fontSize: 'clamp(9px, 1vw, 12px)',
                            color: isLast ? 'rgba(92,225,255,0.9)' : 'rgba(120,80,0,0.55)',
                            textShadow: isLast ? '0 0 8px rgba(92,225,255,0.3)' : 'none',
                          }}
                        >
                          {hasOK ? (
                            <>
                              {line.replace(/OK|LOCK/, '')}
                              <span style={{ color: 'rgba(60,220,100,0.85)', textShadow: '0 0 6px rgba(60,220,100,0.3)' }}>
                                {line.includes('LOCK') ? 'LOCK' : 'OK'}
                              </span>
                            </>
                          ) : line}
                        </motion.p>
                      );
                    })}
                    {bootIdx < BOOT_LINES.length && (
                      <motion.span
                        className="inline-block"
                        style={{ width: 6, height: 10, background: 'rgba(92,225,255,0.7)' }}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    )}
                    {phase === 'ready' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2"
                        style={{
                          fontFamily: 'var(--font-departure-mono), monospace',
                          fontSize: 'clamp(10px, 1.1vw, 13px)',
                          color: 'rgba(92,225,255,1)',
                          letterSpacing: '0.2em',
                          textShadow: '0 0 15px rgba(92,225,255,0.5)',
                        }}
                      >
                        [ LAUNCH SEQUENCE INITIATED ]
                      </motion.p>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-auto pt-3 border-t border-[rgba(92,225,255,0.08)]">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex gap-[2px]">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-[6px]"
                            style={{
                              background: i < Math.floor(progress / 100 * 25) ? 'rgba(92,225,255,0.7)' : 'rgba(92,225,255,0.07)',
                              boxShadow: i < Math.floor(progress / 100 * 25) ? '0 0 4px rgba(92,225,255,0.3)' : 'none',
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontFamily: 'var(--font-departure-mono), monospace', fontSize: '9px', color: 'rgba(92,225,255,0.5)', fontVariantNumeric: 'tabular-nums', minWidth: 28, textAlign: 'right' }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right instruments */}
              <div className="w-[22%] p-3 md:p-4 flex flex-col gap-3">
                <div className="flex-1 border border-[rgba(92,225,255,0.15)] bg-[rgba(6,8,4,0.75)] backdrop-blur-sm rounded-sm p-3">
                  {['PWR', 'FUEL', 'O2', 'HEAT'].map((label, i) => (
                    <div key={label} className="mb-2">
                      <p style={{ fontFamily: 'var(--font-departure-mono), monospace', fontSize: '8px', color: 'rgba(92,225,255,0.35)', marginBottom: 2 }}>{label}</p>
                      <div className="flex gap-[1px]">
                        {Array.from({ length: 10 }).map((_, j) => (
                          <div
                            key={j}
                            className="flex-1 h-[4px]"
                            style={{ background: j < Math.floor(progress / 100 * [8,6,9,7][i]) ? 'rgba(92,225,255,0.6)' : 'rgba(92,225,255,0.06)' }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 border border-[rgba(92,225,255,0.15)] bg-[rgba(6,8,4,0.75)] backdrop-blur-sm rounded-sm p-3 flex items-center justify-center gap-3 flex-wrap">
                  {['NAV', 'COM', 'LIFE', 'PWR', 'DATA'].map((l, i) => {
                    const active = progress > (i + 1) * 15;
                    return (
                      <div key={l} className="flex flex-col items-center gap-1">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            background: active ? 'rgba(60,220,100,0.9)' : 'rgba(92,225,255,0.1)',
                            boxShadow: active ? '0 0 8px rgba(60,220,100,0.6)' : 'none',
                          }}
                        />
                        <span style={{ fontFamily: 'var(--font-departure-mono), monospace', fontSize: '7px', color: active ? 'rgba(92,225,255,0.6)' : 'rgba(92,225,255,0.2)' }}>{l}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="px-4 md:px-6 pb-3 flex justify-between" style={{ fontFamily: 'var(--font-departure-mono), monospace', fontSize: '9px', color: 'rgba(92,225,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              <span>The Level Studio</span>
              <span>25.03°N 121.57°E</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GaugeCircle({ value, label, size = 'md' }: { value: number; label: string; size?: 'sm' | 'md' }) {
  const r = size === 'sm' ? 28 : 36;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - value * 0.75);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={r * 2 + 10} height={r * 2 + 10} className="transform -rotate-[135deg]">
        <circle cx={r + 5} cy={r + 5} r={r} fill="none" stroke="rgba(92,225,255,0.1)" strokeWidth="3" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} />
        <circle cx={r + 5} cy={r + 5} r={r} fill="none" stroke="rgba(92,225,255,0.6)" strokeWidth="3" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 0.5s ease', filter: 'drop-shadow(0 0 4px rgba(92,225,255,0.3))' }} />
      </svg>
      <span style={{ fontFamily: 'var(--font-departure-mono), monospace', fontSize: '8px', color: 'rgba(92,225,255,0.4)', letterSpacing: '0.15em' }}>{label}</span>
    </div>
  );
}
