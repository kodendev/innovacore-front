import axios from "axios";
import { Product } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/utils";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type UpdateProductInput = {
  id: number;
  data: Omit<Product, "id">;
};

export const editProduct = async ({
  id,
  data,
}: UpdateProductInput): Promise<Product> => {
  const response = await axios.patch<Product>(
    `${BASE_URL}/products/${id}`,
    data
  );
  console.log("Producto actualizado:", response.data);
  return response.data;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, UpdateProductInput>({
    mutationFn: editProduct,
    onSuccess: (updatedProduct) => {
      toast.success(
        `Producto "${updatedProduct.name}" actualizado correctamente.`
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log(`Producto actualizado:`, updatedProduct);
    },
    onError: () => {
      toast.error("Ocurrió un error al actualizar el producto.");
    },
  });
};
