# Especificaciones Técnicas - Innovation Network Manager

## Arquitectura del Sistema

### Frontend
- **Framework**: React 18.3.1
- **Lenguaje**: TypeScript 5.5.3
- **Bundler**: Vite 5.4.2
- **Estilos**: Tailwind CSS 3.4.1
- **Componentes UI**: Tremor (@tremor/react) 3.14.1
- **Editor de Texto**: TipTap 2.2.4
- **Iconos**: Lucide React 0.344.0
- **Gestión de Estado**: Zustand 4.5.2
- **Enrutamiento**: React Router DOM 6.22.3
- **Cliente HTTP**: TanStack Query 5.28.4

### Backend
- **Runtime**: Node.js 20 LTS
- **Base de Datos**: MariaDB 10.11
- **ORM**: MariaDB Node.js Connector 3.2.3
- **Email**: Nodemailer 6.9.12
- **Validación**: Zod 3.22.4

## Requisitos del Sistema

### Desarrollo
- Node.js 20.x o superior
- NPM 10.x o superior
- 8GB RAM mínimo
- 20GB espacio en disco

### Producción
- CPU: 4 cores mínimo
- RAM: 4GB mínimo
- Almacenamiento: 20GB mínimo
- Sistema Operativo: Debian 11 o superior

## Estructura de la Base de Datos

### Tablas Principales

#### users
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  medusaCode VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  center VARCHAR(100) NOT NULL,
  network VARCHAR(50) NOT NULL,
  role ENUM('admin', 'general_coordinator', 'subnet_coordinator', 'manager') NOT NULL,
  imageUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### actions
```sql
CREATE TABLE actions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  studentParticipants INT NOT NULL DEFAULT 0,
  teacherParticipants INT NOT NULL DEFAULT 0,
  rating INT NOT NULL DEFAULT 5,
  comments TEXT,
  createdBy VARCHAR(36) NOT NULL,
  network VARCHAR(50) NOT NULL,
  center VARCHAR(100) NOT NULL,
  quarter VARCHAR(36) NOT NULL,
  imageUrl TEXT,
  documentUrl TEXT,
  documentName VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Características Principales

### Gestión de Usuarios
- Sistema de roles jerárquico
- Autenticación basada en JWT
- Recuperación de contraseña por email
- Registro con código de invitación
- Perfiles de usuario con avatar

### Gestión de Acciones
- CRUD completo de acciones
- Filtrado multicriteria
- Carga de imágenes y documentos
- Sistema de valoración
- Estadísticas y reportes

### Calendario y Reuniones
- Vista de calendario mensual
- Gestión de reuniones
- Integración con videoconferencias
- Notificaciones por email

### Reportes y Estadísticas
- Generación de informes en Excel
- Gráficos interactivos
- Filtros avanzados
- Exportación de datos

## Seguridad

### Autenticación
- Tokens JWT con rotación
- Contraseñas hasheadas con bcrypt
- Protección contra fuerza bruta
- Sesiones con tiempo de expiración

### Autorización
- Control de acceso basado en roles (RBAC)
- Permisos granulares por módulo
- Validación de tokens en cada petición
- Sanitización de inputs

### Protección de Datos
- Encriptación de datos sensibles
- Validación de tipos con Zod
- Prevención de SQL Injection
- Sanitización de HTML en rich text

## API REST

### Endpoints Principales

#### Autenticación
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/recover
- POST /api/auth/reset-password

#### Usuarios
- GET /api/users
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

#### Acciones
- GET /api/actions
- POST /api/actions
- PUT /api/actions/:id
- DELETE /api/actions/:id

## Optimización

### Frontend
- Code splitting por rutas
- Lazy loading de componentes
- Caché de consultas con React Query
- Optimización de imágenes

### Backend
- Conexiones pooling de base de datos
- Caché de consultas frecuentes
- Compresión gzip/brotli
- Rate limiting

## Monitoreo

### Logs
- Logs de aplicación en `/logs`
- Logs de base de datos
- Logs de acceso
- Logs de errores

### Métricas
- Uso de CPU/memoria
- Tiempo de respuesta
- Errores y excepciones
- Usuarios activos

## Mantenimiento

### Backups
- Backup diario de base de datos
- Backup semanal completo
- Retención de 30 días
- Verificación automática

### Actualizaciones
- Actualización de dependencias
- Parches de seguridad
- Migraciones de base de datos
- Rollback automatizado

## Escalabilidad

### Horizontal
- Arquitectura stateless
- Sesiones en Redis (planificado)
- Balanceo de carga (planificado)
- Replicación de base de datos

### Vertical
- Optimización de consultas
- Índices de base de datos
- Caché en memoria
- Compresión de datos

## Integración Continua

### Pipeline
- Linting y formateo
- Tests unitarios
- Tests de integración
- Build y deploy automático

### Calidad de Código
- ESLint configuración estricta
- Prettier para formateo
- TypeScript strict mode
- Husky para pre-commit hooks