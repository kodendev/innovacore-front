import { createSupplier } from "@/data/api/suppliers/postCreateSupplier";
import { CreateSupplierDto, Supplier } from "@/types/suppliers/supplierTypes";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupplier, // TS infiere automáticamente Promise<Supplier> y CreateSupplierDto
    onSuccess: (data) => {
      toast.success(`Proveedor ${data.name} agregado exitosamente`);
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: () => {
      toast.error("Error al crear el proveedor");
    },
  });
};
