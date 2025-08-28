import { BASE_URL } from "@/lib/utils";
import { LoginResponse, LoginUserTypes } from "@/types/types";
import axios from "axios";

export const LoginUser = async (
  user: LoginUserTypes
): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>(
    `${BASE_URL}/auth/login`,
    user
  );
  return data;
};
