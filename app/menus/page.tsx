"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useComponentView } from "@/hooks/useComponentView";
import MenusTable from "@/components/tables/MenuTable";
import { useUpdateMenuStatus } from "@/hooks/tanstack/menus/useUpdateMenuStatus";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type statusTypes = 'all' | 'active' | 'inactive';

const statusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' }
];

export default function MenusPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [selectedType, setSelectedType] = useState<number | 0>(0);
  const [selectedStatus, setSelectedStatus] = useState<statusTypes>("all");
  const [searchText, setSearchText] = useState("");

  const { data: menus, isLoading, error, isPending } = useMenus();
  const { data: menuType } = useMenuType();

  const { componentView, toggleView } = useComponentView();
  const updateMenuMutation = useUpdateMenuStatus();

  const filteredMenus = menus?.filter((menu) => {
    const matchesType = selectedType === 0 || menu.menuTypeId === selectedType;
    const matchesStatus = selectedStatus === "all" || menu.active === (selectedStatus === "active");
    const matchesSearch = !searchText || menu.name.toLowerCase().includes(searchText.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  }) ?? [];

  const toggleMenuStatus = (menuId: number) => {
    updateMenuMutation.mutate(menuId);
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
          <div className="flex flex-row items-center w-full justify-between gap-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Buscar menú..."
                className="w-64"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Select
                value={selectedType.toString()}
                onValueChange={(val: string) => setSelectedType(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elegir menú..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">
                    <span>Todos los tipos</span>
                  </SelectItem>
                  {menuType?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      <span>{type.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(selectedStatus)}
                onValueChange={(val: string) => setSelectedStatus(val as statusTypes)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elegir estado..." />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{status.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant={"default"} onClick={toggleView}>
              Cambiar vista
            </Button>
          </div>

          <div className="mt-4">
            {filteredMenus.length === 0 ? (
              <p className="text-center text-xl text-gray-500 mt-20">
                No hay menús creados en este tipo.
              </p>
            ) : (
              <>
                {componentView === "card" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && <p>Cargando menús...</p>}
                    {error && <p>Error al cargar menús</p>}
                    {!isLoading &&
                      !error &&
                      filteredMenus?.map((menu) => (
                        <MenuCards
                          key={menu.id}
                          menu={menu}
                          deleteMenu={deleteMenu}
                          toggleMenuStatus={toggleMenuStatus}
                        />
                      ))}
                  </div>
                ) : (
                  <MenusTable isPending={isPending} data={filteredMenus} toggleMenuStatus={toggleMenuStatus} />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
