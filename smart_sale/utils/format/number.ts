import Decimal from "decimal.js";
import { APP_CURRENCY, APP_LOCALE, DECIMALS } from "./config";

/**
 * Display-only number formatting. These helpers return strings for the
 * screen and for prints. Do not feed their output back into calculations
 * or API payloads; use `formatToFixed`/`parseFixedNumber` in
 * numberFormat.ts or decimal.js for that.
 */

export type NumericInput = number | string | Decimal | null | undefined;

export type NumberDisplayOptions = {
    /** Fixed number of decimals. Values are rounded half away from zero (1.005 → 1.01). */
    decimals?: number;
    /** Returned for null, undefined, empty and invalid values. Default "". */
    fallback?: string;
    locale?: string;
    /** Thousands grouping (1,23,456.00 in en-IN). Default true. */
    grouping?: boolean;
};

/**
 * Parses a display value into a Decimal. Returns null for null, undefined,
 * empty or whitespace strings, NaN, Infinity and text that is not a number.
 * Thousands separators ("1,23,456.50") are accepted.
 */
export const toDecimal = (value: NumericInput): Decimal | null => {
    if (value === null || value === undefined) return null;
    if (Decimal.isDecimal(value)) return value.isFinite() ? value : null;
    if (typeof value === "number") return Number.isFinite(value) ? new Decimal(value) : null;

    const text = value.trim().replace(/,/g, "");
    if (text === "" || !/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(text)) return null;
    return new Decimal(text);
};

/** Rounds half away from zero and drops negative zero, so -0.001 → 0. */
const roundForDisplay = (value: Decimal, decimals: number) => {
    const rounded = value.toDecimalPlaces(decimals, Decimal.ROUND_HALF_UP);
    return rounded.isZero() ? new Decimal(0) : rounded;
};

const formatterCache = new Map<string, Intl.NumberFormat>();

const getFormatter = (locale: string, options: Intl.NumberFormatOptions) => {
    const key = `${locale}|${JSON.stringify(options)}`;
    let formatter = formatterCache.get(key);
    if (!formatter) {
        formatter = new Intl.NumberFormat(locale, options);
        formatterCache.set(key, formatter);
    }
    return formatter;
};

/** 1234.5 → "1,234.50" (en-IN, 2 decimals). */
export const formatNumber = (value: NumericInput, options: NumberDisplayOptions = {}): string => {
    const { decimals = DECIMALS.amount, fallback = "", locale = APP_LOCALE, grouping = true } = options;
    const parsed = toDecimal(value);
    if (!parsed) return fallback;

    return getFormatter(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouping,
    }).format(roundForDisplay(parsed, decimals).toNumber());
};

/** Weight in grams with 3 decimals: 12.5 → "12.500". */
export const formatWeight = (value: NumericInput, options: NumberDisplayOptions = {}) =>
    formatNumber(value, { decimals: DECIMALS.weight, ...options });

/** Pure (fine) weight with 3 decimals. */
export const formatPureWeight = (value: NumericInput, options: NumberDisplayOptions = {}) =>
    formatNumber(value, { decimals: DECIMALS.pureWeight, ...options });

/** Money amount without a currency symbol: 1500 → "1,500.00". */
export const formatAmount = (value: NumericInput, options: NumberDisplayOptions = {}) =>
    formatNumber(value, { decimals: DECIMALS.amount, ...options });

/** Rate per gram without a currency symbol. */
export const formatRate = (value: NumericInput, options: NumberDisplayOptions = {}) =>
    formatNumber(value, { decimals: DECIMALS.rate, ...options });

/** Whole pieces by default: 3 → "3"; pass `unit` for "3 pcs". */
export const formatQuantity = (
    value: NumericInput,
    options: NumberDisplayOptions & { unit?: string } = {}
) => {
    const { unit, ...rest } = options;
    const text = formatNumber(value, { decimals: DECIMALS.quantity, ...rest });
    return unit && toDecimal(value) ? `${text} ${unit}` : text;
};

/**
 * Percentage given in points, as the app stores it: 12.5 → "12.50%".
 * Pass `decimals` to change precision.
 */
export const formatPercent = (value: NumericInput, options: NumberDisplayOptions = {}) => {
    const text = formatNumber(value, { decimals: DECIMALS.percent, ...options });
    return toDecimal(value) ? `${text}%` : text;
};

export type CurrencyDisplayOptions = NumberDisplayOptions & {
    currency?: string;
    /**
     * "symbol" → "₹1,500.00" (Intl), "spaced" → "₹ 1,500.00" (print style),
     * "code" → "INR 1,500.00".
     */
    display?: "symbol" | "spaced" | "code";
};

/**
 * Money with its currency. Locale and currency default to the app's
 * (en-IN, INR); negatives keep their sign: -50 → "-₹50.00".
 */
export const formatCurrency = (value: NumericInput, options: CurrencyDisplayOptions = {}): string => {
    const {
        decimals = DECIMALS.amount,
        fallback = "",
        locale = APP_LOCALE,
        grouping = true,
        currency = APP_CURRENCY,
        display = "symbol",
    } = options;
    const parsed = toDecimal(value);
    if (!parsed) return fallback;

    const rounded = roundForDisplay(parsed, decimals);
    if (display === "symbol") {
        return getFormatter(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            useGrouping: grouping,
        }).format(rounded.toNumber());
    }

    const symbol =
        display === "code"
            ? currency
            : getFormatter(locale, { style: "currency", currency })
                  .formatToParts(0)
                  .find((part) => part.type === "currency")?.value ?? currency;
    const sign = rounded.isNegative() ? "-" : "";
    const amount = formatNumber(rounded.abs(), { decimals, locale, grouping });
    return `${sign}${symbol} ${amount}`;
};
