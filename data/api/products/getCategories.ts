import { BASE_URL } from "@/lib/utils";
import { Category } from "@/types/types";
import axios from "axios";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(`${BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
