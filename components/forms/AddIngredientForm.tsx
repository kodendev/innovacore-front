import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ingredient, Product } from "@/types/types";
import { toast } from "sonner";
import { useCreateProduct } from "@/hooks/tanstack/products/useCreateProducts";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

export type NewIngredient = Omit<Ingredient, "id" | "status">;

interface Props {
  onClose: () => void;
}

export const AddIngredientForm = ({ onClose }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sale_price: "",
    cost_price: "",
    barcode: "",
    active: true,
    stock: "",
    expirationDate: "",
    minStock: "",
  });

  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending } = useCreateProduct({
    onSuccess: (data) => {
      toast.success(`Ingrediente ${data.name} agregado exitosamente`);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct({
      ...formData,
      minStock: parseFloat(formData.minStock),
      stock: parseFloat(formData.stock),
      sale_price: parseFloat(formData.sale_price),
      cost_price: parseFloat(formData.cost_price),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Ingrediente</Label>
        <Input
          placeholder="Ej: Tomate, Lechuga, Queso"
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
          <Label htmlFor="description">Descripción</Label>
          <Input
            placeholder="Ej: Tomate fresco orgánico"
            id="description"
            type="string"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock KG</Label>
          <Input
            placeholder="Ej: 50"
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                stock: e.target.value,
              }))
            }
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="minStock">Stock Mínimo</Label>
        <Input
          placeholder="Ej: 10"
          id="minStock"
          type="number"
          value={formData.minStock}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              minStock: e.target.value,
            }))
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="expirationDate">Fecha de Vencimiento</Label>
        <Input
          placeholder="Selecciona una fecha"
          id="expirationDate"
          type="date"
          value={formData.expirationDate}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, expirationDate: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="sale_price">Precio de venta</Label>
        <Input
          placeholder="Ej: 150"
          id="sale_price"
          value={formData.sale_price}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              sale_price: e.target.value,
            }))
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="cost_price">Precio de costo</Label>
        <Input
          placeholder="Ej: 100"
          id="cost_price"
          value={formData.cost_price}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              cost_price: e.target.value,
            }))
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="barcode">Codigo de barras</Label>
        <Input
          placeholder="Ej: 12321221"
          id="barcode"
          value={formData.barcode}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              barcode: e.target.value,
            }))
          }
          required
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        Agregar Producto
      </Button>
    </form>
  );
};
