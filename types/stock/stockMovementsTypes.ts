export interface PurchaseProduct {
  productId: number;
  quantity: number;
}

export interface PurchaseRequest {
  userId: number;
  products: PurchaseProduct[];
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  data?: any; // lo podés tipar más fuerte cuando tengas la respuesta del backend
}
