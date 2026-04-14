'use client';

import DraggableWindow from '@/components/shared/DraggableWindow';

const RESUME_URL = 'https://www.linkedin.com/in/evan-chang';

export default function ResumeQRWindow({
  initialX,
  initialY,
  rotate,
}: {
  initialX: number;
  initialY: number;
  rotate?: number;
}) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(RESUME_URL)}&color=5DD3E3&bgcolor=0B1026`;

  return (
    <DraggableWindow
      title="resume.qr"
      filename="042.qr"
      initialX={initialX}
      initialY={initialY}
      width={220}
      rotate={rotate}
      accent="#5DD3E3"
    >
      <div className="p-4 flex flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt="Scan to open resume / LinkedIn"
          width={184}
          height={184}
          style={{ display: 'block', width: 184, height: 184 }}
        />
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 9,
            letterSpacing: '0.3em',
            color: 'rgba(93,211,227,0.65)',
            textAlign: 'center',
          }}
        >
          [ SCAN · RESUME ↗ ]
        </div>
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noreferrer"
          data-cursor="↗ EXTERNAL"
          data-cursor-variant="link"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 9,
            letterSpacing: '0.22em',
            color: 'rgba(250,250,248,0.55)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            borderTop: '1px solid rgba(250,250,248,0.08)',
            paddingTop: 8,
            width: '100%',
            textAlign: 'center',
          }}
        >
          or click · linkedin ↗
        </a>
      </div>
    </DraggableWindow>
  );
}
