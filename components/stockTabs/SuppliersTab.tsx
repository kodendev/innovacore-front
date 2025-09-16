// components/Tabs/SuppliersTab.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Delete, Phone, Trash } from "lucide-react";
import { useSuppliers } from "@/hooks/tanstack/useSuppliers";
import Spinner from "../spinners/Spinner";
import { Button } from "../ui/button";
import { useComponentView } from "@/hooks/useComponentView";
import SuppliersTable from "../tables/SuppliersTable";
import { Input } from "@/components/ui/input";

export const SuppliersTab = () => {
  const { data, isLoading } = useSuppliers();

  const handleEditSupplier = (supplierId: number) => {
    console.log(`Edit supplier with ID: ${supplierId}`);
  };

  const handleDeleteSupplier = (supplierId: number) => {
    console.log(`Delete supplier with ID: ${supplierId}`);
  };

  const { componentView, toggleView } = useComponentView();

  return (
    <>
      {data?.length === 0 ? (
        <div className="flex items-center justify-center mt-4 h-[80vh]">
          <p className="text-gray-500 text-xl">
            No hay proveedores disponibles.
          </p>
        </div>
      ) : (
        <div className="flex justify-end items-end w-full mb-4">
          <Input
            onChange={(e) => console.log(e.target.value)}
            value=""
            placeholder="Buscar Proveedor"
          ></Input>
          <div className="flex flex-row items-center gap-1">
            <Button className="bg-green-500" onClick={toggleView}>
              Agregar proveedor
            </Button>
            <Button onClick={toggleView}>Cambiar vista</Button>
          </div>
        </div>
      )}

      {componentView === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading && <Spinner isLoading={isLoading} />}
          {data &&
            data?.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex flex-row justify-between">
                    <CardTitle>{supplier.name}</CardTitle>
                    <Button className="cursor-pointe" variant="destructive">
                      <Trash />
                    </Button>
                  </div>

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
                    <div className="text-sm text-gray-600">
                      {supplier.email}
                    </div>
                    <div className="flex flex-row gap-2">
                      <Button
                        className="p-4 mt-4 bg-green-500"
                        onClick={() => handleEditSupplier(supplier.id)}
                      >
                        Realizar Pedido
                      </Button>
                      <Button
                        className="p-4 mt-4 "
                        variant={"secondary"}
                        onClick={() => handleEditSupplier(supplier.id)}
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
            data={data}
            handleDeleteClick={handleDeleteSupplier}
            isPending={isLoading}
            key={data?.length}
          />
        </div>
      )}
    </>
  );
};
