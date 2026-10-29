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
        // Brand + accent palettes, usable as colorPalette="brand" / "gold"
        brand: palette("brand"),
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

        // Application shell. The sidebar stays dark in both modes so navigation
        // reads as a separate layer from the work area.
        sidebar: {
            bg: { value: "{colors.aubergine.800}" },
            bgRaised: { value: "{colors.aubergine.700}" },
            border: { value: "rgba(255,255,255,0.08)" },
            fg: { value: "rgba(255,255,255,0.92)" },
            fgMuted: { value: "rgba(255,255,255,0.62)" },
            fgSubtle: { value: "rgba(255,255,255,0.42)" },
            hover: { value: "rgba(255,255,255,0.07)" },
            active: { value: "rgba(212,175,55,0.14)" },
            accent: { value: "{colors.gold.400}" },
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
