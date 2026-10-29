"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DesignTokens } from "./theme";
import { lightTheme, darkTheme } from "./theme";
import { DEFAULT_PALETTE_ID, getPalette } from "@/theme/palettes";

type ThemeMode = "light" | "dark";
export type SidebarStyle = "light" | "brand";

type ThemeContextType = {
    theme: DesignTokens;
    mode: ThemeMode;
    toggleTheme: () => void;
    setMode: (mode: ThemeMode) => void;
    /** Selected colour palette id (theme/palettes.ts). */
    palette: string;
    setPalette: (id: string) => void;
    sidebarStyle: SidebarStyle;
    setSidebarStyle: (style: SidebarStyle) => void;
    resetAppearance: () => void;
};

// Keys shared with the pre-paint script in app/layout.tsx.
export const APPEARANCE_STORAGE_KEYS = {
    mode: "theme-mode",
    palette: "theme-palette",
    sidebar: "theme-sidebar",
} as const;

const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    mode: "light",
    toggleTheme: () => { },
    setMode: () => { },
    palette: DEFAULT_PALETTE_ID,
    setPalette: () => { },
    sidebarStyle: "light",
    setSidebarStyle: () => { },
    resetAppearance: () => { },
});

const readStorage = (key: string) => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const writeStorage = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Storage can be unavailable (private mode); the choice still applies for this session.
    }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [mode, setModeState] = useState<ThemeMode>("light");
    const [palette, setPaletteState] = useState<string>(DEFAULT_PALETTE_ID);
    const [sidebarStyle, setSidebarStyleState] = useState<SidebarStyle>("light");

    useEffect(() => {
        const saved = readStorage(APPEARANCE_STORAGE_KEYS.mode) as ThemeMode;
        if (saved === "light" || saved === "dark") setModeState(saved);
        setPaletteState(getPalette(readStorage(APPEARANCE_STORAGE_KEYS.palette)).id);
        if (readStorage(APPEARANCE_STORAGE_KEYS.sidebar) === "brand") setSidebarStyleState("brand");
    }, []);

    const setMode = (next: ThemeMode) => {
        writeStorage(APPEARANCE_STORAGE_KEYS.mode, next);
        setModeState(next);
    };

    const toggleTheme = () => setMode(mode === "light" ? "dark" : "light");

    const setPalette = (id: string) => {
        const next = getPalette(id).id;
        writeStorage(APPEARANCE_STORAGE_KEYS.palette, next);
        setPaletteState(next);
    };

    const setSidebarStyle = (style: SidebarStyle) => {
        writeStorage(APPEARANCE_STORAGE_KEYS.sidebar, style);
        setSidebarStyleState(style);
    };

    const resetAppearance = () => {
        setMode("light");
        setPalette(DEFAULT_PALETTE_ID);
        setSidebarStyle("light");
    };

    const theme = mode === "light" ? lightTheme : darkTheme;

    useEffect(() => {
        const root = document.documentElement;
        root.dataset.palette = palette;
        root.dataset.sidebar = sidebarStyle;
    }, [palette, sidebarStyle]);

    useEffect(() => {
        const root = document.documentElement;

        root.style.setProperty("--table-border", theme.colors.secondary);
        root.style.setProperty("--table-header-bg", theme.colors.accient);
        root.style.setProperty("--table-header-text", theme.colors.whiteColor);
        root.style.setProperty("--table-body-bg", theme.colors.bg);
        root.style.setProperty("--table-body-text", theme.colors.primaryText);
        root.style.setProperty("--table-striped-bg", mode === "dark" ? "#1f2937" : "#f9fafb");
        root.style.setProperty("--table-hover-bg", mode === "dark" ? "#111827" : "#f3f4f6");
    }, [theme, mode]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                mode,
                toggleTheme,
                setMode,
                palette,
                setPalette,
                sidebarStyle,
                setSidebarStyle,
                resetAppearance,
            }}
        >
            <div
                style={{
                    backgroundColor: theme.colors.bg,
                    color: theme.colors.primaryText,
                    minHeight: "100vh",
                }}
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
