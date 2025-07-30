// app/components/tabs/StockPredictionsTab.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockData = [
  { name: "Tomates", stock: 2, ideal: 10 },
  { name: "Queso", stock: 5, ideal: 12 },
  { name: "Pan", stock: 1, ideal: 8 },
];

export const StockPredictionsTab = () => {
  const sortedData = mockData
    .map((item) => ({ ...item, missing: item.ideal - item.stock }))
    .sort((a, b) => a.missing - b.missing);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sortedData.map((item) => (
        <Card key={item.name}>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Stock actual: {item.stock} kg</p>
            <p>Stock ideal: {item.ideal} kg</p>
            <p className="text-red-500 font-medium">
              Faltante: {item.missing} kg
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StockPredictionsTab;
