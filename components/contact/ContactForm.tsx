'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  locale: 'zh-TW' | 'en-US';
  variant?: 'compact' | 'wide';
}

const EMAIL_TO = 'evanchang818@gmail.com';

const COPY = {
  'zh-TW': {
    sub: '平均回覆 < 24 小時 · 台北 · UTC+8',
    nameLabel: '你怎麼稱呼？',
    namePh: '例如：Evan',
    emailLabel: '聯絡信箱',
    emailPh: 'your@email.com',
    orgLabel: '單位 / 品牌（optional）',
    orgPh: 'e.g. Nike Taiwan',
    typeLabel: '類型',
    scaleLabel: '規模',
    budgetLabel: '預算（NTD）',
    dateLabel: '目標日期',
    briefLabel: '你想做什麼？',
    briefPh: '簡單描述想像、需求、關鍵限制。沒有太細節沒關係，我會主動追問。',
    submit: '送出諮詢',
    ackTitle: '收到囉',
    ackLine1: '信件已丟進你的郵件 app · 請按送出',
    ackLine2: '收到後 24 小時內會回覆',
    ackReset: '再寫一封',
  },
  'en-US': {
    sub: 'Typical reply < 24hr · Taipei · UTC+8',
    nameLabel: 'Your name',
    namePh: 'e.g. Evan',
    emailLabel: 'Email',
    emailPh: 'your@email.com',
    orgLabel: 'Org / Brand (optional)',
    orgPh: 'e.g. Nike Taiwan',
    typeLabel: 'Project type',
    scaleLabel: 'Scale',
    budgetLabel: 'Budget (NTD)',
    dateLabel: 'Target date',
    briefLabel: 'What do you want to make?',
    briefPh: 'Quick sketch of the idea, need, or constraints. Rough is fine — I will ask.',
    submit: 'Transmit Request',
    ackTitle: 'Got it.',
    ackLine1: 'Draft opened in your mail app · Hit send',
    ackLine2: 'I reply within 24hr of receiving',
    ackReset: 'Send another',
  },
};

type Kind = 'BRAND' | 'CONFERENCE' | 'POPUP' | 'LAUNCH' | 'GALA' | 'CORPORATE';
type Scale = 'under-500' | '500-2000' | '2000-plus';
type Budget = 'under-1m' | '1-3m' | '3-10m' | '10m-plus';

const KIND_TILES: { key: Kind; label: string; hue: number; icon: string }[] = [
  { key: 'BRAND',      label: 'Brand',      hue: 14,  icon: '◆' },
  { key: 'CONFERENCE', label: 'Conference', hue: 200, icon: '≡' },
  { key: 'POPUP',      label: 'Pop-Up',     hue: 30,  icon: '⊡' },
  { key: 'LAUNCH',     label: 'Launch',     hue: 220, icon: '↑' },
  { key: 'GALA',       label: 'Gala',       hue: 8,   icon: '✦' },
  { key: 'CORPORATE',  label: 'Corporate',  hue: 180, icon: '□' },
];

const SCALE_TILES: { key: Scale; label: string; sub: string }[] = [
  { key: 'under-500',   label: '< 500',     sub: 'Intimate'  },
  { key: '500-2000',    label: '500–2000',  sub: 'Signature' },
  { key: '2000-plus',   label: '2000+',     sub: 'Arena'     },
];

const BUDGET_TILES: { key: Budget; label: string }[] = [
  { key: 'under-1m', label: '< 1M'  },
  { key: '1-3m',     label: '1–3M'  },
  { key: '3-10m',    label: '3–10M' },
  { key: '10m-plus', label: '10M+'  },
];

export default function ContactForm({ locale, variant = 'compact' }: Props) {
  const t = COPY[locale];
  const [kind, setKind] = useState<Kind | null>(null);
  const [scale, setScale] = useState<Scale | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const wide = variant === 'wide';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const org = String(fd.get('org') ?? '').trim();
    const date = String(fd.get('date') ?? '').trim();
    const brief = String(fd.get('brief') ?? '').trim();

    const subject = `[THE LEVEL STUDIO] ${kind ?? 'Enquiry'} — ${name || 'Unnamed'}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Organization: ${org || '-'}`,
      `Event kind: ${kind ?? '-'}`,
      `Scale: ${scale ?? '-'}`,
      `Budget: ${budget ?? '-'}`,
      `Preferred date: ${date || '-'}`,
      '',
      'Brief:',
      brief,
    ].join('\n');

    window.location.href = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false);
    setKind(null);
    setScale(null);
    setBudget(null);
  };

  return (
    <div className="relative">
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#5DD3E3',
          padding: '14px 18px 0',
        }}
      >
        — {t.sub} —
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 px-4 md:px-5 py-5"
          >
            <div className={wide ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
              <InputField label={t.nameLabel} name="name" placeholder={t.namePh} required />
              <InputField label={t.emailLabel} name="email" type="email" placeholder={t.emailPh} required />
              <div className={wide ? 'md:col-span-2' : ''}>
                <InputField label={t.orgLabel} name="org" placeholder={t.orgPh} />
              </div>
            </div>

            <FieldGroup label={t.typeLabel}>
              <div className={wide ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-2 gap-2'}>
                {KIND_TILES.map((k) => (
                  <KindTile
                    key={k.key}
                    active={kind === k.key}
                    hue={k.hue}
                    icon={k.icon}
                    label={k.label}
                    onClick={() => setKind(k.key)}
                  />
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label={t.scaleLabel}>
              <div className="grid grid-cols-3 gap-2">
                {SCALE_TILES.map((s) => (
                  <ScaleTile
                    key={s.key}
                    active={scale === s.key}
                    label={s.label}
                    sub={s.sub}
                    onClick={() => setScale(s.key)}
                  />
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label={t.budgetLabel}>
              <div className="flex flex-wrap gap-2">
                {BUDGET_TILES.map((b) => (
                  <BudgetPill
                    key={b.key}
                    active={budget === b.key}
                    label={b.label}
                    onClick={() => setBudget(b.key)}
                  />
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label={t.dateLabel}>
              <input
                type="date"
                name="date"
                className="bg-transparent"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  color: '#FAFAF8',
                  border: '1px solid rgba(250,250,248,0.18)',
                  padding: '8px 12px',
                  colorScheme: 'dark',
                  outline: 'none',
                }}
              />
            </FieldGroup>

            <FieldGroup label={t.briefLabel}>
              <textarea
                name="brief"
                required
                rows={wide ? 5 : 4}
                placeholder={t.briefPh}
                className="bg-transparent w-full"
                style={{
                  fontFamily: 'var(--font-display), serif',
                  fontVariationSettings: '"opsz" 18, "wght" 400',
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: '#FAFAF8',
                  border: '1px solid rgba(250,250,248,0.18)',
                  padding: '12px 14px',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </FieldGroup>

            <div className="flex justify-end pt-2">
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                data-cursor="▸ TRANSMIT"
                data-cursor-variant="primary"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 11,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#0B1026',
                  background: '#E63E1F',
                  border: '1px solid #E63E1F',
                  padding: '11px 20px',
                  cursor: 'pointer',
                  transition: 'background 120ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FF6B47';
                  e.currentTarget.style.borderColor = '#FF6B47';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#E63E1F';
                  e.currentTarget.style.borderColor = '#E63E1F';
                }}
              >
                [ {t.submit} → ]
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="ack"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="px-5 py-10"
            style={{
              border: '1px solid rgba(93,211,227,0.35)',
              background: 'rgba(93,211,227,0.04)',
              margin: 16,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#5DD3E3',
                marginBottom: 14,
              }}
            >
              [ ACK · TICKET #{String(Math.floor(Math.random() * 99999)).padStart(5, '0')} ]
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display), serif',
                fontVariationSettings: '"opsz" 72, "wght" 700',
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: '#FAFAF8',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                margin: 0,
                marginBottom: 12,
              }}
            >
              {t.ackTitle}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 11,
                letterSpacing: '0.05em',
                color: 'rgba(250,250,248,0.85)',
                marginBottom: 6,
              }}
            >
              &gt; {t.ackLine1}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 11,
                letterSpacing: '0.05em',
                color: 'rgba(250,250,248,0.55)',
                marginBottom: 20,
              }}
            >
              &gt; {t.ackLine2}
            </p>
            <button
              type="button"
              onClick={reset}
              data-cursor="▸ AGAIN"
              data-cursor-variant="link"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#5DD3E3',
                border: '1px solid #5DD3E3',
                padding: '10px 16px',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              [ {t.ackReset} ↺ ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span
        className="block mb-2"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.3em',
          color: 'rgba(93,211,227,0.7)',
          textTransform: 'uppercase',
        }}
      >
        &gt; {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="bg-transparent w-full"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 13,
          letterSpacing: '0.02em',
          color: '#FAFAF8',
          borderBottom: '1px solid rgba(250,250,248,0.22)',
          padding: '7px 0',
          outline: 'none',
        }}
      />
    </label>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="mb-3"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.3em',
          color: 'rgba(93,211,227,0.7)',
          textTransform: 'uppercase',
        }}
      >
        &gt; {label}
      </div>
      {children}
    </div>
  );
}

function KindTile({
  active,
  hue,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  hue: number;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="⊙ SELECT"
      data-cursor-variant="action"
      style={{
        aspectRatio: '5 / 3',
        background: `linear-gradient(135deg, hsl(${hue},48%,22%) 0%, hsl(${hue + 14},36%,10%) 100%)`,
        border: active ? '1px solid #5DD3E3' : '1px solid rgba(250,250,248,0.1)',
        padding: 10,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        transition: 'border-color 140ms, filter 140ms',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.borderColor = 'rgba(93,211,227,0.5)';
        e.currentTarget.style.filter = 'brightness(1.12)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.borderColor = 'rgba(250,250,248,0.1)';
        e.currentTarget.style.filter = 'brightness(1)';
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display), serif',
          fontVariationSettings: '"opsz" 36, "wght" 500',
          fontSize: 22,
          color: active ? '#5DD3E3' : '#FAFAF8',
          lineHeight: 1,
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.26em',
          color: '#FAFAF8',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </button>
  );
}

function ScaleTile({
  active,
  label,
  sub,
  onClick,
}: {
  active: boolean;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="⊙ SELECT"
      data-cursor-variant="action"
      style={{
        aspectRatio: '2 / 1',
        padding: 12,
        background: active ? 'rgba(93,211,227,0.08)' : 'transparent',
        border: active ? '1px solid #5DD3E3' : '1px solid rgba(250,250,248,0.12)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 140ms, background 0ms',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.borderColor = 'rgba(93,211,227,0.5)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.borderColor = 'rgba(250,250,248,0.12)';
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display), serif',
          fontVariationSettings: '"opsz" 48, "wght" 700',
          fontSize: 22,
          color: active ? '#5DD3E3' : '#FAFAF8',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 8,
          letterSpacing: '0.28em',
          color: 'rgba(250,250,248,0.45)',
          textTransform: 'uppercase',
        }}
      >
        {sub}
      </div>
    </button>
  );
}

function BudgetPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="⊙ SELECT"
      data-cursor-variant="action"
      style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: active ? '#0B1026' : '#FAFAF8',
        background: active ? '#5DD3E3' : 'transparent',
        border: `1px solid ${active ? '#5DD3E3' : 'rgba(250,250,248,0.15)'}`,
        padding: '7px 12px',
        cursor: 'pointer',
        transition: 'background 0ms, color 0ms, border-color 120ms',
      }}
    >
      {label}
    </button>
  );
}
