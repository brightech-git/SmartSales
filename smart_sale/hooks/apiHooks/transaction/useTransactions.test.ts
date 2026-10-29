import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { invalidateAfterTransactionSave, transactionKeys } from "./useTransactions";

const seed = (client: QueryClient, keys: readonly (readonly unknown[])[]) =>
    keys.forEach((key) => client.setQueryData(key, { seeded: true }));

const isInvalidated = (client: QueryClient, key: readonly unknown[]) =>
    client.getQueryState(key)?.isInvalidated ?? false;

describe("transactionKeys", () => {
    it("never shares a cache entry between purchase and sales", () => {
        const filters = { accode: null, startdate: null };
        expect(transactionKeys.list("purchase", filters)).not.toEqual(transactionKeys.list("sales", filters));
        expect(transactionKeys.byTransId("12", "purchase")).not.toEqual(transactionKeys.byTransId("12", "sales"));
    });

    it("normalises missing filters so equal filters give equal keys", () => {
        expect(transactionKeys.list("sales", { accode: undefined })).toEqual(transactionKeys.list("sales", {}));
    });
});

describe("invalidateAfterTransactionSave", () => {
    it("refreshes the saved type's lists, balances, stock and untagged lots only", async () => {
        const client = new QueryClient();
        const purchaseList = transactionKeys.list("purchase", { accode: 5 });
        const salesList = transactionKeys.list("sales", { accode: 5 });
        const related = [
            ["openingBalance", 5],
            ["ornaments", "", "N"],
            ["pureGoldData", "", {}],
            ["bill-details", { ACCODE: 5 }],
            ["barcode-items", { ACCODE: 5 }],
        ] as const;
        const unrelated = ["metals"] as const;
        seed(client, [purchaseList, salesList, ...related, unrelated]);

        await invalidateAfterTransactionSave(client, "purchase");

        expect(isInvalidated(client, purchaseList)).toBe(true);
        related.forEach((key) => expect(isInvalidated(client, key)).toBe(true));
        expect(isInvalidated(client, salesList)).toBe(false);
        expect(isInvalidated(client, unrelated)).toBe(false);
    });

    it("lets patch/delete invalidation by type reach filtered lists", async () => {
        const client = new QueryClient();
        const list = transactionKeys.list("sales", { accode: 7, startdate: "2026-10-01" });
        seed(client, [list]);
        await client.invalidateQueries({ queryKey: transactionKeys.type("sales") });
        expect(isInvalidated(client, list)).toBe(true);
    });
});
