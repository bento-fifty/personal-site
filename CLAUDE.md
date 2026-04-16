# CLAUDE.md

Guidance for Claude Code working on this repo.

@AGENTS.md

## Commands

```bash
npm run dev      # Turbopack dev (Next.js 16 default)
npm run build    # Production build
npm run lint     # ESLint
```

No test suite yet.

## Architecture

Deploy plan + API abstraction (Vercel main site, Cloudflare Workers future split): see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). All frontend API calls must go through `lib/api-client.ts`.

Component tour, routing, home composition, data conventions — **read the code directly**. Key entry points:

- `app/[locale]/layout.tsx` — root shell (i18n provider + fonts + `<Nav>` + `<main>` + `<Footer>`)
- `app/[locale]/page.tsx` — home composition (Hero / FeaturedWork / LocationsMap / HomeCta)
- `app/[locale]/about/page.tsx` → `components/about/AboutPage.tsx` — about page
- `app/[locale]/contact/page.tsx` → `components/contact/ContactPage.tsx` — contact page
- `app/[locale]/work/[slug]/page.tsx` — case detail (OSER: Objective / Strategy / Execution / Result)
- `components/home/*` — marketing sections
- `components/shared/HudCorners.tsx`, `components/shared/GlitchText.tsx` — reusable primitives

## Critical gotchas

### Next.js 16

- **`proxy.ts` replaces `middleware.ts`** — named export `export const proxy = ...`, not default export
- **`params` is a `Promise`** — always `const { locale } = await params` in layouts / pages / `generateMetadata`
- **Turbopack** is the default bundler
- Authoritative API reference: `node_modules/next/dist/docs/` — read before touching routing / proxy / config

### Styling / fonts

- **Tailwind v4 arbitrary values**: use `border-[rgba(0,0,0,0.08)]`, not `border-black/8` (v4 opacity shorthand behaves differently)
- **`Noto_Serif_TC` / `Noto_Sans_TC`** do NOT accept a `subsets` parameter — omit it when loading
- **Turbopack `:root` CSS HMR gotcha**: editing CSS variables in `globals.css` sometimes doesn't trigger rebuild. Touch any other line (comment / whitespace) to force reprocess.
- **`.font-display` / `.font-label` have `-webkit-font-smoothing: none`** — pixel fonts (Departure Mono / Cubic 11) need this to stay crisp. If you re-enable smoothing per-element, use inline `WebkitFontSmoothing: 'antialiased'`.

### Layout

- `<main className="pt-14">` in `app/[locale]/layout.tsx` is tied to `<Nav>` `h-14`. Change both together or the hero gets cropped.
- Home sections use `bg-transparent` so `HomeAmbientBg` streams show through every section. Do NOT add `bg-[#080808]` to individual home sections — it breaks visual continuity.

### Environment

- **Dev server runs in `.worktrees/build/`** on branch `feature/build-personal-site`, NOT the main checkout. Edit files at the worktree path during active sessions — main-path edits won't be picked up by HMR.
- **`git push` is blocked** by a harness hook per user rule. Commit freely; always stop before push and let the user run `git push` manually.

## 品質管控

交給用戶前必須：build 通過、Playwright 截圖自審（無殘留/穿透/不可見元素）、對照最新指令、不重複已否決做法。未通過不準叫用戶看。

## Design Context

由 `/impeccable teach` 產生，完整版在 [`.impeccable.md`](.impeccable.md)。摘要如下：

### Users
個人品牌展示場，不是業務 landing。訪客組合：品牌端業主、agency 同行、設計圈同業。**Job**：3 秒內讓人意識到「這是有強烈個人 POV 的 event producer，不是制式接案公司」，被某個細節勾住記住。

### Brand Personality
**前衛・技術感・硬派**。像情報簡報、不像活動公司。要被記得，不是被喜歡。拒絕可愛、溫馨、熱鬧、豐盛感。

### Aesthetic Direction
v8 cold editorial 已定調：ink navy + paper + flame + ice 四色鎖；Fraunces + Geist + Departure Mono + Noto/Chiron CJK；HUD/GlitchText/FIELD KIT/TRANSMISSION LOG/OSER 語彙。

**Anti-refs**：一般台灣活動公司官網、AI 味個人網站、Webflow/Framer 套版設計師 portfolio。

**Memory hook**：HUD/TRANSMISSION 的**敘事質感**——區塊命名、微動效、結構處理的整體語氣。

### Design Principles
1. 冷為底，flame 是例外（10% 或更少）
2. 資訊密度優先於留白美
3. 細節命名即設計（新區塊先問：在 HUD 世界觀裡叫什麼？）
4. 雙語不是翻譯，是雙份創作
5. 破格有目的（每處破格對應 intel report 的哪個慣例）
6. 拒絕模板化（長得像活動公司/Webflow/AI 常見輸出就重做）
