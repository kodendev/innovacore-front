# 🏥 InnovaCore Front - Sistema Cocina Sanatorio

Sistema de gestión integral para la cocina de un sanatorio, desarrollado con [Next.js](https://nextjs.org/). Este sistema permite la administración completa de menús para pacientes internados, control de inventario, punto de venta y gestión de proveedores.

## 📋 Descripción del Proyecto

InnovaCore Front es una aplicación web moderna diseñada para optimizar y digitalizar las operaciones de una cocina de sanatorio. El sistema facilita la gestión diaria de comidas para pacientes, control de stock, ventas a empleados y visitantes, y la administración de menús especializados.

### Características Principales

- **Gestión de Camas**: Asignación de menús a pacientes internados por habitación y cama
- **Control de Inventario**: Gestión de ingredientes, stock y control de vencimientos
- **Punto de Venta**: Sistema POS para ventas a empleados y visitantes
- **Gestión de Menús**: Creación y administración de menús diarios y especiales
- **Gestión de Proveedores**: Control de proveedores y pedidos
- **Reportes**: Generación de reportes y estadísticas
- **Dashboard Interactivo**: Vista general con métricas en tiempo real

## 🚀 Tecnologías Utilizadas

### Core
- **[Next.js 15.2.4](https://nextjs.org/)** - Framework de React con SSR/SSG
- **[React 19](https://reactjs.org/)** - Librería para interfaces de usuario
- **[TypeScript 5](https://www.typescriptlang.org/)** - JavaScript con tipado estático
- **[TailwindCSS 3.4](https://tailwindcss.com/)** - Framework CSS utility-first

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Componentes accesibles y sin estilo
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes reutilizables basados en Radix
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[React Icons](https://react-icons.github.io/react-icons/)** - Librería de iconos

### State Management & Data Fetching
- **[TanStack Query (React Query)](https://tanstack.com/query/latest)** - Gestión de estado del servidor
- **[Axios](https://axios-http.com/)** - Cliente HTTP para APIs
- **[React Hook Form](https://react-hook-form.com/)** - Gestión de formularios

### Utilities
- **[Zod](https://zod.dev/)** - Validación de esquemas TypeScript-first
- **[date-fns](https://date-fns.org/)** - Utilidades para fechas
- **[clsx](https://github.com/lukeed/clsx)** & **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Utilidades para clases CSS
- **[Sonner](https://sonner.emilkowal.ski/)** - Notificaciones toast elegantes
- **[Next Themes](https://github.com/pacocoursey/next-themes)** - Soporte para temas claro/oscuro

## 📂 Estructura del Proyecto

```
innovacore-front/
├── app/                          # Directorio principal de Next.js App Router
│   ├── camas/                    # Módulo de gestión de camas
│   ├── configuracion/            # Configuración del sistema
│   ├── inventario/               # Gestión de stock e inventario
│   ├── menus/                    # Gestión de menús
│   ├── proveedores/              # Gestión de proveedores
│   ├── punto-venta/              # Punto de venta (POS)
│   ├── reportes/                 # Reportes y estadísticas
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Dashboard principal
│   ├── globals.css               # Estilos globales
│   └── providers.tsx             # Providers de React (Query, Themes)
├── components/                   # Componentes reutilizables
│   ├── forms/                    # Componentes de formularios
│   ├── menus/                    # Componentes específicos de menús
│   ├── pop-ups/                  # Modales y diálogos
│   ├── spinners/                 # Componentes de carga
│   ├── stockTabs/                # Componentes de inventario
│   ├── tables/                   # Componentes de tablas
│   ├── ui/                       # Componentes UI base (shadcn/ui)
│   └── theme-provider.tsx        # Provider de temas
├── data/                         # Datos y servicios API
│   ├── api/                      # Configuración de APIs
│   └── fakeData.ts              # Datos de prueba
├── hooks/                        # Custom React hooks
├── lib/                          # Utilidades y configuraciones
│   └── utils.ts                  # Funciones auxiliares
├── public/                       # Archivos estáticos
├── styles/                       # Estilos adicionales
├── types/                        # Definiciones de tipos TypeScript
├── utils/                        # Utilidades adicionales
├── components.json               # Configuración de shadcn/ui
├── next.config.mjs               # Configuración de Next.js
├── tailwind.config.ts            # Configuración de TailwindCSS
├── tsconfig.json                 # Configuración de TypeScript
└── package.json                  # Dependencias y scripts
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- **Node.js** 18+ o superior
- **npm**, **yarn** o **pnpm** (gestor de paquetes)
- Conexión a internet para descargar dependencias

### Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/kodendev/innovacore-front.git
cd innovacore-front
```

2. **Instalar dependencias**:

Con npm:
```bash
npm install
```

Con yarn:
```bash
yarn install
```

Con pnpm:
```bash
pnpm install
```

3. **Configurar variables de entorno** (opcional):

Crear un archivo `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000/api
```

## 🚀 Scripts Disponibles

### Desarrollo

Inicia el servidor de desarrollo en `http://localhost:3000`:

```bash
npm run dev
```

La aplicación se recargará automáticamente al hacer cambios en el código.

### Producción

**Construir para producción**:
```bash
npm run build
```

**Iniciar servidor de producción**:
```bash
npm start
```

### Linting

Ejecutar ESLint para verificar el código:
```bash
npm run lint
```

## 📱 Módulos del Sistema

### 🛏️ Gestión de Camas
Módulo para la asignación de menús a pacientes internados.

**Funcionalidades**:
- Asignación de menús por habitación y cama
- Control de dietas especiales
- Historial de comidas servidas
- Gestión de restricciones alimentarias

**Ruta**: `/camas`

### 📦 Inventario
Control completo del stock de ingredientes y productos.

**Funcionalidades**:
- Gestión de ingredientes y cantidades
- Control de vencimientos
- Alertas de stock bajo
- Movimientos de inventario
- Categorización de productos

**Ruta**: `/inventario`

### 🛒 Punto de Venta
Sistema POS para ventas a empleados y visitantes del sanatorio.

**Funcionalidades**:
- Crear órdenes de menús
- Procesamiento de pagos
- Historial de ventas
- Tickets e impresiones
- Gestión de caja

**Ruta**: `/punto-venta`

### 🍽️ Gestión de Menús
Creación y administración de menús del día.

**Funcionalidades**:
- Crear nuevos menús
- Editar menús existentes
- Programar menús semanales
- Categorización por tipo de comida
- Filtros y búsquedas avanzadas

**Ruta**: `/menus`

### 🏢 Proveedores
Gestión de proveedores y pedidos.

**Funcionalidades**:
- Registro de proveedores
- Gestión de contactos
- Historial de pedidos
- Evaluación de proveedores

**Ruta**: `/proveedores`

### 📊 Reportes
Generación de reportes y análisis de datos.

**Funcionalidades**:
- Reportes de ventas
- Estadísticas de consumo
- Análisis de stock
- Exportación de datos

**Ruta**: `/reportes`

## 🎨 Personalización

### Temas
El sistema soporta temas claro y oscuro. La configuración se gestiona automáticamente mediante `next-themes`.

### Componentes UI
Los componentes están basados en shadcn/ui y pueden personalizarse editando:
- `tailwind.config.ts` - Colores, fuentes y estilos globales
- `app/globals.css` - Variables CSS y estilos base
- `components/ui/` - Componentes individuales

## 🔧 Desarrollo

### Agregar Nuevos Componentes UI

Usar el CLI de shadcn/ui:
```bash
npx shadcn-ui@latest add [component-name]
```

### Estructura de Rutas

El proyecto usa Next.js App Router. Para crear nuevas rutas:
1. Crear carpeta en `app/[nombre-ruta]/`
2. Agregar archivo `page.tsx` con el componente de la página

### API Routes

Las rutas API se pueden crear en `app/api/[ruta]/route.ts`.

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Notas de Configuración

- **ESLint**: Configurado para ignorar errores durante build (`ignoreDuringBuilds: true`)
- **TypeScript**: Configurado para ignorar errores de tipo durante build
- **Imágenes**: Sin optimización (`unoptimized: true`) para facilitar deployment

## 📄 Licencia

Este proyecto es privado y pertenece a su respectivo propietario.

## 👥 Equipo

Desarrollado por el equipo de KodenDev.

## 📞 Soporte

Para soporte y preguntas, contactar al equipo de desarrollo.

---

**Versión**: 0.1.0  
**Última actualización**: Enero 2026  
**Framework**: Next.js 15.2.4  
**React**: 19

