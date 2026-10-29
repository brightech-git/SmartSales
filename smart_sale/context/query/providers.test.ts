import { describe, expect, it } from "vitest";
import { createAppQueryClient } from "./providers";

describe("createAppQueryClient", () => {
    it("keeps transactional data near-live and caches master data longer", () => {
        const client = createAppQueryClient();
        expect(client.getQueryDefaults(["openingBalance", 5]).staleTime ?? client.getDefaultOptions().queries?.staleTime).toBe(15_000);
        expect(client.getQueryDefaults(["metals"]).staleTime).toBe(5 * 60_000);
        expect(client.getQueryDefaults(["softcontrol", "USE_API_RATE"]).staleTime).toBe(5 * 60_000);
        expect(client.getDefaultOptions().queries?.retry).toBe(1);
    });
});
