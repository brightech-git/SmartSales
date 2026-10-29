"use client";

import { Box, HStack, Text, type StackProps } from "@chakra-ui/react";

type BrandMarkProps = StackProps & {
    /** Show the "Smart Sales" word mark next to the symbol. */
    showName?: boolean;
    size?: number;
};

/**
 * Smart Sales symbol: a faceted gem in the secondary colour on the primary
 * colour, so it follows the selected palette. Inline SVG so it is crisp at
 * any size and costs no network request.
 */
export function BrandMark({ showName = true, size = 32, ...rest }: BrandMarkProps) {
    return (
        <HStack gap={2.5} {...rest}>
            <Box
                as="span"
                display="inline-flex"
                flexShrink={0}
                w={`${size}px`}
                h={`${size}px`}
                borderRadius="l3"
                bg="brand.600"
                alignItems="center"
                justifyContent="center"
                boxShadow="inset 0 0 0 1px rgba(255,255,255,0.12)"
            >
                <svg
                    width={size * 0.62}
                    height={size * 0.62}
                    viewBox="0 0 24 24"
                    fill="none"
                    role="img"
                    aria-label="Smart Sales"
                >
                    <path d="M6 3h12l4 6-10 12L2 9l4-6Z" style={{ fill: "var(--ss-accent-400)" }} />
                    <path d="M2 9h20M9 3 7.5 9 12 21M15 3l1.5 6L12 21" style={{ stroke: "var(--ss-brand-700)" }} strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
            </Box>
            {showName && (
                <Box lineHeight="1.1" minW={0}>
                    <Text fontFamily="heading" fontWeight="700" fontSize="sm" color="sidebar.fg" letterSpacing="-0.01em">
                        Smart Sales
                    </Text>
                    <Text textStyle="overline" color="sidebar.accent" fontSize="9px">
                        Wholesale
                    </Text>
                </Box>
            )}
        </HStack>
    );
}
