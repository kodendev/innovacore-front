import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ingredient, Product } from "@/types/types";
import { toast } from "sonner";
import { useUpdateProduct } from "@/hooks/tanstack/products/useEditProducts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCategories } from "@/hooks/tanstack/products/useCategories";

type Props = {
  product: Product;
};

export function StockUpdateDialog({ product }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: product.name,
    description: product.description,
    sale_price: product.sale_price,
    cost_price: product.cost_price,
    barcode: product.barcode,
    active: product.active,
    stock: product.stock,
    expirationDate: product.expirationDate,
    minStock: product.minStock,
    categoryId: product.categoryId,
  });
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const { data: categories } = useCategories();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "sale_price" || name === "cost_price" || name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.sale_price <= 0 ||
      formData.cost_price <= 0 ||
      formData.stock < 0 ||
      formData.expirationDate === null ||
      formData.categoryId === undefined
    ) {
      toast.error("Por favor, completá todos los campos correctamente.");
      return;
    }
    updateProduct({ id: Number(product.id), data: formData });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>
            Modificá los campos y confirmá los cambios
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="categoryId">Categoría</Label>
            <Select
              value={formData.categoryId ? formData.categoryId.toString() : ""}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryId: Number(value),
                }))
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Seleccionar Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((categories) => (
                  <SelectItem
                    key={categories.id}
                    value={categories.id.toString()}
                  >
                    {categories.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sale_price">Precio de venta</Label>
            <Input
              id="sale_price"
              name="sale_price"
              type="number"
              value={formData.sale_price}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="cost_price">Precio de costo</Label>
            <Input
              id="cost_price"
              name="cost_price"
              type="number"
              value={formData.cost_price}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="barcode">Código de barras</Label>
            <Input
              id="barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="barcode">Fecha de vencimiento</Label>
            <Input
              id="expirationDate"
              name="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock Mínimo</Label>
            <Input
              id="minStock"
              name="minStock"
              type="number"
              value={formData.minStock}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
            />
            <Label htmlFor="active">Activo</Label>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full"
          >
            Confirmar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
