// components/forms/EditPatientForm.tsx
import React, { useMemo } from "react";
import {
  updatePatientSchema,
  UpdatePatientFormData,
} from "@/schemas/patientSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PatientResponse } from "@/types/camas/bedTypes";
import { useUpdatePatient } from "@/hooks/tanstack/camas/patients/useEditPatients";
import { GenericFormDialog } from "./GenericEditForm";
import { UpdatePatientPayload } from "@/data/api/patients/EditPatient";

interface EditPatientFormProps {
  patient: PatientResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updatedPatient: any) => void;
}

export default function EditPatientForm({
  patient,
  open,
  onOpenChange,
  onSuccess,
}: EditPatientFormProps) {
  const { mutate: updatePatient } = useUpdatePatient();

  const defaultValues = useMemo((): Partial<UpdatePatientFormData> => {
    if (!patient) return {};

    return {
      name: patient.name || "",
      documentNumber: patient.documentNumber || "",
      age: patient.age || undefined,
      diagnosis: patient.diagnosis || "",
    };
  }, [patient]);

  // Preparar defaultValues para el formulario
  const getDefaultValues = (): Partial<UpdatePatientFormData> => {
    if (!patient) return {};

    return {
      name: patient.name || "",
      documentNumber: patient.documentNumber || "",
      age: patient.age || undefined,
      diagnosis: patient.diagnosis || "",
    };
  };

  // Handler para el submit del formulario
  const handleUpdatePatient = async (values: UpdatePatientFormData) => {
    if (!patient) return;

    // Convertir string vacío a undefined para campos opcionales
    const payload: UpdatePatientPayload = {
      name: values.name,
      documentNumber: values.documentNumber || undefined,
      age: values.age || undefined,
      diagnosis: values.diagnosis || undefined,
    };

    return new Promise<void>((resolve, reject) => {
      updatePatient(
        {
          id: patient.id,
          payload,
        },
        {
          onSuccess: (updatedPatient) => {
            console.log("Paciente actualizado exitosamente");
            onSuccess?.(updatedPatient);
            resolve();
          },
          onError: (error) => {
            console.error("Error al actualizar:", error);
            reject(error);
          },
        }
      );
    });
  };

  // Render de los campos del formulario
  const renderFields = ({ form }: { form: any }) => (
    <>
      <div>
        <Label htmlFor="name">Nombre *</Label>
        <Input id="name" {...form.register("name")} placeholder="Juan Pérez" />
        {form.formState.errors.name && (
          <p className="text-sm text-red-600 mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="documentNumber">Documento</Label>
        <Input
          id="documentNumber"
          {...form.register("documentNumber")}
          placeholder="12345678"
        />
        {form.formState.errors.documentNumber && (
          <p className="text-sm text-red-600 mt-1">
            {form.formState.errors.documentNumber.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="age">Edad</Label>
        <Input
          id="age"
          type="number"
          {...form.register("age", { valueAsNumber: true })}
          placeholder="45"
        />
        {form.formState.errors.age && (
          <p className="text-sm text-red-600 mt-1">
            {form.formState.errors.age.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="diagnosis">Diagnóstico</Label>
        <Textarea
          id="diagnosis"
          {...form.register("diagnosis")}
          className="min-h-[72px]"
          placeholder="Descripción del diagnóstico..."
        />
        {form.formState.errors.diagnosis && (
          <p className="text-sm text-red-600 mt-1">
            {form.formState.errors.diagnosis.message}
          </p>
        )}
      </div>
    </>
  );

  return (
    <GenericFormDialog<UpdatePatientFormData>
      open={open}
      onOpenChange={onOpenChange}
      title={`Editar Paciente${patient ? ` - ${patient.name}` : ""}`}
      description="Actualiza la información del paciente"
      schema={updatePatientSchema}
      defaultValues={defaultValues}
      submitLabel="Actualizar paciente"
      cancelLabel="Cancelar"
      onSubmit={handleUpdatePatient}
      renderFields={renderFields}
    />
  );
}
