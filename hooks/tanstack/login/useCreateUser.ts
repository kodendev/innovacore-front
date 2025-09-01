import { createUser } from "@/data/api/login/createUser";
import { CreateUserTypes } from "./../../../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newUser: CreateUserTypes) => createUser(newUser),
    onSuccess: () => {
      // refrescar lista de usuarios si existe
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error creando usuario:", error);
    },
  });
};
