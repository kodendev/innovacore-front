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
import { Badge } from "../ui/badge";
import { getBadgeLabel, getBadgeVariant } from "@/utils/badge_variants";

interface Props {
  data: Menu[] | undefined;
  isPending?: boolean;
  toggleMenuStatus: (menuId: number) => void;
}
const MenusTable = ({ data, isPending, toggleMenuStatus }: Props) => {
  if (isPending) return <p>Cargando menús...</p>;

  return (
    <>
      <Table className="min-w-full table-auto border border-gray-200">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Ingredientes</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>
                {row.menuProducts
                  ?.slice(0, 2)
                  .map((p) => p.product.name)
                  .join(", ")}
                ({row.quantity})
                {row?.menuProducts && row.menuProducts.length > 3 && (
                  <div className="text-sm text-slate-500">
                    +{row.menuProducts.length - 2} más
                  </div>
                )}
              </TableCell>
              <TableCell>
                {" "}
                <Badge
                  variant={getBadgeVariant(
                    row.active === true ? "Activo" : "Inactivo"
                  )}
                  onClick={() => toggleMenuStatus(row.id)}
                >
                  {getBadgeLabel(row.active === true ? "Activo" : "Inactivo")}
                </Badge>
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
