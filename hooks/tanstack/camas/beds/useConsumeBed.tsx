import axios from "axios";
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/utils";

export type ConsumeBedMenuPayload = {
  bedMenuId: number;
  quantity: number;
  userId: number;
  bedId?: number;
};

export type ConsumeBedMenuResponse = {
  // adapta según lo que devuelva tu backend; por ahora dejamos un tipo genérico
  success: boolean;
  message?: string;
  data?: any;
};

/**
 * Llama al endpoint POST /bed-menu/consume
 */
export const consumeBedMenu = async (payload: ConsumeBedMenuPayload) => {
  const { data } = await axios.post<ConsumeBedMenuResponse>(
    `${BASE_URL}/bed-menu/consume`,
    payload
  );
  return data;
};

/**
 * useConsumeBedMenu - hook para consumir un menú asignado a una cama (genera movimiento de stock)
 *
 * Uso:
 * const consumeMut = useConsumeBedMenu();
 * await consumeMut.mutateAsync({ bedMenuId: 4, quantity: 1, userId: 1 });
 *
 * Nota: revisa consumeMut.status o consumeMut.isPending para el estado de la mutación (según versión de TanStack)
 */
export function useConsumeBedMenu(): UseMutationResult<
  ConsumeBedMenuResponse,
  unknown,
  ConsumeBedMenuPayload,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation<ConsumeBedMenuResponse, unknown, ConsumeBedMenuPayload>({
    mutationFn: (payload) => consumeBedMenu(payload),

    onSuccess: (data) => {
      toast.success("Menú consumido correctamente");
      // invalidar queries relevantes para refrescar UI
      // ajusta las keys según tu app (ej. "rooms", "bed-menus", "menus", etc.)
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["bed-menus"] });
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },

    onError: (error: any) => {
      console.error("Error consumiendo menú de cama:", error);
      toast.error("No se pudo consumir el menú");
    },
  });
}
