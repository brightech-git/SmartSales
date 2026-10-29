"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const MINUTE = 60 * 1000;

/**
 * Master data changes rarely and every screen that edits it invalidates
 * these keys, so it can be reused for a few minutes instead of being
 * refetched on every screen mount and window focus.
 */
const MASTER_DATA_KEYS = [
    "softcontrol",
    "companies",
    "company",
    "metals",
    "items",
    "stoneItems",
    "otherCharges",
    "bankAccounts",
    "printer-settings",
    "pureGoldDName",
    "states",
];

export const createAppQueryClient = () => {
    const client = new QueryClient({
        defaultOptions: {
            queries: {
                // Balances, stock, rates and transactions stay near-live, but a
                // remount or window switch within 15s reuses the cached result
                // instead of refetching ~20 queries per entry screen.
                staleTime: 15 * 1000,
                // One retry: an entry screen should show an error in seconds,
                // not after the default three back-off retries.
                retry: 1,
            },
        },
    });
    for (const key of MASTER_DATA_KEYS) {
        client.setQueryDefaults([key], { staleTime: 5 * MINUTE });
    }
    return client;
};

export default function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(createAppQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
