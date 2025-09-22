import {
  PurchaseRequest,
  PurchaseResponse,
} from "@/types/stock/stockMovementsTypes";
import axios from "axios";
import { BASE_URL } from "@/lib/utils";

export const createPurchase = async (
  data: PurchaseRequest
): Promise<PurchaseResponse> => {
  const response = await axios.post<PurchaseResponse>(
    `${BASE_URL}/products/addPurchase`,
    data
  );
  return response.data;
};
