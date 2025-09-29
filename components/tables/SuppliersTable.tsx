import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Supplier } from "@/types/suppliers/supplierTypes";

interface Props {
  data: Supplier[] | undefined;
  handleDeleteClick: (supplier: Supplier) => void;
  isPending?: boolean;
}

const SuppliersTable = ({ data, handleDeleteClick, isPending }: Props) => {
  return (
    <Table className="min-w-full table-auto border border-gray-200">
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-gray-100 bg-white">
        {data?.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell className="px-6 py-4">{supplier.name}</TableCell>
            <TableCell className="px-6 py-4">
              {supplier?.supplierProducts
                .map((sp) => sp.product.name)
                .join(", ")}
            </TableCell>
            <TableCell className="px-6 py-4">{supplier?.phone}</TableCell>
            <TableCell className="px-6 py-4">{supplier?.email}</TableCell>

            {/* <TableCell className="px-6 py-4">
              <Badge
                variant={getBadgeVariant(
                  supplier.active ? "Activo" : "Inactivo"
                )}
              >
                {getBadgeLabel(supplier.active ? "Activo" : "Inactivo")}
              </Badge>
            </TableCell> */}
            <TableCell className="px-6 py-4 space-x-2">
              <Button
                onClick={() => handleDeleteClick(supplier.id)}
                variant="secondary"
              >
                Editar
              </Button>
              <Button
                onClick={() => handleDeleteClick(supplier.id)}
                className="bg-green-500"
              >
                Realizar Pedido
              </Button>
              <Button
                onClick={() => handleDeleteClick(supplier)}
                variant={"destructive"}
              >
                <Trash />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SuppliersTable;
