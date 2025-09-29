import { Product } from "../types";

export interface SupplierProduct {
  id: number;
  costPrice: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  supplierProducts: SupplierProduct[];
}
