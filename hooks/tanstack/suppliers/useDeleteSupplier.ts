import { deleteSupplier } from "@/data/api/suppliers/deleteSupplier";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      toast.success("Proveedor eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: () => {
      toast.error("Error al eliminar proveedor");
    },
  });
};
