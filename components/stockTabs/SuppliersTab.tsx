// components/Tabs/SuppliersTab.tsx
import { Supplier } from "@/types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Phone } from "lucide-react";

interface Props {
  suppliers: Supplier[];
}

export const SuppliersTab = ({ suppliers }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {suppliers.map((supplier) => (
        <Card key={supplier.id}>
          <CardHeader>
            <CardTitle>{supplier.name}</CardTitle>
            <CardDescription>
              Productos: {supplier.products.join(", ")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{supplier.contact}</span>
              </div>
              <div className="text-sm text-gray-600">{supplier.email}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
