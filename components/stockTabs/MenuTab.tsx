"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed } from "lucide-react";

const mockMenus = [
  {
    id: 1,
    name: "Pollo con papas",
    description: "Pollo con salsa de verdeo y pure de papas",
    type: "Almuerzo",
    products: ["pollo", "papas", "verdeo"],
  },
  {
    id: 2,
    name: "Milanesa con ensalada",
    description: "Milanesa de carne con ensalada mixta",
    type: "Almuerzo",
    products: ["Carne", "Pan rallado", "Tomate", "Lechuga", "Cebolla"],
  },
];

const MenuTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {mockMenus.map((menu) => (
        <Card key={menu.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5" />
                {menu.name}
              </span>
              <Badge variant="outline">{menu.type}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>{menu.description}</p>
            <div>
              <span className="font-medium">Productos incluidos:</span>
              <ul className="list-disc list-inside pl-2">
                {menu.products.map((product, index) => (
                  <li key={index}>{product}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenuTab;
