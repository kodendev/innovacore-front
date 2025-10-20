import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePatchRoom } from "@/hooks/tanstack/camas/editRoom";

interface EditRoomFormProps {
  roomId: number;
  roomName: string;
  floor?: number;
  onClose: () => void;
}

export const EditRoomForm = ({
  roomId,
  roomName,
  floor = 1,
  onClose,
}: EditRoomFormProps) => {
  const [name, setName] = useState(roomName);
  const [roomFloor, setRoomFloor] = useState(floor);

  const { mutate: updateRoom, isPending } = usePatchRoom();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRoom(
      { roomId, data: { name, floor: roomFloor } },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name">Nombre de habitación</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Habitación 101"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="floor">Piso</Label>
        <Input
          id="floor"
          type="number"
          value={roomFloor}
          onChange={(e) => setRoomFloor(Number(e.target.value))}
          className="mt-1"
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
};
