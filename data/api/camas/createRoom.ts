import { BASE_URL } from "@/lib/utils";
import axios from "axios";
import { Room } from "@/types/camas/bedTypes";

export type CreateRoomDto = {
  name: string;
  floor?: number | null;
};
export async function createRoom(payload: CreateRoomDto): Promise<Room> {
  const { data } = await axios.post<Room>(`${BASE_URL}/rooms`, payload);
  return data;
}
