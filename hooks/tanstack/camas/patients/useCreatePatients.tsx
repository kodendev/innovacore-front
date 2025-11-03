import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/utils";

export interface CreatePatientPayload {
  name: string;
  documentNumber: string;
  age?: number;
  diagnosis?: string;
  bedId?: number | null;
}

export type CreatedPatient = {
  id: number;
  name: string;
  documentNumber?: string;
  age?: number | null;
  diagnosis?: string | null;
  bedId?: number | null;
  // añade otros campos que tu API devuelva
};

export const createPatient = async (payload: CreatePatientPayload) => {
  const { data } = await axios.post<CreatedPatient>(
    `${BASE_URL}/patients`,
    payload
  );
  return data;
};

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePatientPayload) => createPatient(payload),
    onSuccess: (data: CreatedPatient) => {
      toast.success("Paciente creado correctamente");
      // invalidar patients y rooms para que se actualice UI donde corresponda
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: any) => {
      console.error("Error al crear paciente:", error);
      toast.error("No se pudo crear el paciente");
    },
  });
}
