import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { HmcService } from "@/service/HmcService";
import { ApiResponse } from "@/types/api/apiResponse";

import {
    toastCreated,
    toastError,
    toastUpdated,
} from "@/component/toast/toast";

import {
    HmcFilter,
    HmcForm,
} from "@/types/hmc/hmc";


/* ---------------- CREATE ---------------- */

export const useHmcCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: HmcService().createHmc,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["hmc"],
            });
            // Entry screens read rates through these keys.
            queryClient.invalidateQueries({ queryKey: ["hmc-by-id"] });
            queryClient.invalidateQueries({ queryKey: ["hmc-filter"] });

            toastCreated("HMC Mapping");
        },

        onError: (error) => {
            console.error("Error creating hmc:", error);
            toastError(`${error}`);
        },
    });
};

/* ---------------- GET ALL ---------------- */

export const useHmcData = (filter?: string, advancedFilter: Record<string, any> = {}) => {
    return useQuery({
        queryKey: ["hmc", filter, advancedFilter],

        queryFn: () =>
            HmcService().getHmcData(filter, advancedFilter),

        select: (data) => data.data,
    });
};

/* ---------------- GET BY ID ---------------- */

export const useHmcDataById = (
    id: number | null
) => {
    return useQuery({
        queryKey: ["hmc-by-id", id],

        queryFn: () =>
            HmcService().getHmcById(id),

        select: (data) => data.data,

        enabled: !!id,
    });
};

/* ---------------- UPDATE ---------------- */

export const useModifyHmcById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            id: number;
            formData: HmcForm;
        }) =>
            HmcService().updateHmc(
                data.id,
                data.formData
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["hmc"],
            });
            // Entry screens read rates through these keys.
            queryClient.invalidateQueries({ queryKey: ["hmc-by-id"] });
            queryClient.invalidateQueries({ queryKey: ["hmc-filter"] });

            toastUpdated("HMC Mapping");
        },

        onError: (error) => {
            console.error("Error updating hmc:", error);
            toastError(`${error}`);
        },
    });
};

/* ---------------- FILTER ---------------- */

export const useHmcByFilter = (
    filter: HmcFilter,
    enabled: boolean
) => {
    return useQuery({
        queryKey: ["hmc-filter", filter],

        queryFn: () =>
            HmcService().getHmcByFilter(filter),

        select: (data) => data.data,

        enabled,
    });
};