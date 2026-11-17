# Matriz de Trazabilidad de Evidencias Académicas
## Prisma Business Dashboard - UTC 9 IDGSA

Esta matriz vincula cada criterio de evaluación de la Unidad 3 con los entregables de software, endpoints de la API, componentes visuales y documentos de respaldo en `docs/`.

---

## 1. Matriz de Correspondencia de Criterios

| Criterio de Evaluación Académica | Componente del Sistema | Endpoint / Archivo Clave | Documento de Respaldo | Estado de Evidencia |
| :--- | :--- | :--- | :--- | :---: |
| **Arquitectura Desacoplada** | Monolito modular NestJS + SPA React Vite | `apps/api/src/app.module.ts`<br/>`apps/web/src/App.tsx` | `docs/02_ARQUITECTURA/ARQUITECTURA_SOFTWARE.md` | Documentado (Fase 0) |
| **Diseño y Patrones de Software** | DTOs, Repository, Inyección de Dependencias, Money Pattern | `apps/api/src/modules/treasury/*`<br/>`common/pipes/*` | `docs/02_ARQUITECTURA/PATRONES_DE_DISENO.md` | Documentado (Fase 0) |
| **Servicios Web Propios (REST)** | Controladores REST con códigos HTTP estructurados | `/api/v1/treasury/transactions`<br/>`/api/v1/projects` | `docs/02_ARQUITECTURA/SERVICIOS_WEB.md` | Documentado (Fase 0) |
| **Documentación de API** | Interfaz Swagger / OpenAPI interactiva | `/api/docs`<br/>`apps/api/src/main.ts` | `docs/02_ARQUITECTURA/SERVICIOS_WEB.md` | Planificado (Fase 7) |
| **Consumo de Servicio Externo** | Consumo HTTP asíncrono de API de divisas (USD/MXN) | `apps/api/src/modules/external-api/*` | `docs/02_ARQUITECTURA/SERVICIOS_WEB.md` | Planificado (Fase 7) |
| **Persistencia Relacional & ORM** | Prisma ORM con migraciones y transacciones ACID | `prisma/schema.prisma`<br/>`prisma/migrations/*` | `docs/03_BASE_DE_DATOS/MODELO_ENTIDAD_RELACION.md` | Documentado (Fase 0) |
| **Autenticación Segura (JWT)** | Emisión de tokens firmados y verificación por Guards | `apps/api/src/modules/auth/*`<br/>`common/guards/jwt-auth.guard.ts` | `docs/04_SEGURIDAD_Y_FINANZAS/MODELO_ROLES_PERMISOS.md` | Documentado (Fase 0) |
| **Cifrado de Credenciales** | Hashing adaptativo con bcrypt (salt factor >= 10) | `apps/api/src/modules/auth/auth.service.ts` | `docs/04_SEGURIDAD_Y_FINANZAS/MODELO_ROLES_PERMISOS.md` | Documentado (Fase 0) |
| **Control de Acceso por Roles (RBAC)**| RolesGuard con roles `SUPER_ADMIN`, `ADMIN_FINANCIERO`, etc. | `common/decorators/roles.decorator.ts`<br/>`common/guards/roles.guard.ts` | `docs/04_SEGURIDAD_Y_FINANZAS/MODELO_ROLES_PERMISOS.md` | Documentado (Fase 0) |
| **Regla Financiera 2-Man (Doble Firma)**| Motor transaccional de dos autorizadores independientes | `apps/api/src/modules/approvals/*` | `docs/04_SEGURIDAD_Y_FINANZAS/FLUJO_AUTORIZACIONES.md` | Documentado (Fase 0) |
| **Interfaz de Usuario y Dashboard** | Tablero reactivo con Tailwind CSS y gráficas Recharts | `apps/web/src/pages/dashboard/*`<br/>`components/charts/*` | `docs/01_REQUISITOS/REQUISITOS_FUNCIONALES.md` | Planificado (Fase 6) |
| **Pruebas Automatizadas** | Pruebas unitarias y de integración con Jest y Supertest | `apps/api/test/*`<br/>`apps/api/src/**/*.spec.ts` | `docs/06_PRUEBAS/ESTRATEGIA_PRUEBAS.md`<br/>`docs/06_PRUEBAS/CASOS_PRUEBA.md` | Diseñado (Fase 0) |
| **Documento Técnico Académico PDF** | Memoria técnica completa en formato institucional UTC | `docs/07_ENTREGA_ACADEMICA/Memoria_Tecnica_UTC.pdf` | `docs/07_ENTREGA_ACADEMICA/REQUISITOS_UNIDAD_3.md` | Planificado (Fase 9) |

---

## 2. Mecanismo de Validación de Evidencias

Conforme se avance en las fases de desarrollo (Fase 1 a Fase 9), se actualizará la columna **Estado de Evidencia** adjuntando los enlaces a los commits de Git, capturas de pantalla de la terminal de pruebas y respuestas de Swagger, certificando el cumplimiento del 100% de la rúbrica.

