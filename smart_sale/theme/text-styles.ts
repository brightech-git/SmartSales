import { defineLayerStyles, defineTextStyles } from "@chakra-ui/react";

/**
 * Typography scale. Use these through `textStyle="..."` instead of setting
 * font size/weight by hand so every screen reads the same way.
 *
 *   pageTitle      20px  Manrope 700  — one per screen, in the PageHeader
 *   sectionTitle   15px  Manrope 600  — card / panel headings
 *   subTitle       13px  Inter   600  — group headings inside a card
 *   body           13px  Inter   400  — default copy
 *   label          12px  Inter   500  — form labels
 *   tableHeader    11px  Inter   600  — uppercase column headers
 *   tableCell      12px  Inter   400  — data cells, tabular numerals
 *   helper         11px  Inter   400  — hints, captions, meta text
 *   overline       10px  Inter   700  — navigation section labels
 *   numeric        13px  Inter   500  — amounts and weights
 */
export const textStyles = defineTextStyles({
    pageTitle: {
        value: {
            fontFamily: "heading",
            fontSize: "xl",
            lineHeight: "1.75rem",
            fontWeight: "700",
            letterSpacing: "-0.015em",
        },
    },
    sectionTitle: {
        value: {
            fontFamily: "heading",
            fontSize: "0.9375rem",
            lineHeight: "1.375rem",
            fontWeight: "600",
            letterSpacing: "-0.005em",
        },
    },
    subTitle: {
        value: { fontFamily: "body", fontSize: "ui", lineHeight: "1.25rem", fontWeight: "600" },
    },
    body: {
        value: { fontFamily: "body", fontSize: "ui", lineHeight: "1.25rem", fontWeight: "400" },
    },
    label: {
        value: { fontFamily: "body", fontSize: "xs", lineHeight: "1rem", fontWeight: "500" },
    },
    tableHeader: {
        value: {
            fontFamily: "body",
            fontSize: "dense",
            lineHeight: "1rem",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
        },
    },
    tableCell: {
        value: {
            fontFamily: "body",
            fontSize: "xs",
            lineHeight: "1.125rem",
            fontWeight: "400",
            fontVariantNumeric: "tabular-nums",
        },
    },
    helper: {
        value: { fontFamily: "body", fontSize: "dense", lineHeight: "1rem", fontWeight: "400" },
    },
    overline: {
        value: {
            fontFamily: "body",
            fontSize: "2xs",
            lineHeight: "1rem",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
        },
    },
    numeric: {
        value: {
            fontFamily: "body",
            fontSize: "ui",
            fontWeight: "500",
            fontVariantNumeric: "tabular-nums",
        },
    },
});

/** Reusable surface treatments: `layerStyle="panel"` etc. */
export const layerStyles = defineLayerStyles({
    panel: {
        value: {
            bg: "bg.panel",
            borderWidth: "1px",
            borderColor: "border",
            borderRadius: "l3",
            boxShadow: "card",
        },
    },
    toolbar: {
        value: {
            bg: "bg.subtle",
            borderWidth: "1px",
            borderColor: "border",
            borderRadius: "l2",
        },
    },
    selected: {
        value: { bg: "bg.selected", color: "fg.brand" },
    },
});
