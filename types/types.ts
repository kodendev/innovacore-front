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
  barcode?: string;
  active: boolean;
  stock: number;
  expirationDate?: string;
  minStock?: number;
  isStockMin?: boolean;
  categoryId: number;
}

export type StockStatus = "Activo" | "Inactivo";

export interface Supplier {
  id: number;
  name: string;
  products: string[];
  contact: string;
  email: string;
  active: boolean;
  status: StockStatus;
}

// Tipado de menu individual
// Tipo para el producto dentro del menú (con relación al menú)
export type MenuProduct = {
  id: number;
  quantity: number;
  menuId: number;
  product: Product;
  productId: number;
  createdAt: string;
  updatedAt: string;
};
//Tipado de menu
export type Menu = {
  id: number;
  quantity: number;
  name: string;
  description: string;
  menuProducts?: MenuProduct[];
  active: boolean;
  menuTypeId: number;
};

//Tipado de tipo de menu

export type MenuType = {
  id: number;
  name: string;
};

//Creacion de menus

type MenuProductPayload = {
  productId: number;
  quantity: number;
};

export type CreateMenuPayload = {
  quantity: number;
  name: string;
  description: string;
  menuTypeId: number;
  menuProducts: MenuProductPayload[];
};

export type CreateMenu = {
  id: number;
  quantity: number;
  name: string;
  description: string;
  menuTypeId: number;
  menuProducts: MenuProductPayload[];
  // puedes agregar más campos si los tienes
};

/**Login types */
export type userTypes = {
  id: number;
  name: string;
  users: [];
  description: string;
};

export interface CreateUserTypes {
  username: string;
  password: string;
  partnerId: number;
  userTypeId: number;
  active: boolean;
  email: string;
}

export interface LoginUserTypes {
  email: string;
  password: string;
}

export type LoginResponse = {
  access_token: string;
};

/**
 * Categorias de productos
 */

export interface Category {
  id: number;
  name: string;
}

export interface CreateCategoryDto {
  name: string;
}

/**
 * Movimientos de stock
 */
export interface InventoryMovementResponse {
  id: number;
  product: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    username: string;
  };
  quantity: number; // cantidad movida (+ ingreso, - egreso)
  finalStock: number; // stock resultante después del movimiento
  reason?: string; // motivo del movimiento
  createdAt: string; // fecha del movimiento
}
