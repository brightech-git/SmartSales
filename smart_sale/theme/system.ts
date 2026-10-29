import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { tokens } from "./tokens";
import { semanticTokens } from "./semantic-tokens";
import { layerStyles, textStyles } from "./text-styles";
import { recipes, slotRecipes } from "./recipes";
import { DEFAULT_PALETTE_ID, PALETTES, getPalette, paletteVars } from "./palettes";

// Sidebar styles, selected with <html data-sidebar="light|brand">.
const sidebarLight = {
    "--ss-sidebar-bg": "#FFFFFF",
    "--ss-sidebar-border": "#E1E1E8",
    "--ss-sidebar-fg": "#1A1A21",
    "--ss-sidebar-fg-muted": "#555563",
    "--ss-sidebar-fg-subtle": "#9C9CAA",
    "--ss-sidebar-hover": "#F6F6F9",
    "--ss-sidebar-active": "var(--ss-brand-50)",
    "--ss-sidebar-active-fg": "var(--ss-brand-700)",
    "--ss-sidebar-accent": "var(--ss-brand-600)",
};
const sidebarLightOnDark = {
    "--ss-sidebar-bg": "#1A1A21",
    "--ss-sidebar-border": "#2A2A33",
    "--ss-sidebar-fg": "#F6F6F9",
    "--ss-sidebar-fg-muted": "#CACAD4",
    "--ss-sidebar-fg-subtle": "#727282",
    "--ss-sidebar-hover": "#2A2A33",
    "--ss-sidebar-active": "color-mix(in srgb, var(--ss-brand-500) 24%, transparent)",
    "--ss-sidebar-active-fg": "var(--ss-brand-200)",
    "--ss-sidebar-accent": "var(--ss-brand-300)",
};
const sidebarBrand = {
    "--ss-sidebar-bg": "var(--ss-brand-950)",
    "--ss-sidebar-border": "rgba(255,255,255,0.08)",
    "--ss-sidebar-fg": "rgba(255,255,255,0.94)",
    "--ss-sidebar-fg-muted": "rgba(255,255,255,0.68)",
    "--ss-sidebar-fg-subtle": "rgba(255,255,255,0.44)",
    "--ss-sidebar-hover": "rgba(255,255,255,0.07)",
    "--ss-sidebar-active": "color-mix(in srgb, var(--ss-accent-400) 18%, transparent)",
    "--ss-sidebar-active-fg": "#FFFFFF",
    "--ss-sidebar-accent": "var(--ss-accent-400)",
};

// One rule per selectable palette: <html data-palette="emerald"> etc.
const paletteRules = Object.fromEntries(
    PALETTES.map((p) => [`html[data-palette="${p.id}"]`, paletteVars(p)])
);

/**
 * Smart Sales design system — the single source of truth for colors, type,
 * spacing, radii, shadows and component styling. Passed to <ChakraProvider>
 * in components/ui/provider.tsx. The colour palette and sidebar style are
 * runtime choices (data-palette / data-sidebar on <html>), see
 * context/theme/themeContext.tsx.
 *
 * Breakpoints are Chakra's defaults and are what the shell is built against:
 *   sm 480px · md 768px (sidebar becomes a drawer below this) · lg 1024px
 *   xl 1280px · 2xl 1536px
 */
const config = defineConfig({
    globalCss: {
        ":root": {
            ...paletteVars(getPalette(DEFAULT_PALETTE_ID)),
            ...sidebarLight,
            "--app-header-h": "sizes.header",
            // Older screens reference these font variables directly.
            "--font-lustria": "var(--font-inter)",
            "--font-domine": "var(--font-inter)",
            "--font-alice": "var(--font-inter)",
        },
        ...paletteRules,
        ".dark": sidebarLightOnDark,
        'html[data-sidebar="brand"], html.dark[data-sidebar="brand"]': sidebarBrand,
        html: {
            fontFamily: "body",
            fontSize: "16px",
            bg: "bg.canvas",
            color: "fg",
        },
        body: {
            bg: "bg.canvas",
            color: "fg",
            fontSize: "ui",
        },
        "*::placeholder": { color: "fg.subtle" },
        "::selection": { bg: "brand.100", color: "brand.900" },
    },
    theme: {
        tokens,
        semanticTokens,
        textStyles,
        layerStyles,
        recipes,
        slotRecipes,
    },
});

export const system = createSystem(defaultConfig, config);
