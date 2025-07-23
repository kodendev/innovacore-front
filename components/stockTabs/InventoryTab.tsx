import { Package, Calendar, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ingredient } from "@/types/types";
import { useProducts } from "@/hooks/tanstack/useProducts";
import { ClipLoader } from "react-spinners";
import { getBadgeLabel, getBadgeVariant } from "@/utils/badge_variants";

interface Props {
  ingredients?: Ingredient[];
  onUpdate: (id: number, quantity: number) => void;
}

export const InventoryTab = ({ onUpdate }: Props) => {
  const { data, isLoading } = useProducts();

  return (
    <>
      {!data && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No hay ingredientes disponibles.</p>
        </div>
      )}
      {isLoading && (
        <div className="flex flex-col items-center justify-center col-span-1 md:col-span-2 xl:col-span-3 mt-20 h-full">
          <ClipLoader color="#123abc" loading={isLoading} size={50} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data &&
          data.map((ingredient) => (
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
                  {/* Actualizacion de stock (integrar UPDATE) */}
                  {/* <div className="flex gap-2 pt-2">
                  <StockUpdateDialog
                    ingredient={ingredient}
                    onUpdate={onUpdate}
                  />
                </div> */}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-semibold text-lg">{value}</span>
  </div>
);
