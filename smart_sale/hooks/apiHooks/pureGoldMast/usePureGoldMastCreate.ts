import { useMutation , useQueryClient } from "@tanstack/react-query";
import { pureGoldMastService } from "@/service/pureGoldService";
import { toastCreated } from "@/component/toast/toast";

export const useCreatePureGoldMast = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: pureGoldMastService().createPureGoldMast,
        onSuccess: () => {
            toastCreated("Pure Gold Master")
            queryClient.invalidateQueries({ queryKey: ["pureGoldData"] });
        },
    });
};

/* ----------------------Pure Gold Name ------------------*/

export const useCreatePureGoldNmae = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: pureGoldMastService().createPureGoldName,
        onSuccess: () => {
            toastCreated("Pure Gold Name")
            queryClient.invalidateQueries({ queryKey: ["pureGoldDName"] });
        },
    });
};