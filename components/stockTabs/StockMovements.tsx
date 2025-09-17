import { useStockMovements } from "@/hooks/tanstack/products/useStockMovements";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const StockMovements = () => {
  const { data: movement } = useStockMovements();

  console.log(movement);
  return (
    <div>
      <Table className="min-w-full table-auto border border-gray-200">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Movimiento</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Stock Final</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {movement?.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="px-4 py-2">
                {row.user?.username ?? "-"}
              </TableCell>
              <TableCell className="px-4 py-2 capitalize">
                {row.reason}
              </TableCell>
              <TableCell className="px-4 py-2">
                {row.product?.name ?? "-"}
              </TableCell>
              <TableCell className="px-4 py-2">
                {new Date(row.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="px-4 py-2">{row.quantity}</TableCell>
              <TableCell className="px-4 py-2">{row.finalStock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockMovements;
