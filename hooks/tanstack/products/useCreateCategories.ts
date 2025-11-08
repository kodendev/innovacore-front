import { Category } from "@/types/types";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const createCategory = async (
  categoryData: Omit<Category, "id">
): Promise<Category> => {
  const res = await axios.post<Category>(`${BASE_URL}/categories`, categoryData);
  return res.data;
};

export const useCreateCategory = (
  options?: UseMutationOptions<Category, Error, Omit<Category, "id">>
) => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, Omit<Category, "id">>({
    mutationFn: createCategory,
    onSuccess: (data, variables, context) => {
      toast.success(`Categoría ${data.name} agregada exitosamente`);
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      toast.error("Error al crear la categoría");

      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};
