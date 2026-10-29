/** "ItemMaster" → "Item Master", "pureGold" → "Pure Gold", "item_stock" → "Item Stock". */
export const toTitle = (value: string | null | undefined): string => {
    if (!value) return "";
    const spaced = value
        .replace(/[_-]+/g, " ")
        .replace(/([a-z\d])([A-Z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .trim();
    return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
};

/** Up to two initials for avatars: "Suganya R" → "SR", "admin" → "A". */
export const getInitials = (name: string | null | undefined): string => {
    const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "";
    const first = words[0][0] ?? "";
    const last = words.length > 1 ? words[words.length - 1][0] ?? "" : "";
    return (first + last).toUpperCase();
};

/** Shows a fallback for missing or blank text. */
export const displayText = (value: string | number | null | undefined, fallback = "—"): string => {
    if (value === null || value === undefined) return fallback;
    const text = String(value).trim();
    return text === "" ? fallback : text;
};
