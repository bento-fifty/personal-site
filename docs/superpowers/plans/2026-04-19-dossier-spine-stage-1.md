# Dossier Spine — Stage 1 (Skeleton) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立整站共用 Dossier Spine 骨架 — DossierHeader / DossierFooter + 4 個共用元件 + Case type 擴充 — 讓所有現存 route 套上統一的 declassified intel file chrome，不動任一 page 內容。

**Architecture:** 新增 `components/dossier/` 目錄共 7 檔（6 components + 1 pageConfig resolver）。DossierHeader 與 DossierFooter 皆為 client components、內部用 `usePathname` 從 pageConfig 解析當前 route 的 meta——這樣 `app/[locale]/layout.tsx` 只改一次，5 個 `page.tsx` 完全不動。舊 `components/layout/EditorialFooter.tsx` 不再被 import（保留檔案備查，Stage 2 再刪）。`lib/work-data.ts` 的 Case interface 加 optional `confidential` / `declassifiedAt` 欄位（redaction 與結案日元資料，Stage 2 才開始填值）。

**Tech Stack:** Next.js 16 (Turbopack), Tailwind v4, framer-motion, next-intl.

**Scope:** Stage 1 only — skeleton + shared components + data model + layout wiring. Stage 2（page-by-page language swap 含 OSER → BRIEF/OPS/EXECUTION/POST-ACTION、/work filter 加 CLEARANCE）與 Stage 3（motion/detail）將各自另開 plan。本 plan 不動任何 `page.tsx` 或 `components/{about,work,services,home}/*`。

**Verification strategy:** 本 repo 無 test framework。每 task 用 `npx tsc --noEmit` + `npm run lint` 當 fast gate；最終 Task 10 用 `npm run build` + `curl` smoke check + 人工 browser 巡頁作整合驗證。

---

## File Structure

**Created:**
- `components/dossier/pageConfig.ts` — route → `DossierPageMeta` resolver，含 `resolveDossierMeta(pathname)` function
- `components/dossier/DossierHeader.tsx` — top chrome（client，usePathname）
- `components/dossier/DossierFooter.tsx` — bottom chrome（client；繼承 EditorialFooter 的 copyEmail + available pulse，再加 dossier row）
- `components/dossier/CaseBadge.tsx` — case id inline chip（server）
- `components/dossier/SectionMark.tsx` — `§ xx · LABEL` 大章節記號（server）
- `components/dossier/RedactionBar.tsx` — redaction bar w/ hover reveal（client）
- `components/dossier/DeclassifiedStamp.tsx` — tilted flame stamp（server）

**Modified:**
- `lib/work-data.ts` — `Case` interface +2 optional 欄位（`confidential`, `declassifiedAt`）
- `app/[locale]/layout.tsx` — swap `<EditorialFooter />` → `<DossierFooter />`，在 `<main>` 開頭塞 `<DossierHeader />`

**Untouched:**
- `components/layout/EditorialFooter.tsx`（保留，未被引用）
- 所有 `app/[locale]/<route>/page.tsx`
- 所有 `components/{about,work,services,home}/*`

---

## Task 1: Extend Case type with confidential + declassifiedAt fields

**Files:**
- Modify: `lib/work-data.ts` (the `Case` interface block, approx lines 25-56)

- [ ] **Step 1: Open Case interface and locate insertion point**

Run: `grep -n "^export interface Case\b" lib/work-data.ts`
Expected: single match returning the line where `export interface Case {` starts (around line 25).

- [ ] **Step 2: Add two optional fields to Case interface**

In `lib/work-data.ts`, find the line `featured: boolean;` inside the `Case` interface. **Right after that line, insert:**

```ts
  // Dossier Spine — optional redaction / declass metadata
  confidential?: {
    client?: boolean;    // redact client name in RedactionBar
    budget?: boolean;    // redact budget fields
    fields?: string[];   // extra custom field keys to redact
  };
  declassifiedAt?: string;   // ISO year+quarter, e.g. "2027.Q1"
```

The resulting block should read (in order): `clusterLayout`, `featured`, new dossier block, then the `// Legacy compat` section.

- [ ] **Step 3: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`
Expected: exits 0 with no output.

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: no errors reported on `lib/work-data.ts`.

- [ ] **Step 5: Commit**

```bash
git add lib/work-data.ts
git commit -m "feat(dossier): extend Case type with confidential + declassifiedAt fields"
```

---

## Task 2: Create pageConfig.ts (route → meta resolver)

**Files:**
- Create: `components/dossier/pageConfig.ts`

- [ ] **Step 1: Write pageConfig.ts**

Create `components/dossier/pageConfig.ts` with this exact content:

```ts
// components/dossier/pageConfig.ts
// Route → Dossier page meta mapping. Used by DossierHeader and DossierFooter
// to self-resolve chrome data via usePathname — avoids every page.tsx having
// to pass meta props manually.

import { getCaseBySlug } from '@/lib/work-data';

export interface DossierPageMeta {
  /** Displayed in header's CASE field, e.g. "019" / "GEN-01" / "APX-B" / "COVER" / "ARCHIVE" */
  caseId: string;
  /** Section index shown after `§`, e.g. "01" / "02" / "02.019" / "APX-B" / "00" */
  sectionIndex: string;
  /** Human readable section label, e.g. "PERSONNEL FILE" */
  sectionName: string;
  /** Footer PG identifier — usually === sectionIndex, broken out for clarity */
  footerSectionIndex: string;
}

/** Total dossier sections; footer shows `PG xx / 07`. 07 reserves a slot for
 *  a future `/blog` § 03 · TRANSMISSION LOG reintroduction. */
export const DOSSIER_SECTION_TOTAL = 7;

export const dossierPageMeta = {
  home: {
    caseId: 'COVER',
    sectionIndex: '00',
    sectionName: 'COVER / BRIEF',
    footerSectionIndex: '00',
  },
  about: {
    caseId: 'GEN-01',
    sectionIndex: '01',
    sectionName: 'PERSONNEL FILE',
    footerSectionIndex: '01',
  },
  workArchive: {
    caseId: 'ARCHIVE',
    sectionIndex: '02',
    sectionName: 'CASE ARCHIVE',
    footerSectionIndex: '02',
  },
  services: {
    caseId: 'APX-B',
    sectionIndex: 'APX-B',
    sectionName: 'FIELD KIT',
    footerSectionIndex: 'APX-B',
  },
} as const satisfies Record<string, DossierPageMeta>;

/** Resolve meta from next-intl usePathname (locale-stripped, e.g. "/about"). */
export function resolveDossierMeta(pathname: string): DossierPageMeta {
  if (pathname === '/' || pathname === '') return dossierPageMeta.home;
  if (pathname === '/about') return dossierPageMeta.about;
  if (pathname === '/work') return dossierPageMeta.workArchive;
  if (pathname === '/services') return dossierPageMeta.services;
  if (pathname.startsWith('/work/')) {
    const slug = pathname.replace(/^\/work\//, '');
    const c = getCaseBySlug(slug);
    const id = c?.id ?? 'UNK';
    return {
      caseId: id,
      sectionIndex: `02.${id}`,
      sectionName: 'CASE FILE',
      footerSectionIndex: `02.${id}`,
    };
  }
  // Unknown route — fall back to home meta to avoid runtime crash.
  return dossierPageMeta.home;
}
```

- [ ] **Step 2: Verify `getCaseBySlug` export exists**

Run: `grep -n "^export function getCaseBySlug" lib/work-data.ts`
Expected: a match near line 320.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/dossier/pageConfig.ts
git commit -m "feat(dossier): pageConfig route→meta resolver"
```

---

## Task 3: Create <DossierHeader>

**Files:**
- Create: `components/dossier/DossierHeader.tsx`

Design constraints:
- Mono font, 10px, 0.25em tracking, uppercase
- Two rows of tight left-grouped items (NOT `justify-between` — user has rejected far-edge layouts 5+ times)
- Flame `#E63E1F` accent only on CLEARANCE letter; all other text in ink-over-dark neutrals
- Self-resolves meta via `usePathname`

- [ ] **Step 1: Write DossierHeader.tsx**

Create `components/dossier/DossierHeader.tsx`:

```tsx
// components/dossier/DossierHeader.tsx
'use client';

import { usePathname } from '@/i18n/navigation';
import { CASES } from '@/lib/work-data';
import { resolveDossierMeta } from './pageConfig';

export default function DossierHeader() {
  const pathname = usePathname();
  const meta = resolveDossierMeta(pathname);
  const caseTotal = String(CASES.length).padStart(3, '0');

  return (
    <header
      aria-label="Dossier header"
      data-dossier-section={meta.sectionIndex}
      className="px-5 md:px-8 py-3"
      style={{
        borderBottom: '1px solid rgba(250,250,248,0.08)',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 10,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(250,250,248,0.55)',
      }}
    >
      {/* Row 1 — studio · CASE */}
      <div className="flex items-center gap-3 flex-wrap">
        <span style={{ color: 'rgba(250,250,248,0.78)' }}>
          The Level Studio · TPE
        </span>
        <span aria-hidden style={{ color: 'rgba(250,250,248,0.25)' }}>/</span>
        <span>CASE · {meta.caseId} / {caseTotal}</span>
      </div>
      {/* Row 2 — § section · CLEARANCE */}
      <div className="flex items-center gap-3 flex-wrap mt-1.5">
        <span>§ {meta.sectionIndex} · {meta.sectionName}</span>
        <span aria-hidden style={{ color: 'rgba(250,250,248,0.25)' }}>/</span>
        <span>
          Clearance · <span style={{ color: '#E63E1F' }}>A</span>
        </span>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors on the new file.

- [ ] **Step 4: Commit**

```bash
git add components/dossier/DossierHeader.tsx
git commit -m "feat(dossier): DossierHeader with pathname-based meta resolve"
```

---

## Task 4: Create <DossierFooter> (merges EditorialFooter)

**Files:**
- Create: `components/dossier/DossierFooter.tsx`

Must preserve EditorialFooter 全部功能：
- `available-pulse` keyframes（ice dot 呼吸）
- `AVAILABLE for Q2·Q3 2026` 狀態字樣
- `evanchang818@gmail.com` click-to-copy button（navigator.clipboard），hover reveal `[ ▸ COPY ]`，copied 1600ms 顯示 `[ ✓ COPIED ]`
- `data-cursor` 與 `data-cursor-variant` attrs（給 CursorChip）
- `TPE · <year>` footer tag

新增 dossier row：
- `— END OF SECTION —`
- 傾斜 `[ DECLASSIFIED <year>.Q1 ]` 方塊（flame 邊框，-4deg 轉），值由 `declassifiedAt` or fallback `currentYear+1.Q1`
- `PG <footerSectionIndex> / 07`
- `TX · <ISO timestamp>` 搬到第二 row

- [ ] **Step 1: Write DossierFooter.tsx**

Create `components/dossier/DossierFooter.tsx`:

```tsx
// components/dossier/DossierFooter.tsx
// Merges legacy EditorialFooter (copy-email button, available pulse) with
// new dossier chrome row (— END OF SECTION — / DECLASSIFIED stamp / PG x/07).
// Self-resolves meta via usePathname like DossierHeader.
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { resolveDossierMeta, DOSSIER_SECTION_TOTAL } from './pageConfig';

const EMAIL = 'evanchang818@gmail.com';
const AVAIL_CONTEXT = 'Q2·Q3 2026';

export default function DossierFooter() {
  const pathname = usePathname();
  const meta = resolveDossierMeta(pathname);
  const year = new Date().getFullYear();
  const declass = `${year + 1}.Q1`;

  const [copied, setCopied] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [txNow, setTxNow] = useState('');

  // Compute TX timestamp on client only (avoid SSR / hydration mismatch).
  useEffect(() => {
    const iso = new Date()
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19); // "YYYY-MM-DD HH:MM:SS"
    setTxNow(iso);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      /* noop */
    }
  };

  return (
    <>
      <style>{`
        @keyframes available-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(93,211,227,0.55); opacity: 1; }
          50%      { box-shadow: 0 0 0 6px rgba(93,211,227,0); opacity: 0.6; }
        }
      `}</style>
      <footer
        aria-label="Dossier footer"
        className="px-5 md:px-8 py-4"
        style={{
          borderTop: '1px solid rgba(250,250,248,0.08)',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(250,250,248,0.55)',
        }}
      >
        {/* Row 1 — dossier chrome */}
        <div
          className="flex items-center gap-3 flex-wrap pb-3"
          style={{ borderBottom: '1px dashed rgba(250,250,248,0.08)' }}
        >
          <span>— End of Section —</span>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>·</span>
          <span
            style={{
              display: 'inline-block',
              border: '1px solid #E63E1F',
              color: '#E63E1F',
              padding: '2px 7px',
              fontSize: 9,
              letterSpacing: '0.3em',
              fontWeight: 700,
              transform: 'rotate(-4deg)',
            }}
          >
            Declassified {declass}
          </span>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>·</span>
          <span>
            PG {meta.footerSectionIndex} / {String(DOSSIER_SECTION_TOTAL).padStart(2, '0')}
          </span>
        </div>

        {/* Row 2 — available · email · TX · year */}
        <div className="flex items-center gap-3 flex-wrap pt-3">
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              background: '#5DD3E3',
              animation: 'available-pulse 2.4s ease-in-out infinite',
            }}
          />
          <span style={{ color: '#5DD3E3' }}>Available</span>
          <span style={{ color: 'rgba(250,250,248,0.3)' }}>for</span>
          <span style={{ color: 'rgba(250,250,248,0.75)' }}>{AVAIL_CONTEXT}</span>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>·</span>
          <button
            type="button"
            onClick={copyEmail}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            data-cursor={copied ? '✓ COPIED' : '▸ COPY EMAIL'}
            data-cursor-variant="action"
            aria-label={`Copy email ${EMAIL}`}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 11,
              letterSpacing: '0.22em',
              color: copied ? '#5DD3E3' : 'rgba(250,250,248,0.85)',
              transition: 'color 140ms ease-out',
              textTransform: 'none',
            }}
          >
            {EMAIL}
          </button>
          {(copied || hovering) && (
            <span style={{ color: '#5DD3E3', fontSize: 9, letterSpacing: '0.28em' }}>
              {copied ? '[ ✓ COPIED ]' : '[ ▸ COPY ]'}
            </span>
          )}
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>·</span>
          <span style={{ color: 'rgba(250,250,248,0.35)' }}>TX · {txNow || '—'}</span>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>·</span>
          <span style={{ color: 'rgba(250,250,248,0.35)' }}>TPE · {year}</span>
        </div>
      </footer>
    </>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/dossier/DossierFooter.tsx
git commit -m "feat(dossier): DossierFooter merges EditorialFooter + adds dossier chrome row"
```

---

## Task 5: Create <CaseBadge>

**Files:**
- Create: `components/dossier/CaseBadge.tsx`

- [ ] **Step 1: Write CaseBadge.tsx**

```tsx
// components/dossier/CaseBadge.tsx
// Small chip shown on case cards / case links in the archive.

export interface CaseBadgeProps {
  caseId: string;
  /** "declassified" = flame dot, paper-side styling (default);
   *  "active" = ice dot, used for in-progress cases */
  status?: 'declassified' | 'active';
  className?: string;
}

export default function CaseBadge({
  caseId,
  status = 'declassified',
  className,
}: CaseBadgeProps) {
  const isActive = status === 'active';
  return (
    <span
      className={className}
      aria-label={`Case ${caseId}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 9,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: isActive ? '#5DD3E3' : 'rgba(250,250,248,0.72)',
        border: `1px solid ${isActive ? 'rgba(93,211,227,0.4)' : 'rgba(250,250,248,0.15)'}`,
        padding: '2px 7px',
      }}
    >
      <span aria-hidden style={{ color: isActive ? '#5DD3E3' : '#E63E1F' }}>●</span>
      CASE · {caseId}
    </span>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add components/dossier/CaseBadge.tsx
git commit -m "feat(dossier): CaseBadge inline chip component"
```

---

## Task 6: Create <SectionMark>

**Files:**
- Create: `components/dossier/SectionMark.tsx`

- [ ] **Step 1: Write SectionMark.tsx**

```tsx
// components/dossier/SectionMark.tsx
// Large in-page section marker — e.g. `§ 02.3  ·  EXECUTION`.
// Used to head sub-sections inside a page, NOT in the top chrome.

export interface SectionMarkProps {
  /** e.g. "02.3" */
  mark: string;
  /** e.g. "EXECUTION" */
  label: string;
  className?: string;
}

export default function SectionMark({ mark, label, className }: SectionMarkProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 10,
        fontFamily: 'var(--font-mono), monospace',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ fontSize: 13, letterSpacing: '0.15em', color: '#E63E1F' }}>
        § {mark}
      </span>
      <span aria-hidden style={{ color: 'rgba(250,250,248,0.3)', fontSize: 11 }}>·</span>
      <span style={{ fontSize: 10, color: 'rgba(250,250,248,0.78)' }}>{label}</span>
    </div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit && git add components/dossier/SectionMark.tsx \
  && git commit -m "feat(dossier): SectionMark large in-page section marker"
```

---

## Task 7: Create <RedactionBar>

**Files:**
- Create: `components/dossier/RedactionBar.tsx`

Design: click/hover reveal. Stage 3 會套 GlitchText decrypt；Stage 1 用簡單 show/hide。

- [ ] **Step 1: Write RedactionBar.tsx**

```tsx
// components/dossier/RedactionBar.tsx
// Inline redaction block — hover (optional) to reveal sensitive value.
// Stage 3 will swap the reveal animation for GlitchText decrypt; Stage 1
// uses a simple instant swap so the component stabilizes first.
'use client';

import { useState } from 'react';

export interface RedactionBarProps {
  /** Small label shown before the bar (e.g. "CLIENT"). */
  label: string;
  /** The sensitive value. */
  value: string;
  /** If true (default), hovering reveals the value. */
  revealOnHover?: boolean;
  className?: string;
}

export default function RedactionBar({
  label,
  value,
  revealOnHover = true,
  className,
}: RedactionBarProps) {
  const [revealed, setRevealed] = useState(false);
  const showValue = revealed && revealOnHover;
  const barLen = Math.max(4, value.length);

  return (
    <span
      className={className}
      onMouseEnter={() => revealOnHover && setRevealed(true)}
      onMouseLeave={() => revealOnHover && setRevealed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        cursor: revealOnHover ? 'help' : 'default',
      }}
    >
      <span style={{ color: 'rgba(250,250,248,0.55)' }}>{label} ·</span>
      {showValue ? (
        <span style={{ color: '#5DD3E3', transition: 'color 160ms ease-out' }}>
          {value}
        </span>
      ) : (
        <span
          aria-label="redacted"
          style={{
            display: 'inline-block',
            background: '#0B1026',
            color: 'transparent',
            padding: '0 6px',
            minWidth: 60,
            userSelect: 'none',
            letterSpacing: 0,
          }}
        >
          {'\u2588'.repeat(barLen)}
        </span>
      )}
    </span>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit && git add components/dossier/RedactionBar.tsx \
  && git commit -m "feat(dossier): RedactionBar with hover-reveal (stage 1: instant swap)"
```

---

## Task 8: Create <DeclassifiedStamp>

**Files:**
- Create: `components/dossier/DeclassifiedStamp.tsx`

Stage 1: static tilt only. Stage 3 會加進場 animation。

- [ ] **Step 1: Write DeclassifiedStamp.tsx**

```tsx
// components/dossier/DeclassifiedStamp.tsx
// Tilted flame-outlined stamp — usable in archive rows, case detail headers,
// or stand-alone. Stage 3 will layer a motion entrance.

export interface DeclassifiedStampProps {
  /** 4-digit year, e.g. "2027" */
  year: string;
  /** Optional quarter, e.g. "Q1" */
  quarter?: string;
  /** CSS rotation in degrees; default -4 */
  rotation?: number;
  className?: string;
}

export default function DeclassifiedStamp({
  year,
  quarter,
  rotation = -4,
  className,
}: DeclassifiedStampProps) {
  const label = quarter ? `${year}.${quarter}` : year;
  return (
    <span
      className={className}
      aria-label={`Declassified ${label}`}
      style={{
        display: 'inline-block',
        border: '2px solid #E63E1F',
        color: '#E63E1F',
        padding: '4px 10px',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 9,
        letterSpacing: '0.3em',
        fontWeight: 700,
        textTransform: 'uppercase',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      Declassified {label}
    </span>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit && git add components/dossier/DeclassifiedStamp.tsx \
  && git commit -m "feat(dossier): DeclassifiedStamp static tilted stamp"
```

---

## Task 9: Wire layout.tsx (swap footer, mount header)

**Files:**
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Swap imports**

In `app/[locale]/layout.tsx`, replace the `EditorialFooter` import:

**Before:**
```tsx
import EditorialFooter from '@/components/layout/EditorialFooter';
```

**After:**
```tsx
import DossierFooter from '@/components/dossier/DossierFooter';
import DossierHeader from '@/components/dossier/DossierHeader';
```

- [ ] **Step 2: Replace footer + add header inside `<main>`**

In the same file, locate this block:

```tsx
<main className="flex-1 pt-11">
  {children}
</main>
<EditorialFooter />
```

Replace with:

```tsx
<main className="flex-1 pt-11">
  <DossierHeader />
  {children}
</main>
<DossierFooter />
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/layout.tsx
git commit -m "refactor(layout): swap EditorialFooter → DossierFooter, mount DossierHeader in main"
```

---

## Task 10: Build + smoke verification

**Files:** None (verification only)

- [ ] **Step 1: Clean build**

Run: `rm -rf .next && npm run build`
Expected: `✓ Compiled successfully` with no type errors. Note any warnings.

- [ ] **Step 2: Start dev server in background**

Run: `npm run dev` (background — you'll stop it at Step 5)
Wait until: `Ready in <N>s` log line appears, usually within 10s.

- [ ] **Step 3: Smoke check — every route renders DossierHeader + DossierFooter**

Run this script (SSR output includes client-initial-render HTML, so `curl` + `grep` is sufficient):

```bash
for route in "" "/about" "/work" "/services"; do
  echo "=== /zh-TW${route} ==="
  out=$(curl -s "http://localhost:3000/zh-TW${route}")
  echo "$out" | grep -q 'aria-label="Dossier header"' && echo "  ✓ DossierHeader" || echo "  ✗ DossierHeader MISSING"
  echo "$out" | grep -q 'aria-label="Dossier footer"' && echo "  ✓ DossierFooter" || echo "  ✗ DossierFooter MISSING"
  echo "$out" | grep -q 'The Level Studio · TPE' && echo "  ✓ studio label" || echo "  ✗ studio label MISSING"
  echo "$out" | grep -q 'End of Section' && echo "  ✓ end of section" || echo "  ✗ end of section MISSING"
done
```

Expected: 4 routes × 4 checks = 16 ✓ marks.

- [ ] **Step 4: Smoke check — case detail route**

Pick the first case slug:

```bash
slug=$(node -e "const{CASES}=require('./lib/work-data');console.log(CASES[0].slug)")
echo "Testing /zh-TW/work/${slug}"
out=$(curl -s "http://localhost:3000/zh-TW/work/${slug}")
echo "$out" | grep -q 'aria-label="Dossier header"' && echo "  ✓ DossierHeader" || echo "  ✗ MISSING"
echo "$out" | grep -oE 'CASE · [0-9]+' | head -1
```

Expected: DossierHeader ✓ and `CASE · 019` (or similar 3-digit id) printed.

- [ ] **Step 5: Stop dev server**

Kill the background `npm run dev` process (Ctrl-C or `pkill -f "next dev"`).

- [ ] **Step 6: Manual browser 巡頁（交給 Evan）**

After automated checks pass, 開 browser 到 `http://localhost:3000/zh-TW` 巡 5 routes + `/zh-TW/work/<某 slug>`。確認：
1. 每頁頂 DossierHeader 可見（mono 字、2 行、flame CLEARANCE A）
2. 每頁底 DossierFooter 可見（END OF SECTION + DECLASSIFIED stamp + AVAILABLE pulse + copy email）
3. 點 email 看 `[ ✓ COPIED ]` 1.6s 出現
4. Header 2 行 gap 看得清
5. 沒有未對齊 / 重疊 / 文字穿透

**若任何 ✗ 或視覺異常，停下來 debug，不要往 Stage 2。**

- [ ] **Step 7: Tag Stage 1 completion**

```bash
git tag dossier-spine-stage-1-done
```

---

## Self-Review

**Spec coverage check:**
- §3.1 路由 → 節 mapping：pageConfig.ts 覆蓋 4 route + /work/[slug]，/blog reserved（spec 已註）✓
- §3.2 共用 Spine Chrome：DossierHeader + DossierFooter ✓
- §3.3 既有 Asset 對應：未觸及（屬 Stage 2/3 scope）——Stage 1 不動 HudCorners/GlitchText/FIELD KIT/OSER，保留原狀
- §4 六個元件：Tasks 3-8 涵蓋所有六個 ✓
- §5 Stage 1 Locked Decisions：CASES.length / Clearance A / 兩層 header — 皆在 code 裡 lock ✓
- §6 Data Model：Task 1 ✓
- §7.1 Stage 1 Implementation：Tasks 1-10 ✓
- §8 Out of Scope：本 plan 明確只限 Stage 1，未觸 Stage 2/3、/blog、mobile RWD ✓
- §9 Success Criteria #1, #2, #5：DossierHeader/Footer 可見 + build/lint 過，Task 10 驗 ✓
- §9.3 OSER → BRIEF/OPS/EXEC/POST：**Stage 2 scope**，本 plan 不覆蓋（spec 的 §7.2 明寫在 Stage 2）
- §9.4 RedactionBar hover decrypt：**Stage 2-3 內容填充 + 3 decrypt 動畫**，Stage 1 只建元件，不 wire 到 case data
- §9.6 Playwright 巡 5 routes：Task 10 用 curl + 手動 browser 替代（repo 無 playwright 依賴） ✓ 等效
- §10 Risks：HMR 殘留（Task 10 Step 1 `rm -rf .next`）✓；HudCorners 混用（Stage 2 審視）；RedactionBar 濫用（Stage 2 保守內容）；Declassified 日期語意（pageConfig.ts 註明敘事裝飾）

**Placeholder scan:** 全 plan 無 TBD / TODO / "handle edge cases" / "similar to Task N"。所有 code 完整。✓

**Type consistency:**
- `DossierPageMeta` 一致（Task 2 定義、Tasks 3-4 消費）
- `resolveDossierMeta` 簽名一致 ✓
- `DOSSIER_SECTION_TOTAL` 同一常數 ✓
- `CASES` / `getCaseBySlug` 皆存在於 lib/work-data.ts

**Gap found — none added.** Plan 涵蓋 spec 的 Stage 1 部份完整。

---

## Commit Log (expected)

After completing all tasks, `git log --oneline` 應含 9 個新 commit：

```
feat(dossier): extend Case type with confidential + declassifiedAt fields
feat(dossier): pageConfig route→meta resolver
feat(dossier): DossierHeader with pathname-based meta resolve
feat(dossier): DossierFooter merges EditorialFooter + adds dossier chrome row
feat(dossier): CaseBadge inline chip component
feat(dossier): SectionMark large in-page section marker
feat(dossier): RedactionBar with hover-reveal (stage 1: instant swap)
feat(dossier): DeclassifiedStamp static tilted stamp
refactor(layout): swap EditorialFooter → DossierFooter, mount DossierHeader in main
```

加上 tag `dossier-spine-stage-1-done`。
