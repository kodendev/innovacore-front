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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSuppliersByProducts } from "@/hooks/tanstack/suppliers/useSuppliersByProducts";
import { Label } from "recharts";

export const SuppliersTab = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchedSupplier, setSearchedSupplier] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const debouncedQuery = useDebounce(searchedSupplier, 400);

  const { data: suppliers, isLoading } = useSuppliers();

  const { data: products } = useProducts();

  const deleteMutation = useDeleteSupplier();

  const updateSupplierMutation = useUpdateSupplier();

  const { data: supplierProductsByProduct } = useSuppliersByProducts(
    selectedProductId ? String(selectedProductId) : ""
  );

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

  const suppliersByProduct: Supplier[] =
    supplierProductsByProduct?.map((sp: any) => sp.supplier) ?? [];

  const displayedSuppliers = useFilteredSuppliers({
    allSuppliers: suppliers ?? [],
    searchSupplier,
    debouncedQuery,
    filters: {
      active: true,
      productId: selectedProductId ?? undefined,
    },
    suppliersByProduct,
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

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-sm text-gray-600 font-medium">
            Buscar proveedor
          </label>
          <Input
            onChange={(e) => handleSearchSupplier(e)}
            value={searchedSupplier}
            placeholder="Escribí un nombre..."
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm text-gray-600 font-medium">
            Filtrar por producto
          </label>
          <Select
            value={
              selectedProductId !== null ? String(selectedProductId) : "ALL"
            }
            onValueChange={(value) =>
              setSelectedProductId(value === "ALL" ? null : Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los productos</SelectItem>
              {products?.map(
                (product) =>
                  product.id !== undefined && (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row items-center gap-2 self-start md:self-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Agregar
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

      {(searchedSupplier.trim() !== "" || selectedProductId !== null) && (
        <div className="text-xs text-gray-500 mt-1">
          {searchedSupplier &&
            `Filtrando por nombre de proveedor: "${searchedSupplier}"`}
          {searchedSupplier && selectedProductId !== null && " • "}
          {selectedProductId !== null &&
            "Filtrando por producto ofrecido por proveedor"}
        </div>
      )}

      {isLoading ? (
        <Spinner isLoading={isLoading} />
      ) : displayedSuppliers.length === 0 &&
        (searchedSupplier.trim() !== "" || selectedProductId !== null) ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          No se encontraron proveedores con los filtros aplicados.
        </div>
      ) : componentView === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
