import { BASE_URL } from "@/lib/utils";
import axios from "axios";

export interface AssignBedMenuPayload {
  bedId: number;
  menuId: number;
  quantity: number;
}

export const assignBedMenu = async (payload: AssignBedMenuPayload) => {
  const { data } = await axios.post(`${BASE_URL}/bed-menu/assign`, payload);
  return data;
};
