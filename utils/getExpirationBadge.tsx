import { Badge } from "@/components/ui/badge";
export const getExpirationBadge = (daysLeft: number) => {
  if (daysLeft < 0) {
    return <Badge className="bg-[#c1121f] text-white">Producto vencido</Badge>;
  }
  if (daysLeft < 1) {
    return <Badge className="bg-red-600 text-white">Vence hoy</Badge>;
  }
  if (daysLeft <= 7)
    return (
      <Badge className="bg-red-600 text-white">Vence en {daysLeft} días</Badge>
    );
  if (daysLeft <= 30)
    return (
      <Badge className="bg-yellow-500 text-white">
        Vence en {daysLeft} días
      </Badge>
    );
  return (
    <Badge className="bg-green-600 text-white">Vence en {daysLeft} días</Badge>
  );
};

export function getExpirationColor(expirationDate: string): string {
  if (!expirationDate) return "text-gray-600"; // color neutro si no hay fecha

  const today = new Date();
  const expiration = new Date(expirationDate);

  const diffTime = expiration.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return "text-red-600"; // vencido
  if (daysLeft <= 7) return "text-orange-500"; // menos de una semana
  if (daysLeft <= 30) return "text-yellow-500"; // menos de un mes
  return "text-green-600"; // seguro
}
