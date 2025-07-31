"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import { Edit, Trash2 } from "lucide-react";
import { Menu } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import { CreateMenuForm } from "./CreateMenuForm";

interface Props {
  menu: Menu;
  setEditingMenu: Dispatch<SetStateAction<null>>;
  editingMenu: null;
  deleteMenu: (menuId: number) => void;
  updateMenu: (menu: Menu) => void;
  toggleMenuStatus: (menuId: number) => void;
}

const MenuCards = ({
  menu,
  setEditingMenu,
  editingMenu,
  deleteMenu,
  updateMenu,
  toggleMenuStatus,
}: Props) => {
  return (
    <div>
      <Card
        key={menu.id}
        className={`hover:shadow-lg transition-shadow ${
          !menu.active ? "opacity-60" : ""
        }`}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{menu.name}</span>
            <div className="flex items-center gap-2">
              <Badge variant={menu.active ? "green" : "destructive"}>
                {menu.active ? "Activo" : "Inactivo"}
              </Badge>
              <Badge variant="outline">${menu.price}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Ingredientes:</h4>
              <div className="space-y-1">
                {menu.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{ingredient.name}</span>
                    <span>
                      {/* {ingredient.qty} */}
                      {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Dialog
                open={editingMenu?.id === menu.id}
                onOpenChange={(open) => !open && setEditingMenu(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMenu(menu)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Editar Menú</DialogTitle>
                    <DialogDescription>
                      Modifique los datos del menú
                    </DialogDescription>
                  </DialogHeader>
                  <CreateMenuForm
                    initialData={editingMenu}
                    onSubmit={updateMenu}
                    isEditing={true}
                  />
                </DialogContent>
              </Dialog>

              <Button
                variant={menu.active ? "secondary" : "default"}
                size="sm"
                onClick={() => toggleMenuStatus(menu.id)}
              >
                {menu.active ? "Desactivar" : "Activar"}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMenu(menu.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuCards;
