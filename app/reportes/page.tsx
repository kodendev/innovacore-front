"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, Package, DollarSign, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

const salesData = [
  { day: "Lun", ventas: 12450, ordenes: 45 },
  { day: "Mar", ventas: 15200, ordenes: 52 },
  { day: "Mie", ventas: 11800, ordenes: 41 },
  { day: "Jue", ventas: 14600, ordenes: 48 },
  { day: "Vie", ventas: 16800, ordenes: 58 },
  { day: "Sab", ventas: 9200, ordenes: 32 },
  { day: "Dom", ventas: 8500, ordenes: 28 },
]

const menuPopularity = [
  { name: "Pastel de Papa", value: 25, color: "#8884d8" },
  { name: "Pollo Grillado", value: 20, color: "#82ca9d" },
  { name: "Milanesa", value: 18, color: "#ffc658" },
  { name: "Pescado al Horno", value: 15, color: "#ff7300" },
  { name: "Ensalada César", value: 12, color: "#00ff00" },
  { name: "Otros", value: 10, color: "#ff0000" },
]

const stockMovement = [
  { ingredient: "Carne", consumo: 15.2, reposicion: 20 },
  { ingredient: "Papa", consumo: 12.8, reposicion: 15 },
  { ingredient: "Pollo", consumo: 18.5, reposicion: 25 },
  { ingredient: "Queso", consumo: 8.3, reposicion: 10 },
  { ingredient: "Arroz", consumo: 6.7, reposicion: 8 },
]

export default function ReportesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Reportes
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas Semana</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$88,550</div>
                <p className="text-xs text-muted-foreground">+12% vs semana anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Órdenes Totales</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">304</div>
                <p className="text-xs text-muted-foreground">+8% vs semana anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$291</div>
                <p className="text-xs text-muted-foreground">+3% vs semana anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rotación Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Eficiencia semanal</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="ventas" className="space-y-6">
            <TabsList>
              <TabsTrigger value="ventas">Ventas</TabsTrigger>
              <TabsTrigger value="menus">Menús</TabsTrigger>
              <TabsTrigger value="inventario">Inventario</TabsTrigger>
              <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
            </TabsList>

            <TabsContent value="ventas">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ventas por Día</CardTitle>
                    <CardDescription>Últimos 7 días</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]} />
                        <Bar dataKey="ventas" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Órdenes por Día</CardTitle>
                    <CardDescription>Cantidad de órdenes procesadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="ordenes" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="menus">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Popularidad de Menús</CardTitle>
                    <CardDescription>Distribución de ventas por menú</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={menuPopularity}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {menuPopularity.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Menús</CardTitle>
                    <CardDescription>Menús más vendidos esta semana</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {menuPopularity.slice(0, 5).map((menu, index) => (
                        <div key={menu.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: menu.color }}></div>
                            <span className="font-medium">{menu.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{menu.value}%</div>
                            <div className="text-sm text-gray-500">#{index + 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventario">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Movimiento de Stock</CardTitle>
                    <CardDescription>Consumo vs Reposición (kg/semana)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={stockMovement}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ingredient" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="consumo" fill="#ff7300" name="Consumo" />
                        <Bar dataKey="reposicion" fill="#82ca9d" name="Reposición" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Eficiencia de Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">92%</div>
                      <p className="text-sm text-gray-600">Aprovechamiento de ingredientes</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Desperdicio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-600">3.2kg</div>
                      <p className="text-sm text-gray-600">Esta semana</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Costo Promedio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">$185</div>
                      <p className="text-sm text-gray-600">Por menú servido</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pacientes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ocupación de Camas</CardTitle>
                    <CardDescription>Estado actual del sanatorio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Habitación 101</span>
                        <div className="flex gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Habitación 102</span>
                        <div className="flex gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Habitación 103</span>
                        <div className="flex gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex justify-between">
                          <span>Ocupación Total:</span>
                          <span className="font-semibold">83% (5/6 camas)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Menús Servidos a Pacientes</CardTitle>
                    <CardDescription>Hoy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Desayuno</span>
                        <span className="font-semibold">5/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Almuerzo</span>
                        <span className="font-semibold">4/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Merienda</span>
                        <span className="font-semibold">5/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cena</span>
                        <span className="font-semibold text-orange-600">0/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
