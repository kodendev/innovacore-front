import { BASE_URL } from "@/lib/utils";
import axios from "axios";

export type DeleteRoomResponse = {
  ok: boolean;
  message?: string;
  roomId?: number;
};

export async function deleteRoomApi(
  roomId: number
): Promise<DeleteRoomResponse> {
  if (typeof roomId !== "number") {
    throw new Error("roomId must be a number");
  }

  const url = `${BASE_URL}/rooms/${roomId}`;
  const res = await axios.delete(url);
  return res.data as DeleteRoomResponse;
}
