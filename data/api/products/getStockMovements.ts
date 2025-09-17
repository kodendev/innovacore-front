import { BASE_URL } from "@/lib/utils";
import { InventoryMovementResponse } from "@/types/types";
import axios from "axios";

export const getStockMovements = async (): Promise<
  InventoryMovementResponse[]
> => {
  try {
    const response = await axios.get<InventoryMovementResponse[]>(
      `${BASE_URL}/inventory/movements`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
