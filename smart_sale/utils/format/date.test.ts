import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, formatTime, parseDate } from "./date";

// vitest.config.mts pins TZ to America/New_York, a zone behind UTC, which is
// where date-only strings used to slip back a day.

describe("parseDate", () => {
    it.each([null, undefined, "", "  ", "not a date", "31-02-2026", "2026-13-01"])("returns null for %p", (value) => {
        expect(parseDate(value)).toBeNull();
    });

    it("returns null for an invalid Date object", () => {
        expect(parseDate(new Date("nope"))).toBeNull();
    });

    it("reads date-only strings as local calendar dates", () => {
        const iso = parseDate("2026-10-29");
        expect([iso?.getFullYear(), iso?.getMonth(), iso?.getDate()]).toEqual([2026, 9, 29]);
        const dayFirst = parseDate("05/01/2026");
        expect([dayFirst?.getFullYear(), dayFirst?.getMonth(), dayFirst?.getDate()]).toEqual([2026, 0, 5]);
    });
});

describe("formatDate", () => {
    it("uses dd-mm-yyyy by default", () => {
        expect(formatDate("2026-10-29")).toBe("29-10-2026");
        expect(formatDate(new Date(2026, 0, 5))).toBe("05-01-2026");
    });

    it("does not shift date-only values across timezones", () => {
        expect(formatDate("2026-01-01")).toBe("01-01-2026");
    });

    it("supports separators and named styles", () => {
        expect(formatDate("2026-10-29", { separator: "/" })).toBe("29/10/2026");
        expect(formatDate("2026-10-29", { style: "medium" })).toBe("29 Oct 2026");
        expect(formatDate("2026-10-29", { style: "long" })).toBe("29 October 2026");
    });

    it("applies an explicit timeZone to timestamps", () => {
        expect(formatDate("2026-10-29T20:00:00Z", { timeZone: "Asia/Kolkata" })).toBe("30-10-2026");
        expect(formatDate("2026-10-29T20:00:00Z", { timeZone: "UTC" })).toBe("29-10-2026");
    });

    it("returns the fallback for missing or invalid input", () => {
        expect(formatDate(null)).toBe("");
        expect(formatDate(undefined, { fallback: "—" })).toBe("—");
        expect(formatDate("garbage", { fallback: "—" })).toBe("—");
    });
});

describe("formatTime and formatDateTime", () => {
    const value = new Date(2026, 9, 29, 14, 5, 9);

    it("formats 12-hour time with an upper-case period", () => {
        expect(formatTime(value)).toBe("02:05 PM");
        expect(formatTime(value, { seconds: true })).toBe("02:05:09 PM");
    });

    it("formats 24-hour time", () => {
        expect(formatTime(value, { hour12: false })).toBe("14:05");
    });

    it("joins date and time and handles missing input", () => {
        expect(formatDateTime(value)).toBe("29-10-2026 02:05 PM");
        expect(formatDateTime(null, { fallback: "—" })).toBe("—");
        expect(formatTime("bad", { fallback: "—" })).toBe("—");
    });
});
