'use client';

export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="font-label text-[0.625rem] text-white/35 hover:text-[#5CE1FF] transition-colors tracking-[0.2em] group"
    >
      [ <span className="group-hover:-translate-y-0.5 inline-block transition-transform">↑</span>&nbsp;&nbsp;BACK&nbsp;TO&nbsp;TOP&nbsp;]
    </button>
  );
}
