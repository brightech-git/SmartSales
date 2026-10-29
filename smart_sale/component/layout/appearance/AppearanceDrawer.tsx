"use client";

import { ReactNode } from "react";
import { Box, Button, chakra, CloseButton, Drawer, Flex, HStack, Portal, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Check, Moon, PanelLeft, RotateCcw, Sun } from "lucide-react";
import { useTheme, type SidebarStyle } from "@/context/theme/themeContext";
import { PALETTES, type Palette } from "@/theme/palettes";

type AppearanceDrawerProps = {
    open: boolean;
    onClose: () => void;
};

const SectionLabel = ({ title, hint }: { title: string; hint: string }) => (
    <Box mb={2.5}>
        <Text textStyle="subTitle" color="fg">{title}</Text>
        <Text textStyle="helper" color="fg.subtle">{hint}</Text>
    </Box>
);

/** Selectable card used for every option in the drawer. */
const OptionCard = ({
    selected,
    onSelect,
    label,
    children,
}: {
    selected: boolean;
    onSelect: () => void;
    label: string;
    children: ReactNode;
}) => (
    <chakra.button
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={label}
        onClick={onSelect}
        position="relative"
        textAlign="left"
        w="full"
        p={2.5}
        borderRadius="l3"
        borderWidth={selected ? "2px" : "1px"}
        borderColor={selected ? "brand.solid" : "border"}
        m={selected ? "0" : "1px"}
        bg="bg.panel"
        cursor="pointer"
        transition="border-color 120ms, box-shadow 120ms"
        _hover={{ borderColor: selected ? "brand.solid" : "border.emphasized", boxShadow: "raised" }}
        _focusVisible={{ outline: "2px solid", outlineColor: "border.focus", outlineOffset: "2px" }}
    >
        {selected && (
            <Flex
                position="absolute"
                top={2}
                right={2}
                w={5}
                h={5}
                borderRadius="full"
                bg="brand.solid"
                color="brand.contrast"
                align="center"
                justify="center"
            >
                <Check size={12} strokeWidth={3} aria-hidden />
            </Flex>
        )}
        {children}
    </chakra.button>
);

/** Miniature of the app shell drawn in the palette's colours, with the current sidebar style. */
const PalettePreview = ({ palette, sidebar }: { palette: Palette; sidebar: SidebarStyle }) => (
    <Flex h="56px" borderRadius="l2" overflow="hidden" borderWidth="1px" borderColor="border.muted" aria-hidden>
        {sidebar === "brand" ? (
            <Stack w="30%" bg={palette.brand[950]} p={1.5} gap={1}>
                <Box h="5px" w="70%" borderRadius="full" bg={palette.accent[400]} />
                <Box h="4px" w="85%" borderRadius="full" bg="whiteAlpha.400" />
                <Box h="4px" w="60%" borderRadius="full" bg="whiteAlpha.400" />
            </Stack>
        ) : (
            <Stack w="30%" bg="white" p={1.5} gap={1} borderRightWidth="1px" borderColor="#E1E1E8">
                <Box h="5px" w="85%" borderRadius="full" bg={palette.brand[100]} borderLeftWidth="2px" borderColor={palette.brand[600]} />
                <Box h="4px" w="70%" borderRadius="full" bg="#CACAD4" />
                <Box h="4px" w="55%" borderRadius="full" bg="#CACAD4" />
            </Stack>
        )}
        <Stack flex={1} bg="#F6F6F9" p={1.5} gap={1.5}>
            <Box h="6px" w="55%" borderRadius="full" bg={palette.brand[600]} />
            <Box flex={1} borderRadius="sm" bg="white" borderWidth="1px" borderColor="#E1E1E8" />
            <HStack gap={1} justify="flex-end">
                <Box h="7px" w="18px" borderRadius="sm" bg={palette.accent[400]} />
                <Box h="7px" w="24px" borderRadius="sm" bg={palette.brand[600]} />
            </HStack>
        </Stack>
    </Flex>
);

const Swatch = ({ color, label }: { color: string; label: string }) => (
    <HStack gap={1.5}>
        <Box w={3.5} h={3.5} borderRadius="full" bg={color} boxShadow="inset 0 0 0 1px rgba(0,0,0,0.12)" />
        <Text textStyle="helper" color="fg.muted">{label}</Text>
    </HStack>
);

const SidebarPreview = ({ style }: { style: SidebarStyle }) => (
    <Flex h="44px" borderRadius="l2" overflow="hidden" borderWidth="1px" borderColor="border.muted" aria-hidden>
        <Stack w="38%" bg={style === "brand" ? "brand.950" : "white"} p={1.5} gap={1} borderRightWidth="1px" borderColor="#E1E1E8">
            <Box h="5px" w="80%" borderRadius="full" bg={style === "brand" ? "accent.400" : "brand.100"} />
            <Box h="4px" w="60%" borderRadius="full" bg={style === "brand" ? "whiteAlpha.400" : "#CACAD4"} />
        </Stack>
        <Box flex={1} bg="#F6F6F9" />
    </Flex>
);

/**
 * Appearance settings: light/dark mode, colour palette (primary + secondary)
 * and sidebar style. Choices are saved per device.
 */
export function AppearanceDrawer({ open, onClose }: AppearanceDrawerProps) {
    const { mode, setMode, palette, setPalette, sidebarStyle, setSidebarStyle, resetAppearance } = useTheme();

    return (
        <Drawer.Root open={open} onOpenChange={(e) => !e.open && onClose()} placement="start" size="sm">
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content bg="bg.panel">
                        <Drawer.Header borderBottomWidth="1px" borderColor="border.muted" py={4}>
                            <Stack gap={0.5}>
                                <Drawer.Title textStyle="sectionTitle" fontSize="md">Appearance</Drawer.Title>
                                <Text textStyle="helper" color="fg.subtle">
                                    Choose how Smart Sales looks on this device.
                                </Text>
                            </Stack>
                        </Drawer.Header>

                        <Drawer.Body py={5}>
                            <Stack gap={7}>
                                <Box role="radiogroup" aria-label="Mode">
                                    <SectionLabel title="Mode" hint="Dark mode is easier on the eyes in low light." />
                                    <SimpleGrid columns={2} gap={2.5}>
                                        {([
                                            { id: "light", label: "Light", icon: <Sun size={16} /> },
                                            { id: "dark", label: "Dark", icon: <Moon size={16} /> },
                                        ] as const).map((m) => (
                                            <OptionCard key={m.id} selected={mode === m.id} onSelect={() => setMode(m.id)} label={`${m.label} mode`}>
                                                <HStack gap={2} py={1}>
                                                    <Flex w={8} h={8} borderRadius="l2" bg={m.id === "dark" ? "neutral.900" : "neutral.100"} color={m.id === "dark" ? "white" : "neutral.700"} align="center" justify="center">
                                                        {m.icon}
                                                    </Flex>
                                                    <Text fontWeight="600" fontSize="ui">{m.label}</Text>
                                                </HStack>
                                            </OptionCard>
                                        ))}
                                    </SimpleGrid>
                                </Box>

                                <Box role="radiogroup" aria-label="Colour theme">
                                    <SectionLabel title="Colour theme" hint="Primary colour for actions and selection, secondary for highlights." />
                                    <SimpleGrid columns={2} gap={2.5}>
                                        {PALETTES.map((p) => (
                                            <OptionCard key={p.id} selected={palette === p.id} onSelect={() => setPalette(p.id)} label={p.name}>
                                                <PalettePreview palette={p} sidebar={sidebarStyle} />
                                                <Text mt={2} fontWeight="600" fontSize="ui" color="fg" lineClamp={1}>{p.name}</Text>
                                                <Text textStyle="helper" color="fg.subtle" lineClamp={1}>{p.description}</Text>
                                                <HStack gap={3} mt={1.5}>
                                                    <Swatch color={p.brand[600]} label="Primary" />
                                                    <Swatch color={p.accent[400]} label="Secondary" />
                                                </HStack>
                                            </OptionCard>
                                        ))}
                                    </SimpleGrid>
                                </Box>

                                <Box role="radiogroup" aria-label="Sidebar">
                                    <SectionLabel title="Sidebar" hint="A light sidebar keeps the focus on your data." />
                                    <SimpleGrid columns={2} gap={2.5}>
                                        {([
                                            { id: "light", label: "Light" },
                                            { id: "brand", label: "Primary colour" },
                                        ] as const).map((s) => (
                                            <OptionCard key={s.id} selected={sidebarStyle === s.id} onSelect={() => setSidebarStyle(s.id)} label={`${s.label} sidebar`}>
                                                <SidebarPreview style={s.id} />
                                                <HStack mt={2} gap={1.5} color="fg">
                                                    <PanelLeft size={14} aria-hidden />
                                                    <Text fontWeight="600" fontSize="ui">{s.label}</Text>
                                                </HStack>
                                            </OptionCard>
                                        ))}
                                    </SimpleGrid>
                                </Box>
                            </Stack>
                        </Drawer.Body>

                        <Drawer.Footer borderTopWidth="1px" borderColor="border.muted" bg="bg.subtle" justifyContent="space-between">
                            <Button size="sm" variant="ghost" color="fg.muted" onClick={resetAppearance}>
                                <RotateCcw /> Reset to default
                            </Button>
                            <Button size="sm" colorPalette="brand" onClick={onClose}>
                                Done
                            </Button>
                        </Drawer.Footer>

                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" aria-label="Close appearance settings" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}
