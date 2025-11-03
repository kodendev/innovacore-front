"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShoppingCart,
  Plus,
  Minus,
  CreditCard,
  DollarSign,
  ArrowLeft,
  Receipt,
} from "lucide-react";
import Link from "next/link";

const menus = [
  {
    id: 1,
    name: "Pastel de Papa",
    price: 850,
    ingredients: [
      { name: "Carne", qty: 300 },
      { name: "Papa", qty: 200 },
      { name: "Queso", qty: 50 },
    ],
  },
  {
    id: 2,
    name: "Pollo Grillado",
    price: 750,
    ingredients: [
      { name: "Pollo", qty: 250 },
      { name: "Arroz", qty: 150 },
      { name: "Verduras", qty: 100 },
    ],
  },
  {
    id: 3,
    name: "Pescado al Horno",
    price: 950,
    ingredients: [
      { name: "Pescado", qty: 200 },
      { name: "Papa", qty: 150 },
      { name: "Limón", qty: 20 },
    ],
  },
  {
    id: 4,
    name: "Ensalada César",
    price: 650,
    ingredients: [
      { name: "Lechuga", qty: 100 },
      { name: "Pollo", qty: 150 },
      { name: "Queso", qty: 30 },
    ],
  },
  {
    id: 5,
    name: "Milanesa",
    price: 800,
    ingredients: [
      { name: "Carne", qty: 200 },
      { name: "Pan rallado", qty: 50 },
      { name: "Huevo", qty: 1 },
    ],
  },
  {
    id: 6,
    name: "Empanadas (x6)",
    price: 600,
    ingredients: [
      { name: "Carne", qty: 150 },
      { name: "Masa", qty: 200 },
    ],
  },
  {
    id: 7,
    name: "Sopa del Día",
    price: 450,
    ingredients: [
      { name: "Verduras", qty: 200 },
      { name: "Caldo", qty: 300 },
    ],
  },
  {
    id: 8,
    name: "Sandwich Completo",
    price: 550,
    ingredients: [
      { name: "Pan", qty: 100 },
      { name: "Jamón", qty: 50 },
      { name: "Queso", qty: 30 },
    ],
  },
];

const bebidas = [
  {
    id: 101,
    name: "Agua Mineral",
    price: 200,
    type: "bebida",
  },
  {
    id: 102,
    name: "Gaseosa 500ml",
    price: 350,
    type: "bebida",
  },
  {
    id: 103,
    name: "Jugo Natural",
    price: 400,
    type: "bebida",
  },
  {
    id: 104,
    name: "Café",
    price: 250,
    type: "bebida",
  },
  {
    id: 105,
    name: "Té",
    price: 200,
    type: "bebida",
  },
  {
    id: 106,
    name: "Cerveza",
    price: 500,
    type: "bebida",
  },
  {
    id: 107,
    name: "Agua Saborizada",
    price: 280,
    type: "bebida",
  },
];

const initialSales = [
  {
    id: 1,
    items: [{ menu: "Pastel de Papa", qty: 2, price: 850 }],
    total: 1700,
    paymentMethod: "Efectivo",
    time: "12:30",
    customer: "Empleado",
  },
  {
    id: 2,
    items: [
      { menu: "Pollo Grillado", qty: 1, price: 750 },
      { menu: "Ensalada César", qty: 1, price: 650 },
    ],
    total: 1400,
    paymentMethod: "Tarjeta",
    time: "12:45",
    customer: "Visitante",
  },
  {
    id: 3,
    items: [{ menu: "Empanadas (x6)", qty: 3, price: 600 }],
    total: 1800,
    paymentMethod: "Efectivo",
    time: "13:15",
    customer: "Empleado",
  },
  {
    id: 4,
    items: [
      { menu: "Milanesa", qty: 1, price: 800 },
      { menu: "Sopa del Día", qty: 2, price: 450 },
    ],
    total: 1700,
    paymentMethod: "Transferencia",
    time: "13:30",
    customer: "Proveedor",
  },
  {
    id: 5,
    items: [
      { menu: "Sandwich Completo", qty: 4, price: 550 },
      { menu: "Gaseosa 500ml", qty: 4, price: 350 },
    ],
    total: 3600,
    paymentMethod: "Tarjeta",
    time: "14:00",
    customer: "Visitante",
  },
];

export default function PuntoVentaPage() {
  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState(initialSales);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedBebidaId, setSelectedBebidaId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const addToCart = (itemId, type = "menu") => {
    const item =
      type === "bebida"
        ? bebidas.find((b) => b.id === Number.parseInt(itemId))
        : menus.find((m) => m.id === Number.parseInt(itemId));

    if (!item) return;

    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    if (type === "bebida") {
      setSelectedBebidaId("");
    } else {
      setSelectedMenuId("");
    }
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== itemId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalSales = () => {
    return sales.reduce((total, sale) => total + sale.total, 0);
  };

  const processPayment = () => {
    if (!paymentMethod || !customerType) return;

    const newSale = {
      id: sales.length + 1,
      items: cart.map((item) => ({
        menu: item.name,
        qty: item.quantity,
        price: item.price,
      })),
      total: getCartTotal(),
      paymentMethod,
      time: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      customer: customerType,
    };

    setSales((prev) => [newSale, ...prev]);
    clearCart();
    setPaymentMethod("");
    setCustomerType("");
    setIsCheckoutOpen(false);

    // Aquí se actualizaría el stock automáticamente
    console.log("Actualizando stock por venta:", newSale);
  };

  const todaySales = getTotalSales();
  const todayOrders = sales.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Punto de Venta
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Ventas Hoy</div>
                <div className="text-lg font-semibold">
                  ${todaySales.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Órdenes</div>
                <div className="text-lg font-semibold">{todayOrders}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Add Items Section */}
            <div className="xl:col-span-1 space-y-6">
              {/* Menús */}
              <Card>
                <CardHeader>
                  <CardTitle>Agregar Menú</CardTitle>
                  <CardDescription>
                    Seleccione un menú para agregar al pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="menu-select">Seleccionar Menú</Label>
                    <Select
                      value={selectedMenuId}
                      onValueChange={setSelectedMenuId}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Elegir menú..." />
                      </SelectTrigger>
                      <SelectContent>
                        {menus.map((menu) => (
                          <SelectItem key={menu.id} value={menu.id.toString()}>
                            <div className="flex justify-between items-center w-full">
                              <span>{menu.name}</span>
                              <span className="ml-4 font-semibold">
                                ${menu.price}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => addToCart(selectedMenuId, "menu")}
                    disabled={!selectedMenuId}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Menú
                  </Button>

                  {selectedMenuId && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Ingredientes:</h4>
                      <div className="text-sm text-gray-600">
                        {menus
                          .find((m) => m.id === Number.parseInt(selectedMenuId))
                          ?.ingredients.map(
                            (ing) =>
                              `${ing.name} (${ing.qty}${
                                typeof ing.qty === "number" && ing.qty < 10
                                  ? "u"
                                  : "g"
                              })`
                          )
                          .join(", ")}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bebidas */}
              <Card>
                <CardHeader>
                  <CardTitle>Agregar Bebida</CardTitle>
                  <CardDescription>
                    Seleccione una bebida para agregar al pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bebida-select">Seleccionar Bebida</Label>
                    <Select
                      value={selectedBebidaId}
                      onValueChange={setSelectedBebidaId}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Elegir bebida..." />
                      </SelectTrigger>
                      <SelectContent>
                        {bebidas.map((bebida) => (
                          <SelectItem
                            key={bebida.id}
                            value={bebida.id.toString()}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span>{bebida.name}</span>
                              <span className="ml-4 font-semibold">
                                ${bebida.price}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => addToCart(selectedBebidaId, "bebida")}
                    disabled={!selectedBebidaId}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Bebida
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Cart */}
            <div className="xl:col-span-2">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Pedido Actual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No hay items en el pedido
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                              {item.name}
                              {item.type === "bebida" && (
                                <Badge variant="outline" className="text-xs">
                                  Bebida
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              ${item.price} c/u
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                addToCart(
                                  item.id.toString(),
                                  item.type || "menu"
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="ml-4 font-semibold">
                            ${(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Total:</span>
                          <span>${getCartTotal().toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={clearCart}
                          className="flex-1"
                        >
                          Limpiar Pedido
                        </Button>

                        <Dialog
                          open={isCheckoutOpen}
                          onOpenChange={setIsCheckoutOpen}
                        >
                          <DialogTrigger asChild>
                            <Button className="flex-1">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Procesar Pago
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Procesar Pago</DialogTitle>
                              <DialogDescription>
                                Total a cobrar: $
                                {getCartTotal().toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Tipo de Cliente</Label>
                                <Select
                                  value={customerType}
                                  onValueChange={setCustomerType}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione tipo de cliente" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Empleado">
                                      Empleado
                                    </SelectItem>
                                    <SelectItem value="Visitante">
                                      Visitante
                                    </SelectItem>
                                    <SelectItem value="Proveedor">
                                      Proveedor
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label>Método de Pago</Label>
                                <Select
                                  value={paymentMethod}
                                  onValueChange={setPaymentMethod}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione método de pago" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Efectivo">
                                      Efectivo
                                    </SelectItem>
                                    <SelectItem value="Tarjeta">
                                      Tarjeta de Débito/Crédito
                                    </SelectItem>
                                    <SelectItem value="Transferencia">
                                      Transferencia
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <Button
                                onClick={processPayment}
                                className="w-full"
                                disabled={!paymentMethod || !customerType}
                              >
                                <DollarSign className="h-4 w-4 mr-2" />
                                Confirmar Pago
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sales History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Historial de Ventas - Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">Venta #{sale.id}</div>
                        <div className="text-sm text-gray-600">
                          {sale.time} - {sale.customer}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${sale.total.toLocaleString()}
                        </div>
                        <Badge variant="outline">{sale.paymentMethod}</Badge>
                      </div>
                    </div>
                    <div className="text-sm">
                      {sale.items.map((item, index) => (
                        <span key={index}>
                          {item.menu} x{item.qty}
                          {index < sale.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Total de todas las ventas */}
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                    <div>
                      <div className="font-semibold text-lg">Total del Día</div>
                      <div className="text-sm text-gray-600">
                        {sales.length} ventas realizadas
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ${todaySales.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Ingresos totales
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
