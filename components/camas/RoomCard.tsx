// RoomCard.jsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Bed } from "lucide-react";
import { CreateBedForm } from "./beds/CreateBedForm";
import { Room } from "../../types/camas/bedTypes";

export const RoomCard = ({ room }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bed className="h-5 w-5" />
          <span className="font-semibold">{room.name}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Acciones
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              Crear cama
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Editar habitación")}>
              Editar habitación
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialog asociado a esta habitación */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl backdrop-blur-md bg-white/90">
            <DialogHeader>
              <DialogTitle>Crear cama</DialogTitle>
              <DialogDescription>
                Crear cama para la habitación <b>{room.name}</b>
              </DialogDescription>
            </DialogHeader>
            <CreateBedForm
              roomId={room.id}
              onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
