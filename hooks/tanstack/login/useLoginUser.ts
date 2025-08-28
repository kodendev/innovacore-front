import { LoginUser } from "@/data/api/login/loginUser";
import { LoginUserTypes } from "./../../../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLoginUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loginUser: LoginUserTypes) => LoginUser(loginUser),
    onSuccess: () => {
      // refrescar lista de usuarios si existe
      queryClient.invalidateQueries({ queryKey: ["login"] });
    },
    onError: (error) => {
      console.error("Error ingresando a la plataforma:", error);
    },
  });
};
