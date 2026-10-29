"use client";

import { Box, HStack, Text, Flex, Separator, useMediaQuery } from "@chakra-ui/react";
import { CalendarDays, Clock, Menu as MenuIcon, Moon, PanelLeftClose, PanelLeftOpen, SquareStack, Sun, AppWindow } from "lucide-react";
import { useSidebar } from "@/context/layout/SideBarContext";
import { useTheme } from "@/context/theme/themeContext";
import { useRates } from "@/hooks/apiHooks/rate/useRate";
import { MetalRatesMenu } from "../rates/MetalRates";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandMark, IconAction } from "@/components/primitives";

/** "ItemMaster" → "Item Master"; "pureGold" → "Pure Gold". */
const toTitle = (value: string) => {
    const spaced = value.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
    return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
};

const Header = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
    const { mode, toggleTheme } = useTheme();
    const pathname = usePathname();
    const { sidebarCollapsed, toggleSidebar, multiWindow, handleMultiWindow } = useSidebar();
    const { data: metalRates, isLoading, isError } = useRates();
    const [isDesktop] = useMediaQuery(["(min-width: 768px)"]);

    // Page context: "Master" › "Metal Master"
    const segments = pathname.split("/").filter(Boolean);
    const section = segments[0] === "dashboard" && segments.length > 2 ? toTitle(segments[1]) : null;
    const lastSegment = segments[segments.length - 1] ?? "dashboard";
    // Derived from the URL so it stays correct after back/forward navigation.
    const pageTitle = toTitle(lastSegment);

    const [timeNow, setTimeNow] = useState("");

    useEffect(() => {
        const tick = () =>
            setTimeNow(
                new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                })
            );
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            as="header"
            position="sticky"
            top={0}
            zIndex={100}
            h="header"
            bg="header.bg"
            borderBottomWidth="1px"
            borderColor="header.border"
            px={{ base: 2, md: 4 }}
        >
            <Flex h="full" align="center" justify="space-between" gap={3}>
                {/* Left: menu control + page context */}
                <HStack gap={2} minW={0}>
                    {isDesktop ? (
                        <IconAction
                            label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            icon={sidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                            onClick={toggleSidebar}
                        />
                    ) : (
                        <>
                            <IconAction label="Open menu" icon={<MenuIcon />} onClick={onOpenMenu} />
                            <BrandMark showName={false} size={28} />
                        </>
                    )}
                    <Separator orientation="vertical" h={5} display={{ base: "none", md: "block" }} />
                    <Box minW={0}>
                        {section && (
                            <Text textStyle="helper" color="fg.subtle" lineHeight="1" mb={0.5} display={{ base: "none", sm: "block" }}>
                                {section}
                            </Text>
                        )}
                        <Text as="span" display="block" fontFamily="heading" fontWeight="700" fontSize="sm" color="fg" truncate maxW={{ base: "40vw", md: "320px" }}>
                            {pageTitle}
                        </Text>
                    </Box>
                </HStack>

                {/* Right: rates, date/time and view toggles */}
                <HStack gap={{ base: 1, md: 2 }} flexShrink={0}>
                    <MetalRatesMenu
                        rates={metalRates}
                        isLoading={isLoading}
                        isError={isError}
                        latestEntry={metalRates?.["LAST_UPDATED"]}
                    />
                    <HStack
                        display={{ base: "none", lg: "flex" }}
                        gap={3}
                        px={3}
                        h={8}
                        borderRadius="l2"
                        bg="bg.subtle"
                        borderWidth="1px"
                        borderColor="border.muted"
                        color="fg.muted"
                        textStyle="numeric"
                        fontSize="xs"
                        aria-label="Current date and time"
                    >
                        <HStack gap={1.5}>
                            <CalendarDays size={14} aria-hidden />
                            <Text>{formatDate(new Date())}</Text>
                        </HStack>
                        <HStack gap={1.5} minW="92px">
                            <Clock size={14} aria-hidden />
                            <Text suppressHydrationWarning>{timeNow}</Text>
                        </HStack>
                    </HStack>
                    <IconAction
                        label={multiWindow ? "Switch to single window" : "Open pages in new windows"}
                        icon={multiWindow ? <SquareStack /> : <AppWindow />}
                        onClick={() => handleMultiWindow()}
                        aria-pressed={multiWindow}
                        color={multiWindow ? "fg.brand" : "fg.muted"}
                        bg={multiWindow ? "brand.subtle" : undefined}
                    />
                    <IconAction
                        label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
                        icon={mode === "light" ? <Moon /> : <Sun />}
                        onClick={toggleTheme}
                    />
                </HStack>
            </Flex>
        </Box>
    );
};

export default Header;
