import { Product } from "../../../types/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchProducts = async (
  categoryId?: number
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${BASE_URL}/products`, {
      params: categoryId ? { categoryId } : {}, // <-- si existe, lo manda como query param
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export function useProducts(categoryId?: number) {
  return useQuery<Product[]>({
    queryKey: ["products", categoryId], // <-- la cache depende del filtro
    queryFn: () => fetchProducts(categoryId),
    staleTime: 0,
  });
}
