"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { AddIngredientForm } from "@/components/forms/AddIngredientForm";
import StockPredictionsTab from "@/components/stockTabs/PredictionsTab";
import SmartPredictionTab from "@/components/stockTabs/SmartPredictionsTab";
import { ExpirationsTab } from "@/components/stockTabs/ExpirationsTab";
import StockMovements from "@/components/stockTabs/StockMovements";

export default function InventarioPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
                <Button className="w-full sm:w-auto bg-green-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Ingrediente</DialogTitle>
                  <DialogDescription>
                    Ingrese los datos del nuevo ingrediente
                  </DialogDescription>
                </DialogHeader>
                <AddIngredientForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList>
              <TabsTrigger value="inventory">Inventario</TabsTrigger>
              <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
              <TabsTrigger value="predictions">Predicción de stock</TabsTrigger>
              <TabsTrigger value="smartPredictions">
                Predicción inteligente
              </TabsTrigger>
              <TabsTrigger value="expirations">
                Próximos vencimientos
              </TabsTrigger>
              <TabsTrigger value="movements">Movimientos de stock</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory">
              <InventoryTab />
            </TabsContent>

            <TabsContent value="suppliers">
              <SuppliersTab />
            </TabsContent>

            <TabsContent value="predictions">
              <StockPredictionsTab />
            </TabsContent>

            <TabsContent value="smartPredictions">
              <SmartPredictionTab />
            </TabsContent>

            <TabsContent value="expirations">
              <ExpirationsTab />
            </TabsContent>

            <TabsContent value="movements">
              <StockMovements />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
