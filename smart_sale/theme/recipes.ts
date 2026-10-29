import { defineRecipe, defineSlotRecipe } from "@chakra-ui/react";
import { cardAnatomy, dialogAnatomy, nativeSelectAnatomy, tableAnatomy } from "@chakra-ui/react/anatomy";

/*
 * Recipe extensions, deep-merged into Chakra's defaults by createSystem, so
 * existing props (variant, size, colorPalette) keep working and only the
 * listed keys change. Slot recipes must list every slot of the component's
 * anatomy, otherwise the unlisted parts lose their default styles.
 */

export const recipes = {
    button: defineRecipe({
        base: {
            fontWeight: "semibold",
            transitionDuration: "fast",
            _active: { transform: "translateY(0.5px)" },
        },
    }),

    input: defineRecipe({
        base: {
            _readOnly: { bg: "bg.subtle" },
        },
        variants: {
            variant: {
                outline: {
                    bg: "bg.panel",
                    borderColor: "border.emphasized",
                    _hover: { borderColor: "neutral.400" },
                },
            },
        },
    }),

    badge: defineRecipe({
        base: { fontWeight: "600", letterSpacing: "0.01em" },
    }),

    textarea: defineRecipe({
        variants: {
            variant: {
                outline: {
                    bg: "bg.panel",
                    borderColor: "border.emphasized",
                    _hover: { borderColor: "neutral.400" },
                },
            },
        },
    }),
};

export const slotRecipes = {
    nativeSelect: defineSlotRecipe({
        slots: nativeSelectAnatomy.keys(),
        variants: {
            variant: {
                outline: {
                    field: {
                        bg: "bg.panel",
                        borderColor: "border.emphasized",
                        _hover: { borderColor: "neutral.400" },
                    },
                },
            },
        },
    }),

    card: defineSlotRecipe({
        slots: cardAnatomy.keys(),
        base: {
            root: { borderRadius: "l3" },
            title: { fontFamily: "heading", fontWeight: "600" },
            description: { color: "fg.muted" },
        },
        variants: {
            variant: {
                outline: {
                    root: { bg: "bg.panel", borderColor: "border", boxShadow: "card" },
                },
            },
        },
    }),

    table: defineSlotRecipe({
        slots: tableAnatomy.keys(),
        variants: {
            variant: {
                // Dense ledger look used by list and report screens.
                data: {
                    root: { textStyle: "tableCell", bg: "bg.panel" },
                    header: { bg: "bg.subtle" },
                    columnHeader: {
                        textStyle: "tableHeader",
                        color: "fg.muted",
                        bg: "bg.subtle",
                        borderBottomWidth: "1px",
                        borderColor: "border",
                    },
                    row: {
                        bg: "bg.panel",
                        transition: "background-color {durations.fast}",
                        "&:not(:last-of-type)": { borderBottomWidth: "1px", borderColor: "border.muted" },
                        _hover: { bg: "bg.hover" },
                        _selected: { bg: "bg.selected" },
                    },
                    cell: { color: "fg" },
                    footer: { bg: "bg.subtle", borderTopWidth: "1px", fontWeight: "600" },
                },
            },
            size: {
                xs: {
                    root: { textStyle: "tableCell" },
                    columnHeader: { px: "2.5", py: "1.5" },
                    cell: { px: "2.5", py: "1.5" },
                },
            },
        },
    }),

    dialog: defineSlotRecipe({
        slots: dialogAnatomy.keys(),
        base: {
            backdrop: { bg: "blackAlpha.500", backdropFilter: "blur(2px)" },
            content: { borderRadius: "l3", boxShadow: "overlay", bg: "bg.panel" },
            title: { fontFamily: "heading", fontWeight: "600", fontSize: "md" },
            footer: { borderTopWidth: "1px", borderColor: "border.muted", bg: "bg.subtle", borderBottomRadius: "l3" },
        },
    }),
};
