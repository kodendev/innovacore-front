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
import MenuCards from "@/components/menus/MenuCards";
import { CreateMenuForm } from "@/components/menus/CreateMenuForm";
import { useMenus } from "@/hooks/tanstack/menus/useMenus";
import { useMenuType } from "@/hooks/tanstack/menus/useMenuType";

export default function MenusPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [selectedType, setSelectedType] = useState<number | 0>(0);

  const { data: menus, isLoading, error, isPending } = useMenus();
  const { data: menuType } = useMenuType();

  const filteredMenus =
    selectedType === 0
      ? menus ?? []
      : menus?.filter((menu) => menu.menuTypeId === selectedType) ?? [];

  console.log("menus filtrados", filteredMenus);

  const toggleMenuStatus = (menuId: number) => {
    console.log("Cambiando estado del menú con ID:", menuId);
  };

  const deleteMenu = (menuId: any) => {
    console.log("Eliminando menú con ID:", menuId);
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
                <CreateMenuForm onClose={() => setIsAddDialogOpen(false)} />
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
              aria-label="Filtrar por tipo de menú"
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value ? Number(e.target.value) : 0)
              }
            >
              <option value={0}>Todos los tipos</option>
              {menuType?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            {filteredMenus.length === 0 ? (
              <p className="text-center text-xl text-gray-500 mt-20">
                No hay menús creados en este tipo.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && <p>Cargando menús...</p>}
                {error && <p>Error al cargar menús</p>}
                {!isLoading &&
                  !error &&
                  filteredMenus?.map((menu) => (
                    <MenuCards
                      key={menu.id}
                      menu={menu}
                      setEditingMenu={setEditingMenu}
                      editingMenu={editingMenu}
                      toggleMenuStatus={toggleMenuStatus}
                      deleteMenu={deleteMenu}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
