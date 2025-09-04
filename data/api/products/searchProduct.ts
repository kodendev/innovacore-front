import { BASE_URL } from "@/lib/utils";
import { Product } from "@/types/types";
import axios from "axios";

export const searchProductsByName = async (
  name: string
): Promise<Product[]> => {
  console.log("🔍 Haciendo request con name:", name);
  const response = await axios.get<Product[]>(`${BASE_URL}/products/search`, {
    params: { name },
  });
  console.log("✅ URL Final:", response.config?.url);
  return response.data;
};
