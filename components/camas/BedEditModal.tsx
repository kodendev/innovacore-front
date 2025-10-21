import React from "react";
import { useForm } from "react-hook-form";
import { Bed as BedType } from "../../types/camas/bedTypes";
import { useUpdateBed } from "@/hooks/tanstack/camas/beds/useUpdateBed";
import { useAddPatientStatus } from "@/hooks/tanstack/camas/beds/useAddPatientStatus";
import { useAssignBedMenu } from "@/hooks/tanstack/camas/beds/useAssignMenuToBed";
import { Button } from "@/components/ui/button";
import { useMenus } from "@/hooks/tanstack/menus/useMenus";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
// optional - adapt if your types live elsewhere

type BedProps = {
  id: number;
  name?: string;
  roomId?: number;
  status?: "disponible" | "ocupada" | "mantenimiento" | string;
  patients?: Array<{ id: number; name?: string }>;
  bedMenus?: Array<{ id: number; menu: { id: number; name: string } }>;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  bed: BedProps;
  roomName?: string;
  // id del usuario que ejecuta la acción (staff). Opcional; si no lo pasas se manda 0.
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<any>({
    defaultValues: {
      name: bed.name ?? "",
      status: bed.status ?? "disponible",
      // patient status
      statusType: "",
      dietType: "",
      description: "",
      // menu
      menuId: bed.bedMenus?.[0]?.menu?.id ?? "",
      quantity: 1,
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
        menuId: bed.bedMenus?.[0]?.menu?.id ?? "",
        quantity: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // 1) Actualizar cama (enviamos el roomId actual, no permitimos editarlo desde UI)
      await updateBedMut.mutateAsync({
        bedId: bed.id,
        payload: {
          name: values.name,
          roomId: bed.roomId ?? 0,
          status: values.status,
        },
      });

      // 2) Agregar estado de paciente solo si hay paciente y hay datos para agregar
      const shouldAddPatientStatus =
        hasPatient &&
        (values.statusType ||
          values.dietType ||
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

      // 3) Si se seleccionó un menú -> asignar
      if (values.menuId) {
        await assignBedMenuMut.mutateAsync({
          bedId: bed.id,
          menuId: Number(values.menuId),
          quantity: Number(values.quantity) || 1,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      // Los hooks manejan toasts en onError; aquí solo logueamos
      console.error("Error en formulario combinado:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal max-w-lg w-full">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">
              {hasPatient
                ? "Editar Cama y Paciente"
                : "Editar Cama / Asignar Menú"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {roomName ? `${roomName} · ${bed.name ?? "Cama"}` : bed.name}
            </p>
          </div>
          <button onClick={onClose} className="text-sm text-gray-600">
            Cerrar
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Cama (no mostramos roomId editable) */}
          <section className="space-y-2">
            <Label>Nombre de la cama</Label>
            <Input
              {...register("name", { required: true })}
              placeholder="Cama 1"
            />

            <Label className="block mt-2">Estado</Label>
            <select className="input" {...register("status")}>
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>

            {/* Mostramos roomName como info pero no editable */}
            {roomName && (
              <div className="text-sm text-gray-600 mt-1">
                Habitación: {roomName}
              </div>
            )}
          </section>

          {/* Paciente */}
          {hasPatient && (
            <section className="border-t pt-3 space-y-2">
              <h4 className="text-sm font-medium">
                Estado del paciente ({patient?.name})
              </h4>

              <Label>Tipo de estado</Label>
              <select className="input" {...register("statusType")}>
                <option value="">-- seleccionar --</option>
                <option value="internacion">Internación</option>
                <option value="alta">Alta</option>
                <option value="observacion">Observación</option>
              </select>

              <Label>Dieta</Label>
              <select className="input" {...register("dietType")}>
                <option value="">-- seleccionar --</option>
                <option value="liquida">Líquida</option>
                <option value="blanda">Blanda</option>
                <option value="normal">Normal</option>
              </select>

              <Label>Notas / Descripción</Label>
              <textarea
                className="input min-h-[80px]"
                {...register("description")}
              />
            </section>
          )}

          {/* Menú */}
          <section className="border-t pt-3 space-y-2">
            <h4 className="text-sm font-medium">Menú</h4>

            <Label>Seleccionar menú</Label>
            <div>
              <select
                className="input"
                {...register("menuId")}
                disabled={menusLoading}
                defaultValue={bed.bedMenus?.[0]?.menu?.id ?? ""}
              >
                <option value="">-- ninguno --</option>
                {menus?.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {menusLoading && (
                <div className="text-xs text-gray-500 mt-1">
                  Cargando menús...
                </div>
              )}
            </div>

            <Label className="mt-2">Cantidad</Label>
            <Input
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              min={1}
            />
          </section>

          <footer className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
