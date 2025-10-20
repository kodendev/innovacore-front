import { BASE_URL } from "@/lib/utils";
import axios from "axios";

export interface AddPatientStatusPayload {
  dietType: string;
  statusType: string;
  userId: number;
  description: string;
}

export const addPatientStatus = async (
  patientId: number,
  payload: AddPatientStatusPayload
) => {
  const { data } = await axios.post(
    `${BASE_URL}/patients/${patientId}/add-status`,
    payload
  );
  return data;
};
