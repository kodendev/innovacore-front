import { Supplier, UpdateSupplierDto } from "@/types/suppliers/supplierTypes";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface EditSupplierFormProps {
  supplier: Supplier;
  onClose: () => void;
  onUpdate: (updated: UpdateSupplierDto) => void;
}

export const EditSupplierForm: React.FC<EditSupplierFormProps> = ({
  supplier,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<UpdateSupplierDto>({
    name: supplier.name,
    email: supplier.email,
    phone: supplier.phone || "",
    address: supplier.address || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
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
        />
      </div>

      <Button type="submit" className="w-full">
        Guardar cambios
      </Button>
    </form>
  );
};
