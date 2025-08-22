import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { createMenu } from "@/data/api/menus/createMenu";
import { toast } from "sonner";
import { CreateMenu, CreateMenuPayload } from "@/types/types";

export const useCreateMenu = (
  options?: UseMutationOptions<CreateMenu, Error, CreateMenuPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation<CreateMenu, Error, CreateMenuPayload>({
    mutationFn: createMenu,
    onSuccess: (data, variables, context) => {
      toast.success(`Menú ${data.name} creado exitosamente`);
      // Actualiza/ invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["menus"] });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      toast.error("Error al crear el menú");
      console.error("Error al crear menú:", error); // 👈 agrega esto

      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};
