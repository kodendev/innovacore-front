import { BASE_URL } from "@/lib/utils";
import axios from "axios";

export interface CreateBedDto {
  name: string;
  roomId: number;
  status: string;
}

export const createBed = async (bedData: CreateBedDto) => {
  const response = await axios.post(`${BASE_URL}/beds`, bedData);
  return response.data;
};
