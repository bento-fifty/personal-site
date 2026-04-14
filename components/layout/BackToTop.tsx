'use client';

export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="text-[11px] text-[#888886] hover:text-[#EAEAE8] transition-colors tracking-[0.04em] group"
      style={{ fontFamily: 'var(--font-geist), sans-serif' }}
    >
      Back to top <span className="group-hover:-translate-y-0.5 inline-block transition-transform">&uarr;</span>
    </button>
  );
}
