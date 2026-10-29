import { APP_LOCALE, DATE_SEPARATOR } from "./config";

/**
 * Display-only date and time formatting. API dates go through
 * formatDateForAPI.ts; keep the two separate.
 *
 * Missing (null, undefined, "") and invalid values return `fallback`
 * ("" by default) instead of "Invalid Date" or a wrong day.
 */

export type DateInput = Date | string | number | null | undefined;

export type DateDisplayOptions = {
    fallback?: string;
    locale?: string;
    /** IANA zone such as "Asia/Kolkata". Omitted = the device's local zone. */
    timeZone?: string;
};

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_FIRST = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/;

const localDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    // Reject roll-overs such as 31-02-2026 → 03-03-2026.
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
};

/**
 * Parses what the API and forms send into a Date, or null when missing or
 * invalid. Date-only strings ("2026-10-29", "29-10-2026", "29/10/2026") are
 * read as local calendar dates so they never shift a day across timezones.
 */
export const parseDate = (value: DateInput): Date | null => {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    if (typeof value === "number") {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    const text = value.trim();
    if (!text) return null;

    const iso = DATE_ONLY.exec(text);
    if (iso) return localDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));
    const dayFirst = DAY_FIRST.exec(text);
    if (dayFirst) return localDate(Number(dayFirst[3]), Number(dayFirst[2]), Number(dayFirst[1]));

    const date = new Date(text);
    return Number.isNaN(date.getTime()) ? null : date;
};

const partsOf = (date: Date, options: Intl.DateTimeFormatOptions, locale: string) => {
    const parts: Record<string, string> = {};
    for (const part of new Intl.DateTimeFormat(locale, options).formatToParts(date)) parts[part.type] = part.value;
    return parts;
};

export type DateStyle = "numeric" | "medium" | "long";

/**
 * "numeric" → "29-10-2026" (the app's standard), "medium" → "29 Oct 2026",
 * "long" → "29 October 2026". `separator` changes the numeric divider.
 */
export const formatDate = (
    value: DateInput,
    options: DateDisplayOptions & { style?: DateStyle; separator?: string } = {}
): string => {
    const { fallback = "", locale = APP_LOCALE, timeZone, style = "numeric", separator = DATE_SEPARATOR } = options;
    const date = parseDate(value);
    if (!date) return fallback;

    if (style === "numeric") {
        const p = partsOf(date, { day: "2-digit", month: "2-digit", year: "numeric", timeZone }, locale);
        return [p.day, p.month, p.year].join(separator);
    }
    const p = partsOf(date, { day: "numeric", month: style === "long" ? "long" : "short", year: "numeric", timeZone }, locale);
    return `${p.day} ${p.month} ${p.year}`;
};

/** "02:05 PM", or "02:05:09 PM" with `seconds`. */
export const formatTime = (
    value: DateInput,
    options: DateDisplayOptions & { seconds?: boolean; hour12?: boolean } = {}
): string => {
    const { fallback = "", locale = APP_LOCALE, timeZone, seconds = false, hour12 = true } = options;
    const date = parseDate(value);
    if (!date) return fallback;

    const p = partsOf(
        date,
        { hour: "2-digit", minute: "2-digit", second: seconds ? "2-digit" : undefined, hour12, timeZone },
        locale
    );
    const clock = [p.hour, p.minute, seconds ? p.second : null].filter(Boolean).join(":");
    return hour12 && p.dayPeriod ? `${clock} ${p.dayPeriod.toUpperCase()}` : clock;
};

/** "29-10-2026 02:05 PM". */
export const formatDateTime = (
    value: DateInput,
    options: DateDisplayOptions & { style?: DateStyle; seconds?: boolean } = {}
): string => {
    const { fallback = "", ...rest } = options;
    if (!parseDate(value)) return fallback;
    return `${formatDate(value, rest)} ${formatTime(value, rest)}`;
};
