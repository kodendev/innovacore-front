import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types/types";
import { Badge } from "@/components/ui/badge";

import { StockUpdateDialog } from "../forms/UpdateStockElement";
import { Button } from "../ui/button";
import { getBadgeLabel, getBadgeVariant } from "@/utils/badge_variants";
import { getExpirationColor } from "@/utils/getExpirationBadge";

interface Props {
  data: Product[] | undefined;
  handleDeleteClick: (ingredient: Product) => void;
  isPending?: boolean;
}

const ProductsTable = ({ data, handleDeleteClick, isPending }: Props) => {
  return (
    <>
      <Table className="min-w-full table-auto border border-gray-200">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Costo</TableHead>
            <TableHead>Venta</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100 bg-white">
          {data?.map((ingredient) => (
            <TableRow key={ingredient.id}>
              <TableCell className="px-6 py-4">{ingredient.name}</TableCell>
              <TableCell className="px-6 py-4">{ingredient.stock} kg</TableCell>
              <TableCell className="px-6 py-4">
                {ingredient.cost_price}
              </TableCell>
              <TableCell className="px-6 py-4">
                {ingredient.sale_price}
              </TableCell>
              <TableCell className="px-6 py-4">
                <Badge
                  variant={getBadgeVariant(
                    ingredient.active ? "Activo" : "Inactivo"
                  )}
                >
                  {getBadgeLabel(ingredient.active ? "Activo" : "Inactivo")}
                </Badge>
              </TableCell>
              <TableCell
                className={getExpirationColor(ingredient.expirationDate!)}
              >
                {ingredient.expirationDate}
              </TableCell>
              <TableCell className="px-6 py-4 space-x-2">
                <StockUpdateDialog product={ingredient} />
                <Button
                  onClick={() => handleDeleteClick(ingredient)}
                  disabled={isPending}
                  variant="destructive"
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ProductsTable;
