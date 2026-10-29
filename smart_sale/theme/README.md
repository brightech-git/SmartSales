# Smart Sales theme

All visual decisions live here and are loaded once through `components/ui/provider.tsx`.

| File | What it holds |
| --- | --- |
| `tokens.ts` | Raw scales: `brand` (garnet), `gold` (accent), `neutral`, `aubergine` (sidebar), fonts, extra font sizes (`dense` 11px, `ui` 13px), radii, shell sizes, page widths |
| `semantic-tokens.ts` | Meaning-based colours (`bg.canvas`, `bg.panel`, `fg.muted`, `border.focus`, `sidebar.*`…), status palettes (`success`, `warning`, `danger`, `info`), radii `l1–l3`, shadows `card`/`raised`/`overlay`. Light and dark values. |
| `text-styles.ts` | Type scale (`pageTitle`, `sectionTitle`, `body`, `label`, `tableHeader`, `tableCell`, `helper`, `overline`, `numeric`) and layer styles (`panel`, `toolbar`, `selected`) |
| `recipes.ts` | Small extensions to Chakra's component recipes (button, inputs, card, dialog, badge, and a dense `data` table variant) |
| `system.ts` | `createSystem(defaultConfig, …)` plus global CSS |

## Rules for new or migrated screens

- Use semantic tokens (`bg.panel`, `fg.muted`, `border`) instead of hex values or `useTheme().theme.colors`.
- Use `textStyle` instead of hand-set font sizes.
- Primary actions use `colorPalette="brand"`; destructive ones `colorPalette="danger"`.
- Icons come from `lucide-react`.
- Build pages from `components/primitives`: `PageContainer` → `PageHeader` → `SectionCard`s, with `FilterBar`, `IconAction`, `StatusBadge`, `EmptyState`/`LoadingState` and `ConfirmDialog`.
- Shared legacy components have opt-in switches so screens can move one at a time: `<DataTable variant="themed">` and `<DynamicForm appearance="themed">`.

`app/dashboard/Master/Item/Metal/page.tsx` is the reference screen.

`context/theme/theme.ts` (`useTheme()`) is kept as a bridge for screens that have not been migrated; its values now match these tokens.
