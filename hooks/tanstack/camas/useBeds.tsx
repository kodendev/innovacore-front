import { getBeds } from "@/data/api/camas/getBeds";
import { RoomFilters } from "@/hooks/filters/useRoomFilters";
import { Room } from "@/types/camas/bedTypes";
import { useQuery } from "@tanstack/react-query";

export function useRooms(filters?: RoomFilters) {
  return useQuery<Room[]>({
    queryKey: [
      "rooms",
     filters?.roomStatus,
     filters?.floor,
     filters?.bedStatus,
     filters?.menuConsumed,
     filters?.name,
   ],
    queryFn: () => getBeds(filters),
    staleTime: 0,
  });
}
