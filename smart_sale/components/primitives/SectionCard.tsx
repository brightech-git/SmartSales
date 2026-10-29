"use client";

import { ReactNode } from "react";
import { Box, Flex, HStack, Stack, Text, type BoxProps } from "@chakra-ui/react";

type SectionCardProps = Omit<BoxProps, "title"> & {
    title?: ReactNode;
    description?: ReactNode;
    /** Icon shown before the title. */
    icon?: ReactNode;
    /** Toolbar on the right of the card header (refresh, export…). */
    actions?: ReactNode;
    footer?: ReactNode;
    /** Remove body padding so a table can run edge to edge. */
    flush?: boolean;
    children: ReactNode;
};

/** White panel with an optional header row; the standard container for forms and lists. */
export function SectionCard({
    title,
    description,
    icon,
    actions,
    footer,
    flush = false,
    children,
    ...rest
}: SectionCardProps) {
    const hasHeader = title || description || actions;
    return (
        <Box as="section" layerStyle="panel" display="flex" flexDirection="column" minW={0} {...rest}>
            {hasHeader && (
                <Flex
                    align="center"
                    justify="space-between"
                    gap={3}
                    px={4}
                    py={3}
                    borderBottomWidth="1px"
                    borderColor="border.muted"
                    minH="52px"
                >
                    <HStack gap={2.5} minW={0}>
                        {icon && (
                            <Flex
                                w={7}
                                h={7}
                                borderRadius="l2"
                                bg="brand.subtle"
                                color="fg.brand"
                                align="center"
                                justify="center"
                                flexShrink={0}
                                css={{ "& svg": { width: "16px", height: "16px" } }}
                            >
                                {icon}
                            </Flex>
                        )}
                        <Stack gap={0} minW={0}>
                            {title && (
                                <Text as="h2" textStyle="sectionTitle" color="fg" truncate>
                                    {title}
                                </Text>
                            )}
                            {description && (
                                <Text textStyle="helper" color="fg.subtle" truncate>
                                    {description}
                                </Text>
                            )}
                        </Stack>
                    </HStack>
                    {actions && (
                        <HStack gap={1} flexShrink={0}>
                            {actions}
                        </HStack>
                    )}
                </Flex>
            )}
            <Box p={flush ? 0 : 4} flex={1} minW={0}>
                {children}
            </Box>
            {footer && (
                <Flex
                    gap={2}
                    px={4}
                    py={3}
                    borderTopWidth="1px"
                    borderColor="border.muted"
                    bg="bg.subtle"
                    borderBottomRadius="l3"
                    justify="flex-end"
                    flexWrap="wrap"
                >
                    {footer}
                </Flex>
            )}
        </Box>
    );
}
