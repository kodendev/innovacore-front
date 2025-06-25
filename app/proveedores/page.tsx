"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, MapPin, Plus, Edit, ArrowLeft, Building, Star } from "lucide-react"
import Link from "next/link"

const initialSuppliers = [
  {
    id: 1,
    name: "Carnicería Central",
    contact: "+54 11 1234-5678",
    email: "ventas@carniceriacentral.com",
    address: "Av. Corrientes 1234, CABA",
    products: ["Carne", "Embutidos", "Vísceras"],
    rating: 4.5,
    notes: "Proveedor principal de carnes. Excelente calidad y puntualidad en entregas.",
    lastOrder: "2024-01-08",
    status: "activo",
  },
  {
    id: 2,
    name: "Verdulería San Juan",
    contact: "+54 11 2345-6789",
    email: "pedidos@verduleriasj.com",
    address: "San Juan 567, CABA",
    products: ["Papa", "Verduras", "Frutas", "Hortalizas"],
    rating: 4.2,
    notes: "Productos frescos diarios. Buen precio y variedad.",
    lastOrder: "2024-01-09",
    status: "activo",
  },
  {
    id: 3,
    name: "Lácteos del Valle",
    contact: "+54 11 3456-7890",
    email: "comercial@lacteosv.com",
    address: "Ruta 9 Km 45, Provincia de Buenos Aires",
    products: ["Queso", "Leche", "Yogurt", "Manteca", "Crema"],
    rating: 4.8,
    notes: "Productos lácteos de primera calidad. Certificación orgánica.",
    lastOrder: "2024-01-07",
    status: "activo",
  },
  {
    id: 4,
    name: "Avícola Norte",
    contact: "+54 11 4567-8901",
    email: "ventas@avicolanorte.com",
    address: "Panamericana Km 32, Tigre",
    products: ["Pollo", "Huevos", "Pavo"],
    rating: 4.0,
    notes: "Aves de corral frescas. Entregas 3 veces por semana.",
    lastOrder: "2024-01-06",
    status: "activo",
  },
  {
    id: 5,
    name: "Almacén Mayorista",
    contact: "+54 11 5678-9012",
    email: "info@almacenmayorista.com",
    address: "Av. Warnes 2890, CABA",
    products: ["Arroz", "Fideos", "Aceite", "Condimentos", "Enlatados"],
    rating: 3.8,
    notes: "Productos secos y no perecederos. Buenos precios mayoristas.",
    lastOrder: "2024-01-05",
    status: "activo",
  },
  {
    id: 6,
    name: "Pescadería del Puerto",
    contact: "+54 11 6789-0123",
    email: "frescos@pescaderiapuerto.com",
    address: "Puerto Madero, Dique 4",
    products: ["Pescado", "Mariscos", "Salmón"],
    rating: 4.3,
    notes: "Pescados y mariscos frescos del día. Entrega temprana.",
    lastOrder: "2024-01-04",
    status: "inactivo",
  },
]

export default function ProveedoresPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.products.some((product) => product.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const activeSuppliers = suppliers.filter((s) => s.status === "activo")
  const totalProducts = [...new Set(suppliers.flatMap((s) => s.products))].length
  const avgRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length

  const addSupplier = (newSupplier) => {
    const id = Math.max(...suppliers.map((s) => s.id)) + 1
    setSuppliers((prev) => [...prev, { ...newSupplier, id, status: "activo" }])
    setIsAddDialogOpen(false)
  }

  const updateSupplier = (updatedSupplier) => {
    setSuppliers((prev) => prev.map((supplier) => (supplier.id === updatedSupplier.id ? updatedSupplier : supplier)))
    setEditingSupplier(null)
  }

  const toggleSupplierStatus = (supplierId) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === supplierId
          ? { ...supplier, status: supplier.status === "activo" ? "inactivo" : "activo" }
          : supplier,
      ),
    )
  }

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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Proveedores</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Proveedor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
                  <DialogDescription>Complete la información del proveedor</DialogDescription>
                </DialogHeader>
                <SupplierForm onSubmit={addSupplier} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{suppliers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Proveedores Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeSuppliers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Productos Únicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1">
                  {avgRating.toFixed(1)}
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">Lista de Proveedores</TabsTrigger>
              <TabsTrigger value="products">Por Productos</TabsTrigger>
              <TabsTrigger value="analytics">Análisis</TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              {/* Search */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Buscar por nombre o producto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Suppliers List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSuppliers.map((supplier) => (
                  <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="flex items-center gap-2 min-w-0">
                          <Building className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{supplier.name}</span>
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <Badge variant={supplier.status === "activo" ? "default" : "secondary"} className="text-xs">
                            {supplier.status === "activo" ? "Activo" : "Inactivo"}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium">{supplier.rating}</span>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-gray-500 flex-shrink-0" />
                            <span className="break-all">{supplier.contact}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-gray-500 flex-shrink-0" />
                            <span className="break-all">{supplier.email}</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="break-words">{supplier.address}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-1 text-sm">Productos:</h4>
                          <div className="flex flex-wrap gap-1">
                            {supplier.products.map((product, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {supplier.notes && (
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg break-words">
                            {supplier.notes}
                          </div>
                        )}

                        <div className="text-xs text-gray-500">Último pedido: {supplier.lastOrder}</div>

                        <div className="flex gap-2 pt-2">
                          <Dialog
                            open={editingSupplier?.id === supplier.id}
                            onOpenChange={(open) => !open && setEditingSupplier(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingSupplier(supplier)}
                                className="flex-1 text-xs"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                              <DialogHeader>
                                <DialogTitle>Editar Proveedor</DialogTitle>
                                <DialogDescription>Modifique los datos del proveedor</DialogDescription>
                              </DialogHeader>
                              <SupplierForm initialData={editingSupplier} onSubmit={updateSupplier} isEditing={true} />
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant={supplier.status === "activo" ? "secondary" : "default"}
                            size="sm"
                            onClick={() => toggleSupplierStatus(supplier.id)}
                            className="flex-1 text-xs"
                          >
                            {supplier.status === "activo" ? "Desactivar" : "Activar"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="products">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...new Set(suppliers.flatMap((s) => s.products))].map((product) => {
                  const productSuppliers = suppliers.filter(
                    (s) => s.products.includes(product) && s.status === "activo",
                  )

                  return (
                    <Card key={product}>
                      <CardHeader>
                        <CardTitle className="text-lg">{product}</CardTitle>
                        <CardDescription>
                          {productSuppliers.length} proveedor{productSuppliers.length !== 1 ? "es" : ""} disponible
                          {productSuppliers.length !== 1 ? "s" : ""}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {productSuppliers.map((supplier) => (
                            <div key={supplier.id} className="flex justify-between items-center text-sm">
                              <span>{supplier.name}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span>{supplier.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Proveedores por Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {suppliers
                        .sort((a, b) => b.rating - a.rating)
                        .slice(0, 5)
                        .map((supplier) => (
                          <div key={supplier.id} className="flex justify-between items-center">
                            <span className="font-medium">{supplier.name}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span>{supplier.rating}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Productos más Ofrecidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        suppliers
                          .flatMap((s) => s.products)
                          .reduce((acc, product) => {
                            acc[product] = (acc[product] || 0) + 1
                            return acc
                          }, {}),
                      )
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([product, count]) => (
                          <div key={product} className="flex justify-between items-center">
                            <span className="font-medium">{product}</span>
                            <Badge variant="outline">{count} proveedores</Badge>
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

function SupplierForm({ initialData, onSubmit, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    contact: initialData?.contact || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    products: initialData?.products || [],
    rating: initialData?.rating || 5,
    notes: initialData?.notes || "",
    lastOrder: initialData?.lastOrder || new Date().toISOString().split("T")[0],
  })

  const [newProduct, setNewProduct] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.contact && formData.email && formData.products.length > 0) {
      onSubmit({
        ...formData,
        rating: Number.parseFloat(formData.rating),
        ...(isEditing && { id: initialData.id }),
      })
    }
  }

  const addProduct = () => {
    if (newProduct.trim() && !formData.products.includes(newProduct.trim())) {
      setFormData((prev) => ({
        ...prev,
        products: [...prev.products, newProduct.trim()],
      }))
      setNewProduct("")
    }
  }

  const removeProduct = (productToRemove) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product !== productToRemove),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre del Proveedor</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="contact">Teléfono</Label>
          <Input
            id="contact"
            value={formData.contact}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label>Productos</Label>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {formData.products.map((product, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-red-100"
                onClick={() => removeProduct(product)}
              >
                {product} ×
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Agregar producto"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addProduct())}
            />
            <Button type="button" onClick={addProduct}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="lastOrder">Último Pedido</Label>
          <Input
            id="lastOrder"
            type="date"
            value={formData.lastOrder}
            onChange={(e) => setFormData((prev) => ({ ...prev, lastOrder: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notas</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Información adicional sobre el proveedor..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? "Actualizar Proveedor" : "Crear Proveedor"}
      </Button>
    </form>
  )
}
