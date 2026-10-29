import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { StoneMappingService } from "@/service/StoneMapping";
import { ApiResponse } from "@/types/api/apiResponse";

import {
    toastCreated,
    toastError,
    toastUpdated,
} from "@/component/toast/toast";

import {
    StoneMappingFilter,
    StoneMappingForm,
} from "@/types/stoneMapping/StoneMappingTypes";


/* ---------------- CREATE ---------------- */

export const useStoneMappingCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: StoneMappingService().createStoneMapping,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["stoneMapping"],
            });
            queryClient.invalidateQueries({ queryKey: ["stoneMapping-by-id"] });
            queryClient.invalidateQueries({ queryKey: ["stoneMapping-filter"] });
        },

        onError: (error) => {
            console.error("Error creating hmc:", error?.message);
            toastError(`${error}`);
        },
    });
};

/* ---------------- GET ALL ---------------- */

export const useStoneMappingData = (filter?: string, advancedFilter: Record<string, any> = {}) => {
    return useQuery({
        queryKey: ["stoneMapping", filter, advancedFilter],

        queryFn: () =>
            StoneMappingService().getStoneMappingData(filter, advancedFilter),

        select: (data) => data.data,
    });
};

/* ---------------- GET BY ID ---------------- */

export const useStoneMappingDataById = (
    id: number | null
) => {
    return useQuery({
        queryKey: ["stoneMapping-by-id", id],

        queryFn: () =>
            StoneMappingService().getStoneMappingById(id),

        select: (data) => data.data,

        enabled: !!id,
    });
};

/* ---------------- UPDATE ---------------- */

export const useModifyStoneMappingById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            id: number;
            formData: StoneMappingForm;
        }) =>
            StoneMappingService().updateStoneMapping(
                data.id,
                data.formData
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stoneMapping"] });
            queryClient.invalidateQueries({ queryKey: ["stoneMapping-by-id"] });
            queryClient.invalidateQueries({ queryKey: ["stoneMapping-filter"] });
        },
    });
};

/* ---------------- FILTER ---------------- */

export const useStoneMappingByFilter = (
    filter: StoneMappingFilter,
    enabled: boolean
) => {
    return useQuery({
        queryKey: ["stoneMapping-filter", filter],

        queryFn: () =>
            StoneMappingService().getStoneMappingByFilter(filter),

        select: (data) => data.data,

        enabled,
    });
};