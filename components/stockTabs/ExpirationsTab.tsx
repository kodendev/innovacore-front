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
import { Badge } from "../ui/badge";

export function ExpirationsTab() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) return <p>Cargando productos...</p>;

  // Ordenar productos por vencimiento
  const sortedProducts = [...(products || [])].sort((a, b) => {
    const dateA = new Date(a.expirationDate || "").getTime();
    const dateB = new Date(b.expirationDate || "").getTime();
    return dateA - dateB;
  });

  const getExpirationBadge = (daysLeft: number) => {
    if (daysLeft < 0) {
      return (
        <Badge className="bg-[#c1121f] text-white">Producto vencido</Badge>
      );
    }
    if (daysLeft < 1) {
      return <Badge className="bg-red-600 text-white">Vence hoy</Badge>;
    }
    if (daysLeft <= 7)
      return (
        <Badge className="bg-red-600 text-white">
          Vence en {daysLeft} días
        </Badge>
      );
    if (daysLeft <= 30)
      return (
        <Badge className="bg-yellow-500 text-white">
          Vence en {daysLeft} días
        </Badge>
      );
    return (
      <Badge className="bg-green-600 text-white">
        Vence en {daysLeft} días
      </Badge>
    );
  };

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
