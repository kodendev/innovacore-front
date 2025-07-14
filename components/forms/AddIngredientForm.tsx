import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ingredient } from "@/types/types";
import { toast } from "sonner";

export type NewIngredient = Omit<Ingredient, "id" | "status">;

interface AddIngredientFormProps {
  onAdd: (ingredient: NewIngredient) => void;
}

export const AddIngredientForm = ({ onAdd }: AddIngredientFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    minStock: "",
    expiry: "",
    supplier: "",
    contact: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      quantity: Number.parseFloat(formData.quantity),
      minStock: Number.parseFloat(formData.minStock),
    });
    setFormData({
      name: "",
      quantity: "",
      unit: "kg",
      minStock: "",
      expiry: "",
      supplier: "",
      contact: "",
    });
    toast.success(`Ingrediente ${formData.name} agregado exitosamente`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Ingrediente</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, quantity: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="unit">Unidad</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, unit: e.target.value }))
            }
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
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, minStock: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="expiry">Fecha de Vencimiento</Label>
        <Input
          id="expiry"
          type="date"
          value={formData.expiry}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, expiry: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="supplier">Proveedor</Label>
        <Input
          id="supplier"
          value={formData.supplier}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, supplier: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="contact">Contacto</Label>
        <Input
          id="contact"
          value={formData.contact}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, contact: e.target.value }))
          }
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Agregar Ingrediente
      </Button>
    </form>
  );
};
