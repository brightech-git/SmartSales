import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";
import {
    formatAmount,
    formatCurrency,
    formatNumber,
    formatPercent,
    formatQuantity,
    formatRate,
    formatWeight,
    toDecimal,
} from "./number";

describe("toDecimal", () => {
    it.each([null, undefined, "", "   ", "abc", "12abc", NaN, Infinity, -Infinity])("returns null for %p", (value) => {
        expect(toDecimal(value as never)).toBeNull();
    });

    it("parses numbers, numeric strings, grouped strings and Decimals", () => {
        expect(toDecimal(0)?.toString()).toBe("0");
        expect(toDecimal(" 12.5 ")?.toString()).toBe("12.5");
        expect(toDecimal("1,23,456.75")?.toString()).toBe("123456.75");
        expect(toDecimal("-0.5")?.toString()).toBe("-0.5");
        expect(toDecimal(new Decimal("3.14"))?.toString()).toBe("3.14");
    });
});

describe("formatNumber", () => {
    it("formats zero instead of treating it as missing", () => {
        expect(formatNumber(0)).toBe("0.00");
        expect(formatNumber("0")).toBe("0.00");
    });

    it("returns the fallback for missing and invalid values", () => {
        expect(formatNumber(null)).toBe("");
        expect(formatNumber(undefined, { fallback: "—" })).toBe("—");
        expect(formatNumber("n/a", { fallback: "-" })).toBe("-");
        expect(formatNumber(NaN, { fallback: "-" })).toBe("-");
    });

    it("rounds half away from zero on the decimal value, not the float", () => {
        expect(formatNumber(1.005)).toBe("1.01");
        expect(formatNumber(2.675)).toBe("2.68");
        expect(formatNumber(-1.005)).toBe("-1.01");
        expect(formatWeight(0.0005)).toBe("0.001");
    });

    it("does not show negative zero", () => {
        expect(formatNumber(-0)).toBe("0.00");
        expect(formatNumber(-0.001)).toBe("0.00");
    });

    it("uses Indian digit grouping and can turn grouping off", () => {
        expect(formatNumber(1234567.8)).toBe("12,34,567.80");
        expect(formatNumber(1234567.8, { grouping: false })).toBe("1234567.80");
    });

    it("keeps the sign of negative values", () => {
        expect(formatAmount(-2500)).toBe("-2,500.00");
    });
});

describe("domain number formatters", () => {
    it("uses the business decimals", () => {
        expect(formatWeight(12.5)).toBe("12.500");
        expect(formatAmount("1500")).toBe("1,500.00");
        expect(formatRate(6543.219)).toBe("6,543.22");
    });

    it("formats quantities as whole pieces with an optional unit", () => {
        expect(formatQuantity(3)).toBe("3");
        expect(formatQuantity(3, { unit: "pcs" })).toBe("3 pcs");
        expect(formatQuantity(null, { unit: "pcs", fallback: "—" })).toBe("—");
    });

    it("formats percentages given in points", () => {
        expect(formatPercent(12.5)).toBe("12.50%");
        expect(formatPercent(0)).toBe("0.00%");
        expect(formatPercent(91.6, { decimals: 1 })).toBe("91.6%");
        expect(formatPercent(undefined)).toBe("");
    });
});

describe("formatCurrency", () => {
    it("uses INR in en-IN by default", () => {
        expect(formatCurrency(1500)).toBe("₹1,500.00");
        expect(formatCurrency(0)).toBe("₹0.00");
    });

    it("handles negatives and rounding", () => {
        expect(formatCurrency(-50)).toBe("-₹50.00");
        expect(formatCurrency(1.005)).toBe("₹1.01");
    });

    it("supports whole rupees, print spacing and codes", () => {
        expect(formatCurrency(7245.6, { decimals: 0 })).toBe("₹7,246");
        expect(formatCurrency(1500, { display: "spaced" })).toBe("₹ 1,500.00");
        expect(formatCurrency(-1500, { display: "spaced" })).toBe("-₹ 1,500.00");
        expect(formatCurrency(1500, { display: "code" })).toBe("INR 1,500.00");
    });

    it("respects an explicit currency and locale", () => {
        expect(formatCurrency(1500, { currency: "USD", locale: "en-US" })).toBe("$1,500.00");
    });

    it("returns the fallback for missing values", () => {
        expect(formatCurrency(null)).toBe("");
        expect(formatCurrency(undefined, { fallback: "—" })).toBe("—");
    });
});
