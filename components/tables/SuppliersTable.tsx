import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Supplier } from "@/types/types";
import { Button } from "../ui/button";

interface Props {
  data: Supplier[] | undefined;
  handleDeleteClick: (supplierId: number) => void;
  isPending?: boolean;
}

const SuppliersTable = ({ data, handleDeleteClick, isPending }: Props) => {
  return (
    <Table className="min-w-full table-auto border border-gray-200">
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Costo</TableHead>
          <TableHead>Venta</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-gray-100 bg-white">
        {data?.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell className="px-6 py-4">{supplier.name}</TableCell>
            <TableCell className="px-6 py-4">
              {supplier?.products.join(", ")}
            </TableCell>
            <TableCell className="px-6 py-4">{supplier?.contact}</TableCell>
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
                variant="destructive"
              >
                Eliminar
              </Button>
              <Button
                onClick={() => handleDeleteClick(supplier.id)}
                variant="default"
              >
                Editar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SuppliersTable;
