// src/components/CreateBedForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useCreateBed } from "@/hooks/tanstack/camas/beds/createBed";

// ✅ esquema de validación con Zod
const bedSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  status: z.enum(["disponible", "ocupada", "mantenimiento"], {
    required_error: "El estado es obligatorio",
  }),
});

export type BedFormValues = z.infer<typeof bedSchema>;

interface CreateBedFormProps {
  roomId: number;
  roomName: string;
  onClose: () => void;
}

export const CreateBedForm = ({
  roomId,
  onClose,
  roomName,
}: CreateBedFormProps) => {
  const { mutate: createBed, isPending } = useCreateBed();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<BedFormValues>({
    resolver: zodResolver(bedSchema),
    defaultValues: {
      name: "",
      status: "disponible",
    },
  });

  const onSubmit = (data: BedFormValues) => {
    setError(null);
    createBed(
      { ...data, roomId },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
        onError: (err: any) => {
          setError("Error al crear la cama. Intente nuevamente.");
          console.error(err);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 mt-4"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la cama</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Cama 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Creando..." : "Crear cama"}
        </Button>
      </form>
    </Form>
  );
};
