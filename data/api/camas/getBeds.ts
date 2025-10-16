import { BASE_URL } from "@/lib/utils";
import { Room } from "@/types/camas/bedTypes";
import axios from "axios";

export const getBeds = async (): Promise<Room[]> => {
  try {
    const response = await axios.get<Room[]>(`${BASE_URL}/rooms/overview`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener camas:", error);
    return [];
  }
};
