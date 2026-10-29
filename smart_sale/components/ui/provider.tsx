"use client";

import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { useTheme as useNextTheme } from "next-themes";
import { system } from "@/theme/system";
import { useTheme } from "@/context/theme/themeContext";
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode";

type ProviderProps = ColorModeProviderProps & {
  children: React.ReactNode;
};

// Keeps Chakra's color mode in step with the app's existing light/dark toggle.
function ColorModeSync() {
  const { mode } = useTheme();
  const { setTheme } = useNextTheme();
  useEffect(() => setTheme(mode), [mode, setTheme]);
  return null;
}

export function Provider({ children, ...props }: ProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider defaultTheme="light" enableSystem={false} {...props}>
        <ColorModeSync />
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  );
}
