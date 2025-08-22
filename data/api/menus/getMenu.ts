import { BASE_URL } from "@/lib/utils";
import { Menu } from "@/types/types";
import axios from "axios";

export const getMenu = async (): Promise<Menu[]> => {
  try {
    const response = await axios.get<Menu[]>(
      `${BASE_URL}/menu/all/with-products`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return [];
  }
};
