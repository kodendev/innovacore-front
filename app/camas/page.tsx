"use client";

import { useEffect, useState } from "react";
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
import { Bed, User, ArrowLeft, Plus } from "lucide-react";
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

export default function CamasPage() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null); // ID de la habitación seleccionada (para editar cama)
  const [selectedBed, setSelectedBed] = useState<number | null>(null); // ID de la cama seleccionada (para editar cama)

  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState<boolean>(false); // crear habitación
  const [isEditRoomOpen, setIsEditRoomOpen] = useState<boolean>(false); // editar habitación

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

  const { data: beds } = useRooms();

  const consumeMut = useConsumeBedMenu();

  const { user } = useAuth();
  const currentUserId = user?.user_id ?? 0;

  const isConsuming = consumeMut.isPending;

  //abre el dialog de crear cama
  const openBedDialog = (room: Room) => {
    setActiveRoom(room);
    setIsEditBedOpen(false);
    setSelectedRoom(null);
    setSelectedBed(null);
    setIsCreateBedOpen(true);
  };

  //edita la habitacion
  const openEditDialog = (room: Room) => {
    setActiveRoom(room);
    setIsEditRoomOpen(true);
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
      // feedback inmediato: marcar la cama como servida localmente
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
              <Button>Cambiar vista</Button>
            </div>
            <TabsContent value="camas">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {beds?.map((room) => (
                  <Card
                    key={room.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bed className="h-5 w-5" />
                        {room.name}
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
                              onClick={() => openBedDialog(room)}
                            >
                              Asignar cama
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer"
                              onClick={() => openEditDialog(room)}
                            >
                              Editar habitación
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
                                  <Badge
                                    className={
                                      hasPatient
                                        ? "bg-orange-100 text-orange-800 border-orange-200"
                                        : "bg-gray-100 text-gray-800 border-gray-200"
                                    }
                                  >
                                    {hasPatient ? "Ocupada" : "Libre"}
                                  </Badge>
                                </div>

                                {(servedBedIds.has(bed.id) ||
                                  !!bed?.currentBedMenu?.consumed) && (
                                  <Badge className="bg-green-500 text-white">
                                    Servido
                                  </Badge>
                                )}

                                {/* Botón Marcar Servido (si hay una asignación activa no consumida) */}
                                {bedMenu && !bedMenu.consumed && (
                                  <Button
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
                                    Marcar Servido
                                  </Button>
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
                                        <Badge>{patient.diagnosis}</Badge>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <strong>Estado:</strong>
                                        <Badge
                                          className={
                                            patient.currentStatus.statusType ===
                                            "internacion"
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
                                  <DialogContent className="max-w-md mx-4">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Editar Cama y Paciente
                                      </DialogTitle>
                                      <DialogDescription>
                                        Cama : {bed.name} - Paciente:{" "}
                                        {patient?.name}
                                      </DialogDescription>
                                    </DialogHeader>

                                    <div className="mt-4">
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

// <TabsContent value="ordenes">
//   <Card>
//     <CardHeader>
//       <div className="flex justify-between items-center">
//         <div>
//           <CardTitle>Órdenes de Pacientes</CardTitle>
//           <CardDescription>
//             Listado de todas las órdenes realizadas para pacientes
//             internados
//           </CardDescription>
//         </div>
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Nueva Orden
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-md mx-4">
//             <DialogHeader>
//               <DialogTitle>Crear Nueva Orden</DialogTitle>
//               <DialogDescription>
//                 Complete los datos para crear una orden para un
//                 paciente
//               </DialogDescription>
//             </DialogHeader>
//             {/* <CreateNewOrderForm
//               onCreateOrder={handleCreateNewOrder}
//             /> */}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </CardHeader>
//     <CardContent>
//       <div className="space-y-4">
//         {orders.map((order) => (
//           <div
//             key={order.id}
//             className={`border rounded-lg p-4 transition-colors ${
//               order.status === "servido"
//                 ? "bg-green-50 border-green-200"
//                 : "bg-orange-50 border-orange-200"
//             }`}
//           >
//             <div className="flex justify-between items-start mb-3">
//               <div>
//                 <div className="font-medium">
//                   Orden #{order.id} - Habitación {order.room}, Cama{" "}
//                   {order.bed}
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   Paciente: {order.patient} • {order.time}
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Badge
//                   variant={
//                     order.status === "servido"
//                       ? "default"
//                       : "destructive"
//                   }
//                   className={
//                     order.status === "servido"
//                       ? "bg-green-100 text-green-800 border-green-200"
//                       : "bg-orange-100 text-orange-800 border-orange-200"
//                   }
//                 >
//                   {order.status === "servido"
//                     ? "✓ Servido"
//                     : "⏳ Pendiente"}
//                 </Badge>
//                 {order.status === "pendiente" && (
//                   <Button size="sm">Marcar Servido</Button>
//                 )}
//               </div>
//             </div>
//             <div className="text-sm">
//               <strong>Items:</strong>{" "}
//               {order.items.map((item, index) => (
//                 <span key={index}>
//                   {item.name} x{item.qty}
//                   {index < order.items.length - 1 ? ", " : ""}
//                 </span>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </CardContent>
//   </Card>
// </TabsContent>
