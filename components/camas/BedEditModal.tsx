import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMenus } from "@/hooks/tanstack/menus/useMenus";
import { useAddPatientStatus } from "@/hooks/tanstack/camas/beds/useAddPatientStatus";
import { useUpdateBed } from "@/hooks/tanstack/camas/beds/useUpdateBed";
import { useAssignBedMenu } from "@/hooks/tanstack/camas/beds/useAssignMenuToBed";
import { useAssignPatientToBed } from "@/hooks/tanstack/camas/beds/useAssignPatientToBed";
import { usePatients } from "@/hooks/tanstack/camas/patients/getPatients";
import { Badge } from "../ui/badge";
import { useQueryClient } from "@tanstack/react-query";

export type BedProps = {
  id: number;
  name?: string;
  roomId?: number | null;
  status?: "disponible" | "ocupada" | "mantenimiento" | string;
  patients?: Array<{ id: number; name?: string }>;
  bedMenus?: Array<{ id: number; menu: { id: number; name: string } }>;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  bed: BedProps;
  roomName?: string;
  currentUserId?: number;
  onSuccess?: () => void;
};

export default function BedEditModal({
  isOpen,
  onClose,
  bed,
  roomName,
  currentUserId,
  onSuccess,
}: Props) {
  const { data: menus, isLoading: menusLoading } = useMenus();

  const [isAssignPatientOpen, setIsAssignPatientOpen] = useState(false);
  const [selectedAssignPatient, setSelectedAssignPatient] =
    useState<string>("none");
  const [isCreatePatientOpen, setIsCreatePatientOpen] = useState(false);

  const { data: patients, isLoading: patientsLoading } = usePatients();
  const assignPatientMut = useAssignPatientToBed();

  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<any>({
    defaultValues: {
      name: bed.name ?? "",
      status: bed.status ?? "disponible",
      statusType: "none",
      dietType: "none",
      description: "",
      menuId: bed.bedMenus?.[0]?.menu?.id?.toString() ?? "none",
      quantity: 1,
      userId: currentUserId ?? null,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        name: bed.name ?? "",
        status: bed.status ?? "disponible",
        statusType: "",
        dietType: "",
        description: "",
        menuId: bed.bedMenus?.[0]?.menu?.id?.toString() ?? "",
        quantity: 1,
      });
    }
  }, [isOpen, bed]);

  const updateBedMut = useUpdateBed();
  const addPatientStatusMut = useAddPatientStatus();
  const assignBedMenuMut = useAssignBedMenu();

  const hasPatient = !!(bed.patients && bed.patients.length > 0);
  const patient = hasPatient ? bed.patients![0] : null;

  const isSaving =
    isSubmitting ||
    updateBedMut.isPending ||
    addPatientStatusMut.isPending ||
    assignBedMenuMut.isPending;

  const onSubmit = async (values: any) => {
    try {
      await updateBedMut.mutateAsync({
        bedId: bed.id,
        payload: {
          name: values.name,
          roomId: bed.roomId ?? 0,
          status: values.status,
        },
      });

      const shouldAddPatientStatus =
        hasPatient &&
        ((values.statusType && values.statusType !== "none") ||
          (values.dietType && values.dietType !== "none") ||
          (values.description && values.description.trim() !== ""));

      if (shouldAddPatientStatus) {
        await addPatientStatusMut.mutateAsync({
          patientId: patient!.id,
          payload: {
            statusType: values.statusType || "internacion",
            dietType: values.dietType || "normal",
            userId: Number(currentUserId ?? 0),
            description: values.description || "",
          },
        });
      }

      if (values.menuId && values.menuId !== "none") {
        await assignBedMenuMut.mutateAsync({
          bedId: bed.id,
          menuId: Number(values.menuId),
          quantity: Number(values.quantity) || 1,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error en formulario combinado:", err);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="px-6 py-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* SECCIÓN: CAMA */}
            <section>
              <h4 className="text-md font-bold mb-3">Cama</h4>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label className="text-black">Nombre de la cama</Label>
                  <Input
                    {...register("name", { required: true })}
                    placeholder="Cama 1"
                  />
                </div>

                <div>
                  <Label className="text-black mt-2">Estado</Label>
                  <Controller
                    control={control}
                    name="status"
                    defaultValue={bed.status ?? "disponible"}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue placeholder="Seleccionar estado..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disponible">Disponible</SelectItem>
                          <SelectItem value="ocupada">Ocupada</SelectItem>
                          <SelectItem value="mantenimiento">
                            Mantenimiento
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </section>

            {/* SECCIÓN: PACIENTE */}
            {hasPatient ? (
              <section className="pt-4 border-t">
                <h4 className="text-md font-bold mb-3">
                  Paciente: {patient?.name}
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-black">Tipo de estado</Label>
                      <Controller
                        control={control}
                        name="statusType"
                        defaultValue="none"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="mt-1 w-full">
                              <SelectValue placeholder="Seleccionar tipo..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">
                                -- seleccionar --
                              </SelectItem>
                              <SelectItem value="internacion">
                                Internación
                              </SelectItem>
                              <SelectItem value="alta">Alta</SelectItem>
                              <SelectItem value="observacion">
                                Observación
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div>
                      <Label className="text-black">Dieta</Label>
                      <Controller
                        control={control}
                        name="dietType"
                        defaultValue="none"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="mt-1 w-full">
                              <SelectValue placeholder="Seleccionar dieta..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">
                                -- seleccionar --
                              </SelectItem>
                              <SelectItem value="liquida">Líquida</SelectItem>
                              <SelectItem value="blanda">Blanda</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-black">Notas / Descripción</Label>
                    {/* Altura reducida para ahorrar espacio */}
                    <Textarea
                      {...register("description")}
                      className="min-h-[72px]"
                    />
                  </div>
                </div>
              </section>
            ) : (
              <div className="pt-4 border-t">
                <div className="text-sm">
                  No hay ningún paciente asignado a esta cama.
                </div>

                {!isAssignPatientOpen ? (
                  <div className="mt-3">
                    <Button
                      className="bg-green-500"
                      onClick={() => {
                        setIsAssignPatientOpen(true);
                        setSelectedAssignPatient("none");
                      }}
                    >
                      Asignar paciente
                    </Button>
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                    <div className="md:col-span-2">
                      <Label className="text-black">Seleccionar paciente</Label>

                      <Select
                        value={selectedAssignPatient}
                        onValueChange={(val) => setSelectedAssignPatient(val)}
                        disabled={patientsLoading}
                      >
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue placeholder="Elegir paciente..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-- ninguno --</SelectItem>
                          {patients?.map((p: any) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {patientsLoading && (
                        <div className="text-xs text-gray-500 mt-1">
                          Cargando pacientes...
                        </div>
                      )}
                    </div>

                    <div>
                      <Button
                        className="w-full bg-green-400"
                        onClick={async () => {
                          if (
                            !selectedAssignPatient ||
                            selectedAssignPatient === "none"
                          )
                            return;

                          try {
                            await assignPatientMut.mutateAsync({
                              patientId: Number(selectedAssignPatient),
                              bedId: bed.id,
                            });
                            setIsAssignPatientOpen(false);
                            setSelectedAssignPatient("none");
                            onSuccess?.();
                          } catch (err) {
                            console.error("Asignar paciente fallo:", err);
                          }
                        }}
                        disabled={
                          assignPatientMut.isPending ||
                          selectedAssignPatient === "none"
                        }
                      >
                        {assignPatientMut.isPending
                          ? "Asignando..."
                          : "Confirmar"}
                      </Button>

                      <Button
                        variant="ghost"
                        className="mt-2 w-full"
                        onClick={() => {
                          setIsAssignPatientOpen(false);
                          setSelectedAssignPatient("none");
                        }}
                        disabled={assignPatientMut.isPending}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECCIÓN: MENÚ */}
            <section className="pt-4 border-t">
              <h4 className="text-md font-bold mb-3">Menú</h4>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label className="text-black">Seleccionar menú</Label>
                  <Controller
                    control={control}
                    name="menuId"
                    defaultValue={
                      bed.bedMenus?.[0]?.menu?.id?.toString() ?? "none"
                    }
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={menusLoading}
                      >
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue placeholder="Elegir menú..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-- ninguno --</SelectItem>
                          {menus?.map((m: any) => (
                            <SelectItem key={m.id} value={m.id.toString()}>
                              <div className="flex justify-between items-center w-full">
                                <span>{m.name}</span>
                                {m.price !== undefined && (
                                  <span className="ml-4 font-semibold">
                                    ${m.price}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {menusLoading && (
                    <div className="text-xs text-gray-500 mt-1">
                      Cargando menús...
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-black">Cantidad</Label>
                  <Input
                    type="number"
                    {...register("quantity", { valueAsNumber: true })}
                    min={1}
                  />
                </div>
              </div>
            </section>
          </form>
        </div>

        <footer className="sticky bottom-0 px-6 py-4 border-t flex justify-end gap-3 bg-white">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </footer>
      </div>
    </div>
  );
}
