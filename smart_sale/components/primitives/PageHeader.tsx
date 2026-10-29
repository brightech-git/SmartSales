"use client";

import { Fragment, ReactNode } from "react";
import { Box, Breadcrumb, Flex, HStack, Stack, Text } from "@chakra-ui/react";

export type Crumb = { label: string; href?: string };

type PageHeaderProps = {
    title: ReactNode;
    description?: ReactNode;
    /** Trail shown above the title, e.g. Master › Item › Metal. */
    breadcrumbs?: Crumb[];
    /** Small items beside the title (record count, status badge). */
    meta?: ReactNode;
    /** Primary actions aligned right; wraps below the title on small screens. */
    actions?: ReactNode;
};

/** The one heading block every screen starts with. */
export function PageHeader({ title, description, breadcrumbs, meta, actions }: PageHeaderProps) {
    return (
        <Flex
            as="header"
            direction={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "flex-end" }}
            justify="space-between"
            gap={{ base: 3, md: 4 }}
            mb={4}
        >
            <Stack gap={1} minW={0}>
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <Breadcrumb.Root size="sm">
                        <Breadcrumb.List gap={1}>
                            {breadcrumbs.map((crumb, i) => {
                                const isLast = i === breadcrumbs.length - 1;
                                return (
                                    <Fragment key={`${crumb.label}-${i}`}>
                                        <Breadcrumb.Item textStyle="helper">
                                            {isLast ? (
                                                <Breadcrumb.CurrentLink color="fg.muted">{crumb.label}</Breadcrumb.CurrentLink>
                                            ) : crumb.href ? (
                                                <Breadcrumb.Link href={crumb.href} color="fg.subtle" _hover={{ color: "fg.brand" }}>
                                                    {crumb.label}
                                                </Breadcrumb.Link>
                                            ) : (
                                                <Text as="span" color="fg.subtle">{crumb.label}</Text>
                                            )}
                                        </Breadcrumb.Item>
                                        {!isLast && <Breadcrumb.Separator color="fg.subtle" />}
                                    </Fragment>
                                );
                            })}
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                )}
                <HStack gap={2.5} flexWrap="wrap">
                    <Text as="h1" textStyle="pageTitle" color="fg">
                        {title}
                    </Text>
                    {meta}
                </HStack>
                {description && (
                    <Text textStyle="body" color="fg.muted" maxW="2xl">
                        {description}
                    </Text>
                )}
            </Stack>
            {actions && (
                <Box flexShrink={0}>
                    <HStack gap={2} flexWrap="wrap" justify={{ base: "flex-start", md: "flex-end" }}>
                        {actions}
                    </HStack>
                </Box>
            )}
        </Flex>
    );
}
