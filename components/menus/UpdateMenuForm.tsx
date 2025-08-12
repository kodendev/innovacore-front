import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUpdateMenu } from "@/hooks/tanstack/menus/useUpdateMenu";
import { useMenuType } from "@/hooks/tanstack/menus/useMenuType";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UpdateMenuFormProps = {
  initialData: {
    id: number;
    name: string;
    description: string;
    quantity: number;
    menuTypeId: number;
  };
  onClose: () => void;
};

export function UpdateMenuForm({ initialData, onClose }: UpdateMenuFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    menuTypeId: 0,
  });

  const { data: menuTypes, isLoading: loadingMenuTypes } = useMenuType();

  const updateMenuMutation = useUpdateMenu();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        quantity: initialData.quantity,
        menuTypeId: initialData.menuTypeId,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "menuTypeId" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.menuTypeId === 0) {
      toast.error("Selecciona un tipo de menú");
      return;
    }

    updateMenuMutation.mutate(
      { id: initialData.id, data: formData },
      {
        onSuccess: () => {
          toast.success("Menú actualizado correctamente");
          onClose();
        },
        onError: () => {
          toast.error("Error al actualizar el menú");
        },
      }
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        <div>
          <Label>Nombre del Menú</Label>
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
          <Label>Descripción</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label>Cantidad</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                quantity: Number(e.target.value),
              }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="menuTypeId">Tipo de Menú</Label>
          <select
            id="menuTypeId"
            className="w-full border rounded p-2"
            value={formData.menuTypeId}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                menuTypeId: Number(e.target.value),
              }))
            }
          >
            <option value={0}>Seleccionar tipo de menú</option>
            {!loadingMenuTypes &&
              menuTypes?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={updateMenuMutation.isLoading}>
            {updateMenuMutation.isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </>
  );
}
