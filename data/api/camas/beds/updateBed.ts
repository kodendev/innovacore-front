// src/api/bedApi.ts
import { BASE_URL } from "@/lib/utils";
import axios from "axios";

export interface UpdateBedPayload {
  name: string;
  roomId: number;
  status: "disponible" | "ocupada" | "mantenimiento";
}

export const updateBed = async (bedId: number, payload: UpdateBedPayload) => {
  const { data } = await axios.patch(`${BASE_URL}/beds/${bedId}`, payload);
  return data;
};
