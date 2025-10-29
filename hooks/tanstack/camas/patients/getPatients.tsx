import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/utils";

export type Patient = {
  id: number;
  name: string;
  dni?: string | null;
  age?: number | null;
  gender?: string | null;
  diagnosis?: string | null;
  needsReview?: boolean | null;
  currentStatus?: {
    id: number;
    statusType: string;
    dietType?: string | null;
    notes?: string | null;
  } | null;
  // agrega otros campos que tu API devuelva
};

/**
 * getPatients - helper que llama al endpoint GET /patients
 * - acepta un objeto options con parámetros de query (p.ej. q, page, perPage)
 */
export const getPatients = async (params?: Record<string, any>) => {
  const { data } = await axios.get<Patient[]>(`${BASE_URL}/patients`, {
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
export function usePatients({
  params,
  enabled = true,
}: {
  params?: Record<string, any>;
  enabled?: boolean;
} = {}) {
  const queryKey = params ? ["patients", params] : ["patients"];

  return useQuery<Patient[], Error>({
    queryKey,
    queryFn: async () => getPatients(params),
    enabled,
    staleTime: 1000 * 60 * 30, // 30 minutos
    retry: 1,
  });
}
