import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Supplier, UpdateSupplierDto } from "@/types/suppliers/supplierTypes";
import { updateSupplier } from "@/data/api/suppliers/patchEditSupplier";
import { toast } from "sonner";

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation<
    Supplier,
    unknown,
    { id: number; data: UpdateSupplierDto }
  >({
    mutationFn: ({ id, data }) => updateSupplier(id, data),
    onSuccess: () => {
      toast.success("Proveedor actualizado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
