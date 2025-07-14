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
import { Ingredient } from "@/types/types";
import { toast } from "sonner";

interface StockUpdateDialogProps {
  ingredient: Ingredient;
  onUpdate: (id: number, newQuantity: number) => void;
}

export function StockUpdateDialog({
  ingredient,
  onUpdate,
}: StockUpdateDialogProps) {
  const [newQuantity, setNewQuantity] = useState<string>(
    ingredient.quantity.toString()
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = () => {
    onUpdate(ingredient.id, Number.parseFloat(newQuantity));
    setIsOpen(false);
    toast.success(`Stock actualizado para ${ingredient.name}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          Actualizar Stock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Stock - {ingredient?.name}</DialogTitle>
          <DialogDescription>
            Stock actual: {ingredient?.quantity} {ingredient?.unit}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="newQuantity">Nueva Cantidad</Label>
            <Input
              id="newQuantity"
              type="number"
              step="0.1"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
          </div>
          <Button onClick={handleUpdate} className="w-full">
            Actualizar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
