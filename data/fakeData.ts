import { Ingredient, Supplier } from "@/types/types";

export const suppliers: Supplier[] = [
  {
    id: 1,
    name: "Carnicería Central",
    contact: "+54 11 1234-5678",
    email: "ventas@carniceriacentral.com",
    products: ["Carne", "Embutidos"],
  },
  {
    id: 2,
    name: "Verdulería San Juan",
    contact: "+54 11 2345-6789",
    email: "pedidos@verduleriasj.com",
    products: ["Papa", "Verduras", "Frutas"],
  },
  {
    id: 3,
    name: "Lácteos del Valle",
    contact: "+54 11 3456-7890",
    email: "comercial@lacteosv.com",
    products: ["Queso", "Leche", "Yogurt"],
  },
  {
    id: 4,
    name: "Avícola Norte",
    contact: "+54 11 4567-8901",
    email: "ventas@avicolanorte.com",
    products: ["Pollo", "Huevos"],
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
