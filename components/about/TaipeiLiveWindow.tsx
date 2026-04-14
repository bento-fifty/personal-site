'use client';

import { useEffect, useState } from 'react';
import DraggableWindow from '@/components/shared/DraggableWindow';

function formatTpe(d: Date) {
  // Format in Asia/Taipei regardless of viewer TZ
  const s = d.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return s;
}

function getTpeParts(d: Date) {
  const dateStr = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' });
  const hour = Number(
    d.toLocaleString('en-GB', { timeZone: 'Asia/Taipei', hour: '2-digit', hour12: false }),
  );
  return { dateStr, hour };
}

export default function TaipeiLiveWindow({
  initialX,
  initialY,
  rotate,
}: {
  initialX: number;
  initialY: number;
  rotate?: number;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = formatTpe(now);
  const { dateStr, hour } = getTpeParts(now);
  const inWorkHours = hour >= 8 && hour < 20;
  const statusLabel = inWorkHours ? 'ON DUTY' : 'OUT OF HOURS';
  const statusColor = inWorkHours ? '#5DD3E3' : '#E63E1F';
  const statusNote = inWorkHours
    ? 'Reply within hours.'
    : 'Message still OK — reply at 08:00 TPE.';

  return (
    <DraggableWindow
      title="taipei.live"
      filename="tpe.sys"
      initialX={initialX}
      initialY={initialY}
      width={240}
      rotate={rotate}
      accent="#FAFAF8"
    >
      <div
        className="px-4 py-4"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        {/* Big time */}
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 36,
            letterSpacing: '0.02em',
            color: '#FAFAF8',
            lineHeight: 1,
            textAlign: 'center',
            marginBottom: 6,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {time}
        </div>
        <div
          style={{
            textAlign: 'center',
            color: 'rgba(250,250,248,0.45)',
            marginBottom: 14,
          }}
        >
          {dateStr} · TPE · UTC+8
        </div>

        {/* Status */}
        <div
          style={{
            borderTop: '1px solid rgba(250,250,248,0.08)',
            paddingTop: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              background: statusColor,
              boxShadow: `0 0 8px ${statusColor}`,
            }}
          />
          <span style={{ color: statusColor }}>{statusLabel}</span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
            textTransform: 'none',
            letterSpacing: '0.02em',
            color: 'rgba(250,250,248,0.6)',
            lineHeight: 1.4,
          }}
        >
          {statusNote}
        </div>
      </div>
    </DraggableWindow>
  );
}
