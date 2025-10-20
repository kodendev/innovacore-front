import { BASE_URL } from "@/lib/utils";
import axios from "axios";

export const patchRoom = async (
  roomId: number,
  data: { name: string; floor: number }
) => {
  const response = await axios.patch(`${BASE_URL}/rooms/${roomId}`, data);
  return response.data;
};
