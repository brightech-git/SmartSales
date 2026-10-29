import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { tokens } from "./tokens";
import { semanticTokens } from "./semantic-tokens";
import { layerStyles, textStyles } from "./text-styles";
import { recipes, slotRecipes } from "./recipes";

/**
 * Smart Sales design system — the single source of truth for colors, type,
 * spacing, radii, shadows and component styling. Passed to <ChakraProvider>
 * in components/ui/provider.tsx.
 *
 * Breakpoints are Chakra's defaults and are what the shell is built against:
 *   sm 480px · md 768px (sidebar becomes a drawer below this) · lg 1024px
 *   xl 1280px · 2xl 1536px
 */
const config = defineConfig({
    globalCss: {
        ":root": {
            "--app-header-h": "sizes.header",
            // Older screens reference these font variables directly.
            "--font-lustria": "var(--font-inter)",
            "--font-domine": "var(--font-inter)",
            "--font-alice": "var(--font-inter)",
        },
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
