"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bed, User, ArrowLeft, Plus, Divide, Delete } from "lucide-react";
import Link from "next/link";
import { useRooms } from "@/hooks/tanstack/camas/useBeds";
import { CreateRoomForm } from "@/components/camas/CreateRoomForm";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { CreateBedForm } from "@/components/camas/beds/CreateBedForm";
import { Room } from "@/types/camas/bedTypes";
import { EditRoomForm } from "@/components/camas/EditRoomForm";
import { GenericDialog } from "@/components/generals/GenericDialog";
import BedEditModal from "@/components/camas/BedEditModal";
import { useConsumeBedMenu } from "@/hooks/tanstack/camas/beds/useConsumeBed";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useComponentView } from "@/hooks/useComponentView";
import RoomsTable from "@/components/camas/RoomsTable";
import DeleteRoomForm from "@/components/camas/DeleteRoomForm";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoomFilters } from "@/hooks/filters/useRoomFilters";
import { Loading } from "@/components/ui/Loading";
import { getBedStatusDisplay } from "@/helpers/getBedStatusDisplay";

export default function CamasPage() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null); // ID de la habitación seleccionada (para editar cama)
  const [selectedBed, setSelectedBed] = useState<number | null>(null); // ID de la cama seleccionada (para editar cama)

  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState<boolean>(false); // crear habitación
  const [isEditRoomOpen, setIsEditRoomOpen] = useState<boolean>(false); // editar habitación
  const [isDeleteRoomOpen, setIsDeleteRoomOpen] = useState<boolean>(false); //eliminar habitación

  // Estados separados para camas
  const [isCreateBedOpen, setIsCreateBedOpen] = useState<boolean>(false); // crear cama
  const [isEditBedOpen, setIsEditBedOpen] = useState<boolean>(false); // editar/editar cama (BedEditModal)

  const [servedBedIds, setServedBedIds] = useState<Set<number>>(new Set());

  //Estados para diálogos de consumo de menú
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [consumeConfirmOpen, setConsumeConfirmOpen] = useState(false);
  const [consumeTarget, setConsumeTarget] = useState<{
    bedId: number;
    bedMenuId: number;
    menuName: string;
    patientName?: string | null;
    quantity?: number;
  } | null>(null);

  const queryClient = useQueryClient();

  const { filters, updateFilter, clearFilters, hasActiveFilters } =
    useRoomFilters();

  const { data: beds, isFetching, isLoading } = useRooms(filters);

  //repetimos la ejecucion para obtener todos los pisos disponibles
  const { data: allRooms } = useRooms();

  const consumeMut = useConsumeBedMenu();

  const { user } = useAuth();
  const currentUserId = user?.user_id ?? 0;

  const isConsuming = consumeMut.isPending;

  const { componentView, toggleView } = useComponentView();

  //abre el dialog de crear cama
  const openBedRoomDialog = (room: Room) => {
    setActiveRoom(room);
    setIsEditBedOpen(false);
    setSelectedRoom(null);
    setSelectedBed(null);
    setIsCreateBedOpen(true);
  };

  //edita la habitacion
  const openEditRoomDialog = (room: Room) => {
    setActiveRoom(room);
    setIsEditRoomOpen(true);
  };

  const openDeleteRoomDialog = (room: Room) => {
    setActiveRoom(room);
    setIsDeleteRoomOpen(true);
  };

  const openConsumeConfirm = ({
    bedId,
    bedMenuId,
    menuName,
    patientName,
    quantity = 1,
  }: {
    bedId: number;
    bedMenuId: number;
    menuName: string;
    patientName?: string | null;
    quantity?: number;
  }) => {
    setConsumeTarget({ bedId, bedMenuId, menuName, patientName, quantity });
    setConsumeConfirmOpen(true);
  };

  const handleConfirmConsume = async () => {
    if (!consumeTarget) return;
    try {
      const response = await consumeMut.mutateAsync({
        bedMenuId: Number(consumeTarget.bedMenuId),
        quantity: consumeTarget.quantity ?? 1,
        userId: Number(currentUserId),
        bedId: Number(consumeTarget.bedId),
      });

      const affectedBedId =
        response && typeof (response as any).bedId === "number"
          ? (response as any).bedId
          : consumeTarget.bedId;
      setServedBedIds((prev) => {
        const next = new Set(prev);
        if (typeof affectedBedId === "number") next.add(affectedBedId);
        return next;
      });
      // cerrar modal
      setConsumeConfirmOpen(false);
      setConsumeTarget(null);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: any } };
      if (axiosErr?.response?.status === 409) {
        toast.error(
          axiosErr.response.data?.message ??
            "El menú ya fue marcado como servido"
        );
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
        setConsumeConfirmOpen(false);
        setConsumeTarget(null);
        return;
      }

      console.error("Error consumiendo bedMenu:", err);
      toast.error("Error al consumir menú");
    }
  };

  const handleOpenConsumeConfirm = (payload: {
    bedId: number;
    bedMenuId: number;
    menuName: string;
    patientName?: string | null;
    quantity?: number;
  }) => {
    openConsumeConfirm(payload); // tu función existente que setea consumeTarget y abre modal
  };

  useEffect(() => {
    if (!beds || !Array.isArray(beds)) return;

    const newServed = new Set<number>();
    beds.forEach((room) => {
      room.beds?.forEach((bed) => {
        const current =
          (bed as any).currentBedMenu ?? (bed as any).bedMenus?.[0] ?? null;

        if (current?.consumed) {
          newServed.add(bed.id);
        }
      });
    });

    setServedBedIds(newServed);
  }, [beds]);

  const availableFloors = useMemo(() => {
    if (!allRooms) return [];

    const floors = allRooms
      .map((room) => room.floor)
      .filter((floor) => floor !== null && floor !== undefined)
      .sort((a, b) => a - b);

    return [...new Set(floors)];
  }, [allRooms]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Confirmación de consumo */}
      <Dialog open={consumeConfirmOpen} onOpenChange={setConsumeConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar consumo de menú</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              ¿Confirmás consumir el siguiente menú y descontar stock?
            </p>

            <div className="mt-4">
              <div className="text-sm font-medium">Menú</div>
              <div className="text-base mb-2">
                {consumeTarget?.menuName ?? "-"}
              </div>

              <div className="text-sm font-medium">Paciente</div>
              <div className="text-base mb-2">
                {consumeTarget?.patientName ?? "Paciente no disponible"}
              </div>

              <div className="text-sm font-medium">Cantidad</div>
              <div className="text-base">{consumeTarget?.quantity ?? 1}</div>
            </div>
          </div>

          <footer className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setConsumeConfirmOpen(false)}
              disabled={isConsuming}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmConsume} disabled={isConsuming}>
              {isConsuming ? "Consumiendo..." : "Confirmar y marcar servido"}
            </Button>
          </footer>
        </DialogContent>
      </Dialog>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Gestión de Camas
              </h1>
            </div>

            {/* Dialog de creacion de habitación */}
            <GenericDialog
              open={isCreateRoomOpen}
              onOpenChange={(open) => setIsCreateRoomOpen(open)}
              title="Crear Habitación"
              description="Cree una nueva habitación o sala en el sistema"
              trigger={
                <Button onClick={() => setIsCreateRoomOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Habitación
                </Button>
              }
            >
              <CreateRoomForm onClose={() => setIsCreateRoomOpen(false)} />
            </GenericDialog>

            {/* Dialog de edición de habitacion */}
            <GenericDialog
              open={isEditRoomOpen}
              onOpenChange={setIsEditRoomOpen}
              title={`Editar la habitación ${activeRoom?.name}`}
            >
              {activeRoom && (
                <EditRoomForm
                  roomId={activeRoom.id}
                  roomName={activeRoom.name}
                  floor={activeRoom.floor}
                  onClose={() => setIsEditRoomOpen(false)}
                />
              )}
            </GenericDialog>

            {/* Crear cama y asignar a la habitacion */}
            <GenericDialog
              open={isCreateBedOpen}
              onOpenChange={(open) => {
                setIsCreateBedOpen(open);
                if (!open) {
                  // limpiar estado cuando se cierre el modal de crear cama
                  setActiveRoom(null);
                }
              }}
              title={`Crear Cama en ${activeRoom?.name ?? ""}`}
            >
              <CreateBedForm
                roomId={activeRoom?.id ?? 0}
                roomName={activeRoom?.name ?? ""}
                onClose={() => {
                  setIsCreateBedOpen(false);
                  setActiveRoom(null);
                }}
              />
            </GenericDialog>

            {/*Eliminar habitacion por id*/}

            <DeleteRoomForm
              open={isDeleteRoomOpen}
              onOpenChange={(open) => {
                setIsDeleteRoomOpen(open);
                if (!open) setActiveRoom(null);
              }}
              roomId={activeRoom?.id ?? 0}
              roomName={activeRoom?.name}
              onDeleted={() => {
                setIsDeleteRoomOpen(false);
                setActiveRoom(null);
                // opcional: invalidate or refetch rooms if needed (though useDeleteRoom already invalidates)
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Tabs defaultValue="camas" className="space-y-6">
            <div className="flex flex-row justify-between w-full">
              <TabsList>
                <TabsTrigger value="camas">Gestión de Camas</TabsTrigger>
                <TabsTrigger value="ordenes">Órdenes de Pacientes</TabsTrigger>
              </TabsList>
              <Button onClick={toggleView}>Cambiar vista</Button>
            </div>

            <div className="flex flex-row items-center justify-start">
              <Input
                className="w-[200px]"
                placeholder="Buscar habitación..."
                value={filters.name || ""}
                onChange={(e) => updateFilter("name", e.target.value)}
              />
              {/* Estado de habitación */}
              <Select
                value={filters.roomStatus || "all"}
                onValueChange={(value) => {
                  updateFilter(
                    "roomStatus",
                    value === "all" ? undefined : value
                  );
                }}
              >
                <SelectTrigger className="w-[180px] ml-4">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="inactive">Inactiva</SelectItem>
                </SelectContent>
              </Select>
              {/* Piso */}
              <Select
                value={filters.floor?.toString() || "all"}
                onValueChange={(value) => {
                  updateFilter(
                    "floor",
                    value === "all" ? undefined : parseInt(value)
                  );
                }}
              >
                <SelectTrigger className="w-[180px] ml-4">
                  <SelectValue placeholder="Filtrar por piso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los pisos</SelectItem>
                  {availableFloors.map((floor) => (
                    <SelectItem key={floor} value={floor.toString()}>
                      Piso {floor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Estado de cama */}
              <Select
                value={filters.bedStatus || "all"}
                onValueChange={(value) => {
                  updateFilter(
                    "bedStatus",
                    value === "all" ? undefined : value
                  );
                }}
              >
                <SelectTrigger className="w-[180px] ml-4">
                  <SelectValue placeholder="Filtrar por cama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las camas</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="ocupada">Ocupada</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
              {/* Menu servido */}
              <Select
                value={
                  filters.menuConsumed !== undefined
                    ? filters.menuConsumed.toString()
                    : "all"
                }
                onValueChange={(value) => {
                  if (value === "all") {
                    updateFilter("menuConsumed", undefined); // Eliminar el filtro
                  } else {
                    updateFilter("menuConsumed", value === "true");
                  }
                }}
              >
                <SelectTrigger className="w-[180px] ml-4">
                  <SelectValue placeholder="Filtrar por menú servido" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los menús</SelectItem>
                  <SelectItem value="true">Servido</SelectItem>
                  <SelectItem value="false">No servido</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="default"
                  className="ml-4 bg-green-400"
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </Button>
              )}

              {isFetching && !isLoading && (
                <div className="ml-4">
                  <Loading size="sm" variant="spinner" />
                </div>
              )}
            </div>

            <TabsContent value="camas">
              {isLoading ? (
                <Loading
                  size="lg"
                  text="Cargando habitaciones..."
                  className="min-h-[400px]"
                  variant="spinner"
                />
              ) : !beds || beds.length === 0 ? (
                <div className="rounded-md p-6 bg-yellow-50 border border-yellow-200 text-center">
                  <p className="text-base font-medium text-yellow-800">
                    No existen habitaciones o salas creadas.
                  </p>
                  <p className="mt-2 text-sm text-yellow-700">
                    Crea una nueva habitación para empezar a gestionar camas.
                  </p>
                  <div className="mt-4">
                    <Button onClick={() => setIsCreateRoomOpen(true)}>
                      Crear habitación
                    </Button>
                  </div>
                </div>
              ) : componentView === "card" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {beds?.map((room) => (
                    <Card
                      key={room.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center gap-2">
                          <div className="flex flex-1 items-center gap-2">
                            <Bed className="h-5 w-5" />
                            {room.name}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Acciones
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-slate-200 mt-2 p-4 shadow-lg rounded-xl  text-sm gap-2 cursor-pointer font-medium"
                            >
                              <DropdownMenuItem
                                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer"
                                onClick={() => openBedRoomDialog(room)}
                              >
                                Asignar cama
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer"
                                onClick={() => openEditRoomDialog(room)}
                              >
                                Editar habitación
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer"
                                onClick={() => openDeleteRoomDialog(room)}
                              >
                                Eliminar habitación
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardTitle>

                        <CardDescription>
                          {
                            room.beds.filter(
                              (b) => b.patients && b.patients.length > 0
                            ).length
                          }{" "}
                          de {room.beds.length} camas ocupadas
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-4">
                          {room.beds.map((bed) => {
                            const hasPatient = bed.patients?.length > 0;
                            const bedStatus = getBedStatusDisplay(
                              bed,
                              hasPatient
                            );
                            const patient = hasPatient ? bed.patients[0] : null;
                            const bedMenu =
                              bed.currentBedMenu ?? bed.bedMenus?.[0] ?? null;

                            return (
                              <div
                                key={bed.id}
                                className={`border rounded-lg p-4 transition-colors ${
                                  hasPatient
                                    ? "bg-orange-50 border-orange-200"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {bed.name}
                                    </span>
                                    <Badge className={bedStatus.className}>
                                      {bedStatus.text}
                                    </Badge>
                                  </div>

                                  {patient?.needsReview && (
                                    <Badge className="bg-amber-400 text-white">
                                      Modificado
                                    </Badge>
                                  )}

                                  {(servedBedIds.has(bed.id) ||
                                    !!bed?.currentBedMenu?.consumed) && (
                                    <Badge className="bg-green-500 text-white">
                                      Servido
                                    </Badge>
                                  )}
                                </div>

                                {hasPatient ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                      <User className="h-4 w-4" />
                                      <span>{patient?.name}</span>
                                    </div>

                                    {patient?.currentStatus ? (
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                          <strong>Diagnóstico:</strong>
                                          <Badge variant={"destructive"}>
                                            {patient.diagnosis}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <strong>Estado:</strong>
                                          <Badge
                                            className={
                                              patient.currentStatus
                                                .statusType === "internacion"
                                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                                : patient.currentStatus
                                                    .statusType === "alta"
                                                ? "bg-green-100 text-green-800 border-green-200"
                                                : "bg-gray-100 text-gray-800 border-gray-200"
                                            }
                                          >
                                            {patient.currentStatus.statusType.toUpperCase()}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <strong>Dieta:</strong>
                                          <Badge
                                            className={
                                              patient.currentStatus.dietType ===
                                              "liquida"
                                                ? "bg-cyan-100 text-cyan-800 border-cyan-200"
                                                : patient.currentStatus
                                                    .dietType === "blanda"
                                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                                : "bg-emerald-100 text-emerald-800 border-emerald-200"
                                            }
                                          >
                                            {patient.currentStatus.dietType?.toUpperCase()}
                                          </Badge>
                                        </div>

                                        {patient.currentStatus.notes &&
                                        patient.currentStatus.notes !==
                                          "string" ? (
                                          <p className="text-gray-500 italic">
                                            {patient.currentStatus.notes}
                                          </p>
                                        ) : (
                                          <p className="text-gray-400 italic">
                                            No hay notas del paciente
                                          </p>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-sm text-gray-500">
                                        <span> Cama libre</span>
                                      </div>
                                    )}

                                    {bedMenu ? (
                                      <div className="text-sm">
                                        <strong>Menú:</strong>{" "}
                                        {bedMenu.menu?.name}
                                      </div>
                                    ) : (
                                      <Button variant={"outline"}>
                                        Asignar menú
                                      </Button>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500">
                                    Cama libre
                                  </div>
                                )}

                                {/* Botones para acciones */}
                                {/* Botón Marcar Servido (si hay una asignación activa no consumida) */}
                                {bedMenu && !bedMenu.consumed && (
                                  <Button
                                    className="flex-1 w-full mt-2"
                                    onClick={() =>
                                      openConsumeConfirm({
                                        bedId: bed.id,
                                        bedMenuId: Number(bedMenu.id),
                                        menuName: bedMenu.menu?.name ?? "Menú",
                                        patientName:
                                          bed.patients?.[0]?.name ?? null,
                                        quantity: bedMenu.quantity ?? 1,
                                      })
                                    }
                                  >
                                    Marcar Menú Servido
                                  </Button>
                                )}
                                <div className="flex gap-2 mt-3">
                                  <Dialog
                                    open={
                                      isEditBedOpen &&
                                      selectedRoom === room.id &&
                                      selectedBed === bed.id
                                    }
                                    onOpenChange={(open) => {
                                      setIsEditBedOpen(open);
                                      if (!open) {
                                        // limpiar selección al cerrar el diálogo de edición de cama
                                        setSelectedRoom(null);
                                        setSelectedBed(null);
                                      }
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => {
                                          // al abrir edición, cerramos el modal de crear cama para evitar overlap
                                          setIsCreateBedOpen(false);
                                          setActiveRoom(null); // no necesitamos activeRoom cuando editamos una cama ya existente
                                          setSelectedRoom(room.id);
                                          setSelectedBed(bed.id);
                                          setIsEditBedOpen(true);
                                        }}
                                      >
                                        Editar Cama
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-5xl w-[90vw] h-[85vh] flex flex-col mx-4">
                                      <DialogHeader className="flex-shrink-0">
                                        <DialogTitle>
                                          Editar Cama y Paciente
                                        </DialogTitle>
                                        <DialogDescription>
                                          Cama : {bed.name} - Paciente:{" "}
                                          {patient?.name}
                                        </DialogDescription>
                                      </DialogHeader>

                                      <div className="flex-1 overflow-y-auto">
                                        <BedEditModal
                                          currentUserId={Number(currentUserId)}
                                          bed={bed}
                                          roomName={room.name}
                                          onClose={() => {
                                            setIsEditBedOpen(false);
                                            setSelectedRoom(null);
                                            setSelectedBed(null);
                                          }}
                                          isOpen={
                                            isEditBedOpen &&
                                            selectedRoom === room.id &&
                                            selectedBed === bed.id
                                          }
                                        />
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <RoomsTable
                  rooms={beds ?? []}
                  servedBedIds={servedBedIds}
                  onOpenConsumeConfirm={handleOpenConsumeConfirm as any}
                  onAssignBed={(r) => openBedRoomDialog(r as unknown as Room)}
                  onEditRoom={(r) => openEditRoomDialog(r as unknown as Room)}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
