import { getStockMovements } from "@/data/api/products/getStockMovements";
import { InventoryMovementResponse } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export const useStockMovements = () => {
  return useQuery<InventoryMovementResponse[]>({
    queryKey: ["stockMovements"],
    queryFn: () => getStockMovements(),
    staleTime: 0,
  });
};
