import { useQuery ,useQueryClient , useMutation } from "@tanstack/react-query";
import { RateEntryService } from "../api/rateApi";
import type { RatePayload } from "../types/rate";


export const useRates = () => {
    return useQuery({
        queryKey:['latest-rates'],
        queryFn:RateEntryService.getLatestRate,
        select:(res)=>res.data
        
    })
}

export const useAllRates = () => {
    return useQuery({
        queryKey:['rates'],
        queryFn:RateEntryService.getAllRates,
        select:(res)=>res.data
        
    })
}

export const useCreateRate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: RatePayload) => RateEntryService.createRate(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['latest-rates' ,'rates'] });
            
        }
    })
}