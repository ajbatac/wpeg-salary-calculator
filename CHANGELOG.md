# Changelog (INTERNAL — do not publish)

Technical record for maintainers. The public, non-technical version lives at
`/changelog` (`src/react-app/pages/Changelog.tsx`) and `public/changelog/rss.xml`.
Canonical URL: https://salary.wpeg.app

## v1.1.0 — 2026-11-09

### Release commits

| Commit    | Summary                                                                 |
| --------- | ----------------------------------------------------------------------- |
| `3d64d3a` | Firebase/Genkit removal, dependency modernization, calculator hardening |
| `2d69e44` | 2026 CRA/Manitoba/CPP/EI parameter correction + BPA credits + CPP2 tier |
| `ce0f4f2` | Source citations with `rel="nofollow noopener noreferrer"` links        |
| `9ff7662` | Left-side TOC jump menu with scroll-spy + anchor offset fixes           |
| `73a4d03` | Brand palette refresh, 21-preset theme engine, HSL channel migration    |
| (this)    | v1.1.0 checkpoint: /changelog page, RSS, sitemap/robots/llms, footer    |

### 1. Firebase & remnant removal (`3d64d3a`)

- `git rm firebase-debug.log`, `git rm -r --cached .genkit` (Firebase Genkit artifacts),
  removed tracked `.DS_Store` files; added `.gitignore` that permanently blocks
  `.firebase/`, `.firebaserc`, `firebase.json`, `.genkit/`, `*-debug.log`, `node_modules/`.
- Dropped unused deps `hono`, `@hono/zod-validator` (leftovers from a removed Cloudflare
  Worker) and the single-route `react-router` wrapper.

### 2. Dependency stack

- React 19.3, Vite 8.3 + `@vitejs/plugin-react` 6 (wired in for Fast Refresh — was installed
  but unused), TypeScript 5.9, ESLint 10 (`typescript-eslint` strict), Tailwind 3.4 (v4 is a
  breaking rewrite — deferred), zod 4, lucide-react 1.x, Prettier 3.9.
- Accepted dev-only advisory: `minimatch` GHSA-g3hv-m249-moderate inside the ESLint toolchain;
  nothing ships to the browser.

### 3. 2026 tax engine (`2d69e44`) — key file `src/shared/types.ts`

```ts
export const FEDERAL_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 58523, rate: 0.14 }, // lowest rate cut 15% -> 14% for 2026
  { min: 58523, max: 117045, rate: 0.205 },
  { min: 117045, max: 181440, rate: 0.26 },
  { min: 181440, max: 258482, rate: 0.29 },
  { min: 258482, max: null, rate: 0.33 },
];
export const MANITOBA_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 47564, rate: 0.108 },
  { min: 47564, max: 101200, rate: 0.1275 },
  { min: 101200, max: null, rate: 0.174 },
];
export const FEDERAL_BPA_MAX = 16452; // floor 14829, phaseout > 181440 @ 3%
export const MANITOBA_BPA_MAX = 16140; // phaseout $200k-$400k, linear to zero
export const CPP_MAX_EARNINGS = 74600; // YMPE; exemption 3500; rate 5.95%
export const CPP2_RATE = 0.04; // YAMPE 85000; max 416.00
export const EI_RATE = 0.0163; // MIE 68900; max 1123.07
export const PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  annual: 1,
  monthly: 12,
  'bi-weekly': 26,
  weekly: 52,
};
```

- `src/react-app/utils/salaryCalculator.ts`: progressive `calculateTax` (per-bracket clamp,
  no fragile bookkeeping), `taxAfterCredits()` applies BPA at the lowest bracket rate,
  `federalBasicPersonalAmount()` (3% phaseout, floored) and `manitobaBasicPersonalAmount()`
  (linear), `calculateCPP2()` band function, `nonNegative()` boundary normalization.
- `SalaryBreakdown` interface gained `cpp2: number`; flows to the breakdown row, share text,
  and JSON export.
- Verified in-browser against hand-computed CRA math at $65k / $150k / $300k (all brackets,
  credit phaseouts, CPP/CPP2/EI maxing) — exact match to the cent.
- Fun-fact bug fixes: Slurpee funding now derives the ~6,242-cup daily habit from the monthly
  190,000 figure (`SLURPEE_DAILY_COST` in `src/shared/constants.ts`) instead of dividing by
  the monthly cost ("0 weeks"); rent-to-income card shows "—" instead of `Infinity%` at $0.

### 4. Citations (`ce0f4f2`)

- `src/shared/constants.ts`: `TAX_SOURCES` (six verified-live government URLs) +
  `CRA_TAX_BRACKETS_URL` / `MANITOBA_TAX_RATES_URL` exports.
- `src/react-app/pages/Home.tsx`: "CRA 2026" and "MB Finance" header chips link out; the
  Sources & References card lists every parameter against its publication, with
  `rel="nofollow noopener noreferrer"`. All URLs fetch-verified (two plausible CRA/MB paths
  were 404s and were replaced with the real pages).

### 5. TOC jump menu (`9ff7662`)

- `src/react-app/components/TableOfContents.tsx`: sticky left rail (xl+), six sections in
  document order, scroll-spy picks the deepest section past a 35% reading line **by on-screen
  position** (survives reordering — the page's real order has Notes/Sources between
  Calculator and Coffee Coin).
- `index.css`: `[id] { scroll-margin-top: 6.5rem; }` fixes jumps hiding under the sticky
  header; `prefers-reduced-motion` disables smooth scroll; hero pills become `xl:hidden`.

### 6. Brand + theme system (`73a4d03`)

- Default WPEG palette refined in `src/react-app/index.css` (iris primary `256 31% 47%`,
  AA contrast; aubergine-ink dark mode). All tokens migrated to **raw HSL channels** and
  `tailwind.config.js` maps `hsl(var(--x) / <alpha-value>)` — fixes latent bug where
  `bg-primary/10` / `border-primary/30` compiled to nothing (Tailwind drops alpha on raw
  `var()`), so pill tints and the TOC active state had been invisible.
- Theme engine (ported from the LinkN catalog spec):
  - `src/shared/themes.ts` — 21 presets, exact resolved light/dark palettes, authored-mode
    previews (`getAuthoredVars`).
  - `src/react-app/lib/colorTheme.ts` — writes ~30 managed CSS properties inline on
    `<html>` (outranking stylesheet defaults), persists `localStorage['color-theme']`,
    `MutationObserver` on the `class` attribute re-applies the mode-matched palette when
    light/dark flips; `null` = WPEG default and removes all managed properties.
  - `src/react-app/hooks/useColorTheme.ts` — `useSyncExternalStore` subscription.
  - `src/react-app/components/ColorThemeSelector.tsx` — header dropdown, swatch chips,
    `aria-checked`, Escape/backdrop close, 44px targets.
  - `Basic` preset toggles `html[data-basic-theme]`: CSS strips shadows/gradients/animations/
    radii, Arial body, classic `#0645ad`/`#551a8b` links; `[class*='theme-gradient']` gets a
    solid `hsl(var(--primary))` fill so white icons stay visible.
- Cleanups: removed dead `ring-color` property (replaced with `--tw-ring-color`), dead
  `.navigation-pills` print selector, wrapped every CSS var consumer in `hsl()`.

### 7. v1.1.0 checkpoint (this release)

- `src/react-app/App.tsx`: `react-router` (v8) restored with `/` and `/changelog`; the build
  copies `dist/index.html` to `dist/404.html` so client routes survive refresh on hosts
  without SPA fallback.
- `src/react-app/pages/Changelog.tsx`: public, non-technical release history — no file names
  or paths, themed to the site, "Subscribe to this feed" pill → `/changelog/rss.xml`.
- `src/react-app/pages/Home.tsx` footer: `v1.1.0 · Changelog` links to `/changelog`;
  `package.json` bumped to `1.1.0`.
- `index.html`: canonical link + RSS autodiscovery `<link rel="alternate" ...>`.
- New public assets (served from `public/` → site root): `robots.txt` (allow all + sitemap),
  `sitemap.xml` (/ and /changelog, lastmod 2026-11-09), `changelog/rss.xml` (RSS 2.0 + Atom
  self-link, full bulleted descriptions mirroring the public page), `llms.txt` (canonical
  URL, parameters, citations).

### 9. Follow-up: WCAG audit engine + theme-palette accessibility floor

- Built a WCAG contrast crawler (runs in-browser): walks every text node, composites
  stacked translucent backgrounds (`/20` tints, `/60` cards, gradients) into effective
  colors, applies 4.5:1 body / 3:1 large-text thresholds. First pass found 17 light-mode
  failures in the default palette (dark-only 400-level colors shown in light mode: badge
  chips at 1.37:1, big numbers, amber smalls, mobile pills) — all fixed with light/dark
  pairs; dark mode was already clean.
- Re-ran the crawler across **all 22 palettes × both modes**: 20 of 22 presets failed
  light mode (up to 40 failures each, worst 1.0:1 — presets authored for dark mode kept
  bright brand colours as light-mode text; Vercel's light primary was literally white).
- Fix in the engine (`src/shared/themes.ts`): a per-palette **accessibility floor** —
  light-mode `primary`/`accent`/`mutedForeground`/`charts` are darkened (hue and
  saturation preserved) until they reach 5:1 against white; dark-mode brand colours are
  lightened against the palette's own card when too dark (Basic's link blue 35%→65%).
  Hue-aware: yellows drop further than blues. Authored values remain untouched for
  selector swatches via `getAuthoredVars` (raw-registry lookup). Two bugs found en route:
  `Number('84%')` is `NaN` (use `parseFloat`), and a loop bound that aborted darkening
  above L=96 (Vercel white).
- Basic preset's forced early-web link blue (`#0645ad`) was 4.14:1 on its dark surfaces;
  dark mode now uses the era's brighter `#8cb4ff`/`#c5a8ff`. Citation chips bumped
  `text-foreground/80` → `/90`.
- Final state: **44/44 palette×mode combinations pass with zero failures** (verified by
  the crawler in-browser), plus a visual pass on the worst prior case (Vercel light).

## v1.0.0 — 2025-08

Initial release: React + Vite calculator, Tailwind/shadcn token layer, dark mode, share/export,
Winnipeg fun-fact cards. (Original 2024-parameter engine replaced in v1.1.0.)
