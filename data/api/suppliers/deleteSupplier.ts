import { BASE_URL } from "@/lib/utils";
import axios from "axios";

export const deleteSupplier = async (id: number) => {
  try {
    await axios.delete(`${BASE_URL}/suppliers/${id}`);
  } catch (error) {
    console.error("Error deleting supplier:", error);
    throw error;
  }
};
