import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuth } from "@/context/AuthContext";
import { useCreatePurchase } from "@/hooks/tanstack/products/usePurchaseStock";
import { toast } from "sonner";
import { Supplier } from "@/types/suppliers/supplierTypes";

interface Props {
  supplier: Supplier;
}

const CreatePurchaseOrder = ({ supplier }: Props) => {
  console.log(supplier);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: 0,
    quantity: 0,
    price: 0,
    supplierId: supplier.id,
  });

  const { user } = useAuth();

  const createPurchase = useCreatePurchase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId || formData.productId <= 0) {
      toast.error("Debes seleccionar un producto válido");
      return;
    }

    if (!formData.productId || formData.productId <= 0) {
      toast.error("Debes seleccionar un producto válido");
      return;
    }

    if (formData.quantity <= 0 || formData.quantity === 0) {
      toast.error("La cantidad debe ser mayor a cero");
      return;
    }

    const selectedProduct = supplier.supplierProducts.find(
      (sp) => sp.product?.id === formData.productId
    );

    if (!selectedProduct) {
      toast.error("Producto inválido");
      return;
    }

    const payload = {
      userId: Number(user?.user_id),
      products: [
        {
          productId: formData.productId,
          quantity: formData.quantity,
          price: selectedProduct.costPrice,
        },
      ],
    };
    createPurchase.mutate(payload, {
      onSuccess: () => {
        toast.success("Compra registrada con éxito ✅");
        setIsOpen(false);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message || "Error registrando compra ❌";
        toast.error(message);
        console.error("Error registrando compra ❌", error);
      },
    });
  };
  return (
    <div className="mt-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Realizar Pedido</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Realizar pedido a proveedor</DialogTitle>
            <DialogDescription>Mayorista : {supplier.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="categoryId">Producto</Label>
              <Select
                value={formData.productId?.toString() ?? ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    productId: Number(value), // guardamos el ID como número
                  }))
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar Producto" />
                </SelectTrigger>
                <SelectContent>
                  {supplier.supplierProducts.map((supplierProduct) => (
                    <SelectItem
                      key={supplierProduct.id}
                      value={
                        supplierProduct.product.id !== undefined
                          ? supplierProduct.product.id.toString()
                          : ""
                      }
                    >
                      {supplierProduct.product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={createPurchase.isPending}
          >
            {createPurchase.isPending ? "Procesando..." : "Confirmar Pedido"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePurchaseOrder;
