/**
 * Image URL handling. Server images are stored as relative paths
 * ("/uploads/user/1.jpg") and served from IMAGE_BASE_URL.
 */
export const IMAGE_BASE_URL = "https://www.smartsaleson.com";

/** Local placeholders in /public, used when an image is missing or fails to load. */
export const FALLBACK_IMAGES = {
    item: "/images/placeholder-item.svg",
    user: "/images/placeholder-user.svg",
} as const;

export type FallbackImage = keyof typeof FALLBACK_IMAGES;

const ABSOLUTE = /^(https?:|data:|blob:)/i;

/**
 * Turns a stored image path into a URL the browser can load. Absolute,
 * data: and blob: URLs are kept as they are; "//host/x" gets https.
 * Returns `fallback` (undefined by default) for missing or blank values.
 */
export const resolveImageUrl = (
    path: string | null | undefined,
    fallback?: string
): string | undefined => {
    const value = path?.trim();
    if (!value) return fallback;
    if (ABSOLUTE.test(value)) return value;
    if (value.startsWith("//")) return `https:${value}`;
    return `${IMAGE_BASE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
};
