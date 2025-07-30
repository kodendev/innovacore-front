"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { availableIngredients } from "@/data/fakeData";

interface Props {
  initialData?: any;
  onSubmit: (data: any) => void;
  isEditing?: boolean;
}

export function CreateMenuForm({
  initialData,
  onSubmit,
  isEditing = false,
}: Props) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    ingredients: initialData?.ingredients || [],
  });

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    qty: "",
    unit: "g",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.price &&
      formData.category &&
      formData.ingredients.length > 0
    ) {
      onSubmit({
        ...formData,
        price: Number.parseFloat(formData.price),
        ...(isEditing && { id: initialData.id }),
      });
    }
  };

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
      }));
      setNewIngredient({ name: "", qty: "", unit: "g" });
    }
  };

  const removeIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre del Menú</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, price: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Categoría</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, category: e.target.value }))
          }
          placeholder="ej: Principal, Ensalada, Postre"
          required
        />
      </div>

      <div>
        <Label>Ingredientes</Label>
        <div className="space-y-4">
          {formData.ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span>
                {ingredient.name} - {ingredient.qty}
                {ingredient.unit}
              </span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeIngredient(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="grid grid-cols-4 gap-2">
            <Select
              value={newIngredient.name}
              onValueChange={(value) =>
                setNewIngredient((prev) => ({ ...prev, name: value }))
              }
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
              onChange={(e) =>
                setNewIngredient((prev) => ({ ...prev, qty: e.target.value }))
              }
            />

            <Select
              value={newIngredient.unit}
              onValueChange={(value) =>
                setNewIngredient((prev) => ({ ...prev, unit: value }))
              }
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
  );
}
