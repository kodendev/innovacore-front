import { patchRoom } from "@/data/api/camas/editRoom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePatchRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      data,
    }: {
      roomId: number;
      data: { name: string; floor: number };
    }) => patchRoom(roomId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(`Habitación actualizada correctamente`);
    },

    onError: (error) => {
      console.error("Error actualizando habitación:", error);
      toast.error("Error actualizando habitación");
    },
  });
};
