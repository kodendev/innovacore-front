import { BASE_URL } from "@/lib/utils";
import { Supplier } from "@/types/suppliers/supplierTypes";
import axios from "axios";

export const getSupplieryByProducts = async (productId: string) => {
  try {
    const response = await axios.get<Supplier[]>(
      `${BASE_URL}/supplier-products/by-product/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers by name:", error);
    return [];
  }
};
