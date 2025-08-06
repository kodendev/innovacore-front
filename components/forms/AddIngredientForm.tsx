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
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    sale_price: 0,
    cost_price: 0,
    barcode: "",
    active: true,
    stock: 0,
  });

  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending } = useCreateProduct({
    onSuccess: (data) => {
      toast.success(`Ingrediente ${data.name} agregado exitosamente`);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose(); // <- cerrar modal
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct(formData);
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
          <Label htmlFor="description">Descripción</Label>
          <Input
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
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                stock: Number(e.target.value),
              }))
            }
            required
          />
        </div>
      </div>
      {/* <div>
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
        </div> */}
      {/* <div>
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
      </div> */}
      <div>
        <Label htmlFor="sale_price">Precio de venta</Label>
        <Input
          id="sale_price"
          value={formData.sale_price}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              sale_price: Number(e.target.value),
            }))
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="cost_pricec">Precio de costo</Label>
        <Input
          id="cost_price"
          value={formData.cost_price}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              cost_price: Number(e.target.value),
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
