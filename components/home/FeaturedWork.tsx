'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
  useInView,
  animate,
  type MotionValue,
} from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { CASES, type Case } from '@/lib/work-data';
import GlitchText from '@/components/shared/GlitchText';

const FEATURED = CASES.slice(0, 3);

export default function FeaturedWork() {
  return (
    <>
      {/* ── Intro ─────────────────────────────────────── */}
      <FeaturedIntro />

      {FEATURED.map((c) => (
        <CaseSection key={c.id} c={c} />
      ))}
    </>
  );
}

// ── Intro: terminal header + typography-first stats ────
function FeaturedIntro() {
  return (
    <section id="featured" className="relative pt-40 pb-28 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Meta row — SELECTED WORK + RUNTIME close together */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex items-center gap-5 mb-10"
        >
          <span
            className="font-label text-[0.625rem] text-[#5CE1FF]/80 tracking-[0.28em]"
            style={{ textShadow: '0 0 12px rgba(92,225,255,0.45)' }}
          >
            {'// SELECTED WORK'}
          </span>
          <span className="font-label text-[0.5625rem] text-white/30 tracking-[0.22em]">
            ·&nbsp;&nbsp;RUNTIME&nbsp;//&nbsp;<span className="text-[#5CE1FF]/70">2024</span>
          </span>
        </motion.div>

        {/* Headline row — tight grouping, left-aligned */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10 mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-light text-white text-4xl md:text-5xl lg:text-6xl leading-[1.02] max-w-xl"
          >
            Three chapters,
            <br />
            one signature.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
            className="font-label text-[0.6875rem] text-white/45 md:max-w-xs leading-relaxed md:pb-3"
          >
            Recent work spanning immersive brand experiences,
            large-scale events, and corporate gatherings.
          </motion.p>
        </div>

        {/* Typography-first stats — big editorial numbers, no bar charts */}
        <div>
          <p className="font-label text-[0.5625rem] text-white/30 mb-10 tracking-[0.22em]">
            [ FEATURED // 03 SIGNALS ]
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
            {FEATURED.map((c, i) => (
              <StatCard key={c.id} caseData={c} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ caseData, index }: { caseData: Case; index: number }) {
  const primaryStat = caseData.stats[0];

  // Parse "2,000+" → num=2000, suffix="+" so the count-up can render it back formatted
  const match     = primaryStat.value.match(/^([\d,]+)(.*)$/);
  const targetNum = match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
  const suffix    = match ? match[2] : '';
  const staticVal = targetNum === null ? primaryStat.value : null;

  // Count-up display (only runs once, lives for the component lifetime)
  const mv = useMotionValue(0);
  const [countDisplay, setCountDisplay] = useState(0);
  // Burst state — periodic glitch frame (doesn't touch count-up state)
  const [burstScramble, setBurstScramble] = useState<string | null>(null);
  const [burstFx, setBurstFx] = useState(false);

  const cardRef    = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { amount: 0.4 });

  // ── Count-up: fires ONCE when the card first enters view ──
  const countStartedRef = useRef(false);
  useEffect(() => {
    if (!cardInView || countStartedRef.current || targetNum === null) return;
    countStartedRef.current = true;
    const controls = animate(mv, targetNum, {
      duration: 1.4,
      delay:    0.2 + index * 0.15,
      ease:     [0.22, 1, 0.36, 1],
    });
    const unsub = mv.on('change', (v) => setCountDisplay(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
  }, [cardInView, targetNum, index, mv]);

  // ── Burst scheduler (fires after count-up is done, does NOT re-count) ──
  useEffect(() => {
    if (!cardInView) return;
    let cancelled = false;
    let next: ReturnType<typeof setTimeout>;
    let reset: ReturnType<typeof setTimeout>;

    const fire = () => {
      if (cancelled) return;
      const scrambled = [...primaryStat.value]
        .map((c) =>
          /\d/.test(c)
            ? STAT_GLITCH[Math.floor(Math.random() * STAT_GLITCH.length)]
            : c,
        )
        .join('');
      setBurstScramble(scrambled);
      setBurstFx(true);
      reset = setTimeout(() => {
        if (cancelled) return;
        setBurstScramble(null);
        setBurstFx(false);
      }, 180);
      next = setTimeout(fire, 3800 + Math.random() * 2200);
    };

    // Kickoff well after count-up finishes (count-up ~1.4s + delay ~0.5s)
    const kickoff = setTimeout(fire, 2800 + index * 700);
    return () => {
      cancelled = true;
      clearTimeout(kickoff);
      clearTimeout(next);
      clearTimeout(reset);
    };
  }, [cardInView, index, primaryStat.value]);

  // What to actually show
  const displayText =
    burstScramble !== null
      ? burstScramble
      : staticVal !== null
        ? staticVal
        : `${countDisplay.toLocaleString()}${suffix}`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 1.1,
        ease:     [0.22, 1, 0.36, 1],
        delay:    0.15 + index * 0.12,
      }}
      className="relative flex flex-col"
    >
      {/* Giant ambient index behind */}
      <span
        aria-hidden
        className="absolute -top-6 -left-2 font-display font-light text-white/[0.04] leading-none pointer-events-none select-none"
        style={{ fontSize: 'clamp(7rem, 14vw, 11rem)' }}
      >
        0{index + 1}
      </span>

      <span className="relative font-label text-[0.5rem] text-[#5CE1FF]/70 mb-5 tracking-[0.28em]">
        [ 0{index + 1} ]
      </span>
      <p
        className="relative font-display font-light leading-[0.95] mb-4 origin-left tabular-nums"
        style={{
          fontSize:   'clamp(3.5rem, 8vw, 6.5rem)',
          color:      burstScramble !== null ? '#5CE1FF' : '#FFFFFF',
          textShadow: burstFx
            ? '-5px 0 0 rgba(255, 40, 120, 1), 5px 0 0 rgba(60, 255, 255, 1), 0 0 40px rgba(92,225,255,0.9)'
            : '0 0 22px rgba(8,8,8,0.85), 0 0 14px rgba(92,225,255,0.18)',
          transform:  burstFx ? 'scale(1.06) translate3d(-3px, 0, 0)' : 'scale(1)',
          filter:     burstFx ? 'brightness(1.35)' : 'brightness(1)',
          transition: 'text-shadow 30ms linear, transform 80ms linear, filter 60ms linear, color 30ms linear',
        }}
      >
        {displayText}
      </p>
      <div
        className="relative h-px w-12 bg-[#5CE1FF]/60 mb-4"
        style={{ boxShadow: '0 0 6px rgba(92,225,255,0.7)' }}
      />
      <p className="relative font-label text-[0.625rem] text-white/60 tracking-[0.2em] mb-6">
        {primaryStat.labelEn}
      </p>
      <div className="relative flex items-baseline gap-2 font-label text-[0.5625rem] tracking-[0.2em]">
        <span className="text-white/40">{caseData.id}</span>
        <span className="text-white/15">/</span>
        <span className="text-[#5CE1FF]/80">[ {caseData.type} ]</span>
      </div>
    </motion.div>
  );
}


// ── Single case, scroll-linked editorial layout ─────────
function CaseSection({ c }: { c: Case }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Meta row — enters earlier
  const metaOpacity = useTransform(scrollYProgress, [0.10, 0.22], [0, 1]);
  const metaY       = useTransform(scrollYProgress, [0.10, 0.22], [28, 0]);
  const metaLineW   = useTransform(scrollYProgress, [0.14, 0.30], ['0%', '100%']);

  // Subtitle
  const subOpacity = useTransform(scrollYProgress, [0.28, 0.35], [0, 1]);
  const subY       = useTransform(scrollYProgress, [0.28, 0.35], [18, 0]);
  const [subTriggered, setSubTriggered] = useState(false);
  const subFiredRef = useRef(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!subFiredRef.current && v >= 0.30) {
      subFiredRef.current = true;
      setSubTriggered(true);
    }
  });

  // Divider line
  const dividerW = useTransform(scrollYProgress, [0.30, 0.40], ['0%', '100%']);

  // Stats
  const statsOpacity = useTransform(scrollYProgress, [0.32, 0.42], [0, 1]);
  const statsY       = useTransform(scrollYProgress, [0.32, 0.42], [24, 0]);

  // Desc + CTA — now much earlier (was 0.54-0.64, too late)
  const footOpacity = useTransform(scrollYProgress, [0.38, 0.48], [0, 1]);

  const year = c.date.slice(0, 4);
  const titleChars = c.title.split('');

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full py-24 md:py-28">
        {/* Meta — case id + type + year together, line extends right */}
        <motion.div
          style={{ opacity: metaOpacity, y: metaY }}
          className="flex items-center gap-4 md:gap-5 mb-14 md:mb-20"
        >
          <span
            className="font-label text-[#5CE1FF]"
            style={{
              fontSize:      '0.6875rem',
              letterSpacing: '0.2em',
              textShadow:    '0 0 10px rgba(92,225,255,0.5)',
            }}
          >
            {c.id}&nbsp;/&nbsp;[ {c.type} ]
          </span>
          <span
            className="font-label text-white/50 tracking-[0.22em]"
            style={{ fontSize: '0.625rem' }}
          >
            ·&nbsp;&nbsp;{year}
          </span>
          <div className="hidden md:block relative h-px flex-1 max-w-xs overflow-hidden">
            <motion.div
              style={{ width: metaLineW }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#5CE1FF]/60 to-transparent"
            />
          </div>
        </motion.div>

        {/* Title — per-character blur→focus stagger */}
        <h3 className="font-display font-light text-white leading-[0.98] tracking-tight text-[11vw] md:text-[7.5vw] lg:text-[5.75rem] mb-5 flex flex-wrap">
          {titleChars.map((ch, i) => (
            <TitleChar key={i} ch={ch} index={i} total={titleChars.length} progress={scrollYProgress} />
          ))}
        </h3>

        {/* English subtitle — scramble decode on enter */}
        <motion.p
          style={{ opacity: subOpacity, y: subY }}
          className="font-display text-white/55 text-base md:text-lg lg:text-xl font-light italic tracking-wide mb-14 md:mb-16"
        >
          {subTriggered ? (
            <GlitchText text={c.titleEn} key={c.titleEn} speed={26} once />
          ) : (
            <span className="opacity-0">{c.titleEn}</span>
          )}
        </motion.p>

        {/* Divider + stats */}
        <div className="max-w-3xl mb-12">
          <motion.div
            style={{ width: dividerW }}
            className="h-px bg-gradient-to-r from-white/[0.18] to-white/[0.02] mb-10"
          />
          <motion.div
            style={{ opacity: statsOpacity, y: statsY }}
            className="grid grid-cols-3 gap-6 md:gap-10"
          >
            {c.stats.map((stat, i) => (
              <CaseStatCell
                key={stat.labelEn}
                stat={stat}
                index={i}
              />
            ))}
          </motion.div>
        </div>

        {/* Desc + CTA — stacked tight, left-aligned under stats */}
        <motion.div
          style={{ opacity: footOpacity }}
          className="max-w-xl"
        >
          <p className="font-label text-white/55 text-[0.75rem] tracking-[0.1em] leading-relaxed mb-6">
            {c.desc}
          </p>
          <Link
            href={`/work/${c.slug}`}
            className="group inline-flex items-center gap-4 font-label text-[0.6875rem] text-white hover:text-[#5CE1FF] border-b border-white/25 hover:border-[#5CE1FF]/70 pb-2 tracking-[0.22em] transition-colors"
          >
            <span>READ CASE</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ── Case section stat cell: chromatic flicker + digit scramble ──
const STAT_GLITCH = '!<>/#@%&*'.split('');

function CaseStatCell({
  stat,
  index,
}: {
  stat: { value: string; labelEn: string };
  index: number;
}) {
  // Scramble one random digit of the stat every few seconds
  const [scramble, setScramble] = useState<{ pos: number; ch: string } | null>(null);
  // Chromatic RGB split flicker — brief red/blue offset, fires independently
  const [chromatic, setChromatic] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  // Digit scramble scheduler
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    let next: ReturnType<typeof setTimeout>;
    let reset: ReturnType<typeof setTimeout>;

    const fire = () => {
      if (cancelled) return;
      const digitIndexes: number[] = [];
      [...stat.value].forEach((c, i) => {
        if (/\d/.test(c)) digitIndexes.push(i);
      });
      if (digitIndexes.length === 0) {
        next = setTimeout(fire, 4000 + Math.random() * 3000);
        return;
      }
      const pos = digitIndexes[Math.floor(Math.random() * digitIndexes.length)];
      const ch  = STAT_GLITCH[Math.floor(Math.random() * STAT_GLITCH.length)];
      setScramble({ pos, ch });
      reset = setTimeout(() => !cancelled && setScramble(null), 110);
      next  = setTimeout(fire, 3500 + Math.random() * 3000);
    };

    const kickoff = setTimeout(fire, 2500 + index * 700);
    return () => {
      cancelled = true;
      clearTimeout(kickoff);
      clearTimeout(next);
      clearTimeout(reset);
    };
  }, [inView, stat.value, index]);

  // Chromatic split flicker scheduler
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    let next: ReturnType<typeof setTimeout>;
    let reset: ReturnType<typeof setTimeout>;

    const fire = () => {
      if (cancelled) return;
      setChromatic(true);
      reset = setTimeout(() => !cancelled && setChromatic(false), 100 + Math.random() * 60);
      next  = setTimeout(fire, 4000 + Math.random() * 2500);
    };

    const kickoff = setTimeout(fire, 3200 + index * 900);
    return () => {
      cancelled = true;
      clearTimeout(kickoff);
      clearTimeout(next);
      clearTimeout(reset);
    };
  }, [inView, index]);

  return (
    <div ref={ref} className="flex flex-col">
      <span className="font-label text-[0.5rem] text-white/25 mb-3 tracking-[0.22em]">
        [ 0{index + 1} ]
      </span>
      <p
        className="relative font-display text-[#5CE1FF] font-light text-3xl md:text-4xl lg:text-5xl leading-none mb-3"
        style={{
          textShadow: chromatic
            ? '-2px 0 0 rgba(255, 40, 120, 0.95), 2px 0 0 rgba(60, 255, 255, 0.95), 0 0 18px rgba(92,225,255,0.55)'
            : '0 0 18px rgba(92,225,255,0.4)',
          transition: 'text-shadow 30ms linear',
        }}
      >
        {[...stat.value].map((ch, i) => {
          const isGlitched = scramble?.pos === i;
          return (
            <span
              key={i}
              style={
                isGlitched
                  ? {
                      color:      '#FFFFFF',
                      textShadow:
                        '0 0 18px rgba(92,225,255,0.95), 0 0 4px rgba(92,225,255,1)',
                    }
                  : undefined
              }
            >
              {isGlitched ? scramble.ch : ch}
            </span>
          );
        })}
      </p>
      <p className="font-label text-[0.5625rem] text-white/45 tracking-[0.15em]">
        {stat.labelEn}
      </p>
    </div>
  );
}

// ── Per-character title reveal tied to scroll ──────────
function TitleChar({
  ch,
  index,
  total,
  progress,
}: {
  ch: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each char has a small window along scroll progress
  const start = 0.22 + (index / total) * 0.18;
  const end   = start + 0.14;

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y       = useTransform(progress, [start, end], [28, 0]);
  const blur    = useTransform(progress, [start, end], [8, 0]);
  const filter  = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.span
      style={{ opacity, y, filter, display: 'inline-block' }}
    >
      {ch}
    </motion.span>
  );
}

