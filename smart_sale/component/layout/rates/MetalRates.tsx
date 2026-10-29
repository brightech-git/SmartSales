"use client";
import React from "react";

import { Button, Menu, Portal, HStack, VStack, Text, Flex, Badge, Spinner, Box, Separator } from "@chakra-ui/react";
import { FaCoins, FaChartLine, FaCaretDown } from "react-icons/fa";
import { GiSilverBullet } from "react-icons/gi";
import { GiGoldBar } from "react-icons/gi";
import { Rates } from "@/types/rate/rate";

interface MetalRatesMenuProps {
    rates?: Rates;
    isLoading: boolean;
    isError: boolean;
    latestEntry?: string | null;
}

// Metal configuration with display names, priority, and icons
const METAL_CONFIG = {
    'GOLD 100.00': {
        displayName: 'GOLD 24K',
        priority: 1,
        icon: <GiGoldBar color="#FFD700" size="18px" />,
        bgColor: 'yellow.50',
        color: 'yellow.700'
    },
    'GOLD 916': {
        displayName: 'GOLD 22K',
        priority: 2,
        icon: <GiGoldBar color="#FDB931" size="18px" />,
        bgColor: 'yellow.50',
        color: 'yellow.700'
    },
    'SILVER 100': {
        displayName: 'SILVER Bar',
        priority: 3,
        icon: <GiSilverBullet color="#C0C0C0" size="18px" />,
        bgColor: 'gray.50',
        color: 'gray.700'
    },
    'SILVER 916': {
        displayName: 'SILVER 916',
        priority: 4,
        icon: <GiSilverBullet color="#A8A8A8" size="18px" />,
        bgColor: 'gray.50',
        color: 'gray.600'
    }
} as const;

// Professional Metal Rates Menu Component
export const MetalRatesMenu: React.FC<MetalRatesMenuProps> = ({ rates, isLoading, isError ,latestEntry }) => {


    // Format currency with Indian numbering system (₹)
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Get metal details - uses config for known metals, falls back to key for unknown
    const getMetalDetails = (key: string) => {
        const upperKey = key.toUpperCase();

        // Check if key matches any configured metal
        const matchedConfig = Object.entries(METAL_CONFIG).find(([configKey]) =>
            upperKey.includes(configKey)
        );

        if (matchedConfig) {
            const [_, config] = matchedConfig;
            return {
                icon: config.icon,
                bgColor: config.bgColor,
                color: config.color,
                label: config.displayName
            };
        }

        // Default for unknown metals - show the original key
        return {
            icon: <FaCoins color="#6B7280" size="16px" />,
            bgColor: 'gray.50',
            color: 'gray.600',
            label: key // Show original key for unknown metals
        };
    };

    // Sort metals based on priority
    const sortMetals = (entries: [string, number][]) => {
        return entries
            .filter(([key]) => key !== "LAST_UPDATED") // remove last array
            .sort(([keyA], [keyB]) => {
                const upperA = keyA.toUpperCase();
                const upperB = keyB.toUpperCase();

                const configA = Object.entries(METAL_CONFIG).find(([configKey]) =>
                    upperA.includes(configKey)
                );

                const configB = Object.entries(METAL_CONFIG).find(([configKey]) =>
                    upperB.includes(configKey)
                );

                const priorityA = configA ? configA[1].priority : 999;
                const priorityB = configB ? configB[1].priority : 999;

                return priorityA - priorityB;
            });
    };

    // Loading state
    if (isLoading) {
        return (
            <Button variant="outline" size="sm" disabled aria-busy="true">
                <Spinner size="xs" color="gold.solid" />
                <Text display={{ base: "none", md: "inline" }}>Loading rates…</Text>
            </Button>
        );
    }

    // Error state
    if (isError || !rates) {
        return (
            <Button variant="outline" size="sm" colorPalette="danger" disabled>
                <FaChartLine aria-hidden />
                <Text display={{ base: "none", md: "inline" }}>Rates unavailable</Text>
            </Button>
        );
    }

    const metalEntries = Object.entries(rates);
    const sortedEntries = sortMetals(metalEntries as [string, number][]);
    const totalMetals = metalEntries.length;


    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    h={8}
                    px={2.5}
                    bg="bg.panel"
                    borderColor="border"
                    _hover={{ bg: "bg.highlight", borderColor: "gold.border" }}
                    aria-label="Today's metal rates"
                >
                    <HStack gap={3}>
                        <Box w="6px" h="6px" borderRadius="full" bg="gold.solid" flexShrink={0} />
                        <HStack gap={3} display={{ base: "none", md: "flex" }}>
                            <HStack gap={1.5}>
                                <Text textStyle="helper" color="fg.subtle">24K</Text>
                                <Text textStyle="numeric" fontSize="xs" color="fg">₹ {rates["GOLD 100.00"]}</Text>
                            </HStack>
                            <HStack gap={1.5}>
                                <Text textStyle="helper" color="fg.subtle">22K</Text>
                                <Text textStyle="numeric" fontSize="xs" color="fg">₹ {rates["GOLD 916.00"]}</Text>
                            </HStack>
                        </HStack>
                        <Text textStyle="label" color="fg" display={{ base: "inline", md: "none" }}>Rates</Text>
                        <Badge colorPalette="gold" variant="subtle" size="xs" borderRadius="full">
                            {totalMetals}
                        </Badge>
                        <FaCaretDown size="12px" />
                    </HStack>
                </Button>
            </Menu.Trigger>

            <Portal>
                <Menu.Positioner>
                    <Menu.Content
                        minW="300px"
                        boxShadow="overlay"
                        borderRadius="l3"
                        borderWidth="1px"
                        borderColor="border"
                        p={1}
                    >
                        {/* Header */}
                        <Box px={3} py={2} borderBottomWidth="1px" borderColor="border.muted">
                            <Text textStyle="overline" color="fg.muted">
                                Today&apos;s rates
                            </Text>
                        </Box>

                        {/* Metal List */}
                        <VStack align="stretch" maxH="250px" overflowY="auto">
                            {sortedEntries.map(([key, value], index) => {
                                const details = getMetalDetails(key);
                                const numericValue = value as number;

                                return (
                                    <React.Fragment key={key}>
                                        <Menu.Item
                                            value={key}
                                            _hover={{ bg: details.bgColor }}
                                            borderRadius="md"
                                            py={1}
                                            style={{margin:'4px 0px'}}
                                        >
                                            <Flex align="center" justify="space-between" w="full">
                                                <HStack spaceX={1}>
                                                    <Box borderRadius="md" bg={details.bgColor}>
                                                        {details.icon}
                                                    </Box>
                                                    <VStack spaceY={0} align="start">
                                                        <Text fontSize="xs" fontWeight="medium" color="fg">
                                                            {details.label}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                                <VStack spaceY={0} align="end">
                                                    <Text textStyle="numeric" fontSize="xs" color="fg">
                                                        {formatCurrency(numericValue)}
                                                    </Text>
                                                </VStack>
                                            </Flex>
                                        </Menu.Item>
                                        {index < sortedEntries.length - 1 && (
                                            <Separator borderColor="border.muted" />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </VStack>

                        {/* Footer with timestamp */}
                        <Box py={2} bg="bg.subtle" borderTopWidth="1px" borderColor="border.muted" borderBottomRadius="l2">
                            <Text textStyle="helper" color="fg.subtle" textAlign="center">
                                Last updated: {latestEntry}
                            </Text>
                        </Box>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};