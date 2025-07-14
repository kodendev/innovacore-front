import { suppliers } from "@/data/fakeData";
import { Supplier } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Provider } from "react";

const fetchSuppliers = async (): Promise<Supplier[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(suppliers);
    }, 500); // simula delay de red
  });
};
export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
    staleTime: 0, // 5 minutos
  });
}
