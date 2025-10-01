# AutoMatch

Plataforma web inteligente para búsqueda, comparación y recomendación de vehículos con asistente de IA integrado.

## Descripción

AutoMatch es una plataforma moderna que combina un catálogo completo de vehículos con inteligencia artificial para ayudar a los usuarios a encontrar el vehículo perfecto según sus necesidades, presupuesto y preferencias. La plataforma ofrece búsqueda avanzada, filtros inteligentes, comparación lado a lado y un asistente virtual conversacional.

## Características Principales

### Catálogo Inteligente
- **Más de 500 vehículos** de 20+ marcas reconocidas
- **Filtros avanzados**: marca, tipo de vehículo, combustible, transmisión, precio, año, características
- **Búsqueda full-text** optimizada en español con PostgreSQL
- **Ordenamiento flexible**: por precio, año, eficiencia de combustible, etc.
- **Paginación eficiente** con caché de resultados

### Asistente de IA
- **Conversacional e inteligente**: comprende lenguaje natural
- **Recomendaciones personalizadas** basadas en presupuesto y necesidades
- **Aprendizaje continuo**: mejora con cada interacción del usuario
- **Preguntas sugeridas** para facilitar la búsqueda
- **Análisis de preferencias** guardadas por sesión

### Comparador de Vehículos
- **Comparación lado a lado** de hasta 4 vehículos
- **Métricas detalladas**: especificaciones técnicas, rendimiento, seguridad
- **Visualización clara** de diferencias y similitudes
- **Exportación de comparaciones**

### Experiencia de Usuario
- **Diseño neobrutalist moderno**: bordes gruesos, sombras pronunciadas, alto contraste
- **Modo oscuro/claro automático** con detección del sistema
- **Responsive**: optimizado para móvil, tablet y desktop
- **Animaciones fluidas** y transiciones suaves
- **Accesibilidad** y navegación intuitiva

## Arquitectura Técnica

### Backend (Go)
```
backend/
├── cmd/              # Punto de entrada de la aplicación
├── internal/
│   ├── models/       # Modelos de datos (Vehicle, Brand, etc.)
│   ├── handlers/     # Controladores HTTP (Gin)
│   ├── database/     # Repositorios y conexión DB
│   └── middleware/   # Middlewares (CORS, Auth, etc.)
├── migrations/       # Migraciones de base de datos
└── pkg/             # Paquetes reutilizables
```

**Stack Backend:**
- **Framework**: Gin (HTTP router)
- **Base de datos**: PostgreSQL 14+
- **Caché**: Redis
- **ORM**: database/sql (estándar de Go)
- **Búsqueda**: Full-text search con tsvector

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/   # Componentes reutilizables (VehicleCard, FilterSidebar)
│   ├── pages/        # Páginas principales (Home, Catalog, AIAssistant)
│   ├── services/     # Servicios API (vehicleService)
│   ├── types/        # Tipos TypeScript
│   ├── hooks/        # Custom hooks (useTheme)
│   └── lib/          # Utilidades
├── public/          # Assets estáticos
└── index.html       # HTML base
```

**Stack Frontend:**
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Estilos**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Iconos**: Lucide React
- **HTTP Client**: Axios

## Base de Datos

### Esquema Principal

**Tablas Core:**
- `vehicles`: Información principal de vehículos
- `brands`: Marcas de vehículos (Toyota, Mazda, etc.)
- `vehicle_types`: Tipos (Sedan, SUV, Pickup, etc.)
- `fuel_types`: Tipos de combustible (Gasolina, Diesel, Híbrido, Eléctrico)
- `transmissions`: Tipos de transmisión (Manual, Automática, CVT)

**Tablas Auxiliares:**
- `vehicle_features`: Características por vehículo
- `vehicle_images`: Galería de imágenes múltiples
- `vehicle_specs`: Especificaciones técnicas adicionales

**Tablas de Analytics:**
- `user_searches`: Búsquedas realizadas (para mejorar IA)
- `user_preferences`: Preferencias guardadas por sesión

### Índices Optimizados
- Índices B-tree en claves foráneas y campos de búsqueda frecuente
- Índice GIN para búsqueda full-text en español
- Triggers automáticos para `updated_at`

## API REST

### Endpoints Principales

```
GET    /api/vehicles              # Listar vehículos con paginación
GET    /api/vehicles/:id          # Obtener vehículo por ID
GET    /api/vehicles/search       # Búsqueda con filtros
POST   /api/vehicles/compare      # Comparar vehículos

GET    /api/brands                # Listar marcas
GET    /api/vehicle-types         # Listar tipos de vehículo
GET    /api/fuel-types            # Listar tipos de combustible
GET    /api/transmissions         # Listar transmisiones
GET    /api/filters               # Obtener todos los filtros

POST   /api/user-searches         # Guardar búsqueda (analytics)
POST   /api/user-preferences      # Guardar preferencia (IA)
```

### Filtros de Búsqueda

```typescript
{
  query: string              // Búsqueda de texto
  brandIds: number[]         // Filtro por marcas
  typeIds: number[]          // Filtro por tipos
  fuelTypeIds: number[]      // Filtro por combustible
  transmissionIds: number[]  // Filtro por transmisión
  priceMin: number           // Precio mínimo
  priceMax: number           // Precio máximo
  yearMin: number            // Año mínimo
  yearMax: number            // Año máximo
  doorsMin: number           // Puertas mínimas
  seatsMin: number           // Asientos mínimos
  fuelEconomyMin: number     // Eficiencia mínima
  sortBy: string             // Ordenamiento
  page: number               // Página
  limit: number              // Resultados por página
}
```

## Instalación y Desarrollo

### Prerrequisitos
- Go 1.21+
- Node.js 18+
- PostgreSQL 14+
- Redis 7+

### Backend

```bash
cd backend

# Instalar dependencias
go mod download

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
psql -U postgres -d vehiculos_db -f migrations/001_initial_schema.sql

# Iniciar servidor
go run cmd/main.go
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev

# Build para producción
npm run build
```

## Configuración

### Variables de Entorno - Backend

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=vehiculos_db

REDIS_HOST=localhost
REDIS_PORT=6379

SERVER_PORT=8080
```

### Variables de Entorno - Frontend

```env
VITE_API_URL=http://localhost:8080/api
```

## Visión Futura

### Fase 1 (Actual) ✓
- ✅ Catálogo completo con filtros
- ✅ Sistema de búsqueda avanzado
- ✅ Diseño responsive y modo oscuro
- ✅ Base para asistente IA

### Fase 2 (Corto Plazo)
- 🔄 Integración con LLM real (OpenAI/Claude)
- 🔄 Sistema de recomendaciones con ML
- 🔄 Galería de imágenes múltiples
- 🔄 Comparador avanzado con gráficos
- 🔄 Autenticación de usuarios

### Fase 3 (Mediano Plazo)
- 📋 Sistema de favoritos y listas guardadas
- 📋 Alertas de precio y disponibilidad
- 📋 Integración con dealerships
- 📋 Sistema de reviews y ratings
- 📋 Calculadora de financiamiento

### Fase 4 (Largo Plazo)
- 📋 Marketplace completo (compra/venta)
- 📋 Sistema de agendamiento de pruebas de manejo
- 📋 Chat en tiempo real con vendedores
- 📋 Integración con seguros y financieras
- 📋 App móvil nativa (iOS/Android)
- 📋 Realidad aumentada (AR) para visualización

## Características de IA Planificadas

### Recomendador Inteligente
- **Análisis de preferencias**: presupuesto, uso, estilo de vida
- **Aprendizaje contextual**: mejora con cada conversación
- **Comparación automática**: sugiere alternativas similares
- **Scoring personalizado**: califica vehículos según perfil

### Procesamiento de Lenguaje Natural
- **Comprensión de intenciones**: "Busco una SUV familiar económica"
- **Extracción de entidades**: marca, modelo, características
- **Conversación contextual**: recuerda preferencias previas
- **Respuestas personalizadas**: adaptadas al usuario

### Analytics y Mejora Continua
- **Tracking de búsquedas**: patrones y tendencias
- **A/B testing**: optimización de recomendaciones
- **Feedback loop**: mejora basada en selecciones
- **Predicción de preferencias**: anticipa necesidades

## Tecnologías Clave

### Performance
- **Caché multi-nivel**: Redis para datos frecuentes
- **Índices optimizados**: PostgreSQL full-text search
- **Lazy loading**: imágenes y componentes
- **Code splitting**: chunks optimizados con Vite

### Seguridad
- **Prepared statements**: prevención de SQL injection
- **CORS configurado**: control de orígenes
- **Rate limiting**: protección contra abuso
- **Input validation**: sanitización de datos

### Escalabilidad
- **Arquitectura modular**: fácil de escalar
- **Stateless API**: permite balanceo de carga
- **Caché distribuido**: Redis cluster-ready
- **Database pooling**: conexiones optimizadas

## Contribución

Este es un proyecto personal en desarrollo activo. Las contribuciones, ideas y sugerencias son bienvenidas.

## Licencia

Proyecto privado - Todos los derechos reservados

## Contacto

Para más información sobre el proyecto, consultas o colaboraciones, por favor contacta al desarrollador.

---

**AutoMatch** - Encuentra tu vehículo ideal con inteligencia artificial 🚗✨
