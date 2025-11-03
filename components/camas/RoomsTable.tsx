import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import BedEditModal, { BedProps } from "./BedEditModal";
import { Bed } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export type Menu = {
  id: number;
  name: string;
  quantity?: number;
};

export type BedMenu = {
  id: number;
  bedId: number;
  menuId: number;
  quantity?: number;
  assignedAt?: string | null;
  consumed?: boolean;
  menu?: Menu | null;
  isEdited?: boolean;
};

export type PatientStatusShape = {
  id?: number;
  statusType: string;
  dietType?: string | null;
  notes?: string | null;
};

export type PatientShape = {
  id: number;
  name: string;
  dni?: string | null;
  age?: number | null;
  gender?: string | null;
  diagnosis?: string | null;
  needsReview?: boolean | null;
  currentStatus?: PatientStatusShape | null;
  documentNumber?: string | null;
  active?: boolean | null;
  bedId?: number | null;
};

export type BedShape = {
  id: number;
  name: string;
  status?: string;
  roomId?: number | null;
  currentBedMenu?: BedMenu | null;
  bedMenus?: BedMenu[] | null;
  patients?: PatientShape[] | null;
};

export type RoomShape = {
  id: number;
  name: string;
  floor?: number | null;
  status?: "active" | "inactive";
  beds: BedShape[];
};

type RoomsTableProps = {
  rooms: RoomShape[];
  servedBedIds?: Set<number>;
  onOpenConsumeConfirm?: (payload: {
    bedId: number;
    bedMenuId: number;
    menuName?: string;
    patientName?: string | null;
    quantity?: number;
  }) => void;
  onAckReview?: (patientId: number) => Promise<void> | void;
  className?: string;
  onAssignBed?: (room: RoomShape) => void;
  onEditRoom?: (room: RoomShape) => void;
};

export default function RoomsTable({
  rooms,
  servedBedIds = new Set<number>(),
  onOpenConsumeConfirm,
  onAckReview,
  className,
  onAssignBed,
  onEditRoom,
}: RoomsTableProps) {
  const [openEditRoomId, setOpenEditRoomId] = React.useState<number | null>(
    null
  );
  const [openEditBedId, setOpenEditBedId] = React.useState<number | null>(null);

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No hay habitaciones para mostrar
      </div>
    );
  }

  const { user } = useAuth();
  const currentUserId = user?.user_id ?? 0;

  return (
    <div className={className ?? ""}>
      {!rooms || rooms.length === 0 ? (
        <div className="rounded-md p-6 bg-yellow-50 border border-yellow-200 text-center">
          <p className="text-base font-medium text-yellow-800">
            No existen habitaciones o salas creadas.
          </p>
          <p className="mt-2 text-sm text-yellow-700">
            Crea una nueva habitación para empezar a gestionar camas.
          </p>
          <div className="mt-4">
            <Button
              onClick={() =>
                /* abrir diálogo de crear habitación en el padre */ null
              }
            >
              Crear habitación
            </Button>
          </div>
        </div>
      ) : (
        <Table className="min-w-full table-auto border border-gray-200">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Hab./Piso</TableHead>
              <TableHead>Cama</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Estado / Dieta</TableHead>
              <TableHead>Menú</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 bg-white">
            {rooms.map((room) => (
              <React.Fragment key={room.id}>
                {/* room header row */}
                <TableRow className="bg-gray-200">
                  <TableCell
                    colSpan={7}
                    className="font-semibold text-sm text-gray-700"
                  >
                    {room.name} {room.floor ? `— Piso ${room.floor}` : ""}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-4">
                          Acciones
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="bg-slate-200 mt-2 p-2 shadow-lg rounded-xl text-sm gap-2 cursor-pointer font-medium"
                      >
                        <DropdownMenuItem
                          className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer"
                          onClick={() => onAssignBed?.(room)}
                        >
                          Asignar cama
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer"
                          onClick={() => onEditRoom?.(room)}
                        >
                          Editar habitación
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                {room.beds?.map((bed) => {
                  const hasPatient = (bed.patients ?? []).length > 0;
                  const patient = hasPatient ? bed.patients![0] : null;
                  const bedMenu =
                    bed.currentBedMenu ?? bed.bedMenus?.[0] ?? null;
                  const isServed =
                    servedBedIds.has(bed.id) || !!bedMenu?.consumed;

                  const bedForModal: BedShape & { roomId?: number } = {
                    ...bed,
                    roomId: bed.roomId ?? undefined,
                  };

                  return (
                    <TableRow key={bed.id}>
                      <TableCell>
                        {/* optionally show a short room indicator */}
                        <div className="text-xs text-gray-500">
                          {/* empty to keep table layout */}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {bed.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border ${
                              bed.status === "ocupada"
                                ? "bg-orange-100 text-orange-800 border-orange-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {bed.status ?? "—"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {patient ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{patient.name}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              <Badge variant={"destructive"}>
                                {patient.diagnosis}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Cama libre
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {patient?.currentStatus ? (
                          <div className="flex flex-col text-sm">
                            <div>
                              <strong>Estado:</strong>{" "}
                              <Badge
                                className={
                                  patient.currentStatus.statusType ===
                                  "internacion"
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : patient.currentStatus.statusType ===
                                      "alta"
                                    ? "bg-green-100 text-green-800 border-green-200 "
                                    : "bg-gray-100 text-gray-800 border-gray-200 "
                                }
                              >
                                {patient.currentStatus.statusType
                                  ?.charAt(0)
                                  .toUpperCase() +
                                  (patient?.currentStatus?.statusType?.slice(
                                    1
                                  ) ?? "") || "N/A"}
                              </Badge>
                            </div>
                            <div className="mt-1">
                              <strong>Dieta:</strong>{" "}
                              <Badge
                                className={
                                  patient.currentStatus.dietType === "liquida"
                                    ? "bg-cyan-100 text-cyan-800 border-cyan-200 "
                                    : patient.currentStatus.dietType ===
                                      "blanda"
                                    ? "bg-amber-100 text-amber-800 border-amber-200"
                                    : "bg-emerald-100 text-emerald-800 border-emerald-200"
                                }
                              >
                                {patient.currentStatus.dietType
                                  ?.charAt(0)
                                  .toUpperCase() +
                                  (patient?.currentStatus?.dietType?.slice(1) ??
                                    "") || "N/A"}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Sin estado
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {bedMenu ? (
                          <div>
                            <div className="font-medium text-sm">
                              {bedMenu.menu?.name ?? "Menú"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Sin menú
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {patient?.needsReview && (
                            <Badge className="bg-amber-400 text-white">
                              Modificado
                            </Badge>
                          )}
                          {isServed && (
                            <Badge className="bg-green-500 text-white">
                              Servido
                            </Badge>
                          )}
                          {bedMenu?.isEdited && (
                            <Badge className="bg-yellow-500 text-white">
                              Menú editado
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              {/* abrir dialog por estado (no usar DialogTrigger aquí) */}
                              <DropdownMenuItem
                                onClick={() => {
                                  setOpenEditRoomId(room.id);
                                  setOpenEditBedId(bed.id);
                                }}
                              >
                                Editar Cama
                              </DropdownMenuItem>

                              {bedMenu && !bedMenu.consumed && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    onOpenConsumeConfirm?.({
                                      bedId: bed.id,
                                      bedMenuId: bedMenu.id,
                                      menuName: bedMenu.menu?.name ?? "Menú",
                                      patientName: patient?.name ?? null,
                                      quantity: bedMenu.quantity ?? 1,
                                    })
                                  }
                                >
                                  Marcar Servido
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {/* Dialog controlado por state - por fila */}
                          <Dialog
                            open={
                              openEditRoomId === room.id &&
                              openEditBedId === bed.id
                            }
                            onOpenChange={(open) => {
                              if (!open) {
                                setOpenEditRoomId(null);
                                setOpenEditBedId(null);
                              }
                            }}
                          >
                            <DialogContent className="max-w-md mx-4">
                              <DialogHeader>
                                <DialogTitle>
                                  Editar Cama y Paciente
                                </DialogTitle>
                                <DialogDescription>
                                  Cama: {bed.name}{" "}
                                  {patient ? `- Paciente: ${patient.name}` : ""}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="mt-4">
                                {/* BedEditModal debe ser solo el form/content aquí.
              Si BedEditModal actualmente envuelve su propio Dialog,
              extraé el contenido a BedEditForm o añade una prop inline.
          */}
                                <BedEditModal
                                  currentUserId={Number(currentUserId ?? 0)}
                                  bed={
                                    {
                                      ...bed,
                                      roomId: bed.roomId ?? undefined,
                                    } as any
                                  }
                                  roomName={room.name}
                                  onClose={() => {
                                    setOpenEditRoomId(null);
                                    setOpenEditBedId(null);
                                  }}
                                  isOpen={
                                    openEditRoomId === room.id &&
                                    openEditBedId === bed.id
                                  }
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
