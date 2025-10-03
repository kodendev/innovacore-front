import { BASE_URL } from "@/lib/utils";
import { Supplier } from "@/types/suppliers/supplierTypes";
import axios from "axios";

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  try {
    const response = await axios.get<Supplier[]>(`${BASE_URL}/suppliers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return [];
  }
};
