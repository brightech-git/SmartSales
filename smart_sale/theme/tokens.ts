import { defineTokens } from "@chakra-ui/react";

/**
 * Raw design tokens for Smart Sales.
 *
 * Brand identity: a deep garnet (from the original #80004D) carries primary
 * actions and selection, and a restrained gold (from the original #D4AF37)
 * is used sparingly as a highlight for active navigation and rate data.
 * Everything else sits on a cool, quiet neutral scale so dense data stays
 * readable.
 */
export const tokens = defineTokens({
    colors: {
        brand: {
            50: { value: "#FBF0F5" },
            100: { value: "#F5DDEA" },
            200: { value: "#E8B9D2" },
            300: { value: "#D387B0" },
            400: { value: "#B8508A" },
            500: { value: "#9A1F66" },
            600: { value: "#80004D" },
            700: { value: "#68003F" },
            800: { value: "#510032" },
            900: { value: "#3B0024" },
            950: { value: "#250017" },
        },
        gold: {
            50: { value: "#FDF9EC" },
            100: { value: "#FAF0CC" },
            200: { value: "#F3DF96" },
            300: { value: "#E9C95E" },
            400: { value: "#D4AF37" },
            500: { value: "#B8942A" },
            600: { value: "#957421" },
            700: { value: "#72581B" },
            800: { value: "#554118" },
            900: { value: "#3B2D12" },
            950: { value: "#231A0A" },
        },
        neutral: {
            25: { value: "#FCFCFD" },
            50: { value: "#F6F6F9" },
            100: { value: "#EEEEF2" },
            200: { value: "#E1E1E8" },
            300: { value: "#CACAD4" },
            400: { value: "#9C9CAA" },
            500: { value: "#727282" },
            600: { value: "#555563" },
            700: { value: "#40404B" },
            800: { value: "#2A2A33" },
            900: { value: "#1A1A21" },
            950: { value: "#111116" },
        },
        aubergine: {
            700: { value: "#3A1630" },
            800: { value: "#2C1024" },
            900: { value: "#200B1A" },
        },
    },

    fonts: {
        heading: { value: "var(--font-manrope), var(--font-inter), 'Segoe UI', system-ui, sans-serif" },
        body: { value: "var(--font-inter), 'Segoe UI', system-ui, -apple-system, sans-serif" },
        mono: { value: "ui-monospace, 'Cascadia Mono', 'Consolas', monospace" },
    },

    // Adds 11px ("dense") and 13px ("ui") steps between Chakra's
    // 2xs (10px), xs (12px) and sm (14px) for data-heavy screens.
    fontSizes: {
        dense: { value: "0.6875rem" },
        ui: { value: "0.8125rem" },
    },

    radii: {
        xs: { value: "0.1875rem" }, // 3px
        sm: { value: "0.25rem" }, // 4px
        md: { value: "0.375rem" }, // 6px
        lg: { value: "0.5rem" }, // 8px
        xl: { value: "0.75rem" }, // 12px
    },

    sizes: {
        header: { value: "56px" },
        sidebar: {
            collapsed: { value: "64px" },
            expanded: { value: "260px" },
        },
        page: {
            narrow: { value: "960px" },
            default: { value: "1440px" },
            wide: { value: "1760px" },
        },
    },

    durations: {
        fast: { value: "120ms" },
        moderate: { value: "200ms" },
    },
});
