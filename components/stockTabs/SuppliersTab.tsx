// components/Tabs/SuppliersTab.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Phone } from "lucide-react";
import { useSuppliers } from "@/hooks/tanstack/useSuppliers";
import Spinner from "../spinners/Spinner";

export const SuppliersTab = () => {
  const { data, isLoading } = useSuppliers();

  console.log(data);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {isLoading && <Spinner isLoading={isLoading} />}
      {data &&
        data?.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader>
              <CardTitle>{supplier.name}</CardTitle>
              <CardDescription>
                Productos: {supplier?.products.join(", ")}
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
