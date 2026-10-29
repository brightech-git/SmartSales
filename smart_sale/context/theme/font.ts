import { Inter, Manrope } from "next/font/google";

// Body, forms and tables. Inter has tabular numerals for amounts and weights.
export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

// Page and section titles only.
export const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
    weight: ["500", "600", "700"],
    display: "swap",
});

export const fontVariables = `${inter.variable} ${manrope.variable}`;
