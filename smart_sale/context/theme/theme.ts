export type FontTokens = {
    primary: string;
    heading: string;
    body: string;
    special: string;
    secondary: string;
    body2:string;
};

export type ColorTokens = {
    primary: string;               // brand maroon #80004D
    secondary: string;             // brand gold #D4AF37
    bg: string;                    // page background #FFF2D8
    inverseText: string;           // text on dark/colored surfaces #FFF
    primaryText: string;           // #222
    secondaryText: string;         // #444
    red: string;
    green: string;
    blue: string;
    yellow: string;
    accient:string;
    formColor:string;
    whiteColor:string;
    greyColor:string;
    sideBar:string;
    sideBarFrom:string;
    sideBarTo:string;
    sideBarFont:string;
};

export type FontSizeTokens = {
    heading: string;
    headingSm: string;
    body: string;
    bodySm: string;
};

export type SpacingTokens = {
    full: string;
    large: string;
    medium: string;
    low: string;
};

export type DesignTokens = {
    fonts: FontTokens;
    colors: ColorTokens;
    fontSizes: FontSizeTokens;
    spacing: SpacingTokens;
};

export const designTokens: DesignTokens = {
    fonts: {
        primary: "Alice, serif",
        heading: "Nosifer, cursive",
        body: "Lustria, serif",
        special: "Rancho, cursive",
        secondary: "Sofia, cursive",
        body2:"Domine, sans-serif",
    },

    colors: {
        primary: "#80004D",
        secondary: "#D4AF37",
        bg: "#EEE",
        inverseText: "#FFFFFF",
        primaryText: "#222222",
        secondaryText: "#5C4A3D",
        red: "#771717",
        green: "#104d26",
        blue: "#45078b",
        yellow: "#EAB308",
        accient:"#EEE",
        formColor:'#FFF',
        whiteColor: '#FFF',
        greyColor:'#F5F5F5',
        sideBar:'#5A0038',
        sideBarFrom:'#80004D',
        sideBarTo:'#4A0029',
        sideBarFont: '#EAD9C4'

    },

    fontSizes: {
        heading: "12px",
        headingSm: "10px",
        body: "10px",
        bodySm: "10px",
    },

    spacing: {
        full: "50%",
        large: "10px",
        medium: "6px",
        low: "4px",
    },
};
// Legacy token bridge: older screens read these via useTheme(). Values are
// kept in step with the Chakra system in /theme so both look the same.
export const lightTheme: DesignTokens = {
    ...designTokens,
    fonts: {
        primary: "var(--font-inter), sans-serif",
        heading: "var(--font-manrope), sans-serif",
        body: "var(--font-inter), sans-serif",
        special: "var(--font-manrope), sans-serif",
        secondary: "var(--font-inter), sans-serif",
        body2: "var(--font-inter), sans-serif",
    },
    colors: {
        ...designTokens.colors,
        primary: "#80004D",
        secondary: "#D4AF37",
        bg: "#F6F6F9",
        inverseText: "#FFFFFF",
        primaryText: "#1A1A21",
        secondaryText: "#555563",
        accient: "#FBF0F5",
        formColor: '#FFF',
        whiteColor: '#FFF',
        greyColor: '#EEEEF2',
        sideBar: '#2C1024',
        sideBarFrom: '#2C1024',
        sideBarTo: '#200B1A',
        sideBarFont: '#EDE3EA',
    },
};

export const darkTheme: DesignTokens = {
    ...lightTheme,
    colors: {
        ...lightTheme.colors,
        primary: "#D4AF37",
        secondary: "#80004D",
        bg: "#111116",
        inverseText: "#FFFFFF",
        primaryText: "#F6F6F9",
        secondaryText: "#CACAD4",
        accient: "#3B0024",
        formColor: '#1A1A21',
        whiteColor: '#FFF',
        greyColor: '#2A2A33',
    },
};
