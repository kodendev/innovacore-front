import { createRoom, CreateRoomDto } from "@/data/api/camas/createRoom";
import { Room } from "@/types/camas/bedTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UseCreateRoomOptions = {
  onSuccess?: (room: Room) => void;
  onError?: (error: unknown) => void;
};

export function useCreateRoom(options?: UseCreateRoomOptions) {
  const qc = useQueryClient();

  return useMutation<Room, unknown, CreateRoomDto>({
    mutationFn: (payload: CreateRoomDto) => createRoom(payload),
    onSuccess: (room) => {
      qc.invalidateQueries({ queryKey: ["rooms"] });

      if (options?.onSuccess) options.onSuccess(room);
    },
    onError: (err) => {
      if (options?.onError) options.onError(err);
    },
  });
}
