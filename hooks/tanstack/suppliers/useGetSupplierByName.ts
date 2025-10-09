import { useQuery } from "@tanstack/react-query";
import { getSupplierByName } from "@/data/api/suppliers/getSupplierByName";

export const useSupplierSearch = (name: string) => {
  return useQuery({
    queryKey: ["suppliers", name],
    queryFn: () => getSupplierByName(name),
    enabled: !!name, // Solo ejecuta si name tiene valor
  });
};
