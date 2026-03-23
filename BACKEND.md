# Documentación del Backend

> Estado actual del proyecto y plan de implementación del backend basado en el frontend existente.

---

## 1. Resumen Ejecutivo

El proyecto es un **sistema de gestión empresarial** con enfoque en:
- Gestión de empleados y contratistas
- Planificación de cargos y turnos
- Control de visitantes
- Gestión documental
- **SGSST** (Sistema de Gestión de Seguridad y Salud en el Trabajo)

### Stack Tecnológico
| Capa | Tecnología |
|------|------------|
| Frontend | React + TypeScript + Vite + TailwindCSS + Zustand |
| Backend | Node.js + Express + TypeScript |
| Base de Datos | PostgreSQL + Prisma ORM |
| Autenticación | JWT |

---

## 2. Estado Actual del Frontend

El frontend está **completamente funcional con datos mock**. No tiene conexión al backend.

### Módulos Implementados en Frontend

```
📁 src/pages/
├── 📄 Login.tsx                    ← Autenticación mock (admin@gmail.com / admin)
│
├── 📁 sedes/                       ← CRUD completo
│   ├── ListaSedes.tsx
│   └── FormSede.tsx
│
├── 📁 empleados/                   ← CRUD + Carga masiva Excel
│   ├── ListaEmpleados.tsx
│   ├── AgregarEmpleado.tsx
│   ├── CargaMasiva.tsx
│   └── ActualizacionMasiva.tsx
│
├── 📁 planificacion/               ← Planificación de cargos
│   ├── PlanificacionCargos.tsx
│   └── CargaMasivaPlanificacion.tsx
│
├── 📁 actividades/                 ← CRUD Actividades
├── 📁 contratistas/                ← CRUD Contratistas
├── 📁 documentos/                  ← Gestión de documentos
├── 📁 centrosCostos/               ← CRUD Centros de Costo
├── 📁 visitantes/                  ← Control de visitantes
├── 📁 destinos/                    ← CRUD Destinos
├── 📁 reportes/                    ← Reportes y estadísticas
│
└── 📁 sgsst/                       ← 22 módulos SGSST (placeholders)
    ├── DetallesEmpresa.tsx
    ├── DiagnosticoInicial.tsx
    ├── PeriodosTrabajo.tsx
    ├── MatrizLegal.tsx
    ├── PlaneadorActividades.tsx
    ├── GestionRiesgos.tsx
    ├── GestionDocumental.tsx
    ├── FichasIndicadores.tsx
    ├── MisTrabajadores.tsx
    ├── PerfilesCargo.tsx
    ├── ReporteAusentismos.tsx
    ├── MedicinaLaboral.tsx
    ├── ReporteAccidentes.tsx
    ├── BateriaPsicosocial.tsx
    ├── GestionTAR.tsx
    ├── ContratistasSST.tsx
    ├── ActosCondicionesInseguras.tsx
    ├── MatrizMejora.tsx
    ├── AccionesCorrectivas.tsx
    ├── InspeccionesSeguridad.tsx
    ├── PlanesEmergencia.tsx
    ├── EvaluacionSimulacros.tsx
    ├── SeguridadVial.tsx
    └── GestionQuimicos.tsx
    └── ControlesAcceso.tsx
```

### Datos Mock Actuales

Todo el frontend funciona con datos estáticos en `src/data/mockData.ts`:

| Entidad | Cantidad Mock | Estado |
|---------|---------------|--------|
| Centros de Costo | 6 registros | ✅ Funcional |
| Contratistas | 6 registros | ✅ Funcional |
| Sedes | 15 registros | ✅ Funcional |
| Empleados | 5 registros | ✅ Funcional |
| Actividades | 5 registros | ✅ Funcional |
| Destinos | 5 registros | ✅ Funcional |
| Planificación Cargos | 8 registros | ✅ Funcional |
| Visitantes | 3 registros | ✅ Funcional |
| Documentos | 5 registros | ✅ Funcional |

---

## 3. Estado Actual del Backend

### ✅ Qué SÍ existe en el backend:

| Componente | Estado | Descripción |
|------------|--------|-------------|
| `prisma/schema.prisma` | ✅ Completo | Modelos de BD definidos para todas las entidades |
| `src/index.ts` | ⚠️ Incompleto | Intenta importar rutas que no existen |
| `src/controllers/` | ✅ 12 controladores | CRUD completo para todas las entidades |
| `src/services/` | ⚠️ Parcial | Solo `auth.service.ts` y `dashboard.service.ts` |
| `src/middleware/` | ✅ Completo | auth, errorHandler, upload, validation |
| `src/config/` | ✅ Completo | database.ts, env.ts |
| `src/types/` | ✅ Completo | Tipos TypeScript |

### ❌ Qué NO existe en el backend (FALTA IMPLEMENTAR):

| Componente | Prioridad | Impacto |
|------------|-----------|---------|
| `src/routes/*.routes.ts` | 🔴 **CRÍTICO** | El servidor no puede arrancar sin rutas |
| `src/services/*.service.ts` | 🔴 **CRÍTICO** | La lógica de negocio no está implementada |
| Integración con frontend | 🟡 Alta | Frontend usa mock data |

### Estructura de Archivos Esperada vs Actual

```
backend/src/
├── index.ts                    ✅ Existe
├── config/
│   ├── database.ts             ✅ Existe
│   └── env.ts                  ✅ Existe
├── controllers/                ✅ 12 archivos existen
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── sede.controller.ts
│   ├── contratista.controller.ts
│   ├── centro-costo.controller.ts
│   ├── empleado.controller.ts
│   ├── actividad.controller.ts
│   ├── destino.controller.ts
│   ├── planificacion.controller.ts
│   ├── turno.controller.ts
│   ├── visitante.controller.ts
│   └── documento.controller.ts
├── routes/                     ❌ NO EXISTEN (crítico)
│   ├── auth.routes.ts          ← Crear
│   ├── user.routes.ts          ← Crear
│   ├── sede.routes.ts          ← Crear
│   ├── contratista.routes.ts   ← Crear
│   ├── centro-costo.routes.ts  ← Crear
│   ├── empleado.routes.ts      ← Crear
│   ├── actividad.routes.ts     ← Crear
│   ├── destino.routes.ts       ← Crear
│   ├── planificacion.routes.ts ← Crear
│   ├── turno.routes.ts         ← Crear
│   ├── visitante.routes.ts     ← Crear
│   ├── documento.routes.ts     ← Crear
│   └── dashboard.routes.ts     ← Crear
├── services/                   ⚠️ Parcial
│   ├── auth.service.ts         ✅ Existe
│   ├── dashboard.service.ts    ✅ Existe
│   ├── sede.service.ts         ❌ FALTA
│   ├── contratista.service.ts  ❌ FALTA
│   ├── centro-costo.service.ts ❌ FALTA
│   ├── empleado.service.ts     ❌ FALTA
│   ├── actividad.service.ts    ❌ FALTA
│   ├── destino.service.ts      ❌ FALTA
│   ├── planificacion.service.ts ❌ FALTA
│   ├── turno.service.ts        ❌ FALTA
│   ├── visitante.service.ts    ❌ FALTA
│   └── documento.service.ts    ❌ FALTA
├── middleware/                 ✅ Completo
│   ├── auth.ts
│   ├── errorHandler.ts
│   ├── upload.ts
│   └── validation.ts
└── types/
    └── index.ts                ✅ Existe
```

---

## 4. Esquema de Base de Datos (Prisma)

### Modelos Implementados

```prisma
✅ User                    ← Usuarios del sistema
✅ Sede                    ← Sedes/ubicaciones
✅ Contratista             ← Empresas contratistas
✅ CentroCosto             ← Centros de costos
✅ Empleado                ← Trabajadores
✅ Actividad               ← Tipos de actividades
✅ Destino                 ← Destinos dentro de sedes
✅ Planificacion           ← Planificación de cargos
✅ Turno                   ← Turnos de empleados
✅ Visitante               ← Control de visitantes
✅ Documento               ← Gestión documental
```

### Relaciones Principales

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Contratista │────→│  Empleado    │←────│    Sede      │
│              │     │              │     │              │
└──────────────┘     └──────┬───────┘     └──────────────┘
       │                    │
       │            ┌───────┴───────┐
       │            │               │
       ↓            ↓               ↓
┌──────────────┐ ┌──────────┐ ┌──────────┐
│ Planificacion│ │  Turno   │ │ Documento│
└──────────────┘ └──────────┘ └──────────┘
```

---

## 5. API Endpoints Requeridos

### Autenticación
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| POST | `/api/auth/login` | Iniciar sesión | ✅ Controller listo, falta service completo |
| POST | `/api/auth/register` | Registrar usuario | ✅ Controller listo |
| GET | `/api/auth/me` | Usuario actual | ✅ Controller listo |
| POST | `/api/auth/change-password` | Cambiar contraseña | ✅ Controller listo |

### Usuarios
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/users` | Listar usuarios | ✅ Controller listo |
| GET | `/api/users/:id` | Obtener usuario | ✅ Controller listo |
| PUT | `/api/users/:id` | Actualizar usuario | ✅ Controller listo |
| DELETE | `/api/users/:id` | Eliminar usuario | ✅ Controller listo |

### Sedes
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/sedes` | Listar sedes | ✅ Controller listo |
| POST | `/api/sedes` | Crear sede | ✅ Controller listo |
| GET | `/api/sedes/:id` | Obtener sede | ✅ Controller listo |
| PUT | `/api/sedes/:id` | Actualizar sede | ✅ Controller listo |
| DELETE | `/api/sedes/:id` | Eliminar sede | ✅ Controller listo |

### Empleados
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/empleados` | Listar empleados | ✅ Controller listo |
| POST | `/api/empleados` | Crear empleado | ✅ Controller listo |
| POST | `/api/empleados/carga-masiva` | Carga masiva Excel | ✅ Controller listo |
| GET | `/api/empleados/:id` | Obtener empleado | ✅ Controller listo |
| PUT | `/api/empleados/:id` | Actualizar empleado | ✅ Controller listo |
| DELETE | `/api/empleados/:id` | Eliminar empleado | ✅ Controller listo |

### Contratistas
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/contratistas` | Listar contratistas | ✅ Controller listo |
| POST | `/api/contratistas` | Crear contratista | ✅ Controller listo |
| GET | `/api/contratistas/:id` | Obtener contratista | ✅ Controller listo |
| PUT | `/api/contratistas/:id` | Actualizar contratista | ✅ Controller listo |
| DELETE | `/api/contratistas/:id` | Eliminar contratista | ✅ Controller listo |

### Centros de Costo
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/centros-costo` | Listar centros | ✅ Controller listo |
| POST | `/api/centros-costo` | Crear centro | ✅ Controller listo |
| GET | `/api/centros-costo/:id` | Obtener centro | ✅ Controller listo |
| PUT | `/api/centros-costo/:id` | Actualizar centro | ✅ Controller listo |
| DELETE | `/api/centros-costo/:id` | Eliminar centro | ✅ Controller listo |

### Actividades
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/actividades` | Listar actividades | ✅ Controller listo |
| POST | `/api/actividades` | Crear actividad | ✅ Controller listo |
| PUT | `/api/actividades/:id` | Actualizar actividad | ✅ Controller listo |
| DELETE | `/api/actividades/:id` | Eliminar actividad | ✅ Controller listo |

### Destinos
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/destinos` | Listar destinos | ✅ Controller listo |
| POST | `/api/destinos` | Crear destino | ✅ Controller listo |
| GET | `/api/destinos/:id` | Obtener destino | ✅ Controller listo |
| PUT | `/api/destinos/:id` | Actualizar destino | ✅ Controller listo |
| DELETE | `/api/destinos/:id` | Eliminar destino | ✅ Controller listo |

### Planificación
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/planificaciones` | Listar planificación | ✅ Controller listo |
| POST | `/api/planificaciones` | Crear planificación | ✅ Controller listo |
| POST | `/api/planificaciones/carga-masiva` | Carga masiva | ✅ Controller listo |
| GET | `/api/planificaciones/:id` | Obtener planificación | ✅ Controller listo |
| PUT | `/api/planificaciones/:id` | Actualizar planificación | ✅ Controller listo |
| DELETE | `/api/planificaciones/:id` | Eliminar planificación | ✅ Controller listo |

### Turnos
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/turnos` | Listar turnos | ✅ Controller listo |
| POST | `/api/turnos` | Crear turno | ✅ Controller listo |
| GET | `/api/turnos/:id` | Obtener turno | ✅ Controller listo |
| PUT | `/api/turnos/:id` | Actualizar turno | ✅ Controller listo |
| DELETE | `/api/turnos/:id` | Eliminar turno | ✅ Controller listo |

### Visitantes
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/visitantes` | Listar visitantes | ✅ Controller listo |
| POST | `/api/visitantes` | Registrar visitante | ✅ Controller listo |
| GET | `/api/visitantes/:id` | Obtener visitante | ✅ Controller listo |
| PUT | `/api/visitantes/:id` | Actualizar visitante | ✅ Controller listo |
| POST | `/api/visitantes/:id/salida` | Registrar salida | ✅ Controller listo |
| DELETE | `/api/visitantes/:id` | Eliminar visitante | ✅ Controller listo |

### Documentos
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/documentos` | Listar documentos | ✅ Controller listo |
| POST | `/api/documentos` | Subir documento | ✅ Controller listo |
| GET | `/api/documentos/:id` | Obtener documento | ✅ Controller listo |
| DELETE | `/api/documentos/:id` | Eliminar documento | ✅ Controller listo |
| GET | `/api/documentos/empleado/:empleadoId` | Docs por empleado | ✅ Controller listo |

### Dashboard
| Método | Endpoint | Descripción | Estado Backend |
|--------|----------|-------------|----------------|
| GET | `/api/dashboard/stats` | Estadísticas generales | ✅ Service listo |

---

## 6. Plan de Implementación

### Fase 1: Infraestructura Base (Crítico)
- [ ] Crear todos los archivos de rutas en `src/routes/`
- [ ] Crear los services faltantes para cada entidad
- [ ] Conectar controladores con services
- [ ] Probar que el servidor arranca sin errores

### Fase 2: Conexión Frontend-Backend
- [ ] Crear cliente API en frontend (axios/fetch)
- [ ] Reemplazar mock data por llamadas reales
- [ ] Implementar manejo de errores y loading states
- [ ] Configurar variables de entorno para API URL

### Fase 3: Módulos SGSST
- [ ] Definir modelos de BD para SGSST en Prisma
- [ ] Crear controladores y servicios para cada módulo
- [ ] Implementar páginas del frontend con funcionalidad real

### Fase 4: Reportes y Estadísticas
- [ ] Implementar generación de reportes
- [ ] Dashboard con datos reales
- [ ] Exportación a Excel/PDF

---

## 7. Tareas Inmediatas (Próximos Pasos)

### Prioridad 1: Hacer funcional el backend

1. **Crear archivo de rutas** - Ejemplo para sedes:
```typescript
// src/routes/sede.routes.ts
import { Router } from 'express';
import * as sedeController from '../controllers/sede.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, sedeController.getAll);
router.post('/', authenticate, sedeController.create);
router.get('/:id', authenticate, sedeController.getById);
router.put('/:id', authenticate, sedeController.update);
router.delete('/:id', authenticate, sedeController.remove);

export default router;
```

2. **Crear service de sedes**:
```typescript
// src/services/sede.service.ts
import prisma from '../config/database';

export const getAll = async () => {
  return await prisma.sede.findMany({
    include: { empleados: true, destinos: true }
  });
};

export const create = async (data: any) => {
  return await prisma.sede.create({ data });
};
// ... etc
```

3. **Repetir para todas las entidades**:
   - sede.service.ts
   - contratista.service.ts
   - centro-costo.service.ts
   - empleado.service.ts
   - actividad.service.ts
   - destino.service.ts
   - planificacion.service.ts
   - turno.service.ts
   - visitante.service.ts
   - documento.service.ts

### Prioridad 2: Frontend - Cliente API

Crear archivo `frontend/src/services/api.ts`:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 8. Notas Técnicas

### Variables de Entorno Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/empresa_db"
JWT_SECRET="tu-secret-key-super-segura"
PORT=3000
NODE_ENV=development
UPLOAD_DIR="uploads"
```

### Variables de Entorno Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

### Comandos Útiles
```bash
# Backend
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

---

## 9. Módulos SGSST - Pendiente de Definición

Los siguientes módulos están en el frontend como placeholders pero requieren definición de modelos BD:

| Módulo | Descripción Preliminar | Estado BD |
|--------|------------------------|-----------|
| DetallesEmpresa | Información de la empresa | ❌ Sin modelo |
| DiagnosticoInicial | Diagnóstico SGSST inicial | ❌ Sin modelo |
| PeriodosTrabajo | Gestión de periodos laborales | ❌ Sin modelo |
| MatrizLegal | Matriz de requisitos legales | ❌ Sin modelo |
| PlaneadorActividades | Plan de trabajo anual | ❌ Sin modelo |
| GestionRiesgos | Identificación de riesgos | ❌ Sin modelo |
| GestionDocumental | Documentos SGSST | ❌ Sin modelo |
| FichasIndicadores | Indicadores de gestión | ❌ Sin modelo |
| MisTrabajadores | Gestión de trabajadores | ⚠️ Usa Empleado |
| PerfilesCargo | Perfiles de cargo | ❌ Sin modelo |
| ReporteAusentismos | Control de ausentismo | ❌ Sin modelo |
| MedicinaLaboral | Exámenes médicos | ⚠️ Parcial en Documentos |
| ReporteAccidentes | Investigación de accidentes | ❌ Sin modelo |
| BateriaPsicosocial | Evaluación psicosocial | ❌ Sin modelo |
| GestionTAR | Trabajos de alto riesgo | ❌ Sin modelo |
| ContratistasSST | Gestión contratistas SST | ⚠️ Usa Contratista |
| ActosCondicionesInseguras | Reportes de condiciones | ❌ Sin modelo |
| MatrizMejora | Plan de mejora | ❌ Sin modelo |
| AccionesCorrectivas | Seguimiento acciones | ❌ Sin modelo |
| InspeccionesSeguridad | Inspecciones programadas | ❌ Sin modelo |
| PlanesEmergencia | Planes de emergencia | ❌ Sin modelo |
| EvaluacionSimulacros | Simulacros y capacitaciones | ❌ Sin modelo |
| SeguridadVial | Plan de seguridad vial | ❌ Sin modelo |
| GestionQuimicos | Sustancias químicas | ❌ Sin modelo |
| ControlesAcceso | Control de ingreso/egreso | ⚠️ Usa Visitante |

---

## 10. Conclusión

### Estado del Proyecto
- **Frontend**: 80% completo (UI lista, falta conexión API)
- **Backend**: 40% completo (modelos BD listos, faltan rutas y services)
- **Integración**: 0% (usa mocks)

### Siguiente Paso Recomendado
1. Crear los archivos de rutas faltantes para que el servidor arranque
2. Implementar los services básicos (CRUD) para cada entidad
3. Crear cliente API en frontend
4. Conectar el login primero, luego el resto de módulos

---

*Documento generado el: 23 de marzo de 2026*
*Versión: 1.0*
