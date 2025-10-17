// src/hooks/useCreateBed.ts
import { createBed, CreateBedDto } from "@/data/api/camas/beds/createBed";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBed = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBedDto) => createBed(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error) => {
      console.error("Error al crear cama:", error);
    },
  });
};
