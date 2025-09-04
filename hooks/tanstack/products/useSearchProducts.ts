import { searchProductsByName } from "@/data/api/products/searchProduct";
import { Product } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export const useSearchProducts = (name: string) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", "search", name],
    queryFn: () => searchProductsByName(name),
    enabled: !!name.trim(),
    retry: false,
  });
};
