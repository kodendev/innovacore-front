import { BASE_URL } from "@/lib/utils";
import { CreateUserTypes } from "@/types/types";
import axios from "axios";

export const createUser = async (user: CreateUserTypes) => {
  const { data } = await axios.post(`${BASE_URL}/users`, user);
  return data;
};
