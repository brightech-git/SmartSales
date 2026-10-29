"use client";

import { ReactNode } from "react";
import { Badge, Box, type BadgeProps } from "@chakra-ui/react";

export type StatusTone = "success" | "warning" | "danger" | "info" | "brand" | "neutral";

const PALETTE: Record<StatusTone, string> = {
    success: "success",
    warning: "warning",
    danger: "danger",
    info: "info",
    brand: "brand",
    neutral: "gray",
};

type StatusBadgeProps = Omit<BadgeProps, "colorPalette"> & {
    tone?: StatusTone;
    /** Leading dot, useful for state (Active / Inactive). */
    dot?: boolean;
    children: ReactNode;
};

/** Small coloured label for record state. */
export function StatusBadge({ tone = "neutral", dot = false, children, ...rest }: StatusBadgeProps) {
    return (
        <Badge colorPalette={PALETTE[tone]} variant="subtle" size="sm" borderRadius="full" px={2} gap={1.5} {...rest}>
            {dot && <Box as="span" w="6px" h="6px" borderRadius="full" bg="colorPalette.solid" />}
            {children}
        </Badge>
    );
}

/** Renders the common "Y"/"N" flag from the API as Active / Inactive. */
export function ActiveBadge({ value }: { value?: string | null }) {
    const active = String(value ?? "").toUpperCase() === "Y";
    return (
        <StatusBadge tone={active ? "success" : "neutral"} dot>
            {active ? "Active" : "Inactive"}
        </StatusBadge>
    );
}
