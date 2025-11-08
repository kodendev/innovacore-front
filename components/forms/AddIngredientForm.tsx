import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ingredient } from "@/types/types";
import { toast } from "sonner";
import { useCreateProduct } from "@/hooks/tanstack/products/useCreateProducts";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCategories } from "@/hooks/tanstack/products/useCategories";
import { Plus } from "lucide-react";
import { DialogDescription, DialogHeader, DialogTitle, Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import AddCategoryForm from "./AddCategoryForm";

export type NewIngredient = Omit<Ingredient, "id" | "status">;

interface Props {
  onClose: () => void;
}

export const AddIngredientForm = ({ onClose }: Props) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
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
    unit: "",
    packSize: 0,
    categoryId: "",
  });

  const queryClient = useQueryClient();

  const { data: categories } = useCategories();

  const { mutate: createProduct, isPending } = useCreateProduct({
    onSuccess: (data) => {
      toast.success(`Ingrediente ${data.name} agregado exitosamente`);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalStock = Number(formData.stock);

    if (formData.unit === "pack" && formData.packSize) {
      finalStock = Number(formData.stock) * Number(formData.packSize);
    }

    createProduct({
      ...formData,
      minStock: parseFloat(formData.minStock),
      // stock: parseFloat(formData.stock),
      stock: finalStock,
      sale_price: parseFloat(formData.sale_price),
      cost_price: parseFloat(formData.cost_price),
      categoryId: parseInt(formData.categoryId),
    });
  };

  return (
    <>
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
      <div className="w-full">
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
      </div>

      <div>
        <Label htmlFor="name">Categoría</Label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) => {
            if (value === "create-new") {
              setIsAddDialogOpen(true);
              return;
            }
            setFormData((prev) => ({
              ...prev,
              categoryId: value,
            }));
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Seleccionar Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="create-new" className="font-semibold text-primary cursor-pointer bg-secondary">
              <div className="flex items-center">
                <Plus className="h-4 w-4" />
                <span>Crear</span>
              </div>
            </SelectItem>
            <SelectSeparator />
            {categories?.map((categories) => (
              <SelectItem key={categories.id} value={categories.id.toString()}>
                {categories.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="stock"
              type="number"
              placeholder="Ej: 50"
              value={formData.stock}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stock: e.target.value,
                }))
              }
              required
            />

            {/* Selector de unidad */}
            <Select
              value={formData.unit || "kg"}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  unit: value,
                }))
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kg</SelectItem>
                <SelectItem value="unidad">Unidad</SelectItem>
                <SelectItem value="pack">Pack</SelectItem>
              </SelectContent>
            </Select>

            {formData.unit === "pack" && (
              <div>
                <Input
                  id="packSize"
                  type="number"
                  placeholder="Ej: 12"
                  value={formData.packSize || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      packSize: parseInt(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>
            )}
          </div>
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
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle>Agregar nueva categoria</DialogTitle>
          <DialogDescription>
            Ingrese el nombre de la nueva categoria
          </DialogDescription>
        </DialogHeader>
        <AddCategoryForm onClose={() => setIsAddDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  </>
  );
};
