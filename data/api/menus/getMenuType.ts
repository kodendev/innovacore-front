import { BASE_URL } from "@/lib/utils";
import { MenuType } from "@/types/types";
import axios from "axios";

export const getMenuType = async (): Promise<MenuType[]> => {
  try {
    const response = await axios.get<MenuType[]>(`${BASE_URL}/menuType`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menuType:", error);
    return [];
  }
};
