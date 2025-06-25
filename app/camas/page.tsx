"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bed, User, Clock, ArrowLeft, Plus, ShoppingCart } from "lucide-react"
import Link from "next/link"

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
]

const bebidas = [
  { id: 101, name: "Agua Mineral" },
  { id: 102, name: "Gaseosa 500ml" },
  { id: 103, name: "Jugo Natural" },
  { id: 104, name: "Café" },
  { id: 105, name: "Té" },
]

const initialRooms = [
  {
    room: 101,
    beds: [
      { bed: 1, patient: "Juan Pérez", menu: "Pastel de Papa", time: "12:30", status: "servido" },
      { bed: 2, patient: "María García", menu: "Pollo Grillado", time: "12:45", status: "pendiente" },
    ],
  },
  {
    room: 102,
    beds: [
      { bed: 1, patient: "Carlos López", menu: "Pescado al Horno", time: "13:00", status: "pendiente" },
      { bed: 2, patient: null, menu: null, time: null, status: "libre" },
    ],
  },
  {
    room: 103,
    beds: [
      { bed: 1, patient: "Ana Martín", menu: "Ensalada César", time: "12:15", status: "servido" },
      { bed: 2, patient: "Luis Rodríguez", menu: "Milanesa", time: "13:15", status: "pendiente" },
    ],
  },
]

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
]

export default function CamasPage() {
  const [rooms, setRooms] = useState(initialRooms)
  const [orders, setOrders] = useState(initialOrders)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedBed, setSelectedBed] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)

  const handleAssignMenu = (roomNum, bedNum, patientName, menuId, time) => {
    const menu = menus.find((m) => m.id === Number.parseInt(menuId))
    setRooms((prev) =>
      prev.map((room) => {
        if (room.room === roomNum) {
          return {
            ...room,
            beds: room.beds.map((bed) => {
              if (bed.bed === bedNum) {
                return {
                  ...bed,
                  patient: patientName,
                  menu: menu?.name,
                  time: time,
                  status: "pendiente",
                }
              }
              return bed
            }),
          }
        }
        return room
      }),
    )
    setIsDialogOpen(false)
  }

  const handleCreateOrder = (roomNum, bedNum, patientName, orderItems) => {
    const newOrder = {
      id: orders.length + 1,
      room: roomNum,
      bed: bedNum,
      patient: patientName,
      items: orderItems,
      time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      status: "pendiente",
      type: "paciente",
    }

    setOrders((prev) => [newOrder, ...prev])
    setIsOrderDialogOpen(false)
  }

  const markAsServed = (roomNum, bedNum) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.room === roomNum) {
          return {
            ...room,
            beds: room.beds.map((bed) => {
              if (bed.bed === bedNum) {
                return { ...bed, status: "servido" }
              }
              return bed
            }),
          }
        }
        return room
      }),
    )

    // También actualizar el estado de la orden
    setOrders((prev) =>
      prev.map((order) => {
        if (order.room === roomNum && order.bed === bedNum && order.status === "pendiente") {
          return { ...order, status: "servido" }
        }
        return order
      }),
    )
  }

  const markOrderAsServed = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: "servido" }
        }
        return order
      }),
    )
  }

  const handleCreateNewOrder = (orderData) => {
    const newOrder = {
      id: orders.length + 1,
      room: Number.parseInt(orderData.room),
      bed: Number.parseInt(orderData.bed),
      patient: orderData.patient,
      items: orderData.items,
      time: orderData.time,
      status: "pendiente",
      type: "paciente",
    }

    setOrders((prev) => [newOrder, ...prev])
  }

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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Camas</h1>
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
                {rooms.map((room) => (
                  <Card key={room.room} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bed className="h-5 w-5" />
                        Habitación {room.room}
                      </CardTitle>
                      <CardDescription>
                        {room.beds.filter((bed) => bed.patient).length} de {room.beds.length} camas ocupadas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {room.beds.map((bed) => (
                          <div
                            key={bed.bed}
                            className={`border rounded-lg p-4 transition-colors ${
                              bed.status === "servido"
                                ? "bg-green-50 border-green-200"
                                : bed.status === "pendiente"
                                  ? "bg-orange-50 border-orange-200"
                                  : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Cama {bed.bed}</span>
                                <Badge
                                  variant={
                                    bed.status === "libre"
                                      ? "secondary"
                                      : bed.status === "servido"
                                        ? "default"
                                        : "destructive"
                                  }
                                  className={
                                    bed.status === "servido"
                                      ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                                      : bed.status === "pendiente"
                                        ? "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100"
                                        : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100"
                                  }
                                >
                                  {bed.status === "libre"
                                    ? "Libre"
                                    : bed.status === "servido"
                                      ? "✓ Servido"
                                      : "⏳ Pendiente"}
                                </Badge>
                              </div>
                              {bed.patient && bed.status === "pendiente" && (
                                <Button size="sm" onClick={() => markAsServed(room.room, bed.bed)}>
                                  Marcar Servido
                                </Button>
                              )}
                            </div>

                            {bed.patient ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="h-4 w-4" />
                                  <span>{bed.patient}</span>
                                </div>
                                <div className="text-sm">
                                  <strong>Menú:</strong> {bed.menu}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  <span>{bed.time}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">Cama libre</div>
                            )}

                            <div className="flex gap-2 mt-3">
                              <Dialog
                                open={isDialogOpen && selectedRoom === room.room && selectedBed === bed.bed}
                                onOpenChange={setIsDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                      setSelectedRoom(room.room)
                                      setSelectedBed(bed.bed)
                                      setIsDialogOpen(true)
                                    }}
                                  >
                                    {bed.patient ? "Modificar" : "Asignar Menú"}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md mx-4">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Asignar Menú - Habitación {room.room}, Cama {bed.bed}
                                    </DialogTitle>
                                    <DialogDescription>Selecciona el menú y horario para el paciente</DialogDescription>
                                  </DialogHeader>
                                  <AssignMenuForm
                                    roomNum={room.room}
                                    bedNum={bed.bed}
                                    currentPatient={bed.patient}
                                    onAssign={handleAssignMenu}
                                  />
                                </DialogContent>
                              </Dialog>

                              {bed.patient && (
                                <Dialog
                                  open={isOrderDialogOpen && selectedRoom === room.room && selectedBed === bed.bed}
                                  onOpenChange={setIsOrderDialogOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1"
                                      onClick={() => {
                                        setSelectedRoom(room.room)
                                        setSelectedBed(bed.bed)
                                        setIsOrderDialogOpen(true)
                                      }}
                                    >
                                      <ShoppingCart className="h-3 w-3 mr-1" />
                                      Nueva Orden
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md mx-4">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Nueva Orden - Habitación {room.room}, Cama {bed.bed}
                                      </DialogTitle>
                                      <DialogDescription>Crear orden adicional para {bed.patient}</DialogDescription>
                                    </DialogHeader>
                                    <CreateOrderForm
                                      roomNum={room.room}
                                      bedNum={bed.bed}
                                      patientName={bed.patient}
                                      onCreateOrder={handleCreateOrder}
                                    />
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                        ))}
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
                        Listado de todas las órdenes realizadas para pacientes internados
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
                            Complete los datos para crear una orden para un paciente
                          </DialogDescription>
                        </DialogHeader>
                        <CreateNewOrderForm onCreateOrder={handleCreateNewOrder} />
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
                          order.status === "servido" ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium">
                              Orden #{order.id} - Habitación {order.room}, Cama {order.bed}
                            </div>
                            <div className="text-sm text-gray-600">
                              Paciente: {order.patient} • {order.time}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={order.status === "servido" ? "default" : "destructive"}
                              className={
                                order.status === "servido"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-orange-100 text-orange-800 border-orange-200"
                              }
                            >
                              {order.status === "servido" ? "✓ Servido" : "⏳ Pendiente"}
                            </Badge>
                            {order.status === "pendiente" && (
                              <Button size="sm" onClick={() => markOrderAsServed(order.id)}>
                                Marcar Servido
                              </Button>
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
  )
}

function AssignMenuForm({ roomNum, bedNum, currentPatient, onAssign }) {
  const [patientName, setPatientName] = useState(currentPatient || "")
  const [selectedMenu, setSelectedMenu] = useState("")
  const [time, setTime] = useState("12:00")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (patientName && selectedMenu && time) {
      onAssign(roomNum, bedNum, patientName, selectedMenu, time)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="patient">Nombre del Paciente</Label>
        <Input
          id="patient"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Ingrese el nombre del paciente"
          required
        />
      </div>

      <div>
        <Label htmlFor="menu">Menú</Label>
        <Select value={selectedMenu} onValueChange={setSelectedMenu} required>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un menú" />
          </SelectTrigger>
          <SelectContent>
            {menus.map((menu) => (
              <SelectItem key={menu.id} value={menu.id.toString()}>
                {menu.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="time">Horario</Label>
        <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>

      <Button type="submit" className="w-full">
        Asignar Menú
      </Button>
    </form>
  )
}

function CreateOrderForm({ roomNum, bedNum, patientName, onCreateOrder }) {
  const [orderItems, setOrderItems] = useState([])
  const [selectedMenuId, setSelectedMenuId] = useState("")
  const [selectedBebidaId, setSelectedBebidaId] = useState("")

  const addMenuItem = () => {
    if (!selectedMenuId) return
    const menu = menus.find((m) => m.id === Number.parseInt(selectedMenuId))
    if (menu) {
      const existing = orderItems.find((item) => item.name === menu.name)
      if (existing) {
        setOrderItems((prev) => prev.map((item) => (item.name === menu.name ? { ...item, qty: item.qty + 1 } : item)))
      } else {
        setOrderItems((prev) => [...prev, { name: menu.name, qty: 1, type: "menu" }])
      }
      setSelectedMenuId("")
    }
  }

  const addBebida = () => {
    if (!selectedBebidaId) return
    const bebida = bebidas.find((b) => b.id === Number.parseInt(selectedBebidaId))
    if (bebida) {
      const existing = orderItems.find((item) => item.name === bebida.name)
      if (existing) {
        setOrderItems((prev) => prev.map((item) => (item.name === bebida.name ? { ...item, qty: item.qty + 1 } : item)))
      } else {
        setOrderItems((prev) => [...prev, { name: bebida.name, qty: 1, type: "bebida" }])
      }
      setSelectedBebidaId("")
    }
  }

  const removeItem = (itemName) => {
    setOrderItems((prev) => prev.filter((item) => item.name !== itemName))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (orderItems.length > 0) {
      onCreateOrder(roomNum, bedNum, patientName, orderItems)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Agregar Menú</Label>
        <div className="flex gap-2">
          <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Seleccionar menú..." />
            </SelectTrigger>
            <SelectContent>
              {menus.map((menu) => (
                <SelectItem key={menu.id} value={menu.id.toString()}>
                  {menu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addMenuItem} disabled={!selectedMenuId}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label>Agregar Bebida</Label>
        <div className="flex gap-2">
          <Select value={selectedBebidaId} onValueChange={setSelectedBebidaId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Seleccionar bebida..." />
            </SelectTrigger>
            <SelectContent>
              {bebidas.map((bebida) => (
                <SelectItem key={bebida.id} value={bebida.id.toString()}>
                  {bebida.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addBebida} disabled={!selectedBebidaId}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {orderItems.length > 0 && (
        <div>
          <Label>Items de la Orden</Label>
          <div className="space-y-2 mt-2">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>
                  {item.name} x{item.qty}
                  {item.type === "bebida" && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Bebida
                    </Badge>
                  )}
                </span>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeItem(item.name)}>
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={orderItems.length === 0}>
        Crear Orden
      </Button>
    </form>
  )
}

function CreateNewOrderForm({ onCreateOrder }) {
  const [formData, setFormData] = useState({
    patient: "",
    room: "",
    bed: "",
    time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
  })
  const [orderItems, setOrderItems] = useState([])
  const [selectedMenuId, setSelectedMenuId] = useState("")
  const [selectedBebidaId, setSelectedBebidaId] = useState("")

  const addMenuItem = () => {
    if (!selectedMenuId) return
    const menu = menus.find((m) => m.id === Number.parseInt(selectedMenuId))
    if (menu) {
      const existing = orderItems.find((item) => item.name === menu.name)
      if (existing) {
        setOrderItems((prev) => prev.map((item) => (item.name === menu.name ? { ...item, qty: item.qty + 1 } : item)))
      } else {
        setOrderItems((prev) => [...prev, { name: menu.name, qty: 1, type: "menu" }])
      }
      setSelectedMenuId("")
    }
  }

  const addBebida = () => {
    if (!selectedBebidaId) return
    const bebida = bebidas.find((b) => b.id === Number.parseInt(selectedBebidaId))
    if (bebida) {
      const existing = orderItems.find((item) => item.name === bebida.name)
      if (existing) {
        setOrderItems((prev) => prev.map((item) => (item.name === bebida.name ? { ...item, qty: item.qty + 1 } : item)))
      } else {
        setOrderItems((prev) => [...prev, { name: bebida.name, qty: 1, type: "bebida" }])
      }
      setSelectedBebidaId("")
    }
  }

  const removeItem = (itemName) => {
    setOrderItems((prev) => prev.filter((item) => item.name !== itemName))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.patient && formData.room && formData.bed && formData.time && orderItems.length > 0) {
      onCreateOrder({
        ...formData,
        items: orderItems,
      })
      // Reset form
      setFormData({
        patient: "",
        room: "",
        bed: "",
        time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      })
      setOrderItems([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patient">Nombre del Paciente</Label>
          <Input
            id="patient"
            value={formData.patient}
            onChange={(e) => setFormData((prev) => ({ ...prev, patient: e.target.value }))}
            placeholder="Nombre completo"
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Horario</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="room">Habitación</Label>
          <Input
            id="room"
            type="number"
            value={formData.room}
            onChange={(e) => setFormData((prev) => ({ ...prev, room: e.target.value }))}
            placeholder="101"
            required
          />
        </div>
        <div>
          <Label htmlFor="bed">Cama</Label>
          <Input
            id="bed"
            type="number"
            value={formData.bed}
            onChange={(e) => setFormData((prev) => ({ ...prev, bed: e.target.value }))}
            placeholder="1"
            required
          />
        </div>
      </div>

      <div>
        <Label>Agregar Menú</Label>
        <div className="flex gap-2">
          <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Seleccionar menú..." />
            </SelectTrigger>
            <SelectContent>
              {menus.map((menu) => (
                <SelectItem key={menu.id} value={menu.id.toString()}>
                  {menu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addMenuItem} disabled={!selectedMenuId}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label>Agregar Bebida</Label>
        <div className="flex gap-2">
          <Select value={selectedBebidaId} onValueChange={setSelectedBebidaId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Seleccionar bebida..." />
            </SelectTrigger>
            <SelectContent>
              {bebidas.map((bebida) => (
                <SelectItem key={bebida.id} value={bebida.id.toString()}>
                  {bebida.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addBebida} disabled={!selectedBebidaId}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {orderItems.length > 0 && (
        <div>
          <Label>Items de la Orden</Label>
          <div className="space-y-2 mt-2">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>
                  {item.name} x{item.qty}
                  {item.type === "bebida" && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Bebida
                    </Badge>
                  )}
                </span>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeItem(item.name)}>
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={orderItems.length === 0}>
        Crear Orden
      </Button>
    </form>
  )
}
