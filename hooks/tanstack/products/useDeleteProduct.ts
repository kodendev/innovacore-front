import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/products/${id}`);
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Producto eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Refresca el listado
    },
    onError: () => {
      toast.error(
        "Error al eliminar el producto , este producto está asociado a un menú"
      );
    },
  });
};
