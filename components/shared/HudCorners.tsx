/**
 * Four corner L-brackets for HUD framing. Parent must be `relative`.
 */
export default function HudCorners() {
  return (
    <>
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={[
            'absolute w-3 h-3 pointer-events-none z-10',
            pos.includes('t') ? '-top-[1px]' : '-bottom-[1px]',
            pos.includes('l') ? '-left-[1px]' : '-right-[1px]',
          ].join(' ')}
        >
          <span
            className="absolute w-full h-px bg-[#5CE1FF]/50"
            style={{ [pos.includes('t') ? 'top' : 'bottom']: 0 }}
          />
          <span
            className="absolute w-px h-full bg-[#5CE1FF]/50"
            style={{ [pos.includes('l') ? 'left' : 'right']: 0 }}
          />
        </span>
      ))}
    </>
  );
}
