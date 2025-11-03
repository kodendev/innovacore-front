import React from "react";
import { toast } from "sonner";
import { useDeleteRoom } from "@/hooks/tanstack/camas/useDeleteRoom";
import { GenericFormDialog } from "../forms/GenericEditForm";
import { ConfirmDialog } from "../pop-ups/ConfirmDialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: number;
  roomName?: string;
  onDeleted?: () => void;
};

export default function DeleteRoomForm({
  open,
  onOpenChange,
  roomId,
  roomName,
  onDeleted,
}: Props) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [roomToDelete, setRoomToDelete] = React.useState<number>(0);
  const [roomNameToDelete, setRoomNameToDelete] = React.useState<string>("");

  const deleteRoom = useDeleteRoom();

  const handleSubmit = async () => {
    setRoomToDelete(roomId);
    setRoomNameToDelete(roomName ?? "");
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    console.log("Habitacion a eliminar", roomToDelete);
    await deleteRoom.mutateAsync({ roomId: roomToDelete });
    toast.success(`Habitación "${roomNameToDelete}" eliminada`);
    setConfirmOpen(false);
    onDeleted?.();
  };

  return (
    <>
      <GenericFormDialog
        open={open}
        onOpenChange={onOpenChange}
        title={`Eliminar Habitación ${roomName ?? ""}`}
        description="Esta acción es irreversible. Confirma para eliminar la habitación."
        submitLabel="Eliminar"
        cancelLabel="Cancelar"
        onSubmit={handleSubmit}
        renderFields={() => (
          <div className="text-sm text-gray-700">
            Vas a eliminar la habitación{" "}
            <strong>{roomName ?? `#${roomId}`}</strong>.
            <div className="mt-2 text-xs text-gray-500">
              Esta acción eliminará la habitación y sus referencias asociadas.
            </div>
          </div>
        )}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="¿Eliminar habitación?"
        description={`¿Estás seguro que querés eliminar "${roomNameToDelete}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={deleteRoom.isPending}
        onConfirm={executeDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
