import { useState } from "react";

export interface PatientFilters {
  name?: string;
  statusType?: "internacion" | "alta" | "critico" | "observacion";
  documentNumber?: string;
  active?: boolean;
  dietType?: "liquida" | "solida" | "blanda" | "enteral" | "normal";
}

export const usePatientFilters = () => {
  const [filters, setFilters] = useState<PatientFilters>({});

  const updateFilter = (key: keyof PatientFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => setFilters({});

  const hasActiveFilters = Object.keys(filters).length > 0;

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
};
