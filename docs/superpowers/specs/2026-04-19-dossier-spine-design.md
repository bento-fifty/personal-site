# Dossier Spine — 整站視覺 / 敘事統一 Design

**Date:** 2026-04-19
**Branch:** `feature/v8-cold-editorial`
**Status:** Brainstorm approved, awaiting implementation plan

## 1. Problem

v8 cold-editorial 上線後，7 頁各自視覺完整，但彼此不相連。訪客從首頁 IssueCover 翻進 /about /work /services 像換了另一個站。

Evan 的診斷：**缺結構骨（共用 skeleton）+ 缺敘事骨（這個 site 講什麼故事）**。不是美感斷層問題。

前一批「Magazine Issue N°004」方向被拒——過度套 editorial wrap，沒解決底層 spine 問題。

## 2. Core Concept

**比喻物：Dossier / Intel File**
**載體：Declassified Intel File（解密檔案）**

- Paper 底（`#FAFAF8` / `#F0EDE6`）+ ink 字（`#0B1026`）為主
- Flame（`#E63E1F`）限於 `[REDACTED]` bar、`[DECLASSIFIED]` stamp、CASE # 標記、結案章
- Ice（`#5DD3E3`）限於 CLEARANCE indicator、status dot、transmission timestamp
- 敘事主角：「檔案管理員 / 解密官」——第三人稱冷靜報告，不是第一人稱 Evan 自誇
- 既有 HUD / FIELD KIT / GlitchText / TRANSMISSION LOG / OSER 全部保留，被重新定位成 dossier 的某節或某元件

## 3. Application Map

### 3.1 路由 → Dossier 節

| Route | Section | Content |
|---|---|---|
| `/` | COVER / BRIEF | IssueCover monogram + files index preview + latest TX timestamp |
| `/about` | § 01 · PERSONNEL FILE | Operator ID (Evan) / credentials / service log / history / pickup |
| `/work` | § 02 · CASE ARCHIVE | 全 files 索引（bento / list / photo 三檢視），每筆含 [DECLASSIFIED] tag / CLEARANCE / 結案日 |
| `/work/[slug]` | § 02.xx · CASE FILE | OSER → **BRIEF · OPS · EXECUTION · POST-ACTION**，敏感欄位走 RedactionBar |
| `/services` | APPENDIX B · FIELD KIT | 現有 Rigs. 表格，套 appendix 外殼 |
| `/blog` | § 03 · TRANSMISSION LOG | **預留 section slot**。bc508ff 拔掉獨立 route 後目前未 reintroduce。`07` section 計數保留此位，pageConfig 不 map 實路由。未來 reintroduce 再套 DossierHeader |
| contact widget | REQUEST CHANNEL | ContactComposeWidget 維持浮動，外殼文案換「request for comms · channel open」 |

### 3.2 共用 Spine Chrome

**DossierHeader**（每頁 inline 在 main 頂部）
- 左：`THE LEVEL STUDIO · TPE`
- 右：`CASE · [caseId] / [caseTotal]`
- 下左：`§ [sectionIndex] · [SECTION NAME]`
- 下右：`CLEARANCE · A`

**DossierFooter**（replace 現有 EditorialFooter，**必須保留既有 COPY EMAIL + AVAILABLE pulse 功能**）
- 上列 · dossier chrome：`— END OF SECTION —` / `[DECLASSIFIED 年.Q]` stamp（-4 到 -6deg 傾斜） / `PG [sectionIndex] / 07`
- 下列 · 繼承 EditorialFooter：`● AVAILABLE for Q2·Q3 2026` (ice dot pulse) / email copy button (hover reveal `[ ▸ COPY ]`, click copied `[ ✓ COPIED ]`) / `TX · [ISO timestamp]` / `TPE · [year]`

**數字系統說明**
- `caseTotal` = `CASES.length`（動態）。`caseId` 依頁：`/work/[slug]` 顯示該 case 的 3-digit id（e.g. `019`）；非 case 頁顯示該 section 的代號（e.g. `/about` = `GEN-01`，`/services` = `APX-B`）。具體每頁 `caseId` / `sectionIndex` / `sectionName` 三值對應表在 implementation plan 中 lock。
- `07` = dossier 總 section 數（COVER / PERSONNEL FILE / CASE ARCHIVE / CASE FILE / APPENDIX B / TRANSMISSION LOG / REQUEST CHANNEL）。與 `CASES.length` 無關。

### 3.3 既有 Asset 對應

| 既有元素 | 對應用途 |
|---|---|
| HudCorners | File corner stamps（clearance / timestamp） |
| GlitchText | Redaction reveal decrypt 動畫（套在 RedactionBar 上） |
| FIELD KIT / Rigs. | Appendix B（在 /services） |
| TRANSMISSION LOG | § 03（/blog，維持當前樣） |
| OSER | Rename to BRIEF / OPS / EXECUTION / POST-ACTION |
| Wireframe cubes（首頁） | 重新定位為「file capsule」隱喻物 |
| RouteTransition | 保留 splat + flame ticker，加 file-folder edge 層 |
| Ambient shaders | 降亮度比例，讓 paper 底色主導，ink 深底退到次要 |

## 4. Components

新增在 `components/dossier/`：

1. **`<DossierHeader>`** — props: `{ caseId?: string; caseTotal: number; section: string; sectionName: string; clearance?: string }`，預設 clearance=`A`。inline 在 main 頂部。
2. **`<DossierFooter>`** — props: `{ section: string; pageNumber: number; pageTotal: number; declassifiedYear?: string }`。replace layout.tsx 的 EditorialFooter。
3. **`<CaseBadge>`** — props: `{ caseId: string; status?: 'declassified' \| 'active' }`。貼在 case card、case link 上。
4. **`<SectionMark>`** — props: `{ mark: string; label: string }`。渲染 `§ 02.3 · EXECUTION` 這種大章節記號，用在長頁內容分段。
5. **`<RedactionBar>`** — props: `{ label: string; value: string; revealOnHover?: boolean }`。敏感欄位塊，hover 走 GlitchText decrypt reveal。
6. **`<DeclassifiedStamp>`** — props: `{ year: string; quarter?: string; rotation?: number }`。結案戳記，flame 邊框 + flame 字。

## 5. Stage 1 Locked Decisions

- **Case # 總數來源**：`CASES.length`（dynamic from `lib/work-data.ts`）
- **CLEARANCE LEVEL**：全站固定 `A`（不按頁 / case 分層）
- **DossierHeader 佈局**：兩層——EditorialMasthead 保留做頂部 nav；DossierHeader 作為每頁 inline file 標識，不取代 masthead

## 6. Data Model Changes

`lib/work-data.ts` 的 `Case` interface 新增 optional field：

```ts
confidential?: {
  client?: boolean;   // 客戶名打碼
  budget?: boolean;   // 預算打碼
  fields?: string[];  // 其他自訂 redaction 欄位
};
declassifiedAt?: string;  // ISO 年.Q, e.g. "2027.Q1"
```

未標記 `confidential` 的 case 預設視為完全揭露，`declassifiedAt` 取該 case `year + 1`.Q1 作 fallback。

## 7. Implementation Strategy: Spine-first Incremental

### Stage 1 — Spine Skeleton（一次做完）
- 建立 `components/dossier/` 六個元件
- `layout.tsx`：DossierFooter replace EditorialFooter；EditorialMasthead 不動
- 每個 page entry 加 `<DossierHeader>` 於 main 頂
- `Case` type 加 confidential / declassifiedAt
- Success：每頁都能看到 header + footer spine；build 通過

### Stage 2 — Page-by-page Language Swap
- `/about`：三章 rename Profile / Credentials / Service Log（套 § 01）
- `/work`：filter chips 加 CLEARANCE filter、archive row 加 `[DECLASSIFIED]` tag
- `/work/[slug]`：OSER sections → BRIEF / OPS / EXECUTION / POST-ACTION；敏感欄位套 RedactionBar
- `/services`：Rigs. 外殼換 APPENDIX B
- `/blog`：TRANSMISSION LOG header 對齊 spine
- contact widget：外殼文案 REQUEST CHANNEL
- `/`：整合 IssueCover + file index preview
- Success：每頁 section 命名 + CaseBadge / SectionMark 視覺一致

### Stage 3 — Motion & Detail
- RedactionBar hover reveal 動畫（GlitchText decrypt 400ms）
- DeclassifiedStamp 進場 tilt（隨機 -4 到 -6deg，0.6s ease-out）
- RouteTransition 加 file-folder edge overlay 層（不替換既有 splat + flame ticker）
- Ambient shaders 降亮度、paper 層拉高

## 8. Out of Scope

- Magazine Issue / Editor's Note 方向（已 reject）
- 新增 `/contact` 獨立路由（維持 ContactComposeWidget）
- 新增 `/blog` 獨立路由（已獨立存在，不動）
- Mobile RWD 驗收（獨立任務清單）
- 新 shader 或 route transition 演算法（保留現有規格）

## 9. Success Criteria

隨機訪問任一路由，以下皆須成立：

1. 頁頂可見 DossierHeader：`THE LEVEL STUDIO · TPE` + `CASE · .. / ..` + `§ .. · SECTION` + `CLEARANCE · A`
2. 頁底可見 DossierFooter：`— END OF SECTION —` + DECLASSIFIED stamp + TX timestamp + `PG .. / 07`
3. `/work/[slug]` 的 4 節是 BRIEF / OPS / EXECUTION / POST-ACTION，不是 OSER
4. 至少一個 case 的客戶 / 預算欄位套 RedactionBar、hover 可 decrypt reveal
5. Build 通過（`npm run build`），Lint 通過（`npm run lint`）
6. Playwright 巡 5 個現存 route（`/`、`/about`、`/work`、`/work/[首筆 slug]`、`/services`）+ contact widget 開關狀態，截圖無 spine 重疊 / 文字穿透 / 不可見元素

## 10. Risks

- **HMR 殘留**：Stage 1 改 layout.tsx + 全 page 引入 DossierHeader，Turbopack HMR 可能靜默。補救：改完重啟 dev。
- **既有 HudCorners 混用**：有些頁面已經放 HudCorners，若再加 DossierHeader 可能資訊冗餘。Stage 1 完成後逐頁 audit，衝突的拔掉舊 HudCorners。
- **RedactionBar 過度使用**：每 case 都 redact 會變噱頭。Stage 2 只挑 4-6 個 case 示範，不全套。
- **Declassified date 語意**：`declassifiedAt` 預設 `year+1.Q1` 可能跟現實脫節（實際有些 case 是跨年多季才結）。可接受——這是敘事裝置，不是真日期。
