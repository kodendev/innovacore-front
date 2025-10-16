import { getBeds } from "@/data/api/camas/getBeds";
import { Room } from "@/types/camas/bedTypes";
import { useQuery } from "@tanstack/react-query";

export function useRooms() {
  return useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: getBeds,
    staleTime: 0,
  });
}
