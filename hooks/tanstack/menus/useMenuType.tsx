import { getMenuType } from "@/data/api/menus/getMenuType";
import { MenuType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useMenuType() {
  return useQuery<MenuType[]>({
    queryKey: ["menuType"],
    queryFn: getMenuType,
    staleTime: 0,
  });
}
