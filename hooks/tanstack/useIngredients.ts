import { initialIngredients } from "@/data/fakeData";
import { Ingredient } from "./../../types/types";
import { useQuery } from "@tanstack/react-query";

const fetchIngredients = async (): Promise<Ingredient[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialIngredients);
    }, 500); // simula delay de red
  });
};
export function useIngredients() {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: fetchIngredients,
    staleTime: 0, // 5 minutos
  });
}
