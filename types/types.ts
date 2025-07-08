export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minStock: number;
  expiry: string; // o Date si lo parseás
  supplier: string;
  contact: string;
  status: StockStatus;
}

export type StockStatus = "ok" | "low" | "critical";

export interface Supplier {
  id: number;
  name: string;
  products: string[];
  contact: string;
  email: string;
}
