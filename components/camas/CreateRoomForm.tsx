import { useCreateRoom } from "@/hooks/tanstack/camas/createRoom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  floor: z.number().min(0, "Debe ser un número válido"),
});

type FormValues = z.infer<typeof schema>;

export function CreateRoomForm({ onClose }: { onClose?: () => void }) {
  const { mutate: createRoom, isPending } = useCreateRoom({
    onSuccess: (room) => {
      toast.success(`Habitación ${room.name} creada correctamente`);
      reset();
      onClose?.();
    },
    onError: (err) => {
      toast.error("Error al crear la habitación");
      console.error(err);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", floor: 1 },
  });

  const onSubmit = (data: FormValues) => {
    createRoom(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-white rounded-lg shadow-md"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <Input
          {...register("name", {
            required: "El nombre es obligatorio",
            minLength: {
              value: 5,
              message: "El nombre debe tener al menos 5 caracteres",
            },
          })}
          placeholder="Habitación 101"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Piso</label>
        <Input type="number" {...register("floor", { valueAsNumber: true })} />
        {errors.floor && (
          <p className="text-red-500 text-xs mt-1">{errors.floor.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creando..." : "Crear habitación"}
        </Button>
      </div>
    </form>
  );
}
