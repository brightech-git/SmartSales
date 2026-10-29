/**
 * Colour themes the user can pick from the header (Appearance drawer).
 * Each theme pairs a primary ("brand") scale with a secondary ("accent")
 * scale. The scales are applied as CSS variables (--ss-brand-*, --ss-accent-*)
 * so switching theme needs no re-render of styled components.
 */

export type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type ColorScale = Record<Shade, string>;

export type Palette = {
    id: string;
    name: string;
    description: string;
    brand: ColorScale;
    accent: ColorScale;
};

export const SHADES: Shade[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export const PALETTES: Palette[] = [
    {
        id: "garnet",
        name: "Garnet & Gold",
        description: "Signature jewellery look",
        brand: { 50: "#F6EDF3", 100: "#EBD6E3", 200: "#D6ADC6", 300: "#BD7AA2", 400: "#A4477F", 500: "#8F1F62", 600: "#80004D", 700: "#69003F", 800: "#530032", 900: "#3D0025", 950: "#260017" },
        accent: { 50: "#FBF7EB", 100: "#F6EDD3", 200: "#EDDDAB", 300: "#E1C773", 400: "#D4AF37", 500: "#B6962F", 600: "#947A26", 700: "#725E1E", 800: "#554616", 900: "#3B310F", 950: "#221C09" },
    },
    {
        id: "emerald",
        name: "Emerald & Gold",
        description: "Fresh and calm",
        brand: { 50: "#EEF5F3", 100: "#D8E7E3", 200: "#B2D0C6", 300: "#82B2A3", 400: "#519480", 500: "#2B7D63", 600: "#0E6B4E", 700: "#0B5840", 800: "#094633", 900: "#073325", 950: "#042017" },
        accent: { 50: "#FBF7EB", 100: "#F6EDD3", 200: "#EDDDAB", 300: "#E1C773", 400: "#D4AF37", 500: "#B6962F", 600: "#947A26", 700: "#725E1E", 800: "#554616", 900: "#3B310F", 950: "#221C09" },
    },
    {
        id: "sapphire",
        name: "Sapphire & Silver",
        description: "Cool and corporate",
        brand: { 50: "#EFF2F8", 100: "#DBE2EF", 200: "#B7C6DF", 300: "#8AA2CA", 400: "#5D7EB6", 500: "#3961A6", 600: "#1E4C9A", 700: "#193E7E", 800: "#143164", 900: "#0E244A", 950: "#09172E" },
        accent: { 50: "#F5F6F8", 100: "#E9EBEE", 200: "#D5DAE0", 300: "#B8C1CA", 400: "#9AA6B4", 500: "#848F9B", 600: "#6C747E", 700: "#535A61", 800: "#3E4248", 900: "#2B2E32", 950: "#191B1D" },
    },
    {
        id: "plum",
        name: "Royal Plum & Rose Gold",
        description: "Soft and premium",
        brand: { 50: "#F3F0F7", 100: "#E5DDEC", 200: "#CABBD8", 300: "#A990C0", 400: "#8866A8", 500: "#6E4495", 600: "#5A2A86", 700: "#4A226E", 800: "#3A1B57", 900: "#2B1440", 950: "#1B0D28" },
        accent: { 50: "#FAF3F0", 100: "#F3E5DE", 200: "#E8CEC1", 300: "#D9AE97", 400: "#C98B6B", 500: "#AD785C", 600: "#8D614B", 700: "#6D4B3A", 800: "#50382B", 900: "#38271E", 950: "#201611" },
    },
    {
        id: "teal",
        name: "Teal & Copper",
        description: "Modern wholesale",
        brand: { 50: "#EEF4F5", 100: "#D8E7E9", 200: "#B1CFD3", 300: "#80B0B7", 400: "#4F929B", 500: "#287A85", 600: "#0B6874", 700: "#09555F", 800: "#07444B", 900: "#053238", 950: "#031F23" },
        accent: { 50: "#F9F2EC", 100: "#F1E2D5", 200: "#E5C7AE", 300: "#D3A278", 400: "#C07A3E", 500: "#A56935", 600: "#86552B", 700: "#684221", 800: "#4D3119", 900: "#362211", 950: "#1F140A" },
    },
    {
        id: "graphite",
        name: "Graphite & Amber",
        description: "Neutral, high contrast",
        brand: { 50: "#F1F1F2", 100: "#DEDFE0", 200: "#BDBEC2", 300: "#93959B", 400: "#6A6D75", 500: "#494C56", 600: "#30343F", 700: "#272B34", 800: "#1F2229", 900: "#17191E", 950: "#0E1013" },
        accent: { 50: "#FCF6E9", 100: "#F8EBCF", 200: "#F2D9A4", 300: "#E9C067", 400: "#E0A526", 500: "#C18E21", 600: "#9D731B", 700: "#795915", 800: "#5A420F", 900: "#3F2E0B", 950: "#241A06" },
    },
];

export const DEFAULT_PALETTE_ID = "garnet";

export const getPalette = (id?: string | null): Palette =>
    PALETTES.find((p) => p.id === id) ?? PALETTES[0];

/** CSS custom properties for one palette, e.g. { "--ss-brand-600": "#80004D", ... }. */
export const paletteVars = (palette: Palette): Record<string, string> => {
    const vars: Record<string, string> = {};
    for (const shade of SHADES) {
        vars[`--ss-brand-${shade}`] = palette.brand[shade];
        vars[`--ss-accent-${shade}`] = palette.accent[shade];
    }
    return vars;
};
