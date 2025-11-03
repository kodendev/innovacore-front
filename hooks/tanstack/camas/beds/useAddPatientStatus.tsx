import {
  addPatientStatus,
  AddPatientStatusPayload,
} from "@/data/api/camas/beds/postAddPatientStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddPatientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      payload,
    }: {
      patientId: number;
      payload: AddPatientStatusPayload;
    }) => addPatientStatus(patientId, payload),

    onSuccess: () => {
      toast.success("Estado del paciente actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },

    onError: (error: any) => {
      console.error("Error al actualizar el estado del paciente:", error);
      toast.error("No se pudo actualizar el estado del paciente");
    },
  });
}
