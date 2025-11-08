import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateCategory } from "@/hooks/tanstack/products/useCreateCategories";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface Props {
    onClose: () => void;
}

const AddCategoryForm: React.FC<Props> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: ""
    });
    const queryClient = useQueryClient();

    const { mutate: createCategory, isPending } = useCreateCategory({
        onSuccess: (data) => {
        toast.success(`Categoría ${data.name} agregada exitosamente`);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createCategory(formData);
    };

      
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Input
                placeholder="Ej: Bebidas, Carnes, Lacteos"
                id="name"
                value={formData.name}
                onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
            />
            <Button type="submit" disabled={isPending} className="w-full mt-4">
                Agregar Categoría
            </Button>
            </div>
        </form>
    );
};

export default AddCategoryForm;
