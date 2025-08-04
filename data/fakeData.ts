import { Ingredient, Supplier } from "@/types/types";

export interface Menu {
  id: number;
  name: string;
  price: number;
  category: string;
  ingredients: { name: string; qty: number; unit: string }[];
  active: boolean;
}

export const mockProducts = [
  {
    id: 1,
    name: "Yogur natural",
    description: "Yogur vencible",
    sale_price: 250,
    cost_price: 100,
    barcode: "123456789",
    active: true,
    stock: 20,
    expirationDate: "2025-08-02", // Muy próximo (rojo)
  },
  {
    id: 2,
    name: "Leche en polvo",
    description: "Producto con vencimiento moderado",
    sale_price: 1500,
    cost_price: 800,
    barcode: "987654321",
    active: true,
    stock: 15,
    expirationDate: "2025-08-20", // Moderado (amarillo)
  },
  {
    id: 3,
    name: "Arroz integral",
    description: "Producto con vencimiento lejano",
    sale_price: 900,
    cost_price: 500,
    barcode: "654321987",
    active: true,
    stock: 40,
    expirationDate: "2025-12-01", // Lejano (verde)
  },
];

export const initialIngredients: Ingredient[] = [
  {
    id: 1,
    name: "Carne",
    quantity: 15,
    unit: "kg",
    minStock: 5,
    expiry: "2024-01-15",
    supplier: "Carnicería Central",
    contact: "+54 11 1234-5678",
    status: "Activo",
  },
  {
    id: 2,
    name: "Papa",
    quantity: 25,
    unit: "kg",
    minStock: 10,
    expiry: "2024-01-20",
    supplier: "Verdulería San Juan",
    contact: "+54 11 2345-6789",
    status: "Activo",
  },
  {
    id: 3,
    name: "Queso",
    quantity: 3,
    unit: "kg",
    minStock: 5,
    expiry: "2024-01-12",
    supplier: "Lácteos del Valle",
    contact: "+54 11 3456-7890",
    status: "Activo",
  },
  {
    id: 4,
    name: "Pollo",
    quantity: 8,
    unit: "kg",
    minStock: 6,
    expiry: "2024-01-18",
    supplier: "Avícola Norte",
    contact: "+54 11 4567-8901",
    status: "Activo",
  },
  {
    id: 5,
    name: "Arroz",
    quantity: 2,
    unit: "kg",
    minStock: 8,
    expiry: "2024-06-01",
    supplier: "Almacén Mayorista",
    contact: "+54 11 5678-9012",
    status: "Activo",
  },
  {
    id: 6,
    name: "Pescado",
    quantity: 1,
    unit: "kg",
    minStock: 3,
    expiry: "2024-01-10",
    supplier: "Pescadería del Puerto",
    contact: "+54 11 6789-0123",
    status: "Activo",
  },
];

export const suppliers: Supplier[] = [
  {
    id: 1,
    name: "Carnicería Central",
    contact: "+54 11 1234-5678",
    email: "ventas@carniceriacentral.com",
    products: ["Carne", "Embutidos"],
    active: true,
    status: "Activo",
  },
  {
    id: 2,
    name: "Verdulería San Juan",
    contact: "+54 11 2345-6789",
    email: "pedidos@verduleriasj.com",
    products: ["Papa", "Verduras", "Frutas"],
    active: true,
    status: "Activo",
  },
  {
    id: 3,
    name: "Lácteos del Valle",
    contact: "+54 11 3456-7890",
    email: "comercial@lacteosv.com",
    products: ["Queso", "Leche", "Yogurt"],
    active: true,
    status: "Activo",
  },
  {
    id: 4,
    name: "Avícola Norte",
    contact: "+54 11 4567-8901",
    email: "ventas@avicolanorte.com",
    products: ["Pollo", "Huevos"],
    active: true,
    status: "Activo",
  },
];

export const availableIngredients = [
  { name: "Carne", unit: "g" },
  { name: "Pollo", unit: "g" },
  { name: "Pescado", unit: "g" },
  { name: "Papa", unit: "g" },
  { name: "Arroz", unit: "g" },
  { name: "Queso", unit: "g" },
  { name: "Verduras", unit: "g" },
  { name: "Lechuga", unit: "g" },
  { name: "Pan", unit: "g" },
  { name: "Huevo", unit: "u" },
  { name: "Limón", unit: "g" },
];

export const initialMenus = [
  {
    id: 1,
    name: "Pastel de Papa",
    price: 850,
    category: "Principal",
    ingredients: [
      { name: "Carne", qty: 300, unit: "g" },
      { name: "Papa", qty: 200, unit: "g" },
      { name: "Queso", qty: 50, unit: "g" },
    ],
    active: true,
  },
  {
    id: 2,
    name: "Pollo Grillado",
    price: 750,
    category: "Principal",
    ingredients: [
      { name: "Pollo", qty: 250, unit: "g" },
      { name: "Arroz", qty: 150, unit: "g" },
      { name: "Verduras", qty: 100, unit: "g" },
    ],
    active: true,
  },
  {
    id: 3,
    name: "Pescado al Horno",
    price: 950,
    category: "Principal",
    ingredients: [
      { name: "Pescado", qty: 200, unit: "g" },
      { name: "Papa", qty: 150, unit: "g" },
      { name: "Limón", qty: 20, unit: "g" },
    ],
    active: true,
  },
  {
    id: 4,
    name: "Ensalada César",
    price: 650,
    category: "Ensalada",
    ingredients: [
      { name: "Lechuga", qty: 100, unit: "g" },
      { name: "Pollo", qty: 150, unit: "g" },
      { name: "Queso", qty: 30, unit: "g" },
    ],
    active: true,
  },
];
