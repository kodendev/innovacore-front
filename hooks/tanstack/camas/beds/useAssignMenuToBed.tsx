import {
  assignBedMenu,
  AssignBedMenuPayload,
} from "@/data/api/camas/beds/assignMenuToBed";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAssignBedMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignBedMenuPayload) => assignBedMenu(payload),
    onSuccess: () => {
      toast.success("Menú asignado correctamente");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: any) => {
      console.error("Error al asignar menú:", error);
      toast.error("No se pudo asignar el menú");
    },
  });
}
