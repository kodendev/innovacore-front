// app/components/tabs/SmartPredictionTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const prediction = {
  name: "Tomates",
  lastMonthOrdered: 5,
  missingLastMonth: 1,
  suggested: 6,
};

export const SmartPredictionTab = () => {
  const [customAmount, setCustomAmount] = useState(prediction.suggested);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    // Aquí eventualmente podrías disparar una mutación para hacer el pedido
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Predicción inteligente: {prediction.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          El mes pasado pediste{" "}
          <strong>{prediction.lastMonthOrdered} kg</strong> y te faltó{" "}
          <strong>{prediction.missingLastMonth} kg</strong>.
        </p>
        <p>
          ¿Deseas pedir <strong>{prediction.suggested} kg</strong> este mes?
        </p>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(Number(e.target.value))}
            className="w-24"
          />
          <span>kg</span>
        </div>

        {!confirmed ? (
          <Button onClick={handleConfirm}>Confirmar pedido</Button>
        ) : (
          <p className="text-green-600 font-medium">
            Pedido confirmado: {customAmount} kg
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartPredictionTab;
