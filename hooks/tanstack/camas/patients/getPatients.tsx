import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/utils";
import { Patient } from "@/types/camas/bedTypes";
import { PatientFilters } from "@/hooks/filters/usePatientsFilters";

/**
 * getPatients - helper que llama al endpoint GET /patients
 * - acepta un objeto options con parámetros de query (p.ej. q, page, perPage)
 */
export const getPatients = async (params?: Record<string, any>) => {
  const { data } = await axios.get<Patient[]>(`${BASE_URL}/patients/filters`, {
    params,
  });
  return data;
};

/**
 * usePatients - hook react-query para obtener la lista de pacientes
 *
 * Opciones:
 * - params: objeto que se pasará como query params a la request (ej: { q: 'nombre', page: 1 })
 * - enabled: si debe estar habilitado el fetch (por defecto true)
 *
 * Ejemplo:
 * const { data: patients, isLoading, error } = usePatients({ params: { q: 'Juan' } });
 */
export function usePatients(filters?: PatientFilters) {
  return useQuery<Patient[]>({
    queryKey: [
      "patients",
      filters?.name,
      filters?.statusType,
      filters?.documentNumber,
      filters?.active,
      filters?.dietType,
    ],
    queryFn: () => getPatients(filters),
    staleTime: 1000 * 60 * 30, // 30 minutos
    retry: 1,
  });
}
