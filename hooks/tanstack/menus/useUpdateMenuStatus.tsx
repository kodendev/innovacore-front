import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { updateMenuStatus } from "@/data/api/menus/updateMenuStatus";
import { toast } from "sonner";
import { CreateMenu } from "@/types/types";
import Error from "next/error";

export const useUpdateMenuStatus = (
  options?: UseMutationOptions<CreateMenu, Error, number>
) => {
  const queryClient = useQueryClient();

  return useMutation<CreateMenu, Error, number>({
    mutationFn: updateMenuStatus,
    onSuccess: (data, variables, context) => {
      toast.success(`Menú ${data.name} actualizado exitosamente`);
      // Actualiza/ invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["menus"] });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      toast.error("Error al actualizar el menú");
      console.error("Error al actualizar menú:", error);

      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};
