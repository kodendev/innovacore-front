"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, AlertTriangle, Plus, ArrowLeft, Calendar, Phone } from "lucide-react"
import Link from "next/link"

const initialIngredients = [
  {
    id: 1,
    name: "Carne",
    quantity: 15,
    unit: "kg",
    minStock: 5,
    expiry: "2024-01-15",
    supplier: "Carnicería Central",
    contact: "+54 11 1234-5678",
    status: "ok",
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
    status: "ok",
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
    status: "low",
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
    status: "ok",
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
    status: "low",
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
    status: "critical",
  },
]

const suppliers = [
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
]

export default function InventarioPage() {
  const [ingredients, setIngredients] = useState(initialIngredients)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const addIngredient = (newIngredient) => {
    const id = Math.max(...ingredients.map((i) => i.id)) + 1
    const status =
      newIngredient.quantity <= newIngredient.minStock
        ? newIngredient.quantity <= newIngredient.minStock * 0.5
          ? "critical"
          : "low"
        : "ok"

    setIngredients((prev) => [...prev, { ...newIngredient, id, status }])
    setIsAddDialogOpen(false)
  }

  const updateStock = (id, newQuantity) => {
    setIngredients((prev) =>
      prev.map((ingredient) => {
        if (ingredient.id === id) {
          const status =
            newQuantity <= ingredient.minStock ? (newQuantity <= ingredient.minStock * 0.5 ? "critical" : "low") : "ok"
          return { ...ingredient, quantity: newQuantity, status }
        }
        return ingredient
      }),
    )
  }

  const lowStockItems = ingredients.filter((i) => i.status === "low" || i.status === "critical")
  const criticalItems = ingredients.filter((i) => i.status === "critical")

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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Stock e Inventario</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Ingrediente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Ingrediente</DialogTitle>
                  <DialogDescription>Ingrese los datos del nuevo ingrediente</DialogDescription>
                </DialogHeader>
                <AddIngredientForm onAdd={addIngredient} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Alerts */}
          {criticalItems.length > 0 && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Stock Crítico
                </CardTitle>
                <CardDescription className="text-red-600">
                  Los siguientes ingredientes requieren reposición urgente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {criticalItems.map((item) => (
                    <Badge key={item.id} variant="destructive">
                      {item.name}: {item.quantity}
                      {item.unit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList>
              <TabsTrigger value="inventory">Inventario</TabsTrigger>
              <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
              <TabsTrigger value="reports">Reportes</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {ingredients.map((ingredient) => (
                  <Card key={ingredient.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          {ingredient.name}
                        </span>
                        <Badge
                          variant={
                            ingredient.status === "critical"
                              ? "destructive"
                              : ingredient.status === "low"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {ingredient.status === "critical" ? "Crítico" : ingredient.status === "low" ? "Bajo" : "OK"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Stock actual:</span>
                          <span className="font-semibold text-lg">
                            {ingredient.quantity} {ingredient.unit}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Stock mínimo:</span>
                          <span className="text-sm">
                            {ingredient.minStock} {ingredient.unit}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Vence: {ingredient.expiry}</span>
                        </div>

                        <div className="text-sm">
                          <div className="font-medium">{ingredient.supplier}</div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="h-3 w-3" />
                            {ingredient.contact}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <StockUpdateDialog ingredient={ingredient} onUpdate={updateStock} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="suppliers">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suppliers.map((supplier) => (
                  <Card key={supplier.id}>
                    <CardHeader>
                      <CardTitle>{supplier.name}</CardTitle>
                      <CardDescription>Productos: {supplier.products.join(", ")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{supplier.contact}</span>
                        </div>
                        <div className="text-sm text-gray-600">{supplier.email}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen de Stock</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total ingredientes:</span>
                        <span className="font-semibold">{ingredients.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stock bajo:</span>
                        <span className="font-semibold text-orange-600">{lowStockItems.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stock crítico:</span>
                        <span className="font-semibold text-red-600">{criticalItems.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Vencimientos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {ingredients
                        .sort((a, b) => new Date(a.expiry) - new Date(b.expiry))
                        .slice(0, 5)
                        .map((ingredient) => (
                          <div key={ingredient.id} className="flex justify-between text-sm">
                            <span>{ingredient.name}</span>
                            <span>{ingredient.expiry}</span>
                          </div>
                        ))}
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

function AddIngredientForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    minStock: "",
    expiry: "",
    supplier: "",
    contact: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({
      ...formData,
      quantity: Number.parseFloat(formData.quantity),
      minStock: Number.parseFloat(formData.minStock),
    })
    setFormData({
      name: "",
      quantity: "",
      unit: "kg",
      minStock: "",
      expiry: "",
      supplier: "",
      contact: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Ingrediente</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            id="quantity"
            type="number"
            step="0.1"
            value={formData.quantity}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="unit">Unidad</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="minStock">Stock Mínimo</Label>
        <Input
          id="minStock"
          type="number"
          step="0.1"
          value={formData.minStock}
          onChange={(e) => setFormData((prev) => ({ ...prev, minStock: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="expiry">Fecha de Vencimiento</Label>
        <Input
          id="expiry"
          type="date"
          value={formData.expiry}
          onChange={(e) => setFormData((prev) => ({ ...prev, expiry: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="supplier">Proveedor</Label>
        <Input
          id="supplier"
          value={formData.supplier}
          onChange={(e) => setFormData((prev) => ({ ...prev, supplier: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="contact">Contacto</Label>
        <Input
          id="contact"
          value={formData.contact}
          onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Agregar Ingrediente
      </Button>
    </form>
  )
}

function StockUpdateDialog({ ingredient, onUpdate }) {
  const [newQuantity, setNewQuantity] = useState(ingredient.quantity)
  const [isOpen, setIsOpen] = useState(false)

  const handleUpdate = () => {
    onUpdate(ingredient.id, Number.parseFloat(newQuantity))
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          Actualizar Stock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Stock - {ingredient.name}</DialogTitle>
          <DialogDescription>
            Stock actual: {ingredient.quantity} {ingredient.unit}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="newQuantity">Nueva Cantidad</Label>
            <Input
              id="newQuantity"
              type="number"
              step="0.1"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
          </div>
          <Button onClick={handleUpdate} className="w-full">
            Actualizar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
