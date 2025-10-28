import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CreatedPatient,
  CreatePatientPayload,
  useCreatePatient,
} from "@/hooks/tanstack/camas/patients/useCreatePatients";

type Props = {
  onClose?: () => void;
  onCreated?: (patient: CreatedPatient) => void;
  defaultBedId?: number | null; // opcional: si quieres crear paciente y asignarlo a la cama directamente
};

export default function PatientCreateForm({
  onClose,
  onCreated,
  defaultBedId = null,
}: Props) {
  const { register, handleSubmit, reset, formState } =
    useForm<CreatePatientPayload>({
      defaultValues: {
        name: "",
        documentNumber: "",
        age: undefined,
        diagnosis: "",
        bedId: defaultBedId ?? undefined,
      },
    });

  const createMut = useCreatePatient();

  const onSubmit = async (values: CreatePatientPayload) => {
    try {
      const created = await createMut.mutateAsync({
        ...values,
        bedId: defaultBedId ?? values.bedId,
      });

      onCreated?.(created);
      reset();

      onClose?.();
    } catch (err) {
      console.error("Error al crear paciente desde form:", err);
    }
  };

  const isSaving = createMut.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label className="text-black">Nombre</Label>
        <Input
          {...register("name", { required: true })}
          placeholder="Juan Pérez"
        />
      </div>

      <div>
        <Label className="text-black">Documento</Label>
        <Input {...register("documentNumber")} placeholder="12345678" />
      </div>

      <div>
        <Label className="text-black">Edad</Label>
        <Input
          type="number"
          {...register("age", { valueAsNumber: true })}
          placeholder="45"
        />
      </div>

      <div>
        <Label className="text-black">Diagnóstico</Label>
        <Textarea {...register("diagnosis")} className="min-h-[72px]" />
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          variant="secondary"
          type="button"
          onClick={() => onClose?.()}
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Creando..." : "Crear paciente"}
        </Button>
      </div>
    </form>
  );
}
