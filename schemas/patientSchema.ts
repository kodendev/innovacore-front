// schemas/patientSchema.ts
import { z } from "zod";

export const updatePatientSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre debe tener máximo 100 caracteres"),
  documentNumber: z.string().optional().or(z.literal("")),
  age: z
    .number()
    .min(0, "La edad debe ser positiva")
    .max(150, "La edad debe ser menor a 150")
    .optional()
    .nullable(),
  diagnosis: z
    .string()
    .max(500, "El diagnóstico debe tener máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type UpdatePatientFormData = z.infer<typeof updatePatientSchema>;
