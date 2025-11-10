import {
  UpdatedPatient,
  updatePatient,
  UpdatePatientPayload,
} from "@/data/api/patients/EditPatient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseUpdatePatientParams {
  id: number;
  payload: UpdatePatientPayload;
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UseUpdatePatientParams) =>
      updatePatient(id, payload),

    onSuccess: (updatedPatient: UpdatedPatient) => {
      toast.success("Paciente actualizado correctamente");

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({
        queryKey: ["patient", updatedPatient.id],
      });

      // Si el paciente tiene cama asignada, invalidar rooms también
      if (updatedPatient.bedId) {
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
      }
    },

    onError: (error: any) => {
      console.error("Error al actualizar paciente:", error);

      // Manejar diferentes tipos de errores
      if (error.response?.status === 404) {
        toast.error("Paciente no encontrado");
      } else if (error.response?.status === 400) {
        toast.error("Datos inválidos para actualizar el paciente");
      } else {
        toast.error("No se pudo actualizar el paciente");
      }
    },
  });
}
