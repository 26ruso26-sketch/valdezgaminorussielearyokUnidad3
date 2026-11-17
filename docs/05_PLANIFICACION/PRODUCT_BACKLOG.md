# Product Backlog Priorizado
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento contiene la lista ordenada de elementos del backlog (Product Backlog Items - PBIs) priorizados mediante el método **MoSCoW (Must have, Should have, Could have, Won't have)** y vinculados a las historias de usuario y fases del Plan Maestro.

---

## 1. Convención de Prioridades y Puntos de Historia

- **P1 (Must Have):** Funcionalidad crítica obligatoria para el funcionamiento del negocio y cumplimiento de reglas inmutables.
- **P2 (Should Have):** Funcionalidad de alto valor que completa la experiencia operativa.
- **P3 (Could Have):** Característica deseable de mejora analítica o automatización visual.
- **P4 (Won't Have / Out of Scope):** Excluido explícitamente del alcance actual.

---

## 2. Tabla del Product Backlog

| ID Item | Épica / Módulo | Descripción de la Tarea / Historia | HU Asociada | Fase Plan | Prioridad | Puntos Est. |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| **PBI-001** | Infraestructura | Configuración del workspace Git, NestJS backend y Vite React frontend. | N/A | Fase 1 | **P1** | 5 |
| **PBI-002** | Base de Datos | Definición del `schema.prisma` y migraciones SQLite con campos en centavos. | N/A | Fase 2 | **P1** | 8 |
| **PBI-003** | Base de Datos | Script de semillas (`seed.ts`) con 10 socios al 10% y usuario `SUPER_ADMIN`. | HU-01 | Fase 2 | **P1** | 3 |
| **PBI-004** | Seguridad & Auth| Módulo `Auth` en NestJS con JWT, bcrypt hash y Guards de roles RBAC. | N/A | Fase 3 | **P1** | 8 |
| **PBI-005** | Seguridad & Auth| Pantalla de login e integración de token JWT en cliente React. | N/A | Fase 3 | **P1** | 5 |
| **PBI-006** | Socios | Endpoints y vistas para consultar y gestionar el padrón de socios. | HU-01 | Fase 3 | **P1** | 5 |
| **PBI-007** | Tesorería | CRUD de cuentas de tesorería y cálculo dinámico de saldos en centavos. | HU-02 | Fase 4 | **P1** | 8 |
| **PBI-008** | Tesorería | Solicitud de movimientos financieros (egresos, ingresos de capital). | HU-02 | Fase 4 | **P1** | 5 |
| **PBI-009** | Tesorería | Transferencias internas neutras entre cuentas de Grupo Prisma. | HU-09 | Fase 4 | **P1** | 5 |
| **PBI-010** | Autorizaciones | Motor transaccional de Doble Autorización (Regla 2-Man) con validación cruzada. | HU-03 | Fase 4 | **P1** | 13 |
| **PBI-011** | Autorizaciones | Bandeja de entrada de firmas y modal de aprobación/rechazo en frontend. | HU-03 | Fase 4 | **P1** | 8 |
| **PBI-012** | Tesorería | Mecanismo de Reversión Compensatoria (contrasiento) sin borrado físico. | HU-08 | Fase 4 | **P1** | 8 |
| **PBI-013** | Proyectos | Módulo de proyectos de inversión con soporte para Remates Vehiculares (VIN). | HU-04 | Fase 5 | **P1** | 8 |
| **PBI-014** | Proyectos | Soporte para Remates Bancarios Inmobiliarios (etapas legales y catastrales). | HU-05 | Fase 5 | **P1** | 8 |
| **PBI-015** | Proyectos | Gestión de hitos, cálculo de días de atraso y porcentaje de avance. | HU-04, 05 | Fase 5 | **P2** | 5 |
| **PBI-016** | Proyectos | Registro de metadatos de documentos, facturas y fotografías de avance. | N/A | Fase 5 | **P2** | 5 |
| **PBI-017** | Proyectos | Módulo de minutas de reunión y acuerdos de asamblea de proyectos. | N/A | Fase 5 | **P2** | 3 |
| **PBI-018** | Utilidades | Configuración y validación estricta de Acuerdos Económicos al 100%. | HU-06 | Fase 5 | **P1** | 5 |
| **PBI-019** | Utilidades | Flujo de Cierre Financiero formal y generación de dispersión a socios. | HU-10 | Fase 5 | **P1** | 8 |
| **PBI-020** | Dashboard | Endpoints consolidados de KPIs financieros y estado de cartera de inversión. | HU-07 | Fase 6 | **P1** | 5 |
| **PBI-021** | Dashboard | Gráficas interactivas con Recharts (flujo de efectivo, distribución de capital). | HU-07 | Fase 6 | **P1** | 8 |
| **PBI-022** | Web Services | Documentación Swagger / OpenAPI completa en `/api/docs`. | N/A | Fase 7 | **P1** | 5 |
| **PBI-023** | Web Services | Integración y consumo de Web Service externo de tipo de cambio oficial. | N/A | Fase 7 | **P1** | 5 |
| **PBI-024** | Auditoría | Interceptor global y vista de consulta de `AuditLog` para `SUPER_ADMIN`. | N/A | Fase 8 | **P2** | 5 |
| **PBI-025** | QA & Pruebas | Suite de pruebas unitarias y de integración con Jest y Supertest (>=80% cov). | N/A | Fase 8 | **P1** | 13 |
| **PBI-026** | Académico | Redacción y compilación del documento académico final en PDF para la UTC. | N/A | Fase 9 | **P1** | 8 |

---

## 3. Criterios de Estimación y Planificación

- Los puntos de historia representan esfuerzo relativo basado en complejidad arquitectónica, criticidad financiera y riesgo de negocio.
- No se introducen fechas calendario fijas ni promesas temporales no consensuadas; la ejecución se realiza de forma estrictamente cadenciada y orientada al cumplimiento de los criterios de aceptación de cada PBI.

