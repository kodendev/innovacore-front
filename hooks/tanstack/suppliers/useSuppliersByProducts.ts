import { getSupplieryByProducts } from "@/data/api/suppliers/getSupplierByProduct";
import { useQuery } from "@tanstack/react-query";

export const useSuppliersByProducts = (productId: string) => {
  return useQuery({
    queryKey: ["supplierProducts", productId],
    queryFn: () => getSupplieryByProducts(productId),
    enabled: !!productId, // Solo ejecuta si name tiene valor
  });
};
