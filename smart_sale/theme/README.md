# Smart Sales theme

All visual decisions live here and are loaded once through `components/ui/provider.tsx`.

| File | What it holds |
| --- | --- |
| `palettes.ts` | The colour themes users pick in the Appearance drawer (primary + secondary scales) and `paletteVars()` |
| `tokens.ts` | Raw scales: `brand` (primary) and `accent` (secondary) read the selected palette through CSS variables; `gold` (the metal), `neutral`, fonts, extra font sizes (`dense` 11px, `ui` 13px), radii, shell sizes, page widths |
| `semantic-tokens.ts` | Meaning-based colours (`bg.canvas`, `bg.panel`, `fg.muted`, `border.focus`, `sidebar.*`…), status palettes (`success`, `warning`, `danger`, `info`), radii `l1–l3`, shadows `card`/`raised`/`overlay`. Light and dark values. |
| `text-styles.ts` | Type scale (`pageTitle`, `sectionTitle`, `body`, `label`, `tableHeader`, `tableCell`, `helper`, `overline`, `numeric`) and layer styles (`panel`, `toolbar`, `selected`) |
| `recipes.ts` | Small extensions to Chakra's component recipes (button, inputs, card, dialog, badge, and a dense `data` table variant) |
| `system.ts` | `createSystem(defaultConfig, …)` plus global CSS: the palette variables per `html[data-palette]` and the sidebar variables per `html[data-sidebar]` |

## Appearance

The header's palette button opens `component/layout/appearance/AppearanceDrawer.tsx`, where users choose light or dark mode, a colour theme and a light or primary-colour sidebar. `context/theme/themeContext.tsx` saves the choice in localStorage and sets `data-palette` / `data-sidebar` on `<html>`; a small script in `app/layout.tsx` applies them before first paint.

To add a palette, add an entry to `PALETTES` in `palettes.ts` (11-step `brand` and `accent` scales). Nothing else changes.

CSS variables do not work inside SVG presentation attributes (`fill="var(...)"`, lucide's `color` prop). Use `style={{ color: ... }}` or a Chakra prop instead, and `color-mix()` instead of appending hex alpha to a theme colour.

## Rules for screens

- Use semantic tokens (`bg.panel`, `fg.muted`, `border`) instead of hex values or `useTheme().theme.colors`.
- Use `textStyle` instead of hand-set font sizes.
- Primary actions use `colorPalette="brand"`; destructive ones `colorPalette="danger"`.
- Icons come from `lucide-react`.
- Build pages from `components/primitives`: `PageContainer` → `PageHeader` → `SectionCard`s, with `FilterBar`, `IconAction`, `StatusBadge`, `EmptyState`/`LoadingState` and `ConfirmDialog`.
- `DataTable` and `DynamicForm` use the themed look by default. Pass `variant="legacy"` / `appearance="legacy"` only where a screen still needs the old look.
- Format numbers, money, dates and image URLs with `utils/format`, `utils/text` and `utils/image` (see `utils/format/README.md`).

Reference screens: `modules/metal/components/MetalMasterPage.tsx` and `modules/rate/components/RateEntryPage.tsx`.

`context/theme/theme.ts` (`useTheme()`) is kept as a bridge for screens that have not been migrated; its colours point at the selected palette.
