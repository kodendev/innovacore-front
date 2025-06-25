"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChefHat, Plus, Edit, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"

const availableIngredients = [
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
]

const initialMenus = [
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
]

export default function MenusPage() {
  const [menus, setMenus] = useState(initialMenus)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)

  const addMenu = (newMenu) => {
    const id = Math.max(...menus.map((m) => m.id)) + 1
    setMenus((prev) => [...prev, { ...newMenu, id, active: true }])
    setIsAddDialogOpen(false)
  }

  const updateMenu = (updatedMenu) => {
    setMenus((prev) => prev.map((menu) => (menu.id === updatedMenu.id ? updatedMenu : menu)))
    setEditingMenu(null)
  }

  const toggleMenuStatus = (menuId) => {
    setMenus((prev) => prev.map((menu) => (menu.id === menuId ? { ...menu, active: !menu.active } : menu)))
  }

  const deleteMenu = (menuId) => {
    setMenus((prev) => prev.filter((menu) => menu.id !== menuId))
  }

  const categories = [...new Set(menus.map((menu) => menu.category))]

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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Menús</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Menú
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Menú</DialogTitle>
                  <DialogDescription>Configure los ingredientes y precio del nuevo menú</DialogDescription>
                </DialogHeader>
                <MenuForm onSubmit={addMenu} />
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
                <CardTitle className="text-sm font-medium">Total Menús</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{menus.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Menús Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{menus.filter((m) => m.active).length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Categorías</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${Math.round(menus.reduce((sum, m) => sum + m.price, 0) / menus.length)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Menus by Category */}
          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menus
                  .filter((menu) => menu.category === category)
                  .map((menu) => (
                    <Card
                      key={menu.id}
                      className={`hover:shadow-lg transition-shadow ${!menu.active ? "opacity-60" : ""}`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{menu.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={menu.active ? "default" : "secondary"}>
                              {menu.active ? "Activo" : "Inactivo"}
                            </Badge>
                            <Badge variant="outline">${menu.price}</Badge>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Ingredientes:</h4>
                            <div className="space-y-1">
                              {menu.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{ingredient.name}</span>
                                  <span>
                                    {ingredient.qty}
                                    {ingredient.unit}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Dialog
                              open={editingMenu?.id === menu.id}
                              onOpenChange={(open) => !open && setEditingMenu(null)}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditingMenu(menu)}>
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Editar Menú</DialogTitle>
                                  <DialogDescription>Modifique los datos del menú</DialogDescription>
                                </DialogHeader>
                                <MenuForm initialData={editingMenu} onSubmit={updateMenu} isEditing={true} />
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant={menu.active ? "secondary" : "default"}
                              size="sm"
                              onClick={() => toggleMenuStatus(menu.id)}
                            >
                              {menu.active ? "Desactivar" : "Activar"}
                            </Button>

                            <Button variant="destructive" size="sm" onClick={() => deleteMenu(menu.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function MenuForm({ initialData, onSubmit, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    ingredients: initialData?.ingredients || [],
  })

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    qty: "",
    unit: "g",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.price && formData.category && formData.ingredients.length > 0) {
      onSubmit({
        ...formData,
        price: Number.parseFloat(formData.price),
        ...(isEditing && { id: initialData.id }),
      })
    }
  }

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.qty) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [
          ...prev.ingredients,
          {
            ...newIngredient,
            qty: Number.parseFloat(newIngredient.qty),
          },
        ],
      }))
      setNewIngredient({ name: "", qty: "", unit: "g" })
    }
  }

  const removeIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre del Menú</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Precio ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Categoría</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
          placeholder="ej: Principal, Ensalada, Postre"
          required
        />
      </div>

      <div>
        <Label>Ingredientes</Label>
        <div className="space-y-4">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>
                {ingredient.name} - {ingredient.qty}
                {ingredient.unit}
              </span>
              <Button type="button" variant="destructive" size="sm" onClick={() => removeIngredient(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="grid grid-cols-4 gap-2">
            <Select
              value={newIngredient.name}
              onValueChange={(value) => setNewIngredient((prev) => ({ ...prev, name: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ingrediente" />
              </SelectTrigger>
              <SelectContent>
                {availableIngredients.map((ingredient) => (
                  <SelectItem key={ingredient.name} value={ingredient.name}>
                    {ingredient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              step="0.1"
              placeholder="Cantidad"
              value={newIngredient.qty}
              onChange={(e) => setNewIngredient((prev) => ({ ...prev, qty: e.target.value }))}
            />

            <Select
              value={newIngredient.unit}
              onValueChange={(value) => setNewIngredient((prev) => ({ ...prev, unit: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">gramos</SelectItem>
                <SelectItem value="kg">kilogramos</SelectItem>
                <SelectItem value="u">unidades</SelectItem>
                <SelectItem value="ml">mililitros</SelectItem>
              </SelectContent>
            </Select>

            <Button type="button" onClick={addIngredient}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? "Actualizar Menú" : "Crear Menú"}
      </Button>
    </form>
  )
}
