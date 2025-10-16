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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bed, User, Clock, ArrowLeft, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRooms } from "@/hooks/tanstack/camas/useBeds";

const menus = [
  {
    id: 1,
    name: "Pastel de Papa",
    ingredients: [
      { name: "Carne", qty: 300 },
      { name: "Papa", qty: 200 },
      { name: "Queso", qty: 50 },
    ],
  },
  {
    id: 2,
    name: "Pollo Grillado",
    ingredients: [
      { name: "Pollo", qty: 250 },
      { name: "Arroz", qty: 150 },
      { name: "Verduras", qty: 100 },
    ],
  },
  {
    id: 3,
    name: "Pescado al Horno",
    ingredients: [
      { name: "Pescado", qty: 200 },
      { name: "Papa", qty: 150 },
      { name: "Limón", qty: 20 },
    ],
  },
  {
    id: 4,
    name: "Ensalada César",
    ingredients: [
      { name: "Lechuga", qty: 100 },
      { name: "Pollo", qty: 150 },
      { name: "Queso", qty: 30 },
    ],
  },
  {
    id: 5,
    name: "Milanesa",
    ingredients: [
      { name: "Carne", qty: 200 },
      { name: "Pan rallado", qty: 50 },
      { name: "Huevo", qty: 1 },
    ],
  },
];

const bebidas = [
  { id: 101, name: "Agua Mineral" },
  { id: 102, name: "Gaseosa 500ml" },
  { id: 103, name: "Jugo Natural" },
  { id: 104, name: "Café" },
  { id: 105, name: "Té" },
];

const initialOrders = [
  {
    id: 1,
    room: 101,
    bed: 1,
    patient: "Juan Pérez",
    items: [
      { name: "Pastel de Papa", qty: 1 },
      { name: "Agua Mineral", qty: 1 },
    ],
    time: "12:30",
    status: "servido",
    type: "paciente",
  },
  {
    id: 2,
    room: 102,
    bed: 1,
    patient: "Carlos López",
    items: [
      { name: "Pescado al Horno", qty: 1 },
      { name: "Té", qty: 1 },
    ],
    time: "13:00",
    status: "pendiente",
    type: "paciente",
  },
];

export default function CamasPage() {
  // const [rooms, setRooms] = useState(initialRooms);
  const [orders, setOrders] = useState(initialOrders);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const { data: beds } = useRooms();
  console.log(beds);

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
                Gestión de Camas
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Tabs defaultValue="camas" className="space-y-6">
            <TabsList>
              <TabsTrigger value="camas">Gestión de Camas</TabsTrigger>
              <TabsTrigger value="ordenes">Órdenes de Pacientes</TabsTrigger>
            </TabsList>
            <TabsContent value="camas">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {beds?.map((room) => (
                  <Card
                    key={room.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bed className="h-5 w-5" />
                        {room.name}
                      </CardTitle>
                      <CardDescription>
                        {
                          room.beds.filter(
                            (b) => b.patients && b.patients.length > 0
                          ).length
                        }{" "}
                        de {room.beds.length} camas ocupadas
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {room.beds.map((bed) => {
                          const hasPatient = bed.patients?.length > 0;
                          const patient = hasPatient ? bed.patients[0] : null;
                          const bedMenu = bed.bedMenus?.[0];

                          return (
                            <div
                              key={bed.id}
                              className={`border rounded-lg p-4 transition-colors ${
                                hasPatient
                                  ? "bg-orange-50 border-orange-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {bed.name}
                                  </span>
                                  <Badge
                                    className={
                                      hasPatient
                                        ? "bg-orange-100 text-orange-800 border-orange-200"
                                        : "bg-gray-100 text-gray-800 border-gray-200"
                                    }
                                  >
                                    {hasPatient ? "Ocupada" : "Libre"}
                                  </Badge>
                                </div>

                                {hasPatient && (
                                  <Button size="sm" variant="outline">
                                    Marcar Servido
                                  </Button>
                                )}
                              </div>

                              {hasPatient ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4" />
                                    <span>{patient?.name}</span>
                                  </div>

                                  {patient?.currentStatus ? (
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <strong>Diagnóstico:</strong>
                                        <Badge>{patient.diagnosis}</Badge>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <strong>Estado:</strong>
                                        <Badge
                                          className={
                                            patient.currentStatus.statusType ===
                                            "internacion"
                                              ? "bg-blue-100 text-blue-800 border-blue-200"
                                              : patient.currentStatus
                                                  .statusType === "alta"
                                              ? "bg-green-100 text-green-800 border-green-200"
                                              : "bg-gray-100 text-gray-800 border-gray-200"
                                          }
                                        >
                                          {patient.currentStatus.statusType.toUpperCase()}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <strong>Dieta:</strong>
                                        <Badge
                                          className={
                                            patient.currentStatus.dietType ===
                                            "liquida"
                                              ? "bg-cyan-100 text-cyan-800 border-cyan-200"
                                              : patient.currentStatus
                                                  .dietType === "blanda"
                                              ? "bg-amber-100 text-amber-800 border-amber-200"
                                              : "bg-emerald-100 text-emerald-800 border-emerald-200"
                                          }
                                        >
                                          {patient.currentStatus.dietType?.toUpperCase()}
                                        </Badge>
                                      </div>

                                      {patient.currentStatus.notes &&
                                      patient.currentStatus.notes !==
                                        "string" ? (
                                        <p className="text-gray-500 italic">
                                          {patient.currentStatus.notes}
                                        </p>
                                      ) : (
                                        <p className="text-gray-400 italic">
                                          No hay notas del paciente
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-500">
                                      <span> Cama libre</span>
                                    </div>
                                  )}

                                  {bedMenu && (
                                    <div className="text-sm">
                                      <strong>Menú:</strong> {bedMenu.menu.name}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500">
                                  Cama libre
                                </div>
                              )}

                              {/* Botones para acciones */}
                              <div className="flex gap-2 mt-3">
                                <Dialog
                                  open={
                                    isDialogOpen &&
                                    selectedRoom === room.id &&
                                    selectedBed === bed.id
                                  }
                                  onOpenChange={setIsDialogOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1"
                                      onClick={() => {
                                        setSelectedRoom(room.id);
                                        setSelectedBed(bed.id);
                                        setIsDialogOpen(true);
                                      }}
                                    >
                                      {hasPatient
                                        ? "Modificar"
                                        : "Asignar Menú"}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md mx-4">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Asignar Menú - {room.name}, {bed.name}
                                      </DialogTitle>
                                      <DialogDescription>
                                        Selecciona el menú y horario para el
                                        paciente
                                      </DialogDescription>
                                    </DialogHeader>
                                  </DialogContent>
                                </Dialog>

                                {hasPatient && (
                                  <Dialog
                                    open={
                                      isOrderDialogOpen &&
                                      selectedRoom === room.id &&
                                      selectedBed === bed.id
                                    }
                                    onOpenChange={setIsOrderDialogOpen}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => {
                                          setSelectedRoom(room.id);
                                          setSelectedBed(bed.id);
                                          setIsOrderDialogOpen(true);
                                        }}
                                      >
                                        <ShoppingCart className="h-3 w-3 mr-1" />
                                        Nueva Orden
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md mx-4">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Nueva Orden - {room.name}, {bed.name}
                                        </DialogTitle>
                                        <DialogDescription>
                                          Crear orden adicional para{" "}
                                          {patient?.name}
                                        </DialogDescription>
                                      </DialogHeader>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ordenes">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Órdenes de Pacientes</CardTitle>
                      <CardDescription>
                        Listado de todas las órdenes realizadas para pacientes
                        internados
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Nueva Orden
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md mx-4">
                        <DialogHeader>
                          <DialogTitle>Crear Nueva Orden</DialogTitle>
                          <DialogDescription>
                            Complete los datos para crear una orden para un
                            paciente
                          </DialogDescription>
                        </DialogHeader>
                        {/* <CreateNewOrderForm
                          onCreateOrder={handleCreateNewOrder}
                        /> */}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          order.status === "servido"
                            ? "bg-green-50 border-green-200"
                            : "bg-orange-50 border-orange-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium">
                              Orden #{order.id} - Habitación {order.room}, Cama{" "}
                              {order.bed}
                            </div>
                            <div className="text-sm text-gray-600">
                              Paciente: {order.patient} • {order.time}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                order.status === "servido"
                                  ? "default"
                                  : "destructive"
                              }
                              className={
                                order.status === "servido"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-orange-100 text-orange-800 border-orange-200"
                              }
                            >
                              {order.status === "servido"
                                ? "✓ Servido"
                                : "⏳ Pendiente"}
                            </Badge>
                            {order.status === "pendiente" && (
                              <Button size="sm">Marcar Servido</Button>
                            )}
                          </div>
                        </div>
                        <div className="text-sm">
                          <strong>Items:</strong>{" "}
                          {order.items.map((item, index) => (
                            <span key={index}>
                              {item.name} x{item.qty}
                              {index < order.items.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
