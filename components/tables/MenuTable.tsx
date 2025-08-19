import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Menu } from "@/types/types";
import { MenuUpdateDialog } from "../menus/MenuUpdateDialog";

interface Props {
  data: Menu[] | undefined;
  isPending?: boolean;
}
const MenusTable = ({ data, isPending }: Props) => {
  if (isPending) return <p>Cargando menús...</p>;

  return (
    <>
      <Table className="min-w-full table-auto border border-gray-200">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Ingredientes</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>
                {row.menuProducts?.map((p) => p.product.name).join(", ")}
              </TableCell>
              <TableCell>
                <MenuUpdateDialog menu={row} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default MenusTable;
