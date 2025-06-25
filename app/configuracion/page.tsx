"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  ArrowLeft,
  Building,
  Mail,
  Phone,
  MapPin,
  Upload,
  Lock,
  Save,
  User,
  Shield,
  Bell,
} from "lucide-react"
import Link from "next/link"

const initialConfig = {
  entityName: "Sanatorio San Rafael",
  email: "administracion@sanatoriosanrafael.com",
  phone: "+54 11 4567-8900",
  address: "Av. Santa Fe 1234, CABA, Argentina",
  description:
    "Centro de salud especializado en atención integral con servicios de internación, consultorios externos y emergencias las 24 horas.",
  logo: "/placeholder.svg?height=100&width=100",
  adminName: "Dr. Carlos Mendoza",
  adminEmail: "carlos.mendoza@sanatoriosanrafael.com",
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState(initialConfig)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    // Aquí se guardaría en la base de datos
    console.log("Configuración guardada:", config)
  }

  const handleCancel = () => {
    setConfig(initialConfig)
    setIsEditing(false)
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Configuración</h1>
            </div>
            <div className="flex items-center gap-2">
              {isEditing && (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Guardando..." : "Guardar"}
                  </Button>
                </>
              )}
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="admin">Administrador</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Información de la Entidad
                  </CardTitle>
                  <CardDescription>Configuración general del sanatorio y datos de contacto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo Section */}
                  <div className="flex items-center gap-6">
                    <div>
                      <Label>Logo de la Entidad</Label>
                      <div className="mt-2">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={config.logo || "/placeholder.svg"} alt="Logo" />
                          <AvatarFallback className="text-lg">
                            <Building className="h-8 w-8" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Cambiar Logo
                        </Button>
                        <p className="text-xs text-gray-500">Formatos: JPG, PNG. Máximo 2MB</p>
                      </div>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="entityName">Nombre de la Entidad</Label>
                      <Input
                        id="entityName"
                        value={config.entityName}
                        onChange={(e) => setConfig((prev) => ({ ...prev, entityName: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Teléfono Principal</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          value={config.phone}
                          onChange={(e) => setConfig((prev) => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Principal</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={config.email}
                          onChange={(e) => setConfig((prev) => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="address"
                          value={config.address}
                          onChange={(e) => setConfig((prev) => ({ ...prev, address: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => setConfig((prev) => ({ ...prev, description: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                      className="mt-1"
                      placeholder="Descripción breve de la entidad..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información del Administrador
                  </CardTitle>
                  <CardDescription>Datos del usuario administrador del sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div>
                      <Label>Avatar del Administrador</Label>
                      <div className="mt-2">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Admin" />
                          <AvatarFallback className="text-lg">
                            {config.adminName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Cambiar Avatar
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="adminName">Nombre Completo</Label>
                      <Input
                        id="adminName"
                        value={config.adminName}
                        onChange={(e) => setConfig((prev) => ({ ...prev, adminName: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="adminEmail">Email del Administrador</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="adminEmail"
                          type="email"
                          value={config.adminEmail}
                          onChange={(e) => setConfig((prev) => ({ ...prev, adminEmail: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Rol del Usuario</h4>
                        <p className="text-sm text-gray-600">Administrador del Sistema</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">Acceso Completo</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Seguridad de la Cuenta
                    </CardTitle>
                    <CardDescription>Gestiona la seguridad y privacidad de tu cuenta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Contraseña</h4>
                        <p className="text-sm text-gray-600">Última actualización: hace 30 días</p>
                      </div>
                      <Button variant="outline">
                        <Lock className="h-4 w-4 mr-2" />
                        Cambiar Contraseña
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Autenticación de Dos Factores</h4>
                        <p className="text-sm text-gray-600">Añade una capa extra de seguridad</p>
                      </div>
                      <Button variant="outline">
                        <Shield className="h-4 w-4 mr-2" />
                        Configurar 2FA
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Sesiones Activas</h4>
                        <p className="text-sm text-gray-600">Gestiona tus sesiones en otros dispositivos</p>
                      </div>
                      <Button variant="outline">Ver Sesiones</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notificaciones
                    </CardTitle>
                    <CardDescription>Configura cómo y cuándo recibir notificaciones</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Stock Bajo</h4>
                        <p className="text-sm text-gray-600">Notificar cuando el stock esté bajo</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Activado
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Nuevas Ventas</h4>
                        <p className="text-sm text-gray-600">Notificar sobre nuevas transacciones</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Activado
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Reportes Semanales</h4>
                        <p className="text-sm text-gray-600">Recibir resumen semanal por email</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Desactivado
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
