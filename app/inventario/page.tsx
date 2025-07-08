"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { initialIngredients, suppliers } from "@/data/fakeData";
import { Ingredient } from "@/types/types";
import { InventoryTab } from "@/components/stockTabs/InventoryTab";
import { SuppliersTab } from "@/components/stockTabs/SuppliersTab";
import { ReportsTab } from "@/components/stockTabs/ReportsTab";
import { AddIngredientForm } from "@/components/forms/AddIngredientForm";

type NewIngredient = Omit<Ingredient, "id" | "status">;

export default function InventarioPage() {
  const [ingredients, setIngredients] =
    useState<Ingredient[]>(initialIngredients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const addIngredient = (newIngredient: NewIngredient) => {
    const id = Math.max(...ingredients.map((i) => i.id)) + 1;
    const status =
      newIngredient.quantity <= newIngredient.minStock
        ? newIngredient.quantity <= newIngredient.minStock * 0.5
          ? "critical"
          : "low"
        : "ok";

    setIngredients((prev) => [...prev, { ...newIngredient, id, status }]);
    setIsAddDialogOpen(false);
  };

  const updateStock = (id: number, newQuantity: number): void => {
    setIngredients((prev) =>
      prev.map((ingredient) => {
        if (ingredient.id === id) {
          const status =
            newQuantity <= ingredient.minStock
              ? newQuantity <= ingredient.minStock * 0.5
                ? "critical"
                : "low"
              : "ok";
          return { ...ingredient, quantity: newQuantity, status };
        }
        return ingredient;
      })
    );
  };

  const lowStockItems = ingredients.filter(
    (i) => i.status === "low" || i.status === "critical"
  );
  const criticalItems = ingredients.filter((i) => i.status === "critical");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Stock e Inventario
              </h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Ingrediente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Ingrediente</DialogTitle>
                  <DialogDescription>
                    Ingrese los datos del nuevo ingrediente
                  </DialogDescription>
                </DialogHeader>
                <AddIngredientForm onAdd={addIngredient} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Alerts */}
          {criticalItems.length > 0 && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Stock Crítico
                </CardTitle>
                <CardDescription className="text-red-600">
                  Los siguientes ingredientes requieren reposición urgente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {criticalItems.map((item) => (
                    <Badge key={item.id} variant="destructive">
                      {item.name}: {item.quantity}
                      {item.unit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList>
              <TabsTrigger value="inventory">Inventario</TabsTrigger>
              <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
              <TabsTrigger value="reports">Reportes</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory">
              <InventoryTab ingredients={ingredients} onUpdate={updateStock} />
            </TabsContent>

            <TabsContent value="suppliers">
              <SuppliersTab suppliers={suppliers} />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsTab
                ingredients={ingredients}
                lowStockItems={lowStockItems}
                criticalItems={criticalItems}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
