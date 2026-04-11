'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LoadingIntro from './LoadingIntro';
import ScrollIndicator from './ScrollIndicator';

// Role → Work filter type. Clicking a role on the subheading jumps to
// /work with the filter pre-set via ?type= query param.
const ROLE_TYPE: Record<string, 'BRAND' | 'EVENT' | 'CORP'> = {
  '企劃':        'BRAND',
  '統籌':        'EVENT',
  '顧問':        'CORP',
  'Planner':     'BRAND',
  'Producer':    'EVENT',
  'Consultant':  'CORP',
};

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

  // ── Subheading static (serif + dividers) ──────────
  const subheading = t('subheading');
  const roles      = subheading.split(/\s*·\s*/).filter(Boolean);

  // ── EVAN CHANG flicker + horizontal tear glitch ────
  const [labelFlicker, setLabelFlicker] = useState(false);
  const [labelTear, setLabelTear] = useState(0);

  // ── EVENTS ghost horizontal slice glitch ──────────
  const [ghostGlitch, setGhostGlitch] = useState<{
    top: number;
    height: number;
    x: number;
  } | null>(null);

  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;

    const scheduleFlicker = () => {
      const delay = 3200 + Math.random() * 3800;
      return setTimeout(() => {
        if (cancelled) return;
        // Burst: on → off → on → off (quick strobe)
        setLabelFlicker(true);
        setTimeout(() => !cancelled && setLabelFlicker(false), 55);
        setTimeout(() => !cancelled && setLabelFlicker(true),  110);
        setTimeout(() => !cancelled && setLabelFlicker(false), 170);
        scheduleFlicker();
      }, delay);
    };

    const scheduleTear = () => {
      const delay = 4500 + Math.random() * 4500;
      return setTimeout(() => {
        if (cancelled) return;
        const offset = (Math.random() * 6) - 3; // -3 ~ +3 px
        setLabelTear(offset);
        setTimeout(() => !cancelled && setLabelTear(0), 75);
        scheduleTear();
      }, delay);
    };

    const scheduleGhostGlitch = () => {
      const delay = 4200 + Math.random() * 4500;
      return setTimeout(() => {
        if (cancelled) return;
        // Pick a random narrow horizontal slice of the EVENTS text and
        // displace it horizontally — classic video-signal tear.
        setGhostGlitch({
          top:    Math.random() * 75,
          height: 6 + Math.random() * 14,
          x:      (Math.random() - 0.5) * 36,
        });
        setTimeout(() => !cancelled && setGhostGlitch(null), 110);
        // Sometimes fire a second micro-glitch 60-140ms later
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

    const t1 = scheduleFlicker();
    const t2 = scheduleTear();
    const t3 = scheduleGhostGlitch();

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [loaded]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative h-screen -mt-14 flex items-center justify-center overflow-hidden"
    >
      {/* Layer 0: Loading intro */}
      <LoadingIntro onComplete={() => setLoaded(true)} />

      {/* Layer 1: Ghost text EVENTS — sits behind the headline, nudged up
          so it reads as the headline's atmospheric backdrop rather than
          centering across the full hero block */}
      <motion.div
        style={{ y: ghostY, opacity: ghostOpacity, paddingBottom: '18vh' }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <div className="relative inline-block leading-none">
          <motion.span
            className="font-bold text-[22vw] leading-none whitespace-nowrap text-white/[0.028] block"
            style={{ fontFamily: 'var(--font-geist), "Chiron Sung HK WS", sans-serif', WebkitFontSmoothing: 'antialiased' }}
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

          {/* Static CRT horizontal scanline overlay */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-multiply"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(8,8,8,0.6) 0px, rgba(8,8,8,0.6) 2px, transparent 2px, transparent 5px)',
            }}
          />

          {/* Horizontal slice noise glitch — fires on random intervals */}
          {loaded && ghostGlitch && (
            <span
              aria-hidden
              className="absolute inset-0 font-bold text-[22vw] leading-none whitespace-nowrap block pointer-events-none"
              style={{
                fontFamily:   'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                WebkitFontSmoothing: 'antialiased',
                color:        'rgba(92, 225, 255, 0.18)',
                clipPath:     `inset(${ghostGlitch.top}% 0 ${100 - ghostGlitch.top - ghostGlitch.height}% 0)`,
                transform:    `translate3d(${ghostGlitch.x}px, 0, 0)`,
                mixBlendMode: 'screen',
                textShadow:
                  '-2px 0 0 rgba(255, 40, 120, 0.22), 2px 0 0 rgba(60, 255, 255, 0.22)',
              }}
            >
              EVENTS
            </span>
          )}
        </div>
      </motion.div>

      {/* Layer 2: Hero content — blur→focus after load */}
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
        {/* Dark radial backdrop behind headline — separates it from EVENTS ghost */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            top:        '45%',
            transform:  'translate(-50%, -50%)',
            width:      'min(1100px, 100vw)',
            height:     'min(560px, 65vh)',
            background:
              'radial-gradient(ellipse at center, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.7) 35%, rgba(8,8,8,0.3) 60%, transparent 85%)',
          }}
        />
        <div className="relative">
        {/* Headline — scan line + letter scramble + blinking cursor */}
        <HeadlineWithMotion text={t('headline')} loaded={loaded} />

        {/* EVAN CHANG signature — placed BELOW headline so it functions
            as the byline/brand reinforcement after the main claim */}
        <p
          className="text-[#5CE1FF] mt-8 md:mt-10 mb-8 md:mb-10 uppercase"
          style={{
            fontFamily:    'var(--font-mono), monospace',
            fontSize:      'clamp(22px, 2.4vw, 33px)',
            letterSpacing: '0.42em',
            textShadow:    '0 0 20px rgba(92,225,255,0.6), 0 0 5px rgba(92,225,255,1)',
            transform:     `translate3d(${labelTear}px, 0, 0)`,
            opacity:       labelFlicker ? 0.15 : 1,
            transition:    'transform 40ms linear, opacity 20ms linear',
          }}
        >
          EVAN&nbsp;&nbsp;·&nbsp;&nbsp;CHANG
        </p>

        {/* Subheading — serif + divider, hover reveals decoded translation */}
        <SubheadingHoverReveal roles={roles} />
        </div>
      </motion.div>

      {/* Layer 3: Scroll indicator */}
      {loaded && <ScrollIndicator />}
    </section>
  );
}

// ── Subheading: 活動企劃 │ 統籌 │ 顧問 — each role links to /work?type=X ──
function SubheadingHoverReveal({ roles }: { roles: string[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <p
      className="font-display text-white/55 flex items-center justify-center gap-5 md:gap-7"
      style={{
        fontSize:      'clamp(1rem, 1.4vw, 1.35rem)',
        letterSpacing: '0.14em',
        fontWeight:    300,
        textShadow:    '0 0 20px rgba(8,8,8,0.8)',
      }}
    >
      {roles.map((role, i) => {
        const isActive = hovered === role;
        const type = ROLE_TYPE[role];
        return (
          <span key={role} className="inline-flex items-center gap-5 md:gap-7">
            {i > 0 && (
              <span
                aria-hidden
                className="inline-block w-px h-4 md:h-5 bg-white/20"
              />
            )}
            <Link
              href={type ? `/work?type=${type}` : '/work'}
              onMouseEnter={() => setHovered(role)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(role)}
              onBlur={() => setHovered(null)}
              className="relative inline-block px-1 py-0.5"
              aria-label={`View ${role} work`}
            >
              <motion.span
                className="relative inline-block"
                animate={{
                  color: isActive ? '#5CE1FF' : 'rgba(255,255,255,0.55)',
                  textShadow: isActive
                    ? '0 0 18px rgba(92,225,255,0.8), 0 0 4px rgba(92,225,255,1), 0 0 20px rgba(8,8,8,0.8)'
                    : '0 0 20px rgba(8,8,8,0.8)',
                  y: isActive ? -3 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {role}
              </motion.span>
              {/* Sliding underline — uses layoutId so it animates between roles */}
              {isActive && (
                <motion.span
                  layoutId="subheading-underline"
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-0.5 h-px bg-[#5CE1FF]"
                  style={{
                    boxShadow:
                      '0 0 10px rgba(92,225,255,0.95), 0 0 2px rgba(92,225,255,1)',
                  }}
                  transition={{
                    type:      'spring',
                    stiffness: 420,
                    damping:   32,
                  }}
                />
              )}
            </Link>
          </span>
        );
      })}
    </p>
  );
}

// ── Headline with scan line + random letter scramble + cursor ───
const HEADLINE_GLITCH_CHARS = '!<>/#@%&*'.split('');

function HeadlineWithMotion({ text, loaded }: { text: string; loaded: boolean }) {
  const chars = [...text];
  const [scramble, setScramble] = useState<{ idx: number; char: string } | null>(null);
  const [cursorOn, setCursorOn] = useState(true);

  // ── Periodic letter scramble (visible glitch on the headline) ──
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

  // ── Blinking cursor after the headline ──────────────
  useEffect(() => {
    if (!loaded) return;
    const id = setInterval(() => setCursorOn((v) => !v), 560);
    return () => clearInterval(id);
  }, [loaded]);

  return (
    <div className="relative inline-block mb-10 max-w-3xl mx-auto">
      <h1
        className="text-white text-[2.75rem] leading-[1.1] md:text-7xl lg:text-[6rem]"
        style={{
          fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
          fontWeight:          500,
          letterSpacing:       '-0.015em',
          WebkitFontSmoothing: 'antialiased',
          textShadow:
            '0 0 32px rgba(8,8,8,0.94), 0 0 12px rgba(8,8,8,0.85), 0 2px 18px rgba(8,8,8,0.7)',
        }}
      >
        {chars.map((ch, i) => {
          const isGlitched = scramble?.idx === i;
          return (
            <span
              key={i}
              style={
                isGlitched
                  ? {
                      color:      '#5CE1FF',
                      textShadow: '0 0 22px rgba(92,225,255,0.9), 0 0 5px rgba(92,225,255,1)',
                    }
                  : undefined
              }
            >
              {isGlitched ? scramble.char : ch}
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
