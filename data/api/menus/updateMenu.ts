import { BASE_URL } from "@/lib/utils";
import { Menu } from "@/types/types";
import axios from "axios";

export interface UpdateMenuDTO {
  name: string;
  description: string;
  quantity: number;
  menuTypeId: number;
}

/** Update a single menu with id
 * @param id - The ID of the menu to update
 * @param data - The data to update the menu with
 * @returns The updated menu data
 */
export const updateMenu = async (id: number, data: UpdateMenuDTO) => {
  const response = await axios.put<Menu>(`${BASE_URL}/menu/${id}`, data);
  return response.data;
};
