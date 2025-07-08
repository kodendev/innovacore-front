// components/Tabs/ReportsTab.tsx
import { Ingredient } from "@/types/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  ingredients: Ingredient[];
  lowStockItems: Ingredient[];
  criticalItems: Ingredient[];
}

export const ReportsTab = ({
  ingredients,
  lowStockItems,
  criticalItems,
}: Props) => {
  const upcomingExpiries = [...ingredients]
    .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime())
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Resumen de stock */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <InfoRow
              label="Total ingredientes:"
              value={ingredients.length.toString()}
            />
            <InfoRow
              label="Stock bajo:"
              value={lowStockItems.length.toString()}
              valueClass="text-orange-600"
            />
            <InfoRow
              label="Stock crítico:"
              value={criticalItems.length.toString()}
              valueClass="text-red-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Próximos vencimientos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Vencimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {upcomingExpiries.map((ingredient) => (
              <div key={ingredient.id} className="flex justify-between text-sm">
                <span>{ingredient.name}</span>
                <span>{ingredient.expiry}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className={`font-semibold ${valueClass}`}>{value}</span>
  </div>
);
