// Representa el estado actual del paciente
export interface PatientStatus {
  statusType: string;
  dietType: "liquida" | "solida" | "blanda" | "enteral" | null;
  notes?: string | null;
}

// Representa un paciente
export interface Patient {
  id: number;
  name: string;
  age: number;
  diagnosis: string;
  currentStatus: PatientStatus | null;
}

// Representa el menú asignado a una cama
export interface BedMenu {
  id: number;
  bedId: number;
  menuId: number;
  quantity: number;
  assignedAt: string;
  consumed: boolean;
  menu: {
    id: number;
    quantity: number;
    name: string;
    description: string;
    menuTypeId: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// Representa una cama dentro de una habitación
export interface Bed {
  id: number;
  name: string;
  status: string; // ejemplo: "disponible", "ocupada", etc.
  roomId: number;
  bedMenus: BedMenu[];
  patients: Patient[];
}

// Representa una habitación del hospital
export interface Room {
  id: number;
  name: string;
  floor: number;
  status: "active" | "inactive";
  beds: Bed[];
}
