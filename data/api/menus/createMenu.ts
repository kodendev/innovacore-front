import { BASE_URL } from "@/lib/utils";
import { CreateMenuPayload } from "@/types/types";
import { CreateMenu } from "../../../types/types";
import axios from "axios";

export async function createMenu(
  menuData: CreateMenuPayload
): Promise<CreateMenu> {
  const response = await axios.post<CreateMenu>(`${BASE_URL}/menu`, menuData);
  return response.data;
}
