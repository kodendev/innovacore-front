import React from "react";
import { usePatients } from "@/hooks/tanstack/camas/patients/getPatients";
import {
  CreatedPatient,
  useCreatePatient,
} from "@/hooks/tanstack/camas/patients/useCreatePatients";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/Loading";
import { MoreHorizontal, Edit, Eye, UserX, AlertTriangle } from "lucide-react";
import { PatientResponse } from "@/types/camas/bedTypes";
import PatientCreateForm from "./PatientCreateForm";
import { useUpdatePatient } from "@/hooks/tanstack/camas/patients/useEditPatients";
import { getStatusBadge } from "@/utils/badge_variants";
import EditPatientForm from "../forms/EditPatientForm";
import { usePatientFilters } from "@/hooks/filters/usePatientsFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

const PatientsTable = () => {
  const [selectedPatient, setSelectedPatient] =
    useState<PatientResponse | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { filters, updateFilter, clearFilters, hasActiveFilters } =
    usePatientFilters();

  const { data: patients, isLoading, isFetching } = usePatients(filters);

  const handlePatientUpdated = (updatedPatient: any) => {
    console.log("Paciente actualizado:", updatedPatient);
    setIsEditModalOpen(false);
    setSelectedPatient(null);
  };

  const getCurrentStatus = (statuses?: PatientResponse["statuses"]) => {
    if (!statuses || statuses.length === 0) return null;
    return statuses[0];
  };

  const handleAction = (action: string, patient: PatientResponse) => {
    switch (action) {
      case "view":
        console.log("Ver paciente:", patient);
        // TODO: Implementar modal de vista
        break;
      case "edit":
        setSelectedPatient(patient);
        setIsEditModalOpen(true); // ⬅️ Abrir el modal
        break;
      case "deactivate":
        console.log("Desactivar paciente:", patient);
        // TODO: Implementar confirmación y API call
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Loading
            size="lg"
            text="Cargando pacientes..."
            className="min-h-[400px]"
            variant="skeleton"
          />
        </CardContent>
      </Card>
    );
  }

  const handlePatientCreated = (newPatient: CreatedPatient) => {
    console.log("Paciente creado:", newPatient);
    setIsCreateModalOpen(false);
    // La invalidación de queries se maneja en el hook useCreatePatient
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de Pacientes</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Total de pacientes: {patients?.length}
          </p>
        </div>
        <EditPatientForm
          patient={selectedPatient}
          open={isEditModalOpen}
          onOpenChange={(open) => {
            setIsEditModalOpen(open);
            if (!open) {
              setSelectedPatient(null);
            }
          }}
          onSuccess={handlePatientUpdated}
        />
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Paciente</DialogTitle>
            </DialogHeader>
            <PatientCreateForm
              onClose={() => setIsCreateModalOpen(false)}
              onCreated={handlePatientCreated}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-start flex-wrap gap-4">
          {/* Búsqueda por nombre */}
          <Input
            className="w-[200px]"
            placeholder="Buscar paciente..."
            value={filters.name || ""}
            onChange={(e) => updateFilter("name", e.target.value)}
          />

          {/* Estado del paciente */}
          <Select
            value={filters.statusType || "all"}
            onValueChange={(value) => {
              updateFilter("statusType", value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="internacion">Internación</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="critico">Crítico</SelectItem>
              <SelectItem value="observacion">Observación</SelectItem>
            </SelectContent>
          </Select>

          {/* Tipo de dieta */}
          <Select
            value={filters.dietType || "all"}
            onValueChange={(value) => {
              updateFilter("dietType", value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por dieta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las dietas</SelectItem>
              <SelectItem value="liquida">Líquida</SelectItem>
              <SelectItem value="solida">Sólida</SelectItem>
              <SelectItem value="blanda">Blanda</SelectItem>
              <SelectItem value="enteral">Enteral</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>

          {/* Botón limpiar filtros */}
          {hasActiveFilters && (
            <Button
              variant="default"
              className="bg-green-400"
              onClick={clearFilters}
            >
              Limpiar filtros
            </Button>
          )}

          {/* Indicador de carga */}
          {isFetching && !isLoading && (
            <div className="ml-4">
              <Loading size="sm" variant="spinner" />
            </div>
          )}
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Diagnóstico</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!patients || patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <div className="rounded-md p-6 bg-blue-50 border border-blue-200 text-center w-full">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <UserX className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-base font-medium text-blue-800">
                      {hasActiveFilters
                        ? "No hay pacientes que coincidan con los filtros"
                        : "No hay pacientes registrados"}
                    </p>
                    <p className="mt-2 text-sm text-blue-700">
                      {hasActiveFilters
                        ? "Intenta ajustar los criterios de búsqueda o limpia los filtros para ver todos los pacientes"
                        : "Los pacientes aparecerán aquí una vez que sean dados de alta en el sistema."}
                    </p>
                    <div className="mt-4">
                      {hasActiveFilters ? (
                        <Button variant="outline" onClick={clearFilters}>
                          Limpiar filtros
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateModalOpen(true)}
                        >
                          Registrar primer paciente
                        </Button>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {patients.map((patient) => {
                  const currentStatus = getCurrentStatus(patient?.statuses);
                  const status = getStatusBadge(currentStatus?.statusType);

                  return (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.name}
                      </TableCell>

                      <TableCell>
                        {patient.age ? `${patient.age} años` : "-"}
                      </TableCell>

                      <TableCell>
                        <Badge className={status.className}>
                          {status.text.toUpperCase()}
                        </Badge>
                      </TableCell>

                      <TableCell className="max-w-xs">
                        <Badge>{patient.diagnosis || "Sin diagnóstico"}</Badge>
                        {/* <div className="truncate" title={patient.diagnosis || ""}>
                      {patient.diagnosis || "Sin diagnóstico"}
                    </div> */}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleAction("view", patient)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("edit", patient)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar Paciente
                            </DropdownMenuItem>
                            {patient.needsReview && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleAction("review", patient)
                                  }
                                >
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PatientsTable;
