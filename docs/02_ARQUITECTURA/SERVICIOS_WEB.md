# Servicios Web (Web Services)
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento especifica los contratos de comunicación de los servicios web propios (API REST interna) y los servicios web de terceros que se integrarán para cumplir con las reglas del negocio y los requisitos académicos de la Unidad 3.

---

## 1. Servicios Web Propios (RESTful API)

### 1.1. Estándares Generales de la API
- **Protocolo:** HTTP/1.1 sobre TLS (HTTPS en producción).
- **Prefijo Global de Ruta:** `/api/v1`
- **Formato de Carga Útil:** `application/json; charset=utf-8`
- **Mecanismo de Autenticación:** Encabezado HTTP `Authorization: Bearer <JWT_TOKEN>`
- **Estructura Estándar de Respuesta:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "timestamp": "2026-11-05T20:30:00.000Z"
}
```

---

### 1.2. Catálogo de Endpoints Principales

#### Módulo de Autenticación y Sesiones (`/api/v1/auth`)
| Método | Endpoint | Descripción | Roles Permitidos |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/login` | Valida credenciales con bcrypt, crea `Session` y retorna tokens JWT. | Público |
| `GET` | `/api/v1/auth/me` | Obtiene el perfil, roles combinados y socio vinculado del usuario. | Autenticado |
| `POST` | `/api/v1/auth/refresh` | Renueva el Access Token utilizando un Refresh Token activo. | Autenticado |
| `POST` | `/api/v1/auth/logout` | Revoca la sesión activa en la entidad `Session`. | Autenticado |

#### Módulo de Socios, Participaciones y Aportaciones (`/api/v1/partners`)
| Método | Endpoint | Descripción | Roles Permitidos |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/partners` | Retorna el padrón de los 10 socios fundadores y participaciones acordadas. | `SUPER_ADMIN`, `PARTNER`, `TREASURER` |
| `GET` | `/api/v1/partners/:id` | Retorna detalle de un socio: participaciones, aportaciones y proyectos. | `SUPER_ADMIN`, `PARTNER` |
| `PATCH`| `/api/v1/partners/:id/shares` | Actualiza la participación societaria acordada (requiere justificación). | `SUPER_ADMIN` |
| `POST` | `/api/v1/partners/:id/contributions` | Registra una aportación dineraria al fondo común (`CapitalContribution`). | `TREASURER`, `SUPER_ADMIN` |

#### Módulo de Tesorería y Movimientos (`/api/v1/treasury`)
| Método | Endpoint | Descripción | Roles Permitidos |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/treasury/accounts` | Lista de cuentas de tesorería con saldos calculados en centavos. | `SUPER_ADMIN`, `PARTNER`, `TREASURER` |
| `POST`| `/api/v1/treasury/operations` | Registra solicitud de operación financiera (`FinancialOperation`). | `TREASURER`, `PROJECT_MANAGER` |
| `POST`| `/api/v1/treasury/transfer` | Registra transferencia neutra entre cuentas de Grupo Prisma. | `TREASURER` |
| `POST`| `/api/v1/treasury/operations/:id/execute` | **Registra la ejecución bancaria y genera el movimiento contable** (`AccountMovement`). | `TREASURER` |
| `POST`| `/api/v1/treasury/operations/:id/reverse` | Solicita una reversión compensatoria (contrasiento) con motivo. | `TREASURER`, `SUPER_ADMIN` |
| `GET` | `/api/v1/treasury/movements` | Consulta el libro mayor inmutable de movimientos confirmados. | `SUPER_ADMIN`, `TREASURER`, `PARTNER` |

#### Módulo de Autorizaciones (Regla 2-Man) (`/api/v1/approvals`)
| Método | Endpoint | Descripción | Roles Permitidos |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/approvals/pending` | Lista de operaciones en espera de Firma 1 o Firma 2. | `FINANCE_APPROVER`, `SUPER_ADMIN` |
| `POST`| `/api/v1/approvals/:id/sign` | Otorga firma digital (Firma 1 o 2). Excluye al solicitante. | `FINANCE_APPROVER`, `SUPER_ADMIN` |
| `POST`| `/api/v1/approvals/:id/reject` | Rechaza la operación indicando justificación obligatoria. | `FINANCE_APPROVER`, `SUPER_ADMIN` |

#### Módulo de Proyectos de Inversión (`/api/v1/projects`)
| Método | Endpoint | Descripción | Roles Permitidos |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/projects` | Listado general de proyectos activos, en cierre y concluidos. | `SUPER_ADMIN`, `PARTNER`, `PROJECT_MANAGER` |
| `POST`| `/api/v1/projects` | Alta de nuevo proyecto (Vehicular o Inmobiliario). | `PROJECT_MANAGER`, `SUPER_ADMIN` |
| `GET` | `/api/v1/projects/:id` | Detalle integral: presupuestos, gastos reales, atrasos y avance. | `SUPER_ADMIN`, `PARTNER`, `PROJECT_MANAGER`, `PROJECT_MEMBER` |
| `POST`| `/api/v1/projects/:id/members` | Asigna integrantes al proyecto (`ProjectMember`). | `SUPER_ADMIN`, `PROJECT_MANAGER` |
| `POST`| `/api/v1/projects/:id/budgets` | Registra o ajusta partidas presupuestales (`ProjectBudget`). | `PROJECT_MANAGER`, `SUPER_ADMIN` |
| `POST`| `/api/v1/projects/:id/milestones` | Agrega o actualiza hitos con porcentaje ponderado (`Milestone`). | `PROJECT_MANAGER` |
| `POST`| `/api/v1/projects/:id/updates` | Publica actualización de estado y avances (`ProjectUpdate`). | `PROJECT_MANAGER`, `PROJECT_MEMBER` |
| `POST`| `/api/v1/projects/:id/meetings` | Programa reunión y genera convocatoria (`Meeting`). | `PROJECT_MANAGER` |
| `POST`| `/api/v1/projects/:id/minutes` | Resguarda minuta formal y compromisos acordados (`MeetingMinute`). | `PROJECT_MANAGER`, `PROJECT_MEMBER` |
| `POST`| `/api/v1/projects/:id/activities`| Registra tarea o actividad pendiente (`Activity`). | `PROJECT_MANAGER`, `PROJECT_MEMBER` |
| `POST`| `/api/v1/projects/:id/documents` | Sube metadatos de documentos, facturas y fotos (`ProjectDocument`). | `PROJECT_MANAGER`, `PROJECT_MEMBER` |

#### Módulo de Cierres Financieros y Utilidades (`/api/v1/projects/:id/...`)
| Método | Endpoint | Descripción | Roles Permitidos |
| :---: | :--- | :--- | :---: |
| `POST`| `/api/v1/projects/:id/profit-agreement` | Registra acuerdo de reparto validando suma exacta al 100%. | `SUPER_ADMIN` |
| `POST`| `/api/v1/projects/:id/financial-close` | Formaliza cierre financiero tras conciliar ingresos y gastos. | `SUPER_ADMIN` |
| `GET` | `/api/v1/projects/:id/distributions` | Consulta órdenes de dispersión de utilidades calculadas. | `SUPER_ADMIN`, `PARTNER`, `TREASURER` |
| `POST`| `/api/v1/projects/:id/distributions/execute` | Registra el pago efectivo de utilidades a socios. | `TREASURER` |

#### Módulo de Dashboard y Analítica (`/api/v1/dashboard`)
| Método | Endpoint | Descripción | Roles Permitidos |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/dashboard/summary` | Retorna los KPIs ejecutivos consolidados en centavos. | Todos los socios autenticados |
| `GET` | `/api/v1/dashboard/cashflow` | Datos mensuales agregados para gráfico Recharts de flujo. | Todos los socios autenticados |
| `GET` | `/api/v1/dashboard/portfolio` | Distribución de capital por tipo de activo (Autos vs Inmuebles).| Todos los socios autenticados |

---

## 2. Servicios Web de Terceros (Consumo Externo - Fase 7)

```mermaid
flowchart LR
    NestJS["NestJS Backend<br/>(ExternalApiService)"]
    Cache[("Cache Local en Memoria / SQLite")]
    BanxicoAPI["API Externa Oficial<br/>(Tipo de Cambio USD/MXN)"]

    NestJS -->|1. Consulta si cotizacion vigente existe| Cache
    NestJS -.->|2. Si expiro o no existe: GET HTTP| BanxicoAPI
    BanxicoAPI -.->|3. Retorna tasa de cambio oficial| NestJS
    NestJS -->|4. Almacena en cache (TTL propuesto: 6h)| Cache
```

### Especificación del Consumo:
- **Proveedor Propuesto:** Servicio REST de Tipo de Cambio Oficial (API del Banco de México / Diario Oficial de la Federación / Open Exchange Rates - sujeto a elección del PO).
- **Manejo de Fallos:** Timeout de 3,000 ms con degradación elegante utilizando el último valor almacenado en caso de desconexión.
