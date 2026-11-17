# Estructura del Proyecto de Software (Monorepo Workspace)
## Prisma Business Dashboard - Repositorio `prisma-business-dashboard`

Este documento describe la arquitectura de directorios y empaquetado del repositorio oficial, formalizada tras la **decisión aprobada por el Propietario del Proyecto (Product Owner)**.

---

## 1. Decisiones de Arquitectura del Repositorio Aprobadas

- **Arquitectura de Repositorio:** Monorepo gobernado mediante **npm workspaces**.
- **Frontend SPA:** Ubicado en `apps/web` (React 18 + Vite + TypeScript + Tailwind CSS + Recharts).
- **Backend REST API:** Ubicado en `apps/api` (NestJS + TypeScript + JWT + bcrypt).
- **Capa de Persistencia (Prisma y SQLite):** Ubicada **dentro de `apps/api/prisma/`** (`schema.prisma`, migraciones SQLite y script de semillas).
- **Estructura Documental:** Carpeta `docs/` independiente ubicada en la raíz del espacio de trabajo (`Prisma Workspace/docs/`).
- **Almacenamiento de Evidencias:** Almacenamiento local en el servidor (`apps/api/uploads/`), implementado bajo un patrón de abstracción (`StorageService` / `StorageProvider`) que garantice desacoplamiento y permita una migración futura transparente a almacenamiento en la nube (AWS S3, Supabase Storage, Google Cloud Storage).
- **Estrategia de Semillas (Seeding):** El archivo `apps/api/prisma/seed.ts` inicializará **diez (10) socios ficticios para pruebas** con participaciones paritarias del 10.00%.
- **Privacidad y Confidencialidad:** La información real de los socios y datos sensibles jamás se incluirán ni versionarán en el repositorio público (Git).
- **Métricas Técnicas:** Los valores numéricos de rendimiento (<200ms en API), tiempos de token (15m/7d) y cobertura de pruebas (>=80%) se mantienen formalmente identificados como **objetivos técnicos preliminares** y no como resultados garantizados.

---

## 2. Árbol de Directorios Oficial del Repositorio

```text
Prisma Workspace/
│
├── docs/                           # Carpeta documental independiente en la raíz
│   ├── 00_GESTION_PROYECTO/
│   ├── 01_REQUISITOS/
│   ├── 02_ARQUITECTURA/
│   ├── 03_BASE_DE_DATOS/
│   ├── 04_SEGURIDAD_Y_FINANZAS/
│   ├── 05_PLANIFICACION/
│   ├── 06_PRUEBAS/
│   ├── 07_ENTREGA_ACADEMICA/
│   └── BITACORA/
│
└── prisma-business-dashboard/      # Repositorio Monorepo Git oficial
    ├── .gitignore                  # Exclusión de .env, *.sqlite, *.db, /uploads, node_modules, dist
    ├── package.json                # Configuración raíz de npm workspaces (workspaces: ["apps/*"])
    ├── README.md                   # Guía de instalación y ejecución del monorepo
    │
    └── apps/
        ├── api/                    # Backend REST API con NestJS y TypeScript
        │   ├── package.json
        │   ├── tsconfig.json
        │   ├── nest-cli.json
        │   ├── prisma/             # PERSISTENCIA LOCALIZADA DENTRO DE APPS/API
        │   │   ├── schema.prisma   # Esquema relacional de las 28 entidades
        │   │   ├── seed.ts         # Seeding con 10 socios ficticios para pruebas
        │   │   └── migrations/     # Historial de migraciones SQLite
        │   ├── uploads/            # Almacenamiento local inicial de evidencias (ignorado en git)
        │   ├── test/               # Pruebas de integración E2E con Jest y Supertest
        │   │   ├── app.e2e-spec.ts
        │   │   └── jest-e2e.json
        │   └── src/
        │       ├── main.ts         # Bootstrap de NestJS, Swagger (/api/docs), Pipes
        │       ├── app.module.ts   # Módulo raíz del backend
        │       ├── common/         # Utilidades y componentes transversales
        │       │   ├── decorators/ # @Roles, @CurrentUser, @Public
        │       │   ├── guards/     # JwtAuthGuard, RolesGuard
        │       │   ├── filters/    # GlobalExceptionFilter
        │       │   ├── interceptors/# AuditInterceptor, LoggingInterceptor
        │       │   ├── pipes/      # MoneyValidationPipe
        │       │   └── storage/    # Abstracción StorageService (Local vs Cloud Provider)
        │       │       ├── storage.interface.ts
        │       │       ├── storage.service.ts
        │       │       └── local-storage.provider.ts
        │       ├── prisma/         # Servicio envoltorio de PrismaClient
        │       │   ├── prisma.module.ts
        │       │   └── prisma.service.ts
        │       └── modules/        # Módulos de dominio de negocio
        │           ├── auth/       # Login, JWT strategy, bcrypt hash, sesiones
        │           ├── partners/   # Padrón de socios, participaciones y aportaciones
        │           ├── treasury/   # Cuentas, operaciones financieras y movimientos contables
        │           ├── approvals/  # Motor de doble autorización (Regla 2-Man)
        │           ├── projects/   # Proyectos, hitos, presupuestos, minutas, actividades
        │           ├── profit-sharing/ # Acuerdos económicos al 100%, cierres y distribuciones
        │           ├── dashboard/  # Métricas agregadas y analítica para Recharts
        │           ├── audit/      # Bitácora inmutable de eventos
        │           └── external-api/# Integración de servicio externo de divisas
        │
        └── web/                    # Frontend SPA con React, Vite, Tailwind CSS y Recharts
            ├── package.json
            ├── vite.config.ts
            ├── tailwind.config.js
            ├── postcss.config.js
            ├── tsconfig.json
            ├── index.html
            └── src/
                ├── main.tsx        # Punto de entrada React
                ├── App.tsx         # Enrutador y proveedores de contexto
                ├── assets/         # Recursos gráficos
                ├── components/     # UI modular (Sidebar, Header, StatCard, Tablas)
                │   ├── layout/
                │   ├── ui/
                │   ├── charts/     # Componentes interactivos Recharts
                │   └── feedback/
                ├── pages/          # Vistas (Dashboard, Socios, Tesorería, Proyectos, Firmas)
                ├── hooks/          # Custom hooks (useAuth, useTreasury, useProjects)
                ├── services/       # Clientes HTTP Axios tipados
                ├── types/          # Interfaces TypeScript sincronizadas con DTOs de API
                └── utils/          # Formateo monetario en centavos y fechas
```

---

## 3. Patrón de Abstracción de Almacenamiento (`StorageService`)

Para garantizar que el almacenamiento local inicial no comprometa la escalabilidad ni cree acoplamiento:

```typescript
// Contrato de interfaz en apps/api/src/common/storage/storage.interface.ts
export interface IStorageProvider {
  uploadFile(file: Express.Multer.File, folder: string): Promise<{ filePath: string; fileHash: string; fileSizeBytes: number }>;
  getFileUrl(filePath: string): Promise<string>;
  deleteFile(filePath: string): Promise<boolean>;
}
```

- En la fase actual, se implementa `LocalStorageProvider` que almacena en disco local dentro de `apps/api/uploads/`.
- En caso de requerir migración en producción o fases futuras, se sustituye el proveedor por `S3StorageProvider` o `SupabaseStorageProvider` sin modificar ningún controlador ni entidad de proyecto.
