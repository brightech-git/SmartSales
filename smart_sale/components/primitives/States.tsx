"use client";

import { ReactNode } from "react";
import { Box, EmptyState as ChakraEmptyState, HStack, Skeleton, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
    title: string;
    description?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
};

/** Shown when a list or report has nothing to display. */
export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
    return (
        <ChakraEmptyState.Root size="sm" py={10}>
            <ChakraEmptyState.Content>
                <ChakraEmptyState.Indicator color="fg.subtle">{icon ?? <Inbox aria-hidden />}</ChakraEmptyState.Indicator>
                <VStack textAlign="center" gap={1}>
                    <ChakraEmptyState.Title textStyle="subTitle" color="fg">
                        {title}
                    </ChakraEmptyState.Title>
                    {description && (
                        <ChakraEmptyState.Description textStyle="helper" color="fg.subtle">
                            {description}
                        </ChakraEmptyState.Description>
                    )}
                </VStack>
                {action}
            </ChakraEmptyState.Content>
        </ChakraEmptyState.Root>
    );
}

/** Inline loading indicator for panels and sections. */
export function LoadingState({ label = "Loading…" }: { label?: string }) {
    return (
        <HStack justify="center" gap={2} py={8} color="fg.muted" role="status" aria-live="polite">
            <Spinner size="sm" color="brand.solid" />
            <Text textStyle="body">{label}</Text>
        </HStack>
    );
}

/** Placeholder rows while a table loads. */
export function TableSkeleton({ rows = 6, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <Stack gap={0} aria-hidden>
            {Array.from({ length: rows }).map((_, r) => (
                <HStack key={r} gap={4} px={3} py={2.5} borderBottomWidth="1px" borderColor="border.muted">
                    {Array.from({ length: columns }).map((__, c) => (
                        <Box key={c} flex={c === 1 ? 2 : 1}>
                            <Skeleton h="10px" borderRadius="sm" />
                        </Box>
                    ))}
                </HStack>
            ))}
        </Stack>
    );
}
