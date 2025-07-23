import { Product } from "../../types/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return [];
  }
};

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 0, // o por ej. 5 * 60 * 1000 para 5 minutos
  });
}
