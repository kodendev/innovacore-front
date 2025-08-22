import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { UpdateMenuForm } from "../menus/UpdateMenuForm";
import type { Menu } from "@/types/types";

type Props = {
  menu: Menu;
};

export function MenuUpdateDialog({ menu }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Menú</DialogTitle>
          <DialogDescription>Modifique los datos del menú</DialogDescription>
        </DialogHeader>

        <UpdateMenuForm initialData={menu} onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
