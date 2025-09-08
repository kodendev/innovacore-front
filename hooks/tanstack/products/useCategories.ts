import { getCategories } from "@/data/api/products/getCategories";
import { Category } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"], // <-- la cache depende del filtro
    queryFn: () => getCategories(),
    staleTime: 0,
  });
}
