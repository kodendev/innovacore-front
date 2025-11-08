import { Package, Calendar, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/types";
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
import { getExpirationColor } from "@/utils/getExpirationBadge";
import { Input } from "../ui/input";
import { useSearchProducts } from "@/hooks/tanstack/products/useSearchProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { useCategories } from "@/hooks/tanstack/products/useCategories";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const InventoryTab = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Product | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  // Filtro de busqueda
  const [query, setQuery] = useState("");
  //Temporizador para evitar muchas consultas a la api
  const debouncedQuery = useDebounce(query, 400);

  const categoryIdNumber =
    selectedCategory && selectedCategory !== "all"
      ? Number(selectedCategory)
      : undefined;

  //Utilizacion de hook para obtener productos
  const { data: allProducts, isLoading: loadingAll } =
    useProducts(categoryIdNumber);

  //Hook para cambiar vista de tabla a card
  const { componentView, toggleView } = useComponentView();

  //Hook para eliminar producto
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  //Hook para busqueda de productos
  const { data: searchResults, isLoading: loadingSearch } =
    useSearchProducts(query);

  //Hook para obtener categorias
  const { data: categories } = useCategories();

  // Determinar qué productos mostrar según si hay una búsqueda activa
  const productsToShow: Product[] =
    debouncedQuery.trim().length > 0 ? searchResults ?? [] : allProducts ?? [];

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
    console.log("Id obtenido de producto a eliminar:", id);
    deleteProduct(id);
    setDialogOpen(false);
  };

  const lowStockProducts = (productsToShow ?? []).filter((p) => p.isStockMin);

  return (
    <>
      {lowStockProducts.length > 0 && (
        <div className="mb-4 p-4 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800">
          ⚠️ Los siguientes productos tienen stock mínimo, por favor reponer:{" "}
          <span className="font-semibold">
            {lowStockProducts.map((p) => p.name).join(", ")}
          </span>
        </div>
      )}
      <ConfirmDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar producto?"
        description={`¿Estás seguro que querés eliminar "${selectedIngredient?.name}"?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
      {searchResults?.length === 0 ? (
        <div className="flex items-center justify-center mt-4 h-[80vh]">
          <p className="text-gray-500 text-xl">
            No hay ingredientes disponibles.
          </p>
        </div>
      ) : (
        <div className="flex flex-col justify-between items-end w-full mb-4">
          <div className="flex flex-row items-center w-full">
            <Input
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              placeholder="Buscar Producto"
            ></Input>
            <Button onClick={toggleView}>Cambiar vista</Button>
          </div>
          <div className="flex items-start w-full mt-4">
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
              required
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filtros" />
              </SelectTrigger>
              <SelectContent>
                <>
                  <SelectItem value="all">Todos los productos</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {loadingAll && (
        <div className="flex flex-col items-center justify-center col-span-1 md:col-span-2 xl:col-span-3 mt-20 h-full">
          <ClipLoader color="#123abc" loading={loadingAll} size={50} />
        </div>
      )}

      {componentView === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {productsToShow?.map((ingredient) => (
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
                    className={
                      ingredient.isStockMin ? "text-red-500 font-bold" : ""
                    }
                    label="Punto de compra:"
                    value={`${ingredient?.minStock} kg`}
                  />

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span
                      className={getExpirationColor(ingredient.expirationDate!)}
                    >
                      Vence: {ingredient.expirationDate}
                    </span>
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
            data={productsToShow || []}
            handleDeleteClick={handleDeleteClick}
            isPending={isPending}
          />
        </div>
      )}
    </>
  );
};
