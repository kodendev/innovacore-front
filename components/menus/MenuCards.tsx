"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { UpdateMenuForm } from "./UpdateMenuForm";

interface Props {
  menu: Menu;
  setEditingMenu: Dispatch<SetStateAction<null>>;
  editingMenu: null;
  deleteMenu: (menuId: number) => void;
  toggleMenuStatus: (menuId: number) => void;
}

const MenuCards = ({
  menu,
  setEditingMenu,
  editingMenu,
  deleteMenu,
  toggleMenuStatus,
}: Props) => {
  return (
    <div>
      <Card
        key={menu.id}
        className={`hover:shadow-lg transition-shadow  ${
          !menu.name ? "opacity-60" : ""
        }`}
      >
        <CardHeader>
          <CardTitle className="flex flex-col items-start gap-2 justify-between">
            <span>{menu.name}</span>
            <span className="text-sm font-medium text-slate-500">
              {menu.description}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className=" h-[100px]">
              <h4 className="font-medium mb-2">Ingredientes:</h4>
              <div className="space-y-1">
                {menu?.menuProducts?.map((ingredient, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {ingredient?.product?.name || "Producto no disponible"}
                    </span>
                    <span>
                      {/* {ingredient.qty} */}
                      {ingredient.quantity || "No disponible"}
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
                  {editingMenu && (
                    <UpdateMenuForm
                      initialData={editingMenu}
                      onClose={() => setEditingMenu(null)}
                    />
                  )}
                </DialogContent>
              </Dialog>

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
