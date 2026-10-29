import { describe, expect, it } from "vitest";
import { displayText, getInitials, toTitle } from "./text";

describe("text helpers", () => {
    it("turns route and key names into titles", () => {
        expect(toTitle("ItemMaster")).toBe("Item Master");
        expect(toTitle("pureGold")).toBe("Pure Gold");
        expect(toTitle("item_stock-report")).toBe("Item Stock Report");
        expect(toTitle(undefined)).toBe("");
    });

    it("builds avatar initials", () => {
        expect(getInitials("Suganya R")).toBe("SR");
        expect(getInitials("admin")).toBe("A");
        expect(getInitials("  ")).toBe("");
        expect(getInitials(null)).toBe("");
    });

    it("shows a fallback for blank text but keeps zero", () => {
        expect(displayText(" ")).toBe("—");
        expect(displayText(null, "-")).toBe("-");
        expect(displayText(0)).toBe("0");
    });
});
