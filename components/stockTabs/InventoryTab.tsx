import { Package, Calendar, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ingredient, Product } from "@/types/types";
import { useProducts } from "@/hooks/tanstack/products/useProducts";
import { ClipLoader } from "react-spinners";
import { getBadgeLabel, getBadgeVariant } from "@/utils/badge_variants";
import { Button } from "../ui/button";
import { useDeleteProduct } from "@/hooks/tanstack/products/useDeleteProduct";
import { useState } from "react";
import { ConfirmDialog } from "../pop-ups/ConfirmDialog";
import { StockUpdateDialog } from "../forms/UpdateStockElement";
import { InfoRow } from "@/utils/info_row";
import ProductsTable from "../tables/ProductsTable";
import { useComponentView } from "@/hooks/useComponentView";

interface Props {
  ingredients?: Ingredient[];
  onUpdate: (id: number, quantity: number) => void;
}

export const InventoryTab = ({ onUpdate }: Props) => {
  const { data, isLoading } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Product | null>(
    null
  );

  const { componentView, toggleView } = useComponentView();

  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const handleDeleteClick = (ingredient: Product) => {
    setSelectedIngredient(ingredient);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedIngredient) {
      handleDeleteProductos(Number(selectedIngredient.id));
      setDialogOpen(false);
    }
  };

  const handleDeleteProductos = (id: number): void => {
    deleteProduct(id);
    setDialogOpen(false);
  };

  return (
    <>
      <ConfirmDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar producto?"
        description={`¿Estás seguro que querés eliminar "${selectedIngredient?.name}"?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
      {data?.length === 0 ? (
        <div className="flex items-center justify-center mt-4 h-[80vh]">
          <p className="text-gray-500 text-xl">
            No hay ingredientes disponibles.
          </p>
        </div>
      ) : (
        <div className="flex justify-end items-end w-full mb-4">
          <Button onClick={toggleView}>Cambiar vista</Button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center col-span-1 md:col-span-2 xl:col-span-3 mt-20 h-full">
          <ClipLoader color="#123abc" loading={isLoading} size={50} />
        </div>
      )}

      {componentView === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data?.map((ingredient) => (
            <Card
              key={ingredient.name}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {ingredient.name}
                  </span>
                  <Badge
                    variant={getBadgeVariant(
                      ingredient.active === true ? "Activo" : "Inactivo"
                    )}
                  >
                    {getBadgeLabel(
                      ingredient.active === true ? "Activo" : "Inactivo"
                    )}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <InfoRow
                    label="Stock actual:"
                    value={`${ingredient.stock} kg`}
                  />
                  <InfoRow
                    label="Stock mínimo:"
                    value={`${ingredient.stock} kg`}
                  />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Vence: 25/07/2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Precio de costo : {ingredient.cost_price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Precio de venta : {ingredient.sale_price}</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Mayorista SRL</div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="h-3 w-3" />
                      2364621198
                    </div>
                  </div>
                  {/* Actualizacion de stock  */}
                  <div className="flex gap-2 pt-2">
                    <StockUpdateDialog product={ingredient} />
                    <Button
                      onClick={() => handleDeleteClick(ingredient)}
                      disabled={isPending}
                      variant={"destructive"}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // 📊 Vista tipo Tabla (una sola tabla para todos los ingredientes)
        <div className="w-full overflow-x-auto">
          <ProductsTable
            data={data}
            handleDeleteClick={handleDeleteClick}
            isPending={isPending}
          />
        </div>
      )}
    </>
  );
};
