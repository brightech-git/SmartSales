# Display formatting

These helpers turn values into text for screens and prints. They never feed calculations or API payloads:

- calculations: `decimal.js`, or `formatToFixed` / `parseFixedNumber` in `numberFormat.ts`
- API dates: `formatDateForAPI` in `formatDateForAPI.ts`

Business defaults live in `config.ts`: locale `en-IN`, currency `INR`, weights 3 decimals, amounts and rates 2, percentages 2, pieces 0. No timezone is defined, so dates use the device's zone unless you pass `timeZone`.

| Need | Use | Example |
| --- | --- | --- |
| Weight / pure weight | `formatWeight`, `formatPureWeight` | `12.5` → `12.500` |
| Amount, rate (no symbol) | `formatAmount`, `formatRate` | `1500` → `1,500.00` |
| Money | `formatCurrency` | `1500` → `₹1,500.00`; `{ display: "spaced" }` → `₹ 1,500.00`; `{ decimals: 0 }` → `₹1,500` |
| Percentage (points) | `formatPercent` | `12.5` → `12.50%` |
| Pieces | `formatQuantity` | `3, { unit: "pcs" }` → `3 pcs` |
| Any number | `formatNumber` | `{ decimals, grouping, locale }` |
| Date | `formatDate` | `"2026-10-29"` → `29-10-2026`; `{ style: "medium" }` → `29 Oct 2026` |
| Time / both | `formatTime`, `formatDateTime` | `02:05 PM`, `29-10-2026 02:05 PM` |
| Parse safely | `toDecimal`, `parseDate` | return `null` for missing or invalid input |
| Titles, initials, blanks | `utils/text/text.ts` | `toTitle("ItemMaster")`, `getInitials`, `displayText` |
| Image URLs | `utils/image/imageUrl.ts` | `resolveImageUrl(path, FALLBACK_IMAGES.item)` |

Rules every formatter follows:

- `null`, `undefined`, `""`, `NaN` and text that is not a number return `fallback` (default `""`). Zero is a value, not missing.
- Rounding is half away from zero on the decimal value (`1.005` → `1.01`), and `-0` never shows.
- Negative amounts keep their sign: `-₹50.00`.
- Date-only strings (`2026-10-29`, `29-10-2026`, `29/10/2026`) are read as local calendar dates, so they never move a day.

Tests: `npm test` (vitest), next to each file as `*.test.ts`.
