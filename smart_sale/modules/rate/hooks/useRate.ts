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
            // Two separate keys; one array ['latest-rates', 'rates'] matched
            // neither, so the header and entry screens kept the old rate.
            queryClient.invalidateQueries({ queryKey: ['latest-rates'] });
            queryClient.invalidateQueries({ queryKey: ['rates'] });
            
        }
    })
}