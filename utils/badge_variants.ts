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

export const getStatusBadge = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "activo":
    case "internacion":
      return { text: status, className: "bg-green-100 text-green-800" };
    case "alta":
      return { text: status, className: "bg-blue-100 text-blue-800" };
    case "critico":
      return { text: status, className: "bg-red-100 text-red-800" };
    case "observacion":
      return { text: status, className: "bg-yellow-100 text-yellow-800" };
    default:
      return {
        text: status || "Sin estado",
        className: "bg-gray-100 text-gray-800",
      };
  }
};
