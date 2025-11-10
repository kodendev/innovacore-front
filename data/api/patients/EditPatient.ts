import axios from "axios";
import { BASE_URL } from "@/lib/utils";

export interface UpdatePatientPayload {
  name?: string;
  documentNumber?: string;
  age?: number;
  diagnosis?: string;
  bedId?: number | null; // ⬅️ Opcional como pediste
}

export interface UpdatedPatient {
  id: number;
  name: string;
  documentNumber?: string;
  age?: number | null;
  diagnosis?: string | null;
  bedId?: number | null;
  // Agregar otros campos que devuelva tu API
}

export const updatePatient = async (
  id: number,
  payload: UpdatePatientPayload
): Promise<UpdatedPatient> => {
  const { data } = await axios.patch<UpdatedPatient>(
    `${BASE_URL}/patients/${id}`,
    payload
  );
  return data;
};
