import { RoomFilters } from "@/hooks/filters/useRoomFilters";
import { BASE_URL } from "@/lib/utils";
import { Room } from "@/types/camas/bedTypes";
import axios from "axios";

export const getBeds = async (filters?: RoomFilters): Promise<Room[]> => {
  try {
    let url = `${BASE_URL}/rooms`;

    // Si hay filtros, usar el endpoint de filtros con parámetros
    if (filters && Object.keys(filters).length > 0) {
      const params = new URLSearchParams();

      if (filters.roomStatus) params.append("roomStatus", filters.roomStatus);
      if (filters.floor !== undefined)
        params.append("floor", filters.floor.toString());
      if (filters.bedStatus) params.append("bedStatus", filters.bedStatus);
      if (filters.menuConsumed !== undefined)
        params.append("menuConsumed", filters.menuConsumed.toString());
      if (filters.name) params.append("name", filters.name);

      url = `${BASE_URL}/rooms/filters?${params.toString()}`;
    }

    const response = await axios.get<Room[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error al obtener camas:", error);
    return [];
  }
};
