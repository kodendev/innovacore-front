import { fetchSuppliers } from "@/data/api/suppliers/getSuppliers";
import { Supplier } from "@/types/suppliers/supplierTypes";
import { useQuery } from "@tanstack/react-query";

export function useSuppliers() {
  return useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
    staleTime: 0,
  });
}
