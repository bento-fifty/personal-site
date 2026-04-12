'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import LoadingIntro from './LoadingIntro';
import HeroCornerHud from './HeroCornerHud';

/**
 * Hero — Round 2.1 v2 "Starship Command Bridge" rewrite.
 *
 * Layout:
 *   - EVENTS ghost (fixed behind, unchanged)
 *   - 4 corner HUD blocks (terminal-style readouts: BOOT / STATUS / ROLES / INPUT)
 *   - Centre: per-char 3D-reveal headline + a single serif italic value prop
 *
 * Deleted from v1:
 *   - EVAN · CHANG byline (brand is in Nav already)
 *   - BRAND EVENTS · PRESS · ... scope list
 *   - SubheadingHoverReveal (Planner / Producer / Consultant) → moved to BL HUD
 *
 * 6-layer centred stack → 1 headline + 1 subtitle + 4 corner HUDs.
 * The centre breathes; the HUDs establish the command-bridge tone.
 */
export default function Hero() {
  const t = useTranslations('home');
  const ref = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const ghostY       = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // ── EVENTS ghost horizontal slice glitch ──────────
  const [ghostGlitch, setGhostGlitch] = useState<{
    top: number;
    height: number;
    x: number;
  } | null>(null);

  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;

    const scheduleGhostGlitch = () => {
      const delay = 4200 + Math.random() * 4500;
      return setTimeout(() => {
        if (cancelled) return;
        setGhostGlitch({
          top:    Math.random() * 75,
          height: 6 + Math.random() * 14,
          x:      (Math.random() - 0.5) * 36,
        });
        setTimeout(() => !cancelled && setGhostGlitch(null), 110);
        if (Math.random() < 0.55) {
          setTimeout(() => {
            if (cancelled) return;
            setGhostGlitch({
              top:    Math.random() * 75,
              height: 4 + Math.random() * 10,
              x:      (Math.random() - 0.5) * 26,
            });
            setTimeout(() => !cancelled && setGhostGlitch(null), 70);
          }, 80 + Math.random() * 80);
        }
        scheduleGhostGlitch();
      }, delay);
    };

    const t1 = scheduleGhostGlitch();
    return () => {
      cancelled = true;
      clearTimeout(t1);
    };
  }, [loaded]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[100dvh] -mt-14 flex items-center justify-center overflow-hidden"
    >
      {/* Layer 0: Loading intro */}
      <LoadingIntro onComplete={() => setLoaded(true)} />

      {/* Layer 1: Ghost text EVENTS */}
      <motion.div
        style={{ y: ghostY, opacity: ghostOpacity, paddingBottom: '18vh' }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <div className="relative inline-block leading-none">
          <motion.span
            className="font-bold text-[22vw] leading-none whitespace-nowrap text-white/[0.028] block"
            style={{
              fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
              WebkitFontSmoothing: 'antialiased',
            }}
            initial={{ filter: 'blur(48px)', opacity: 0 }}
            animate={{
              filter:  loaded ? 'blur(0px)' : 'blur(48px)',
              opacity: loaded ? 1 : 0,
              textShadow: loaded
                ? [
                    '-1.5px 0 0 rgba(255, 40, 120, 0.08), 1.5px 0 0 rgba(60, 255, 255, 0.08)',
                    '-1.5px 0 0 rgba(255, 40, 120, 0.18), 1.5px 0 0 rgba(60, 255, 255, 0.18)',
                    '-1.5px 0 0 rgba(255, 40, 120, 0.08), 1.5px 0 0 rgba(60, 255, 255, 0.08)',
                  ]
                : '-1.5px 0 0 rgba(255, 40, 120, 0), 1.5px 0 0 rgba(60, 255, 255, 0)',
            }}
            transition={{
              filter:     { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
              opacity:    { duration: 1.2, ease: 'easeOut' },
              textShadow: {
                duration: 10,
                repeat:   Infinity,
                ease:     'easeInOut',
                delay:    2,
                times:    [0, 0.5, 1],
              },
            }}
          >
            EVENTS
          </motion.span>

          {/* CRT scanline mask */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-multiply"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(5,5,5,0.6) 0px, rgba(5,5,5,0.6) 2px, transparent 2px, transparent 5px)',
            }}
          />

          {/* Horizontal slice glitch */}
          {loaded && ghostGlitch && (
            <span
              aria-hidden
              className="absolute inset-0 font-bold text-[22vw] leading-none whitespace-nowrap block pointer-events-none"
              style={{
                fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                WebkitFontSmoothing: 'antialiased',
                color:               'rgba(92, 225, 255, 0.18)',
                clipPath:            `inset(${ghostGlitch.top}% 0 ${100 - ghostGlitch.top - ghostGlitch.height}% 0)`,
                transform:           `translate3d(${ghostGlitch.x}px, 0, 0)`,
                mixBlendMode:        'screen',
                textShadow:
                  '-2px 0 0 rgba(255, 40, 120, 0.22), 2px 0 0 rgba(60, 255, 255, 0.22)',
              }}
            >
              EVENTS
            </span>
          )}
        </div>
      </motion.div>

      {/* Layer 2: Corner HUDs */}
      {loaded && (
        <>
          <HeroCornerHud position="tl" label="SYSTEMS" delay={0.15}>
            <div>&gt; INIT_CORE...OK</div>
            <div>&gt; LOAD_CASE_FILES</div>
            <div>&nbsp;&nbsp;[ 50+ ] LOADED</div>
            <div>&gt; READY_</div>
          </HeroCornerHud>

          <HeroCornerHud position="tr" label="STATUS" delay={0.25}>
            <div>&gt; LOC: TPE / GMT+8</div>
            <LiveClockLine />
            <div>&gt; STATE: NOMINAL</div>
            <div>&gt; OPEN FOR 2026 Q3</div>
          </HeroCornerHud>

          <HeroCornerHud position="bl" label="ROLES" delay={0.35}>
            <div>&gt; PLANNER</div>
            <div>&gt; PRODUCER</div>
            <div>&gt; CONSULTANT</div>
          </HeroCornerHud>

          <HeroCornerHud position="br" label="INPUT" delay={0.45}>
            <div>&gt; SCROLL ↓</div>
            <div>&gt; OR PRESS [SPACE]</div>
            <div>&gt; [ENTER] TO READ</div>
          </HeroCornerHud>
        </>
      )}

      {/* Layer 3: Hero content — blur→focus after load */}
      <motion.div
        initial={{ opacity: 0, filter: 'blur(22px)', y: 8 }}
        animate={{
          opacity: loaded ? 1 : 0,
          filter:  loaded ? 'blur(0px)' : 'blur(22px)',
          y:       loaded ? 0 : 8,
        }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative z-10 text-center px-6 pt-14"
      >
        {/* Dark radial backdrop behind headline */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            top:        '45%',
            transform:  'translate(-50%, -50%)',
            width:      'min(1100px, 100vw)',
            height:     'min(560px, 65vh)',
            background:
              'radial-gradient(ellipse at center, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.78) 35%, rgba(5,5,5,0.35) 60%, transparent 85%)',
          }}
        />
        <div className="relative">
          {/* Headline — per-char 3D reveal (preserved from v1) */}
          <HeadlineWithMotion text={t('headline')} loaded={loaded} />

          {/* Single serif italic value prop — no other centred elements */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 8 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 2.0 }}
            className="mt-12 md:mt-14 font-display text-white/80 text-center max-w-2xl mx-auto"
            style={{
              fontSize:      'clamp(16px, 1.5vw, 22px)',
              fontWeight:    300,
              fontStyle:     'italic',
              letterSpacing: '0.01em',
              textShadow:    '0 0 22px rgba(5,5,5,0.9), 0 0 8px rgba(5,5,5,0.75)',
            }}
          >
            {t('positioning_value')}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

// ── Live clock line for TR HUD ──────────────────────
function LiveClockLine() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = d.getUTCHours().toString().padStart(2, '0');
      const mm = d.getUTCMinutes().toString().padStart(2, '0');
      const ss = d.getUTCSeconds().toString().padStart(2, '0');
      setTime(`${hh}:${mm}:${ss}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <div>&gt; UTC: {time}</div>;
}

// ── Headline with per-character 3D reveal + scramble idle glitch ─
const HEADLINE_GLITCH_CHARS = '!<>/#@%&*'.split('');

function HeadlineWithMotion({ text, loaded }: { text: string; loaded: boolean }) {
  const chars = [...text];
  // Group into words so wrapping happens at word boundaries, not mid-word
  const words: { chars: string[]; startIdx: number }[] = [];
  {
    let current: { chars: string[]; startIdx: number } | null = null;
    chars.forEach((ch, i) => {
      if (ch === ' ') {
        if (current) {
          words.push(current);
          current = null;
        }
        words.push({ chars: [' '], startIdx: i });
      } else {
        if (!current) current = { chars: [], startIdx: i };
        current.chars.push(ch);
      }
    });
    if (current) words.push(current);
  }
  const [scramble, setScramble] = useState<{ idx: number; char: string } | null>(null);
  const [cursorOn, setCursorOn] = useState(true);

  // Periodic letter scramble (idle glitch)
  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    let nextTimer: ReturnType<typeof setTimeout>;
    let resetTimer: ReturnType<typeof setTimeout>;

    const validIndexes = chars
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => /[a-zA-Z]/.test(c));

    const fire = () => {
      if (cancelled || validIndexes.length === 0) return;
      const pick = validIndexes[Math.floor(Math.random() * validIndexes.length)];
      const ch   = HEADLINE_GLITCH_CHARS[Math.floor(Math.random() * HEADLINE_GLITCH_CHARS.length)];
      setScramble({ idx: pick.i, char: ch });
      resetTimer = setTimeout(() => !cancelled && setScramble(null), 140);
      nextTimer  = setTimeout(fire, 4000 + Math.random() * 2800);
    };

    const kickoff = setTimeout(fire, 3000);
    return () => {
      cancelled = true;
      clearTimeout(kickoff);
      clearTimeout(nextTimer);
      clearTimeout(resetTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, text]);

  // Blinking cursor
  useEffect(() => {
    if (!loaded) return;
    const id = setInterval(() => setCursorOn((v) => !v), 560);
    return () => clearInterval(id);
  }, [loaded]);

  return (
    <div className="relative inline-block mb-10 max-w-3xl mx-auto">
      <h1
        data-scan-target="true"
        className="text-white text-[2.75rem] leading-[1.1] md:text-7xl lg:text-[6rem]"
        style={{
          fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
          fontWeight:          500,
          letterSpacing:       '-0.015em',
          WebkitFontSmoothing: 'antialiased',
          textShadow:
            '0 0 36px rgba(5,5,5,0.96), 0 0 14px rgba(5,5,5,0.88), 0 2px 18px rgba(5,5,5,0.72)',
          perspective:         '820px',
        }}
      >
        {words.map((word, wIdx) => {
          if (word.chars.length === 1 && word.chars[0] === ' ') {
            return <span key={`s${wIdx}`}>&nbsp;</span>;
          }
          return (
            <span
              key={`w${wIdx}`}
              style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            >
              {word.chars.map((ch, ci) => {
                const globalIdx = word.startIdx + ci;
                const isGlitched = scramble?.idx === globalIdx;
                return (
                  <motion.span
                    key={ci}
                    initial={{ rotateX: -92, y: -14, opacity: 0 }}
                    animate={
                      loaded
                        ? { rotateX: 0, y: 0, opacity: 1 }
                        : { rotateX: -92, y: -14, opacity: 0 }
                    }
                    transition={{
                      duration: 0.9,
                      ease:     [0.22, 1, 0.36, 1],
                      delay:    0.25 + globalIdx * 0.055,
                    }}
                    style={{
                      display:         'inline-block',
                      transformOrigin: '50% 100%',
                      ...(isGlitched
                        ? {
                            color:      '#5CE1FF',
                            textShadow: '0 0 22px rgba(92,225,255,0.9), 0 0 5px rgba(92,225,255,1)',
                          }
                        : undefined),
                    }}
                  >
                    {isGlitched ? scramble.char : ch}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
        {/* Blinking terminal cursor */}
        {loaded && (
          <span
            aria-hidden
            className="inline-block align-[-0.1em] ml-2"
            style={{
              width:      '0.4em',
              height:     '0.85em',
              background: cursorOn ? '#5CE1FF' : 'transparent',
              boxShadow:  cursorOn
                ? '0 0 16px rgba(92,225,255,0.9), 0 0 4px rgba(92,225,255,1)'
                : 'none',
              transition: 'none',
            }}
          />
        )}
      </h1>

      {/* Scan reveal overlay — cyan text layer synced to the scan line,
          revealed from top as the beam passes down through the headline. */}
      {loaded && (
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
          animate={{
            clipPath: [
              'inset(0 0 100% 0)',  // fully masked (scan above text)
              'inset(0 0 100% 0)',  // still masked until scan enters
              'inset(0 0 0% 0)',    // fully revealed when scan exits bottom
              'inset(0 0 0% 0)',    // hold briefly
              'inset(100% 0 0% 0)', // mask from top (reverse fade)
            ],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration:    1.8,
            times:       [0, 0.12, 0.88, 0.92, 1],
            repeat:      Infinity,
            repeatDelay: 3.5,
            ease:        'linear',
            delay:       2.5,
          }}
        >
          <h1
            aria-hidden
            className="text-[2.75rem] leading-[1.1] md:text-7xl lg:text-[6rem]"
            style={{
              fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
              fontWeight:          500,
              letterSpacing:       '-0.015em',
              WebkitFontSmoothing: 'antialiased',
              color:               '#5CE1FF',
              textShadow:
                '0 0 18px rgba(92,225,255,0.85), 0 0 6px rgba(92,225,255,1), 0 0 32px rgba(92,225,255,0.45)',
            }}
          >
            {chars.map((ch, i) => (ch === ' ' ? <span key={i}>&nbsp;</span> : <span key={i}>{ch}</span>))}
          </h1>
        </motion.div>
      )}

      {/* Horizontal scan line sweeping across the headline */}
      {loaded && (
        <motion.div
          aria-hidden
          className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(92,225,255,0.85) 25%, #5CE1FF 50%, rgba(92,225,255,0.85) 75%, transparent)',
            boxShadow:    '0 0 20px rgba(92,225,255,1), 0 0 4px rgba(92,225,255,1)',
            mixBlendMode: 'screen',
          }}
          animate={{
            top:     ['-5%', '105%'],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration:    1.8,
            repeat:      Infinity,
            repeatDelay: 3.5,
            ease:        'easeIn',
            delay:       2.5,
            times:       [0, 0.12, 0.5, 0.88, 1],
          }}
        />
      )}
    </div>
  );
}
