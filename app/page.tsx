"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Bed,
  User,
} from "lucide-react";
import Link from "next/link";

import { IoFastFood } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, login, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema Cocina Sanatorio
              </h1>
            </div>

            <div className="flex flex-row items-center gap-4">
              <span className="text-sm flex flex-row items-center justify-center gap-4 text-gray-500 ">
                Bienvenido, {user?.username}
              </span>

              <Button variant="destructive" onClick={handleLogout}>
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pacientes Activos
                </CardTitle>
                <Bed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 desde ayer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas Hoy
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground">+15% vs ayer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Items Stock Bajo
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">5</div>
                <p className="text-xs text-muted-foreground">
                  Requieren reposición
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Menús Servidos
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">Hoy</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Modules */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bed className="h-5 w-5 text-blue-500" />
                  Gestión de Camas
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Asignar menús a pacientes internados por habitación y cama
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col flex-1">
                <div className="space-y-2 mb-6 flex-1">
                  <div className="text-sm text-gray-600">
                    • Asignación de menús por habitación/cama
                  </div>
                  <div className="text-sm text-gray-600">
                    • Control de dietas especiales
                  </div>
                  <div className="text-sm text-gray-600">
                    • Historial de comidas servidas
                  </div>
                </div>
                <Link href="/camas" className="mt-auto">
                  <Button className="w-full">Gestionar Camas</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-green-500" />
                  Stock e Inventario
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Control de ingredientes, stock y proveedores
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col flex-1">
                <div className="space-y-2 mb-6 flex-1">
                  <div className="text-sm text-gray-600">
                    • Gestión de ingredientes y cantidades
                  </div>
                  <div className="text-sm text-gray-600">
                    • Control de vencimientos
                  </div>
                  <div className="text-sm text-gray-600">
                    • Gestión de proveedores
                  </div>
                </div>
                <Link href="/inventario" className="mt-auto">
                  <Button className="w-full">Ver Inventario</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="h-5 w-5 text-purple-500" />
                  Punto de Venta
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Ventas a empleados y visitantes del sanatorio
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col flex-1">
                <div className="space-y-2 mb-6 flex-1">
                  <div className="text-sm text-gray-600">
                    • Crear órdenes de menús
                  </div>
                  <div className="text-sm text-gray-600">• Procesar pagos</div>
                  <div className="text-sm text-gray-600">
                    • Historial de ventas
                  </div>
                </div>
                <Link href="/punto-venta" className="mt-auto">
                  <Button className="w-full">Abrir POS</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IoFastFood size={24} className="text-red-500" />
                  Gestión de menús
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Creación y visualización de menús del día
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col flex-1">
                <div className="space-y-2 mb-6 flex-1">
                  <div className="text-sm text-gray-600">
                    • Crear nuevos menús
                  </div>
                  <div className="text-sm text-gray-600">
                    • Editar existentes
                  </div>
                  <div className="text-sm text-gray-600">
                    • Visualización y filtros
                  </div>
                </div>
                <Link href="/menus" className="mt-auto">
                  <Button className="w-full">Ver menús</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>
                  Tareas frecuentes del día a día
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/menus">
                    <Button variant="outline" className="w-full">
                      Gestionar Menús
                    </Button>
                  </Link>
                  <Link href="/reportes">
                    <Button variant="outline" className="w-full">
                      Ver Reportes
                    </Button>
                  </Link>
                  <Link href="/proveedores">
                    <Button variant="outline" className="w-full">
                      Proveedores
                    </Button>
                  </Link>
                  <Link href="/configuracion">
                    <Button variant="outline" className="w-full">
                      Configuración
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
