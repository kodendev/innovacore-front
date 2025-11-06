import { BASE_URL } from "@/lib/utils";
import { CreateMenu } from "../../../types/types";
import axios from "axios";

export async function updateMenuStatus(
  menuId: number
): Promise<CreateMenu> {
  const response = await axios.patch<CreateMenu>(`${BASE_URL}/menu/${menuId}/changeStatus`);
  return response.data;
}
