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

export function ExpirationsTab() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) return <p>Cargando productos...</p>;

  // Ordenar productos por vencimiento
  const sortedProducts = [...mockProducts].sort((a, b) => {
    const dateA = new Date(a.expirationDate || "").getTime();
    const dateB = new Date(b.expirationDate || "").getTime();
    return dateA - dateB;
  });
  const getColor = (daysLeft: number) => {
    if (daysLeft <= 7) return "text-red-600";
    if (daysLeft <= 30) return "text-yellow-500";
    return "text-green-600";
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
          {sortedProducts.map((product) => {
            const expiration = parseISO(product.expirationDate || "");
            const daysLeft = differenceInDays(expiration, new Date());

            return (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{format(expiration, "dd/MM/yyyy")}</TableCell>
                <TableCell>{product.stock} Kg</TableCell>
                <TableCell className={`font-bold ${getColor(daysLeft)}`}>
                  {daysLeft} días
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
