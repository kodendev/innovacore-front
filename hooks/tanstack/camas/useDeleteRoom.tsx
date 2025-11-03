import { deleteRoomApi, DeleteRoomResponse } from "@/data/api/camas/deleteRoom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // or your project's toast util

type DeleteRoomVariables = {
  roomId: number;
};

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation<DeleteRoomResponse, unknown, DeleteRoomVariables>({
    mutationFn: async ({ roomId }) => {
      return await deleteRoomApi(roomId);
    },
    onMutate: async ({ roomId }) => {
      // optional optimistic update: snapshot current rooms list
      await queryClient.cancelQueries({ queryKey: ["rooms"] });
      const previous = queryClient.getQueryData<any[]>(["rooms"]);
      // optionally remove the room optimistically
      if (previous) {
        queryClient.setQueryData(
          ["rooms"],
          previous.filter((r) => r.id !== roomId)
        );
      }
      return { previous };
    },
    onError: (err, variables, context: any) => {
      // rollback optimistic update if any
      if (context?.previous) {
        queryClient.setQueryData(["rooms"], context.previous);
      }
      toast.error("Error eliminando la habitación");
      console.error("deleteRoom error:", err);
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message ?? "Habitación eliminada");
      // invalidate to refetch canonical data
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onSettled: () => {
      // ensure we refetch in any case
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
