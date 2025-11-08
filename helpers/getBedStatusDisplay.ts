import type { Bed } from "../types/bed";

export const getBedStatusDisplay = (bed: Bed, hasPatient: boolean) => {
  // ⬅️ PRIORIDAD 1: Estado de mantenimiento (más importante)
  if (bed.status === "mantenimiento") {
    return {
      text: "Mantenimiento",
      className: "bg-red-100 text-red-800 border-red-200",
    };
  }

  // ⬅️ PRIORIDAD 2: Verificar si está ocupada por paciente
  if (bed.status === "occupied" || hasPatient) {
    return {
      text: "Ocupada",
      className: "bg-orange-100 text-orange-800 border-orange-200",
    };
  }

  // ⬅️ PRIORIDAD 3: Por defecto libre/disponible
  return {
    text: "Libre",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };
};
