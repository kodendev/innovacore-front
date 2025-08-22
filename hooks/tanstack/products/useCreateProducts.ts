import { Product } from "@/types/types";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const createProduct = async (
  productData: Omit<Product, "id">
): Promise<Product> => {
  const res = await axios.post<Product>(`${BASE_URL}/products`, productData);
  return res.data;
};

export const useCreateProduct = (
  options?: UseMutationOptions<Product, Error, Omit<Product, "id">>
) => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, Omit<Product, "id">>({
    mutationFn: createProduct,
    onSuccess: (data, variables, context) => {
      toast.success(`Ingrediente ${data.name} agregado exitosamente`);
      queryClient.invalidateQueries({ queryKey: ["products"] });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      toast.error("Error al crear el producto");

      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};
