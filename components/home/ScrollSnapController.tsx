'use client';

import { useEffect } from 'react';

/**
 * ScrollSnapController — JS-driven fast-jump scroll hijack.
 *
 * CSS `scroll-snap-type: y mandatory` alone reads "soft" — the browser
 * only engages snap after scroll idles for a frame. Users wanted the
 * SynaBun feel: flick the wheel and the page *rushes* to the next
 * section's top with a committed ease curve.
 *
 * Strategy:
 * 1. Disable CSS scroll-snap (body takes over).
 * 2. Intercept wheel events on desktop. Small deltas pass through
 *    (so inside scroll-able children like the terminal body still
 *    scroll normally). Large deltas → pick direction, find next
 *    section id, `scrollTo` with smooth behaviour.
 * 3. Lock during in-flight scroll (`isScrolling`) so rapid wheel
 *    input doesn't stack multiple jumps.
 * 4. Keyboard: PageDown / PageUp / Arrow / Space all route through
 *    the same snap logic.
 * 5. Touch devices keep the native iOS/Android scroll — we don't
 *    hijack there, but CSS scroll-snap-type: y proximity still gives
 *    them a soft pull.
 */

const SECTION_IDS = [
  'hero',
  'toolbelt',
  'mission-log',
  'featured-ops',
  'showcase',
  'footprint',
  'console',
] as const;

export default function ScrollSnapController() {
  useEffect(() => {
    // Touch devices: native scroll + soft CSS snap only
    if (window.matchMedia('(pointer: coarse)').matches) {
      document.documentElement.style.scrollSnapType = 'y proximity';
      return;
    }

    // Desktop: disable CSS snap so we have full control
    document.documentElement.style.scrollSnapType = 'none';

    let isScrolling = false;
    let cooldown = 0;
    const SCROLL_LOCK_MS = 780;
    const WHEEL_THRESHOLD = 22;

    function getSections(): HTMLElement[] {
      return SECTION_IDS
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el);
    }

    function currentIdx(sections: HTMLElement[]): number {
      const anchor = window.scrollY + window.innerHeight * 0.35;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        const mid = s.offsetTop + s.offsetHeight / 2;
        const dist = Math.abs(mid - (window.scrollY + window.innerHeight / 2));
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
        // Also: if scrollY just passed this section's top, prefer it
        if (s.offsetTop <= anchor && s.offsetTop + s.offsetHeight > anchor) {
          best = i;
        }
      }
      return best;
    }

    function jumpTo(idx: number, sections: HTMLElement[]) {
      const target = sections[idx];
      if (!target) return;
      isScrolling = true;
      cooldown = Date.now() + SCROLL_LOCK_MS;
      window.scrollTo({
        top:      target.offsetTop,
        behavior: 'smooth',
      });
      // Release lock when smooth scroll should be done
      window.setTimeout(() => {
        isScrolling = false;
      }, SCROLL_LOCK_MS);
    }

    function step(dir: 1 | -1) {
      const sections = getSections();
      if (sections.length === 0) return;
      const idx = currentIdx(sections);
      const next = Math.max(0, Math.min(sections.length - 1, idx + dir));
      if (next === idx) return;
      jumpTo(next, sections);
    }

    function onWheel(e: WheelEvent) {
      // Allow small scrolls (e.g. inside terminal body / sidebar)
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      // Allow events originating from elements that need native scroll
      const target = e.target as HTMLElement | null;
      const scrollable = target?.closest?.('[data-allow-scroll="true"]');
      if (scrollable) return;

      const sections = getSections();
      if (sections.length === 0) return;
      const idx = currentIdx(sections);
      const direction: 1 | -1 = e.deltaY > 0 ? 1 : -1;

      // At the very bottom of the last section and scrolling down → let
      // native scroll handle the footer area so it's reachable + smooth.
      if (idx === sections.length - 1 && direction === 1) {
        const last = sections[sections.length - 1];
        const lastBottom = last.offsetTop + last.offsetHeight;
        if (window.scrollY + window.innerHeight >= lastBottom - 40) {
          return; // don't preventDefault — native scroll into footer
        }
      }

      // At the very top scrolling up → no hijack, allow overscroll
      if (idx === 0 && direction === -1 && window.scrollY < 20) {
        return;
      }

      if (isScrolling || Date.now() < cooldown) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      step(direction);
    }

    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (isScrolling) return;

      if (e.key === 'PageDown' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        const sections = getSections();
        if (sections.length) jumpTo(0, sections);
      } else if (e.key === 'End') {
        e.preventDefault();
        const sections = getSections();
        if (sections.length) jumpTo(sections.length - 1, sections);
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.scrollSnapType = '';
    };
  }, []);

  return null;
}
