# Prisma Business Dashboard
## Grupo Prisma S.A.P.I. de C.V.

Sistema integral de administración de socios, tesorería, operaciones financieras, proyectos de inversión y distribución de resultados económicos.

---

## 1. Arquitectura del Repositorio (Monorepo)

El proyecto se gestiona como un **monorepo estructurado con npm workspaces**:

```text
Prisma Workspace/
├── apps/
│   ├── api/                   # Backend API REST (NestJS + TypeScript + Prisma ORM)
│   │   ├── prisma/            # Esquema y migraciones SQLite (schema.prisma, dev.db)
│   │   ├── src/               # Código fuente del backend
│   │   └── package.json
│   └── web/                   # Frontend SPA (React + Vite + TypeScript + Tailwind CSS)
│       ├── src/               # Componentes, vistas y utilidades del frontend
│       └── package.json
├── docs/                      # Fuente oficial de documentación técnica y gobernanza (Fase 0)
├── package.json               # Configuración raíz de npm workspaces
├── .gitignore                 # Exclusiones de Git (secretos, SQLite, evidencias)
├── .env.example               # Plantilla de variables de entorno de referencia
└── README.md                  # Este documento
```

---

## 2. Requisitos Previos

- **Node.js:** Versión 18.x, 20.x o superior (LTS recomendada).
- **npm:** Versión 9.x, 10.x u 11.x (soporte nativo de `npm workspaces`).

---

## 3. Comandos de Instalación y Ejecución

### A. Instalación de Dependencias
Para instalar todas las dependencias del monorepo (backend y frontend) de manera unificada y vinculada:

```bash
npm install
```

### B. Compilación de Paquetes
Para compilar ambos proyectos en TypeScript:

```bash
# Compilar todo el monorepo
npm run build

# O compilar individualmente cada workspace:
npm run build:api
npm run build:web
```

### C. Generación de Cliente Prisma ORM
Para generar el cliente tipado de Prisma ORM configurado con SQLite:

```bash
npm run prisma:generate
```

### D. Ejecución en Modo Desarrollo
*(Nota: Requiere autorización previa del Propietario antes de iniciar servidores en sesiones interactivas)*

```bash
# Iniciar backend en desarrollo (NestJS en puerto 3000):
npm run start:api:dev

# Iniciar frontend en desarrollo (Vite en puerto 5173):
npm run dev:web
```

---

## 4. Reglas de Seguridad y Persistencia

1. **Base de Datos SQLite:** Alojada exclusivamente en `apps/api/prisma/dev.db`. Se encuentra excluida de Git en el archivo `.gitignore`.
2. **Archivos de Evidencias:** Se almacenan localmente en `apps/api/uploads/`, protegidos y excluidos del versionado en Git.
3. **Variables de Entorno:** Copie `.env.example` a `.env` en la raíz o en los paquetes respectivos. Nunca publique archivos `.env` a repositorios públicos.
4. **Regla de Oro de Fases:** El avance del desarrollo se apega estrictamente al `PLAN_MAESTRO.md` y al seguimiento de fases en `docs/`.

