"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
    Box,
    VStack,
    Text,
    Drawer,
    HStack,
    Icon,
    useMediaQuery,
    Avatar,
    Flex,
    chakra,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { ChevronDown, Search, X, ArrowRight, LogOut } from "lucide-react";
import {
    useSidebar,
    type MenuItem,
    type DirectMenuItem,
    type ParentMenuItem,
    type SectionContent,
    type MenuGroup,
    type SectionDirectItem,
} from "@/context/layout/SideBarContext";
import { useRouter, usePathname } from "next/navigation";
import { normalizePath } from "@/utils/path/normalizePath";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/apiHooks/auth/useAuth";
import { usePageName } from "@/context/header/PageNameContext";
import { useSessionStorage } from "@/utils/storage/useSessionStorage";
import Logout from "@/component/logout/Logout";
import { setStorage } from "@/utils/storage/storage";
import { BrandMark } from "@/components/primitives";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.18, ease: "easeOut" as const } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.12 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Type guards
// ─────────────────────────────────────────────────────────────────────────────
const parentHasActiveChild = (item: ParentMenuItem, pathname: string): boolean =>
    item.children.some((c) => c.route === pathname);

const isMenuGroup = (content: SectionContent): content is MenuGroup =>
    "icon" in content && "items" in content;

const isSectionDirectItem = (content: SectionContent): content is SectionDirectItem =>
    "type" in content && content.type === "direct";

/** "RoleBased" → "Role Based", "RateEntry" → "Rate Entry" */
const humanize = (key: string) => key.replace(/([a-z])([A-Z])/g, "$1 $2");

interface FlatSearchResult {
    label: string;
    route: string;
    icon: React.ElementType;
    parentLabel?: string;
    sectionLabel?: string;
    meta?: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav row — one clickable line in the tree
// ─────────────────────────────────────────────────────────────────────────────
type NavRowProps = {
    label: string;
    icon?: React.ElementType;
    isActive?: boolean;
    /** A group/parent that contains the active page. */
    isTrail?: boolean;
    isExpanded: boolean;
    depth?: 0 | 1;
    onClick: () => void;
    trailing?: React.ReactNode;
};

const NavRow = ({ label, icon, isActive, isTrail, isExpanded, depth = 0, onClick, trailing }: NavRowProps) => (
    <Tooltip content={label} disabled={isExpanded} showArrow positioning={{ placement: "right" }}>
        <HStack
            as="button"
            w="100%"
            gap={2.5}
            h={depth === 0 ? 9 : 8}
            px={isExpanded ? 2.5 : 0}
            justify={isExpanded ? "flex-start" : "center"}
            borderRadius="l2"
            position="relative"
            cursor="pointer"
            textAlign="left"
            color={isActive ? "sidebar.fg" : isTrail ? "sidebar.fg" : "sidebar.fgMuted"}
            bg={isActive ? "sidebar.active" : "transparent"}
            transition="background-color 120ms, color 120ms"
            _hover={{ bg: isActive ? "sidebar.active" : "sidebar.hover", color: "sidebar.fg" }}
            _focusVisible={{ outline: "2px solid", outlineColor: "sidebar.accent", outlineOffset: "-2px" }}
            aria-current={isActive ? "page" : undefined}
            onClick={onClick}
            _before={
                isActive
                    ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "6px",
                          bottom: "6px",
                          w: "3px",
                          borderRadius: "full",
                          bg: "sidebar.accent",
                      }
                    : undefined
            }
        >
            {icon ? (
                <Icon as={icon} boxSize={depth === 0 ? 4 : 3.5} flexShrink={0} color={isActive ? "sidebar.accent" : undefined} />
            ) : (
                <Box w="4px" h="4px" borderRadius="full" bg={isActive ? "sidebar.accent" : "sidebar.fgSubtle"} flexShrink={0} mx={1.5} />
            )}
            {isExpanded && (
                <Text flex={1} fontSize="ui" fontWeight={isActive ? 600 : 500} truncate>
                    {label}
                </Text>
            )}
            {isExpanded && trailing}
        </HStack>
    </Tooltip>
);

const Chevron = ({ open }: { open: boolean }) => (
    <Icon
        as={ChevronDown}
        boxSize={3.5}
        color="sidebar.fgSubtle"
        transform={open ? "rotate(0deg)" : "rotate(-90deg)"}
        transition="transform 0.2s ease"
    />
);

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const {
        menuData,
        currentSection,
        setCurrentSection,
        expandedNodes,
        toggleNode,
        sidebarConfig,
        sidebarCollapsed,
        multiWindow,
    } = useSidebar();

    const { user } = useAuth();
    const { setPageName, setDescription } = usePageName();

    const router = useRouter();
    const rawPathname = usePathname();
    const pathname = normalizePath(rawPathname);

    const [title, setTitle] = useSessionStorage<string | null>("PAGE", null);
    const [isDesktop] = useMediaQuery(["(min-width: 768px)"]);
    const [isHovered, setIsHovered] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [logoutOpen, setLogoutOpen] = useState(false);

    const { collapsedWidth, expandedWidth } = sidebarConfig;

    const sidebarWidth = useMemo(() => {
        if (!isDesktop) return expandedWidth;
        return sidebarCollapsed && !isHovered ? collapsedWidth : expandedWidth;
    }, [isDesktop, sidebarCollapsed, isHovered, collapsedWidth, expandedWidth]);

    const isExpanded = useMemo(
        () => !isDesktop || !sidebarCollapsed || isHovered,
        [isDesktop, sidebarCollapsed, isHovered]
    );

    useEffect(() => {
        if (!isExpanded) setSearchQuery("");
    }, [isExpanded]);

    useEffect(() => setPageName(title), [title]);

    // Open the section and group that hold the current page on first load.
    const didAutoOpen = useRef(false);
    useEffect(() => {
        if (didAutoOpen.current || currentSection !== null) return;
        didAutoOpen.current = true;
        for (const [sectionKey, groups] of Object.entries(menuData)) {
            for (const [groupKey, content] of Object.entries(groups)) {
                const holdsPage = isSectionDirectItem(content)
                    ? content.route === pathname
                    : content.items.some((item) =>
                          item.type === "direct" ? item.route === pathname : parentHasActiveChild(item, pathname)
                      );
                if (!holdsPage) continue;
                setCurrentSection(sectionKey);
                if (isMenuGroup(content)) toggleNode(`${sectionKey}__${groupKey}`);
                return;
            }
        }
    }, []);

    // ── Flat search results ────────────────────────────────────────────────────
    const flatSearchResults = useMemo((): FlatSearchResult[] => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        const results: FlatSearchResult[] = [];

        Object.entries(menuData).forEach(([sectionKey, groups]) => {
            Object.entries(groups).forEach(([groupKey, content]) => {
                if (isSectionDirectItem(content)) {
                    if (content.label.toLowerCase().includes(q)) {
                        results.push({
                            label: content.label,
                            route: content.route,
                            icon: content.icon,
                            sectionLabel: sectionKey,
                            meta: content,
                        });
                    }
                } else if (isMenuGroup(content)) {
                    content.items.forEach((item) => {
                        if (item.type === "direct" && item.label.toLowerCase().includes(q)) {
                            results.push({
                                label: item.label,
                                route: item.route,
                                icon: item.icon,
                                parentLabel: groupKey,
                                sectionLabel: sectionKey,
                                meta: item,
                            });
                        } else if (item.type === "parent") {
                            item.children.forEach((child) => {
                                if (
                                    child.label.toLowerCase().includes(q) ||
                                    item.label.toLowerCase().includes(q)
                                ) {
                                    results.push({
                                        label: child.label,
                                        route: child.route,
                                        icon: child.icon,
                                        parentLabel: item.label,
                                        sectionLabel: sectionKey,
                                        meta: child,
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });

        return results;
    }, [menuData, searchQuery]);

    const isSearching = searchQuery.trim().length > 0;

    // ── Navigation ─────────────────────────────────────────────────────────────
    const navigate = useCallback(
        (route: string, meta?: any) => {
            if (multiWindow) {
                const userId = user?.USERID;
                if (userId) setStorage(`userId`, true);
                window.open(`${window.location.origin}${route}`, "_blank", "noopener,noreferrer");
                return;
            }
            router.push(route);
            if (meta?.title) {
                setTitle(meta.title);
                setPageName(meta.title);
                setDescription(meta.description);
            }
            if (!isDesktop) onClose();
        },
        [router, isDesktop, onClose, multiWindow, user]
    );

    // ── Search results ─────────────────────────────────────────────────────────
    const renderSearchResults = () => {
        if (flatSearchResults.length === 0) {
            return (
                <VStack py={10} gap={1} align="center" color="sidebar.fgMuted">
                    <Icon as={Search} boxSize={5} color="sidebar.fgSubtle" mb={1} />
                    <Text fontSize="ui" fontWeight="500">No results for “{searchQuery}”</Text>
                    <Text textStyle="helper" color="sidebar.fgSubtle">Try a different keyword</Text>
                </VStack>
            );
        }

        return (
            <VStack align="stretch" gap={0.5} px={2}>
                <Text px={2.5} pb={1} textStyle="overline" color="sidebar.fgSubtle">
                    {flatSearchResults.length} result{flatSearchResults.length !== 1 ? "s" : ""}
                </Text>
                {flatSearchResults.map((result, i) => {
                    const isActive = pathname === result.route;
                    return (
                        <HStack
                            as="button"
                            key={`${result.route}-${i}`}
                            px={2.5}
                            py={2}
                            gap={2.5}
                            borderRadius="l2"
                            textAlign="left"
                            cursor="pointer"
                            color={isActive ? "sidebar.fg" : "sidebar.fgMuted"}
                            bg={isActive ? "sidebar.active" : "transparent"}
                            _hover={{ bg: "sidebar.hover", color: "sidebar.fg", "& .nav-arrow": { opacity: 1 } }}
                            onClick={() => {
                                navigate(result.route, result.meta);
                                setSearchQuery("");
                            }}
                        >
                            <Icon as={result.icon} boxSize={4} flexShrink={0} />
                            <Box flex={1} minW={0}>
                                <Text fontSize="ui" fontWeight={isActive ? 600 : 500} truncate>
                                    {result.label}
                                </Text>
                                <Text textStyle="helper" color="sidebar.fgSubtle" truncate>
                                    {[result.sectionLabel, result.parentLabel].filter(Boolean).map((s) => humanize(s!)).join(" › ")}
                                </Text>
                            </Box>
                            <Icon as={ArrowRight} className="nav-arrow" boxSize={3.5} opacity={0} transition="opacity 120ms" />
                        </HStack>
                    );
                })}
            </VStack>
        );
    };

    // ── Tree renderers ─────────────────────────────────────────────────────────
    const renderDirectItem = (item: DirectMenuItem, depth: 0 | 1 = 1) => (
        <NavRow
            key={item.route}
            label={item.label}
            icon={depth === 0 ? item.icon : undefined}
            isActive={pathname === item.route}
            isExpanded={isExpanded}
            depth={depth}
            onClick={() => navigate(item.route, item)}
        />
    );

    const renderParentItem = (item: ParentMenuItem, sectionKey: string, groupKey: string) => {
        const nodeId = `${sectionKey}__${groupKey}__${item.label}`;
        const isNodeOpen = !!expandedNodes[nodeId];
        return (
            <Box key={item.label} w="100%">
                <NavRow
                    label={item.label}
                    isTrail={parentHasActiveChild(item, pathname)}
                    isExpanded={isExpanded}
                    depth={1}
                    onClick={() => isExpanded && toggleNode(nodeId)}
                    trailing={<Chevron open={isNodeOpen} />}
                />
                <AnimatePresence initial={false}>
                    {isExpanded && isNodeOpen && (
                        <MotionVStack
                            align="stretch"
                            gap={0.5}
                            ml={4}
                            pl={2}
                            borderLeftWidth="1px"
                            borderColor="sidebar.border"
                            overflow="hidden"
                            variants={expandVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {item.children.map((child) => (
                                <NavRow
                                    key={child.route}
                                    label={child.label}
                                    isActive={pathname === child.route}
                                    isExpanded={isExpanded}
                                    depth={1}
                                    onClick={() => navigate(child.route, child)}
                                />
                            ))}
                        </MotionVStack>
                    )}
                </AnimatePresence>
            </Box>
        );
    };

    const renderMenuItem = (item: MenuItem, sectionKey: string, groupKey: string) => {
        if (item.type === "direct") return renderDirectItem(item);
        if (item.type === "parent") return renderParentItem(item, sectionKey, groupKey);
        return null;
    };

    const renderSectionContent = (content: SectionContent, groupKey: string, sectionKey: string) => {
        if (isSectionDirectItem(content)) {
            return (
                <NavRow
                    key={groupKey}
                    label={content.label}
                    icon={content.icon}
                    isActive={pathname === content.route}
                    isExpanded={isExpanded}
                    onClick={() => navigate(content.route, content)}
                />
            );
        }

        if (isMenuGroup(content)) {
            const groupNodeId = `${sectionKey}__${groupKey}`;
            const isGroupOpen = !!expandedNodes[groupNodeId];
            const groupIsActive = content.items.some((item) =>
                item.type === "direct" ? item.route === pathname : parentHasActiveChild(item, pathname)
            );

            return (
                <Box key={groupKey} w="100%">
                    <NavRow
                        label={humanize(groupKey)}
                        icon={content.icon}
                        isTrail={groupIsActive}
                        isExpanded={isExpanded}
                        onClick={() => isExpanded && toggleNode(groupNodeId)}
                        trailing={<Chevron open={isGroupOpen} />}
                    />
                    <AnimatePresence initial={false}>
                        {isExpanded && isGroupOpen && (
                            <MotionVStack
                                align="stretch"
                                gap={0.5}
                                ml={4}
                                pl={2}
                                mt={0.5}
                                borderLeftWidth="1px"
                                borderColor="sidebar.border"
                                overflow="hidden"
                                variants={expandVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {content.items.map((item) => renderMenuItem(item, sectionKey, groupKey))}
                            </MotionVStack>
                        )}
                    </AnimatePresence>
                </Box>
            );
        }

        return null;
    };

    // ── Sidebar content ────────────────────────────────────────────────────────
    const Content = (
        <MotionBox
            as="nav"
            aria-label="Main navigation"
            w={sidebarWidth}
            onMouseEnter={() => isDesktop && setIsHovered(true)}
            onMouseLeave={() => isDesktop && setIsHovered(false)}
            bg="sidebar.bg"
            color="sidebar.fg"
            h="100%"
            display="flex"
            flexDirection="column"
            borderRightWidth="1px"
            borderColor="sidebar.border"
            overflow="hidden"
            boxShadow={sidebarCollapsed && isHovered ? "overlay" : "none"}
            initial={false}
            animate={{ width: sidebarWidth }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] } as any}
        >
            {/* ── Brand ── */}
            <Flex h="header" px={isExpanded ? 4 : 0} align="center" justify={isExpanded ? "flex-start" : "center"} flexShrink={0} borderBottomWidth="1px" borderColor="sidebar.border">
                <BrandMark showName={isExpanded} size={30} />
            </Flex>

            {/* ── Search ── */}
            {isExpanded && (
                <Box px={3} pt={3} pb={1} flexShrink={0}>
                    <HStack
                        bg="sidebar.hover"
                        borderRadius="l2"
                        borderWidth="1px"
                        borderColor="sidebar.border"
                        px={2.5}
                        gap={2}
                        h={8}
                        _focusWithin={{ borderColor: "sidebar.accent" }}
                        transition="border-color 120ms"
                    >
                        <Icon as={Search} boxSize={3.5} color="sidebar.fgSubtle" flexShrink={0} />
                        <chakra.input
                            type="text"
                            aria-label="Search menu"
                            placeholder="Search menu…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            flex={1}
                            bg="transparent"
                            border="none"
                            outline="none"
                            fontSize="ui"
                            color="sidebar.fg"
                            minW={0}
                            css={{ "&::placeholder": { color: "var(--chakra-colors-sidebar-fg-subtle)" } }}
                        />
                        {searchQuery && (
                            <Box as="button" aria-label="Clear search" cursor="pointer" onClick={() => setSearchQuery("")} color="sidebar.fgSubtle" _hover={{ color: "sidebar.fg" }}>
                                <Icon as={X} boxSize={3.5} />
                            </Box>
                        )}
                    </HStack>
                </Box>
            )}

            {/* ── Scrollable body ── */}
            <Box
                flex={1}
                overflowY="auto"
                overflowX="hidden"
                py={2}
                css={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.12) transparent",
                }}
            >
                {isSearching && isExpanded ? (
                    renderSearchResults()
                ) : (
                    <VStack align="stretch" gap={1} px={isExpanded ? 3 : 2}>
                        {Object.entries(menuData).map(([sectionKey, groups]) => {
                            const isSectionOpen = currentSection === sectionKey;
                            return (
                                <Box key={sectionKey} w="100%">
                                    {isExpanded ? (
                                        <HStack
                                            as="button"
                                            w="100%"
                                            px={2.5}
                                            pt={2.5}
                                            pb={1.5}
                                            justify="space-between"
                                            cursor="pointer"
                                            color={isSectionOpen ? "sidebar.accent" : "sidebar.fgSubtle"}
                                            _hover={{ color: "sidebar.fg" }}
                                            onClick={() => setCurrentSection(sectionKey)}
                                            aria-expanded={isSectionOpen}
                                            transition="color 120ms"
                                        >
                                            <Text textStyle="overline">{humanize(sectionKey)}</Text>
                                            <Chevron open={isSectionOpen} />
                                        </HStack>
                                    ) : (
                                        <Box h="1px" bg="sidebar.border" my={2} mx={2} />
                                    )}

                                    <AnimatePresence initial={false}>
                                        {(isExpanded ? isSectionOpen : true) && (
                                            <MotionVStack
                                                align="stretch"
                                                gap={0.5}
                                                overflow="hidden"
                                                variants={expandVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                            >
                                                {Object.entries(groups).map(([groupKey, content]) =>
                                                    renderSectionContent(content, groupKey, sectionKey)
                                                )}
                                            </MotionVStack>
                                        )}
                                    </AnimatePresence>
                                </Box>
                            );
                        })}
                    </VStack>
                )}
            </Box>

            {/* ── Footer / user ── */}
            <Box borderTopWidth="1px" borderColor="sidebar.border" p={isExpanded ? 3 : 2} flexShrink={0}>
                <Tooltip content="Log out" disabled={isExpanded} showArrow positioning={{ placement: "right" }}>
                    <HStack
                        as="button"
                        w="100%"
                        gap={2.5}
                        p={1.5}
                        borderRadius="l2"
                        cursor="pointer"
                        justify={isExpanded ? "flex-start" : "center"}
                        _hover={{ bg: "sidebar.hover", "& .logout-icon": { color: "sidebar.fg" } }}
                        onClick={() => setLogoutOpen(true)}
                        aria-label="Log out"
                    >
                        <Avatar.Root size="xs" colorPalette="gold" variant="solid">
                            <Avatar.Fallback name={user?.USERNAME ?? "Admin"} />
                        </Avatar.Root>
                        {isExpanded && (
                            <>
                                <Box flex={1} minW={0} textAlign="left">
                                    <Text fontSize="ui" fontWeight="600" color="sidebar.fg" truncate>
                                        {user?.USERNAME ?? "Admin"}
                                    </Text>
                                    <Text textStyle="helper" color="sidebar.fgSubtle">
                                        Signed in
                                    </Text>
                                </Box>
                                <Icon as={LogOut} className="logout-icon" boxSize={4} color="sidebar.fgSubtle" />
                            </>
                        )}
                    </HStack>
                </Tooltip>
                <Logout isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
            </Box>
        </MotionBox>
    );

    if (!isDesktop) {
        return (
            <Drawer.Root open={isOpen} onOpenChange={onClose} size="xs" placement="start">
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content width={sidebarWidth} maxW="85vw" bg="sidebar.bg">
                        <Drawer.Body p={0}>{Content}</Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        );
    }

    return (
        <Box position="fixed" left={0} top={0} bottom={0} zIndex="sticky">
            {Content}
        </Box>
    );
};

export default Sidebar;
