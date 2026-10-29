import { useQuery ,useQueryClient, type QueryClient } from "@tanstack/react-query";
import { getBarcodeFilters, getBarcodeItemsDetails } from "@/service/BarcodeService";
import { BarCodeFilter } from "@/types/barcode/BarcodeDetails";
import { useApiQuery ,useApiMutation } from "../apiHook/ApiHook";
import { CreateTag, CreateTagResponse } from "@/types/tagging/Tag";

export const useBarcodeItems = (data:BarCodeFilter) => {
  return useQuery({
    queryKey: ["barcode-items", data],
    queryFn: () => getBarcodeItemsDetails(data),
    select:(data) => data.data,
  });

  
};

export const getBarcodeFilter = (param:any) => {
  return useQuery({
    queryKey: ["barcode-items-filter", param],
    queryFn: () => getBarcodeFilters(param),
    select:(data) => data.data,
  });
};

/**
 * Saving tags uses up untagged weight and advances the next tag number, so
 * refresh the lot details (barcode-items) as well as the tag listing.
 * Otherwise generating a second batch reuses the old start number.
 */
const invalidateAfterTagging = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["tag-details"] }),
    queryClient.invalidateQueries({ queryKey: ["barcode-items"] }),
    queryClient.invalidateQueries({ queryKey: ["ornaments"] }),
  ]);

export const useCreateTag = () =>{
  const queryClient = useQueryClient();
  return useApiMutation<CreateTagResponse,CreateTag>(
    {
      url:"/tagged",
      params: (variables: CreateTag) => ({ RETAG: variables.RETAG }), // Access from body
      method:"POST",
      queryKey:['barcode-items-filter'],
 
      onSuccess: () => invalidateAfterTagging(queryClient),

    }
  )
}

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useApiMutation<CreateTagResponse, CreateTag & { id?: string | number }>(
    {
      url:({id})=>`/tagged/${id}`,
      method:"PUT",
      params: (variables: CreateTag) => ({ RETAG: variables.RETAG }), // Access from body
      queryKey:['barcode-items-filter'],
      // enabled: !!id ,
      onSuccess: () => invalidateAfterTagging(queryClient)
    }
  )
}

