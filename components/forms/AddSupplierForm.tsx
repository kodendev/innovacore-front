import { useCreateSupplier } from "@/hooks/tanstack/suppliers/usecreateSupplier";
import { CreateSupplierDto } from "@/types/suppliers/supplierTypes";
import { Product } from "@/types/types";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { AddIngredientForm } from "./AddIngredientForm";

interface AddSupplierFormProps {
  products: Product[];
  onClose: () => void;
}

export const AddSupplierForm: React.FC<AddSupplierFormProps> = ({
  products,
  onClose,
}) => {
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);

  const [formData, setFormData] = useState<CreateSupplierDto>({
    name: "",
    email: "",
    phone: "",
    address: "",
    products: [],
  });

  const createSupplierMutation = useCreateSupplier();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invalidProducts = formData.products.filter(
      (p) => !p.costPrice || p.costPrice <= 0
    );

    if (invalidProducts.length > 0) {
      toast.error("Todos los productos deben tener un precio de costo válido.");
      return;
    }
    createSupplierMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Proveedor creado con éxito.");
        onClose();
      },
      onError: (error: any) => {
        // Si el backend devuelve el error con "response.data.message"
        const errorMessage =
          error?.response?.data?.message || "Ocurrió un error inesperado";
        toast.error(errorMessage);
      },
    });
  };

  const handleAddProduct = (productId: number) => {
    setFormData((prev) => {
      if (prev.products.some((p) => p.productId === productId)) return prev;
      return {
        ...prev,
        products: [...prev.products, { productId, costPrice: 0 }],
      };
    });
  };

  const handleCostPriceChange = (productId: number, costPrice: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.productId === productId ? { ...p, costPrice } : p
      ),
    }));
  };

  const handleRemoveProduct = (productId: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.productId !== productId),
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre del proveedor</Label>
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label>Productos</Label>
          <Select
            value=""
            onValueChange={(value) => handleAddProduct(Number(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Agregar Producto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) =>
                product.id ? (
                  <SelectItem key={product.id} value={product?.id.toString()}>
                    {product.name}
                  </SelectItem>
                ) : null
              )}
            </SelectContent>
          </Select>

          <p
            className="text-sm mt-1 text-blue-500 cursor-pointer hover:underline"
            onClick={() => setIsAddProductDialogOpen(true)}
          >
            ¿No existe el producto? Crear.
          </p>

          {formData.products.map((sp) => (
            <div key={sp.productId} className="flex items-center gap-2 mt-2">
              <span>{products.find((p) => p.id === sp.productId)?.name}</span>
              <Label className="ml-2 text-red-500">Precio Costo:</Label>
              <Input
                type="number"
                min={1}
                value={sp.costPrice}
                onChange={(e) =>
                  handleCostPriceChange(sp.productId, Number(e.target.value))
                }
                placeholder="Precio costo"
                className="w-24"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleRemoveProduct(sp.productId)}
              >
                <Trash />
              </Button>
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full mt-4">
          Crear Proveedor
        </Button>
      </form>

      <Dialog
        open={isAddProductDialogOpen}
        onOpenChange={setIsAddProductDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          </DialogHeader>
          <AddIngredientForm onClose={() => setIsAddProductDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
