import { Package } from "lucide-react";
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

export interface Product {
  id?: number | undefined;
  name: string;
  description: string;
  sale_price: number;
  cost_price: number;
  barcode: string;
  active: boolean;
  stock: number;
}

export type StockStatus = "Activo" | "Inactivo";

export interface Supplier {
  id: number;
  name: string;
  products: string[];
  contact: string;
  email: string;
}

// Tipado de menu individual
export interface Menu {
  id: number;
  name: string;
  price: number;
  category: string;
  ingredients: Ingredient[];
  active: boolean;
}
