import {
    useQuery,
    useMutation,
    useQueryClient,
    type QueryClient,
} from "@tanstack/react-query";

import { TransactionService, getBillWiseSales } from "@/service/TransactionService";
import { CreateTransaction, UpdateTransactionPayload } from "@/types/transcation/Transaction";
import { ApiResponse } from "@/types/api/apiResponse";
import { billNoParams } from "@/service/TransactionService";
import { PurchaseTransactionList } from "@/types/transactionList/TransactionList";

/* -------------------- QUERY KEYS -------------------- */
// Every key starts with ["transactions", TRANTYPE] so purchase and sales never
// share cache entries and invalidating one type leaves the other alone.
export type TransactionListFilters = {
    trantype?: string | null;
    accode?: number | null;
    startdate?: string | null;
    enddate?: string | null;
    itemid?: number | null;
};

export const transactionKeys = {
    all: ["transactions"] as const,
    type: (TRANTYPE: string) => [...transactionKeys.all, TRANTYPE] as const,
    list: (TRANTYPE: string, filters?: TransactionListFilters) =>
        filters
            ? ([...transactionKeys.type(TRANTYPE), "list", {
                  trantype: filters.trantype ?? null,
                  accode: filters.accode ?? null,
                  startdate: filters.startdate ?? null,
                  enddate: filters.enddate ?? null,
                  itemid: filters.itemid ?? null,
              }] as const)
            : ([...transactionKeys.type(TRANTYPE), "list"] as const),
    byId: (sno: number, TRANTYPE: string) =>
        [...transactionKeys.type(TRANTYPE), "one", sno] as const,
    byTransId: (transId: string | null, TRANTYPE: string) =>
        [...transactionKeys.type(TRANTYPE), "transId", transId] as const,
};

/**
 * Data a saved purchase or sale changes: its own lists and next entry
 * numbers, the customer's opening balance, stock lists, bill details and the
 * untagged lots shown on Barcode Generate.
 */
export const invalidateAfterTransactionSave = (queryClient: QueryClient, TRANTYPE: string) =>
    Promise.all([
        queryClient.invalidateQueries({ queryKey: transactionKeys.type(TRANTYPE) }),
        queryClient.invalidateQueries({ queryKey: ["openingBalance"] }),
        queryClient.invalidateQueries({ queryKey: ["ornaments"] }),
        queryClient.invalidateQueries({ queryKey: ["pureGoldData"] }),
        queryClient.invalidateQueries({ queryKey: ["bill-details"] }),
        queryClient.invalidateQueries({ queryKey: ["barcode-items"] }),
    ]);


/* -------------------- QUERIES -------------------- */

// GET ALL
export const useTransactions = (props: {
    TRANTYPE: string;
    trantype?: string | null;
    accode?: number | null;
    startdate?: string | null;
    enddate?: string | null;
    itemid?: number | null;
}) => {
    return useQuery<ApiResponse<PurchaseTransactionList>, Error, PurchaseTransactionList>({
        queryKey: transactionKeys.list(props.TRANTYPE, props),
        queryFn: () => TransactionService.getAll(props),
        select: (res) => res.data
    });
};

// GET BY TRANSACTION ID
export const useTransactionByTransId = (
    transId: string | null,
    TRANTYPE: string
) => {
    return useQuery<ApiResponse<any>>({
        queryKey: transactionKeys.byTransId(transId, TRANTYPE),
        queryFn: () =>
            TransactionService.getByTransId(transId, TRANTYPE),
        enabled: !!transId,
    });
};

// GET ONE
export const useTransaction = (
    sno: number,
    TRANTYPE: string,
    tranType: string
) => {
    return useQuery<ApiResponse<any>>({
        queryKey: transactionKeys.byId(sno, TRANTYPE),
        queryFn: () => TransactionService.getOne(sno, TRANTYPE, tranType),
        enabled: !!sno && !!TRANTYPE,
    });
};

/* -------------------- MUTATIONS -------------------- */


// UPDATE (PUT)
export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            entryNo,
            payload,
            TRANTYPE
        }: {
            entryNo: number;
            payload: CreateTransaction;
            TRANTYPE: string;
        }) => TransactionService.update(entryNo, payload, TRANTYPE),

        onSuccess: (_data, { TRANTYPE }) => invalidateAfterTransactionSave(queryClient, TRANTYPE),
    });
};

// PATCH
export const usePatchTransaction = (TRANTYPE: string, tranType: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            sno,
            payload,
        }: {
            sno: number;
            payload: Partial<any>;
        }) => TransactionService.patch(sno, payload, TRANTYPE, tranType),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transactionKeys.type(TRANTYPE),
            });
        },
    });
};

// DELETE
export const useDeleteTransaction = (TRANTYPE: string, tranType: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sno: number) =>
            TransactionService.remove(sno, TRANTYPE, tranType),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transactionKeys.type(TRANTYPE),
            });
        },
    });
};

//CREATE
//CREATE
export const useCreateTransactions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ payload, TRANTYPE }: { payload: CreateTransaction; TRANTYPE: string }) =>
            TransactionService.createMany(payload, TRANTYPE),

        onSuccess: (_data, { TRANTYPE }) => invalidateAfterTransactionSave(queryClient, TRANTYPE),
    });
};


export const useBillDetails = (params: billNoParams) => {
    return useQuery({
        queryKey: ['bill-details', params],
        queryFn: () => getBillWiseSales(params),
        retry: 1,
    })
}