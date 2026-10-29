import { describe, expect, it } from "vitest";
import { FALLBACK_IMAGES, IMAGE_BASE_URL, resolveImageUrl } from "./imageUrl";
import { getImage } from "./getImage";

describe("resolveImageUrl", () => {
    it("prefixes stored paths with the image host", () => {
        expect(resolveImageUrl("/uploads/a.jpg")).toBe(`${IMAGE_BASE_URL}/uploads/a.jpg`);
        expect(resolveImageUrl("uploads/a.jpg")).toBe(`${IMAGE_BASE_URL}/uploads/a.jpg`);
    });

    it("keeps absolute, data and blob URLs", () => {
        expect(resolveImageUrl("https://cdn.example.com/a.png")).toBe("https://cdn.example.com/a.png");
        expect(resolveImageUrl("data:image/png;base64,AAA")).toBe("data:image/png;base64,AAA");
        expect(resolveImageUrl("blob:http://localhost/1")).toBe("blob:http://localhost/1");
        expect(resolveImageUrl("//cdn.example.com/a.png")).toBe("https://cdn.example.com/a.png");
    });

    it("returns the fallback for missing values", () => {
        expect(resolveImageUrl(null)).toBeUndefined();
        expect(resolveImageUrl("  ", FALLBACK_IMAGES.item)).toBe(FALLBACK_IMAGES.item);
    });

    it("keeps getImage working for existing callers", () => {
        expect(getImage("/u/1.jpg")).toBe(`${IMAGE_BASE_URL}/u/1.jpg`);
        expect(getImage(undefined)).toBeUndefined();
    });
});
