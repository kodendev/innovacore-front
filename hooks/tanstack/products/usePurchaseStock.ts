import { useMutation } from "@tanstack/react-query";
import {
  PurchaseRequest,
  PurchaseResponse,
} from "@/types/stock/stockMovementsTypes";
import { createPurchase } from "@/data/api/products/postAddPurchase";

export const useCreatePurchase = () => {
  return useMutation<PurchaseResponse, Error, PurchaseRequest>({
    mutationFn: createPurchase,
  });
};
