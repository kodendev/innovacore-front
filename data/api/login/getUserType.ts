import { BASE_URL } from "@/lib/utils";
import { userTypes } from "@/types/types";
import axios from "axios";

export const getUserType = async (): Promise<userTypes[]> => {
  try {
    const response = await axios.get<userTypes[]>(`${BASE_URL}/user-types`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return [];
  }
};
