import { BASE_URL } from "@/lib/utils";
import axios from "axios";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

type AssignPatientVars = { patientId: number; bedId: number };

export const assignPatientToBed = async (patientId: number, bedId: number) => {
  const { data } = await axios.patch(
    `${BASE_URL}/patients/${patientId}/assign-bed`,
    {
      bedId,
    }
  );
  return data;
};

export function useAssignPatientToBed(): UseMutationResult<
  any,
  unknown,
  AssignPatientVars,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation<any, unknown, AssignPatientVars>({
    mutationFn: ({ patientId, bedId }: AssignPatientVars) =>
      assignPatientToBed(patientId, bedId),

    onSuccess: () => {
      toast.success("Paciente asignado correctamente a la cama");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },

    onError: (error: any) => {
      console.error("Error al asignar paciente a la cama:", error);
      toast.error("No se pudo asignar el paciente");
    },
  });
}
