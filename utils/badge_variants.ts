import { StockStatus } from "@/types/types";

export const getBadgeVariant = (status: StockStatus) => {
  switch (status) {
    case "Inactivo":
      return "destructive";
    case "Activo":
      return "green";
    default:
      return "default";
  }
};

export function getBadgeLabel(status: string): string {
  if (status === "Activo") return "Activo";
  if (status === "Inactivo") return "Inactivo";
  return "Ok";
}
