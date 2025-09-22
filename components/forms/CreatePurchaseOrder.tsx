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
import { Supplier } from "@/types/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  supplier: Supplier;
}

const CreatePurchaseOrder = ({ supplier }: Props) => {
  console.log(supplier);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    product: "",
    quantity: 0,
    supplierId: supplier.id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pedido creado:", formData);
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
                value={formData.product}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    product: value,
                  }))
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Seleccionar Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {supplier.products.map((supplierProduct) => (
                    <SelectItem
                      key={supplierProduct}
                      value={supplierProduct.toString()}
                    >
                      {supplierProduct}
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

          <Button onClick={handleSubmit} className="w-full">
            Confirmar Pedido
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePurchaseOrder;
