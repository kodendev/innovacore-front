import axios from "axios";
import { Supplier, UpdateSupplierDto } from "@/types/suppliers/supplierTypes";
import { BASE_URL } from "@/lib/utils";

export async function updateSupplier(
  id: number,
  data: UpdateSupplierDto
): Promise<Supplier> {
  const response = await axios.patch<Supplier>(
    `${BASE_URL}/suppliers/${id}`,
    data
  );
  return response.data;
}
