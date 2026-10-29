import { useMutation , useQueryClient } from "@tanstack/react-query";
import { TouchMastService } from "@/service/TouchService";
import { toastCreated, toastError } from "@/component/toast/toast";

const useTouchMastCreate = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: TouchMastService().createTouchMast,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["touchMast"] });
            toastCreated('touchMaster');
        },
        onError: (error) => {
            console.error("Error creating touch-mast:", error);
            toastError(`${error}`)
        }
    });


}
export default useTouchMastCreate;