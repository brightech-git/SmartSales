import { axiosInstance } from "@/api/axiosInstance";
import { createResourceApi } from "@/api/resourceApi";
import { callApi } from "@/api/apiClient";
import type { Metal, MetalData } from "../types/metal";

export type { Metal, MetalData };

export const MetalService = {
    // GET all metals
    getAllMetals: async (): Promise<Metal[]> => {
        const { data } = await axiosInstance.get("/metal");
        return data.data;
    },
    

    // GET active metals
    getActiveMetals: async (): Promise<Metal[]> => {
        const { data } = await axiosInstance.get("/metal/active");
        return data.data;
    },

    // GET metal by id
    getMetalById: async (id: string): Promise<Metal> => {
        const { data } = await axiosInstance.get(`/metal/${id}`);
        return data.data;
    },

    // POST create metal
    createMetal: async (metal: Metal): Promise<Metal> => {
        const { data } = await axiosInstance.post("/metal", metal);
        return data.data;
    },

    // PUT update metal
    updateMetal: async (sno: number, metal: Metal): Promise<Metal> => {
        const { data } = await axiosInstance.put(`/metal/${sno}`, metal);
        return data.data;
    },
};




export const getMetalBySno = (sno: number) =>

   
    callApi<null, MetalData>({
        method: "get",
        url: `/metal/sno/${sno}`,
    });
