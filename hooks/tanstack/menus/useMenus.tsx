import { getMenu } from "@/data/api/menus/getMenu";
import { Menu } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useMenus() {
  return useQuery<Menu[]>({
    queryKey: ["menus"],
    queryFn: getMenu,
    staleTime: 0,
  });
}
