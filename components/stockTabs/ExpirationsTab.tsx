import { format, differenceInDays, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "@/hooks/tanstack/products/useProducts";
import { mockProducts } from "@/data/fakeData";
import { Badge } from "@/components/ui/badge"; // si usas shadcn/ui o similar
import { getExpirationBadge } from "@/utils/getExpirationBadge";

export function ExpirationsTab() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) return <p>Cargando productos...</p>;

  // Ordenar productos por vencimiento
  const sortedProducts = [...(products || [])].sort((a, b) => {
    const dateA = new Date(a.expirationDate || "").getTime();
    const dateB = new Date(b.expirationDate || "").getTime();
    return dateA - dateB;
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Vencimientos de productos</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Fecha de vencimiento</TableHead>
            <TableHead>Stock actual</TableHead>
            <TableHead>Días restantes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts?.map((product) => {
            const expiration = parseISO(product.expirationDate || "");
            const daysLeft = differenceInDays(expiration, new Date());

            return (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{format(expiration, "dd/MM/yyyy")}</TableCell>
                <TableCell>{product.stock} Kg</TableCell>
                <TableCell>{getExpirationBadge(daysLeft)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
