# Requisitos Funcionales (RF)
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento cataloga y describe los requisitos funcionales del sistema, organizados por módulos de negocio. Cada requisito cuenta con identificador único, descripción, prioridad, roles involucrados y criterios de aceptación verificables.

---

## 1. Módulo de Seguridad, Roles y Permisos (RF-SEC)

| ID | Nombre | Descripción | Roles Involucrados | Prioridad |
| :--- | :--- | :--- | :---: | :---: |
| **RF-SEC-01** | Catálogo de Roles Oficiales | El sistema debe implementar los seis roles del sistema: `SUPER_ADMIN`, `PARTNER`, `TREASURER`, `FINANCE_APPROVER`, `PROJECT_MANAGER`, `PROJECT_MEMBER`. | `SUPER_ADMIN` | **Alta** |
| **RF-SEC-02** | Combinación de Roles y Permisos Granulares | El sistema debe permitir asignar múltiples roles a un mismo usuario (ej. `PARTNER` + `FINANCE_APPROVER` o `PARTNER` + `PROJECT_MANAGER`), evaluando permisos granulares para evitar duplicidades. | `SUPER_ADMIN` | **Alta** |
| **RF-SEC-03** | Control de Sesiones y Refresh Tokens | El sistema debe registrar las sesiones activas en la entidad `Session`, permitiendo renovación mediante Refresh Token y revocación remota en caso de riesgo. | Todos los roles | **Alta** |

---

## 2. Módulo de Socios, Participaciones y Aportaciones (RF-SOC)

| ID | Nombre | Descripción | Roles Involucrados | Prioridad |
| :--- | :--- | :--- | :---: | :---: |
| **RF-SOC-01** | Registro de Socios Fundadores | El sistema debe permitir el registro y visualización del padrón de los 10 socios fundadores de Grupo Prisma S.A.P.I. de C.V. | `SUPER_ADMIN`, `PARTNER` | **Alta** |
| **RF-SOC-02** | Participación Inicial Acordada | El sistema debe registrar una participación societaria inicial acordada del 10.00% para cada uno de los diez socios fundadores, distinguiendo este acuerdo inicial de una formalización estatutaria hasta contar con el acta jurídica. | `SUPER_ADMIN` | **Alta** |
| **RF-SOC-03** | Independencia Conceptual | El sistema debe tratar como entidades y registros independientes: 1) Participación societaria acordada (`PartnerShare`), 2) Aportaciones de capital (`CapitalContribution`), y 3) Acuerdos de utilidades por proyecto (`ProfitAgreement`). | Todos | **Alta** |
| **RF-SOC-04** | Registro de Aportaciones de Capital | El sistema debe permitir registrar aportaciones dinerarias al fondo común realizadas por socios (`CapitalContribution`), asociándolas a una cuenta de tesorería y generando comprobante. | `TREASURER`, `SUPER_ADMIN` | **Alta** |
| **RF-SOC-05** | Perfil del Socio y Consulta | Cada socio autenticado debe poder consultar su información personal, participación acordada, aportaciones históricas realizadas y proyectos asignados. | `PARTNER` | **Media** |

---

## 3. Módulo de Tesorería, Cuentas y Movimientos (RF-TES)

| ID | Nombre | Descripción | Roles Involucrados | Prioridad |
| :--- | :--- | :--- | :---: | :---: |
| **RF-TES-01** | Administración de Cuentas Financieras | Registrar y administrar cuentas de tesorería (`BANCARIA`, `CAJA_CHICA`, `FONDO_INVERSION`) con soporte multimoneda (base MXN). | `TREASURER`, `SUPER_ADMIN` | **Alta** |
| **RF-TES-02** | Almacenamiento Monetario en Centavos | Todos los importes dinerarios deben almacenarse en base de datos de manera estricta como valores enteros en centavos (`amount_cents`), prohibiendo tipos `float`. | Todos | **Alta** |
| **RF-TES-03** | Solicitud de Operaciones Financieras | Permitir solicitar egresos operativos, inversiones a proyectos, retiros o fondeos (`FinancialOperation`). | `TREASURER`, `PROJECT_MANAGER` | **Alta** |
| **RF-TES-04** | Transferencias Internas Neutras | Registrar transferencias entre cuentas propias como operaciones contablemente neutras (cero impacto en patrimonio neto). | `TREASURER` | **Alta** |
| **RF-TES-05** | Cálculo Dinámico de Saldos | Los saldos disponibles de cada cuenta deben derivarse de la sumatoria de movimientos contables confirmados (`AccountMovement`). | Todos | **Alta** |
| **RF-TES-06** | Inmutabilidad de Operaciones Ejecutadas | Bloquear cualquier eliminación física (`DELETE`) o modificación de importes (`UPDATE`) sobre operaciones en estado `EJECUTADO`. | Todos | **Alta** |
| **RF-TES-07** | Reversión Compensatoria (Contrasiento) | Corregir errores mediante operaciones de reversión compensatoria con justificación obligatoria y doble autorización independiente. | `TREASURER`, `SUPER_ADMIN` | **Alta** |

---

## 4. Módulo de Autorizaciones Financieras (RF-AUT)

| ID | Nombre | Descripción | Roles Involucrados | Prioridad |
| :--- | :--- | :--- | :---: | :---: |
| **RF-AUT-01** | Doble Firma Obligatoria (Regla 2-Man) | Toda operación financiera de egreso requiere obligatoriamente dos autorizaciones registradas para alcanzar el estado `AUTORIZADO`. | `FINANCE_APPROVER` | **Alta** |
| **RF-AUT-02** | Segregación de Autorizadores | El Autorizador 1 y el Autorizador 2 deben ser usuarios y personas físicas distintas. | `FINANCE_APPROVER` | **Alta** |
| **RF-AUT-03** | Exclusión Obligatoria del Solicitante | El usuario que solicita o registra la operación tiene estrictamente prohibido autorizar su propia solicitud (como Firma 1 o Firma 2). | Todos | **Alta** |
| **RF-AUT-04** | Inviolabilidad por SUPER_ADMIN | El `SUPER_ADMIN` no puede forzar la aprobación ni omitir el flujo de dos firmas independientes. | `SUPER_ADMIN` | **Alta** |
| **RF-AUT-05** | Separación de Autorización y Ejecución | La autorización otorga el pase a `AUTORIZADO`; la ejecución física del pago y afectación contable (`EJECUTADO`) es registrada de forma separada por el `TREASURER`. | `TREASURER` | **Alta** |
| **RF-AUT-06** | Trazabilidad Indeleble de Firmas | Registrar con sello de tiempo e IP: solicitante, Autorizador 1, Autorizador 2 y Tesorero ejecutor en `ApprovalSignature` y `AuditLog`. | Todos | **Alta** |
| **RF-AUT-07** | Rechazo Fundamentado | Cualquier autorizador facultado puede rechazar una operación pendiente indicando motivo obligatorio, pasando el estado a `RECHAZADO`. | `FINANCE_APPROVER` | **Alta** |

---

## 5. Módulo de Proyectos de Inversión y Seguimiento (RF-PRJ)

| ID | Nombre | Descripción | Roles Involucrados | Prioridad |
| :--- | :--- | :--- | :---: | :---: |
| **RF-PRJ-01** | Alta de Proyectos de Inversión | Registrar proyectos: código, nombre, tipo (`VEHICULAR`, `INMOBILIARIO`, `OTRO`), fechas estimadas y presupuesto. | `PROJECT_MANAGER`, `SUPER_ADMIN` | **Alta** |
| **RF-PRJ-02** | Asignación de Responsable e Integrantes | Asignar un `PROJECT_MANAGER` responsable y un equipo de colaboradores (`PROJECT_MEMBER`). | `SUPER_ADMIN`, `PROJECT_MANAGER` | **Alta** |
| **RF-PRJ-03** | Partidas Presupuestales | Desglosar presupuestos por categoría (`ProjectBudget`) y comparar contra gastos reales ejecutados en tesorería. | `PROJECT_MANAGER`, `TREASURER` | **Alta** |
| **RF-PRJ-04** | Hitos y Control de Avance | Definir hitos ponderados (`Milestone`) y calcular dinámicamente el avance físico del proyecto (0-100%). | `PROJECT_MANAGER` | **Media** |
| **RF-PRJ-05** | Actualizaciones de Estado | Registrar bitácora de actualizaciones periódicas (`ProjectUpdate`) sobre la situación del proyecto. | `PROJECT_MANAGER`, `PROJECT_MEMBER` | **Media** |
| **RF-PRJ-06** | Reuniones y Minutas | Programar reuniones (`Meeting`), registrar asistencia y resguardar minutas y compromisos formales (`MeetingMinute`). | `PROJECT_MANAGER`, `PROJECT_MEMBER` | **Media** |
| **RF-PRJ-07** | Actividades y Tareas Pendientes | Administrar catálogo de actividades pendientes (`Activity`), responsables asignados, fechas límite y estado. | `PROJECT_MANAGER`, `PROJECT_MEMBER` | **Media** |
| **RF-PRJ-08** | Evidencias y Documentos Probatorios | Almacenar metadatos de documentos, facturas y fotos probatorias (`ProjectDocument`) con hash y tamaño. | `PROJECT_MANAGER`, `PROJECT_MEMBER` | **Media** |
| **RF-PRJ-09** | Casos Específicos: Vehículos e Inmuebles | Soportar campos especializados: VIN, lote de remate y mecánica para autos; juzgado, litigio y avalúo para inmuebles. | `PROJECT_MANAGER` | **Alta** |
| **RF-PRJ-10** | Cálculo de Tiempos y Atrasos | Calcular dinámicamente días transcurridos, tiempo restante y días de atraso respecto a la fecha estimada de cierre. | Todos | **Media** |

---

## 6. Módulo de Cierres Financieros y Utilidades (RF-UTI)

| ID | Nombre | Descripción | Roles Involucrados | Prioridad |
| :--- | :--- | :--- | :---: | :---: |
| **RF-UTI-01** | Acuerdo Económico por Proyecto | Formalizar acuerdo específico (`ProfitAgreement`) que defina la distribución de utilidades del proyecto entre los socios participantes. | `SUPER_ADMIN`, `PROJECT_MANAGER` | **Alta** |
| **RF-UTI-02** | Validación Estricta de Suma 100% | Validar que la suma de porcentajes de un acuerdo sea exactamente igual al 100.00% (10,000 puntos base). | `SUPER_ADMIN` | **Alta** |
| **RF-UTI-03** | Cierre Financiero Formal | Registrar el cierre financiero formal del proyecto (`FinancialClose`) auditando que todos los ingresos y gastos reales estén en estado `EJECUTADO`. | `SUPER_ADMIN`, `TREASURER` | **Alta** |
| **RF-UTI-04** | Dispersión y Pago de Dividendos | Generar órdenes de dispersión individualizadas (`ProfitDistribution`) a favor de cada socio participante según el acuerdo aprobado. | `SUPER_ADMIN`, `TREASURER` | **Alta** |

---

## 7. Módulo de Tablero Ejecutivo (Dashboard) (RF-DSH)

| ID | Nombre | Descripción | Roles Involucrados | Prioridad |
| :--- | :--- | :--- | :---: | :---: |
| **RF-DSH-01** | Indicadores Financieros Consolidados | Visualizar KPIs ejecutivos: capital disponible, monto invertido en proyectos activos y utilidades generadas. | `SUPER_ADMIN`, `PARTNER`, `TREASURER`| **Alta** |
| **RF-DSH-02** | Gráficas Interactivas de Rendimiento | Desplegar gráficas con Recharts de flujo de efectivo mensual y rentabilidad por línea de negocio. | Todos los socios | **Alta** |
| **RF-DSH-03** | Monitoreo de Estado de Cartera | Tablero de seguimiento visual de proyectos (a tiempo, en riesgo, con atraso). | Todos los socios | **Media** |

---

## 8. Módulo de Auditoría y Trazabilidad (RF-AUD)

| ID | Nombre | Descripción | Roles Involucrados | Prioridad |
| :--- | :--- | :--- | :---: | :---: |
| **RF-AUD-01** | Registro Inmutable de Eventos | Insertar automáticamente en `AuditLog` cada mutación de datos, cambio de estado, inicio de sesión o firma digital. | Sistema (Automático) | **Alta** |
| **RF-AUD-02** | Fiscalización y Filtros de Auditoría | Permitir al `SUPER_ADMIN` consultar y filtrar la pista de auditoría por usuario, entidad, fecha y tipo de acción. | `SUPER_ADMIN` | **Media** |
