import { defineSemanticTokens } from "@chakra-ui/react";

/** Builds the semantic keys Chakra expects for a `colorPalette` from a raw scale. */
const palette = (scale: string, solidShade = "600") => ({
    contrast: { value: { _light: "white", _dark: "white" } },
    fg: { value: { _light: `{colors.${scale}.700}`, _dark: `{colors.${scale}.300}` } },
    subtle: { value: { _light: `{colors.${scale}.50}`, _dark: `{colors.${scale}.950}` } },
    muted: { value: { _light: `{colors.${scale}.100}`, _dark: `{colors.${scale}.900}` } },
    emphasized: { value: { _light: `{colors.${scale}.200}`, _dark: `{colors.${scale}.800}` } },
    solid: { value: { _light: `{colors.${scale}.${solidShade}}`, _dark: `{colors.${scale}.500}` } },
    focusRing: { value: { _light: `{colors.${scale}.500}`, _dark: `{colors.${scale}.400}` } },
    border: { value: { _light: `{colors.${scale}.300}`, _dark: `{colors.${scale}.700}` } },
});

export const semanticTokens = defineSemanticTokens({
    colors: {
        // Primary / secondary palettes, usable as colorPalette="brand" / "accent".
        // "gold" stays real gold for metal-specific UI (rates).
        brand: palette("brand"),
        accent: {
            ...palette("accent", "400"),
            contrast: { value: { _light: "{colors.accent.950}", _dark: "{colors.accent.950}" } },
            solid: { value: { _light: "{colors.accent.400}", _dark: "{colors.accent.400}" } },
            fg: { value: { _light: "{colors.accent.700}", _dark: "{colors.accent.300}" } },
        },
        gold: {
            ...palette("gold", "500"),
            contrast: { value: { _light: "{colors.gold.950}", _dark: "{colors.gold.950}" } },
            solid: { value: { _light: "{colors.gold.400}", _dark: "{colors.gold.400}" } },
        },

        // Status palettes, usable as colorPalette="success" | "warning" | "danger" | "info"
        success: palette("green"),
        warning: { ...palette("orange", "500") },
        danger: palette("red"),
        info: palette("blue"),

        // Neutral form controls get a brand focus ring everywhere.
        gray: {
            focusRing: { value: { _light: "{colors.brand.500}", _dark: "{colors.brand.300}" } },
        },

        // Surfaces
        bg: {
            DEFAULT: { value: { _light: "{colors.white}", _dark: "{colors.neutral.950}" } },
            canvas: { value: { _light: "{colors.neutral.50}", _dark: "{colors.neutral.950}" } },
            panel: { value: { _light: "{colors.white}", _dark: "{colors.neutral.900}" } },
            subtle: { value: { _light: "{colors.neutral.50}", _dark: "{colors.neutral.900}" } },
            muted: { value: { _light: "{colors.neutral.100}", _dark: "{colors.neutral.800}" } },
            emphasized: { value: { _light: "{colors.neutral.200}", _dark: "{colors.neutral.700}" } },
            hover: { value: { _light: "{colors.neutral.100}", _dark: "{colors.neutral.800}" } },
            selected: { value: { _light: "{colors.brand.50}", _dark: "{colors.brand.950}" } },
            highlight: { value: { _light: "{colors.gold.50}", _dark: "{colors.gold.950}" } },
        },

        // Text
        fg: {
            DEFAULT: { value: { _light: "{colors.neutral.900}", _dark: "{colors.neutral.50}" } },
            muted: { value: { _light: "{colors.neutral.600}", _dark: "{colors.neutral.300}" } },
            subtle: { value: { _light: "{colors.neutral.500}", _dark: "{colors.neutral.400}" } },
            brand: { value: { _light: "{colors.brand.600}", _dark: "{colors.brand.300}" } },
        },

        // Borders
        border: {
            DEFAULT: { value: { _light: "{colors.neutral.200}", _dark: "{colors.neutral.800}" } },
            muted: { value: { _light: "{colors.neutral.100}", _dark: "{colors.neutral.900}" } },
            emphasized: { value: { _light: "{colors.neutral.300}", _dark: "{colors.neutral.700}" } },
            focus: { value: { _light: "{colors.brand.500}", _dark: "{colors.brand.300}" } },
        },

        // Application shell. Sidebar colours are CSS variables set in
        // system.ts so the sidebar style (light / brand) can be switched at
        // runtime from the Appearance drawer.
        sidebar: {
            bg: { value: "var(--ss-sidebar-bg)" },
            border: { value: "var(--ss-sidebar-border)" },
            fg: { value: "var(--ss-sidebar-fg)" },
            fgMuted: { value: "var(--ss-sidebar-fg-muted)" },
            fgSubtle: { value: "var(--ss-sidebar-fg-subtle)" },
            hover: { value: "var(--ss-sidebar-hover)" },
            active: { value: "var(--ss-sidebar-active)" },
            activeFg: { value: "var(--ss-sidebar-active-fg)" },
            accent: { value: "var(--ss-sidebar-accent)" },
        },
        header: {
            bg: { value: { _light: "{colors.white}", _dark: "{colors.neutral.900}" } },
            border: { value: { _light: "{colors.neutral.200}", _dark: "{colors.neutral.800}" } },
        },
    },

    radii: {
        l1: { value: "{radii.sm}" }, // 4px — small controls, badges
        l2: { value: "{radii.md}" }, // 6px — buttons, inputs
        l3: { value: "{radii.lg}" }, // 8px — cards, dialogs, menus
    },

    shadows: {
        card: {
            value: {
                _light: "0 1px 2px rgba(17,17,22,0.04), 0 1px 3px rgba(17,17,22,0.06)",
                _dark: "0 0 0 1px rgba(255,255,255,0.04)",
            },
        },
        raised: {
            value: {
                _light: "0 4px 12px rgba(17,17,22,0.08), 0 1px 3px rgba(17,17,22,0.06)",
                _dark: "0 4px 12px rgba(0,0,0,0.5)",
            },
        },
        overlay: {
            value: {
                _light: "0 16px 40px rgba(17,17,22,0.16), 0 2px 6px rgba(17,17,22,0.08)",
                _dark: "0 16px 40px rgba(0,0,0,0.6)",
            },
        },
    },
});
