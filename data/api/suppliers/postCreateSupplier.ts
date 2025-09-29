import { BASE_URL } from "@/lib/utils";
import { CreateSupplierDto } from "@/types/suppliers/supplierTypes";
import { Supplier } from "@/types/types";
import axios from "axios";

export const createSupplier = async (
  data: CreateSupplierDto
): Promise<Supplier> => {
  try {
    const response = await axios.post<Supplier>(`${BASE_URL}/suppliers`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating supplier:", error);
    throw error;
  }
};
