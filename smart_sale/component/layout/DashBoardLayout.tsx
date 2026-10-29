"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import Header from "./header/Header";
import Sidebar from "./sidebar/SideBar";
import { useMediaQuery } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/layout/SideBarContext";

const noLayoutRoutes = ["/login"];


const normalizePath = (path?: string) =>
    path?.replace(/\/$/, "") || "";

/**
 * Application shell: full-height sidebar on the left, and a main column with
 * a sticky header above the page. Below 768px the sidebar becomes a drawer.
 */
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { sidebarConfig, sidebarCollapsed } = useSidebar();
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop] = useMediaQuery(["(min-width: 768px)"]);

    let pathname = usePathname();
    pathname = normalizePath(pathname);
    const noLayout = pathname ? noLayoutRoutes.includes(pathname) : false;

    if (noLayout) return children;

    const mainOffset = !isDesktop
        ? "0"
        : sidebarCollapsed ? sidebarConfig.collapsedWidth : sidebarConfig.expandedWidth;

    return (
        <Box minH="100vh" bg="bg.canvas">
            <Sidebar
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />

            <Box
                ml={mainOffset}
                transition="margin-left 0.22s ease"
                minW={0}
            >
                <Header onOpenMenu={() => setIsOpen(true)} />
                <Box as="main" px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }} minW={0}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
