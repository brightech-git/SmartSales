import { resolveImageUrl } from "./imageUrl";

/** Kept for existing callers; new code should use resolveImageUrl. */
export const getImage = (imageUrl?: string | null): string | undefined => resolveImageUrl(imageUrl);
