import { updateMenu, UpdateMenuDTO } from "@/data/api/menus/updateMenu";
import { Menu } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation<Menu, Error, { id: number; data: UpdateMenuDTO }>({
    mutationFn: ({ id, data }) => updateMenu(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (error) => {
      console.error("Error al actualizar el menú:", error);
    },
  });
};
