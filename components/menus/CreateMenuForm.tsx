"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMenuType } from "@/hooks/tanstack/menus/useMenuType";
import { useCreateMenu } from "@/hooks/tanstack/menus/useCreateMenu";
import { CreateMenuPayload } from "@/types/types";
import { useProducts } from "@/hooks/tanstack/products/useProducts";
import { toast } from "sonner";

type CreateMenuFormProps = {
  onClose: () => void;
};

export function CreateMenuForm({ onClose }: CreateMenuFormProps) {
  const [formData, setFormData] = useState<CreateMenuPayload>({
    quantity: 1,
    name: "",
    description: "",
    menuTypeId: 0,
    menuProducts: [],
  });
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const { data: menuTypes, isLoading: loadingMenuTypes } = useMenuType();
  const { data: getProducts } = useProducts();

  // const { data: createMenu } = useCreateMenu();
  const createMenuMutation = useCreateMenu();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.menuTypeId === 0) {
      toast.error("Selecciona un tipo de menú");
      return;
    }

    if (formData.menuProducts.length === 0) {
      toast.error("Agrega al menos un producto al menú");
    }

    console.log("Valores enviados", formData);
    // Lanzar mutación de creación
    createMenuMutation.mutate(formData, {
      onSuccess: () => {
        onClose(); // Cerrar modal al crear
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div>
        <Label htmlFor="name">Nombre del Menú</Label>
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
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
      </div>

      <div className="gap-4 flex flex-row items-center justify-start">
        <Label htmlFor="menuTypeId">Tipo de Menú:</Label>
        <select
          id="menuTypeId"
          value={formData.menuTypeId}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              menuTypeId: Number(e.target.value),
            }))
          }
          disabled={loadingMenuTypes}
          required
          className="border rounded px-2 py-1"
        >
          <option value={0}>Selecciona un tipo</option>
          {menuTypes?.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="border p-3 rounded space-y-2">
        <h3 className="font-semibold">Agregar productos al menú</h3>

        <div className="flex gap-2 items-center">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            <option value={0}>Selecciona un producto</option>
            {getProducts?.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
            className="w-16 border px-2 py-1 rounded"
          />

          <Button
            type="button"
            onClick={() => {
              if (!selectedProductId) return;

              // Evitar duplicados
              const exists = formData.menuProducts.some(
                (p) => p.productId === selectedProductId
              );
              if (exists) return;

              setFormData((prev) => ({
                ...prev,
                menuProducts: [
                  ...prev.menuProducts,
                  { productId: selectedProductId, quantity: selectedQuantity },
                ],
              }));

              // Reset
              setSelectedProductId(0);
              setSelectedQuantity(1);
            }}
          >
            Agregar
          </Button>
        </div>

        {/* Listado de productos agregados */}
        <ul className="space-y-1">
          {formData.menuProducts.map((item) => {
            const product = getProducts?.find((p) => p.id === item.productId);
            return (
              <li
                key={item.productId}
                className="flex justify-between items-center"
              >
                <span>
                  {product?.name || "Producto eliminado"} (x{item.quantity})
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-600"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      menuProducts: prev.menuProducts.filter(
                        (p) => p.productId !== item.productId
                      ),
                    }))
                  }
                >
                  Quitar
                </Button>
              </li>
            );
          })}
        </ul>
      </div>

      <Button type="submit">Crear Menú</Button>
      {createMenuMutation.isError && (
        <p className="text-red-600">Error creando menú</p>
      )}
    </form>
  );
}
