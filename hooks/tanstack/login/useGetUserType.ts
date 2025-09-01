import { getUserType } from "@/data/api/login/getUserType";
import { useQuery } from "@tanstack/react-query";

export const useUserTypes = () => {
  return useQuery({
    queryKey: ["userTypes"], // clave única para el cache
    queryFn: getUserType, // la función que definiste antes
    staleTime: 1000 * 60 * 5, // (opcional) 5 minutos de cache fresco
  });
};
