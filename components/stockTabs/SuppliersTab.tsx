import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Phone, Plus, Trash } from "lucide-react";
import { useSuppliers } from "@/hooks/tanstack/suppliers/useSuppliers";
import Spinner from "../spinners/Spinner";
import { Button } from "../ui/button";
import { useComponentView } from "@/hooks/useComponentView";
import SuppliersTable from "../tables/SuppliersTable";
import { Input } from "@/components/ui/input";
import CreatePurchaseOrder from "../forms/CreatePurchaseOrder";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddSupplierForm } from "../forms/AddSupplierForm";
import { useProducts } from "@/hooks/tanstack/products/useProducts";
import { useDeleteSupplier } from "@/hooks/tanstack/suppliers/useDeleteSupplier";
import { Supplier } from "@/types/suppliers/supplierTypes";
import { ConfirmDialog } from "../pop-ups/ConfirmDialog";
import { useUpdateSupplier } from "@/hooks/tanstack/suppliers/useEditSupplier";
import { EditSupplierForm } from "../forms/EditSupplierForm";
import { useSupplierSearch } from "@/hooks/tanstack/suppliers/useGetSupplierByName";
import { useDebounce } from "@/hooks/useDebounce";
import { useFilteredSuppliers } from "@/hooks/filters/useFilteredSuppliers";

export const SuppliersTab = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchedSupplier, setSearchedSupplier] = useState("");

  const debouncedQuery = useDebounce(searchedSupplier, 400);

  const { data: suppliers, isLoading } = useSuppliers();

  const { data: products } = useProducts();

  const deleteMutation = useDeleteSupplier();

  const updateSupplierMutation = useUpdateSupplier();

  const { data: searchSupplier } = useSupplierSearch(debouncedQuery);

  const { componentView, toggleView } = useComponentView();

  const handleSearchSupplier = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedSupplier(e.target.value);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSupplier) {
      deleteMutation.mutate(selectedSupplier.id);
    }
    setDialogOpen(false);
    setSelectedSupplier(null);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };

  const displayedSuppliers = useFilteredSuppliers({
    allSuppliers: suppliers || [],
    searchSupplier,
    debouncedQuery,
    filters: { active: true },
  });

  return (
    <>
      {selectedSupplier && (
        <ConfirmDialog
          open={dialogOpen}
          onCancel={() => setDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="¿Eliminar proveedor?"
          description={`¿Estás seguro que querés eliminar "${selectedSupplier.name}"?`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
        />
      )}

      {selectedSupplier && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>Editar proveedor</DialogTitle>
            </DialogHeader>
            <EditSupplierForm
              supplier={selectedSupplier}
              onClose={() => setIsEditDialogOpen(false)}
              onUpdate={(updatedData) =>
                updateSupplierMutation.mutate({
                  id: selectedSupplier.id,
                  data: updatedData,
                })
              }
            />
          </DialogContent>
        </Dialog>
      )}

      <div className="flex justify-end items-end w-full mb-4">
        <Input
          onChange={(e) => handleSearchSupplier(e)}
          value={searchedSupplier}
          placeholder="Buscar Proveedor"
        ></Input>
        <div className="flex flex-row items-center gap-1">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Agregar proveedor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
              </DialogHeader>
              <AddSupplierForm
                products={products || []}
                onClose={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Button onClick={toggleView}>Cambiar vista</Button>
        </div>
      </div>

      {componentView === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading && <Spinner isLoading={isLoading} />}
          {displayedSuppliers &&
            displayedSuppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex flex-row justify-between">
                    <CardTitle>{supplier.name}</CardTitle>
                    <Button
                      onClick={() => handleDeleteClick(supplier)}
                      className="cursor-pointer"
                      variant="destructive"
                    >
                      <Trash />
                    </Button>
                  </div>

                  <CardDescription>
                    Productos:{" "}
                    {supplier.supplierProducts.length > 0
                      ? supplier.supplierProducts
                          .map((sp) => sp.product.name)
                          .join(", ")
                      : "Sin productos"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {supplier.email}
                    </div>
                    <div className="flex flex-row gap-2">
                      <CreatePurchaseOrder supplier={supplier} />
                      <Button
                        className="p-4 mt-4"
                        variant={"secondary"}
                        onClick={() => handleEditSupplier(supplier)}
                      >
                        Editar Proveedor
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div>
          <SuppliersTable
            data={displayedSuppliers || []}
            handleDeleteClick={handleDeleteClick}
            isPending={isLoading}
            key={suppliers?.length}
          />
        </div>
      )}
    </>
  );
};
