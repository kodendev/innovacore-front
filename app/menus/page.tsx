"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { initialMenus } from "@/data/fakeData";
import MenuCards from "@/components/menus/MenuCards";
import { CreateMenuForm } from "@/components/menus/CreateMenuForm";

export default function MenusPage() {
  const [menus, setMenus] = useState(initialMenus);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  const addMenu = (newMenu: any) => {
    const id = Math.max(...menus.map((m) => m.id)) + 1;
    setMenus((prev) => [...prev, { ...newMenu, id, active: true }]);
    setIsAddDialogOpen(false);
  };

  const updateMenu = (updatedMenu: any) => {
    setMenus((prev) =>
      prev.map((menu) => (menu.id === updatedMenu.id ? updatedMenu : menu))
    );
    setEditingMenu(null);
  };

  const toggleMenuStatus = (menuId: any) => {
    setMenus((prev) =>
      prev.map((menu) =>
        menu.id === menuId ? { ...menu, active: !menu.active } : menu
      )
    );
  };

  const deleteMenu = (menuId: any) => {
    setMenus((prev) => prev.filter((menu) => menu.id !== menuId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Menús
              </h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Menú
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Menú</DialogTitle>
                  <DialogDescription>
                    Configure los ingredientes y precio del nuevo menú
                  </DialogDescription>
                </DialogHeader>
                <CreateMenuForm onSubmit={addMenu} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-row items-center gap-4">
            <select
              className="bg-slate-200 p-2 rounded"
              aria-placeholder="Filtrar por"
              name=""
              id=""
            >
              <option value="">Todos los menús</option>
              <option value="active">Almuerzo</option>
              <option value="inactive">Merienda</option>
              <option value="inactive">Colaciones</option>
              <option value="inactive">Desayuno</option>
              <option value="inactive">Cena</option>
            </select>
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <MenuCards
                  key={menu.id}
                  menu={menu}
                  setEditingMenu={setEditingMenu}
                  editingMenu={editingMenu}
                  updateMenu={updateMenu}
                  toggleMenuStatus={toggleMenuStatus}
                  deleteMenu={deleteMenu}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
