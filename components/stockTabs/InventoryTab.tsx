import { Package, Calendar, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ingredient, StockStatus } from "@/types/types";
import { StockUpdateDialog } from "@/components/forms/UpdateStockElement";
import { useIngredients } from "@/hooks/tanstack/useIngredients";
import { ClipLoader } from "react-spinners";

interface Props {
  ingredients?: Ingredient[];
  onUpdate: (id: number, quantity: number) => void;
}

export const InventoryTab = ({ onUpdate }: Props) => {
  const { data, isLoading } = useIngredients();

  return (
    <>
      {isLoading && (
        <div className="flex flex-col items-center justify-center col-span-1 md:col-span-2 xl:col-span-3 mt-20 h-full">
          <ClipLoader color="#123abc" loading={isLoading} size={50} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data?.map((ingredient) => (
          <Card
            key={ingredient.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {ingredient.name}
                </span>
                <Badge variant={getBadgeVariant(ingredient.status)}>
                  {getBadgeLabel(ingredient.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <InfoRow
                  label="Stock actual:"
                  value={`${ingredient.quantity} ${ingredient.unit}`}
                />
                <InfoRow
                  label="Stock mínimo:"
                  value={`${ingredient.minStock} ${ingredient.unit}`}
                />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Vence: {ingredient.expiry}</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{ingredient.supplier}</div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Phone className="h-3 w-3" />
                    {ingredient.contact}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <StockUpdateDialog
                    ingredient={ingredient}
                    onUpdate={onUpdate}
                  />
                </div>
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

const getBadgeVariant = (status: StockStatus) => {
  switch (status) {
    case "critical":
      return "destructive";
    case "low":
      return "secondary";
    default:
      return "default";
  }
};

const getBadgeLabel = (status: StockStatus) => {
  switch (status) {
    case "critical":
      return "Crítico";
    case "low":
      return "Bajo";
    default:
      return "OK";
  }
};
