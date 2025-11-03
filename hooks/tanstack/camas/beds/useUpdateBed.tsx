// src/hooks/useUpdateBed.ts
import { updateBed, UpdateBedPayload } from "@/data/api/camas/beds/updateBed";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateBed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bedId,
      payload,
    }: {
      bedId: number;
      payload: UpdateBedPayload;
    }) => updateBed(bedId, payload),

    onSuccess: () => {
      toast.success("Cama actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },

    onError: (error: any) => {
      console.error("Error al actualizar la cama:", error);
      toast.error("No se pudo actualizar la cama");
    },
  });
}
