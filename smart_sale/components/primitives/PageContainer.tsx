"use client";

import { Box, type BoxProps } from "@chakra-ui/react";

const WIDTHS = {
    narrow: "page.narrow",
    default: "page.default",
    wide: "page.wide",
    full: "full",
} as const;

type PageContainerProps = BoxProps & {
    /** narrow 960px · default 1440px · wide 1760px · full (entry grids). */
    size?: keyof typeof WIDTHS;
};

/** Constrains page content to a standard width. */
export function PageContainer({ size = "default", ...rest }: PageContainerProps) {
    return <Box w="full" maxW={WIDTHS[size]} mx="auto" {...rest} />;
}
