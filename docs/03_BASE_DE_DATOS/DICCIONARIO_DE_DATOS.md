# Diccionario de Datos Integral (28 Entidades)
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento cataloga la estructura física de las **28 tablas relacionales** de la base de datos gestionada mediante **Prisma ORM** sobre motor **SQLite**, detallando campos, tipos, restricciones y reglas asociadas.

---

## 1. Módulo de Seguridad y Accesos (6 Entidades)

### 1.1. Tabla: `User` (Usuarios del Sistema)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 único del usuario. |
| `email` | String (`TEXT`) | No | **UK** | Correo electrónico de acceso. |
| `password_hash` | String (`TEXT`) | No | - | Hash de contraseña con bcrypt (cost factor >= 10 preliminar). |
| `full_name` | String (`TEXT`) | No | - | Nombre completo del usuario. |
| `is_active` | Boolean (`INTEGER`) | No | - | Estado activo (`true` = 1, `false` = 0). Default `true`. |
| `created_at` | DateTime (`TEXT`) | No | - | Fecha de alta en el sistema. |

### 1.2. Tabla: `Role` (Catálogo de Roles Oficiales)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del rol. |
| `code` | String (`TEXT`) | No | **UK** | `SUPER_ADMIN`, `PARTNER`, `TREASURER`, `FINANCE_APPROVER`, `PROJECT_MANAGER`, `PROJECT_MEMBER`. |
| `name` | String (`TEXT`) | No | - | Nombre descriptivo del rol. |
| `description` | String (`TEXT`) | No | - | Responsabilidades funcionales. |

### 1.3. Tabla: `UserRole` (Asignación Combinada de Roles)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la asignación. |
| `user_id` | String (`TEXT`) | No | **FK** | Referencia a `User.id`. |
| `role_id` | String (`TEXT`) | No | **FK** | Referencia a `Role.id`. Llave única compuesta (`user_id`, `role_id`). |

### 1.4. Tabla: `Permission` (Permisos Granulares)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del permiso. |
| `code` | String (`TEXT`) | No | **UK** | Código granular (ej. `treasury:request_operation`, `finance:approve`). |
| `description` | String (`TEXT`) | No | - | Detalle de la acción permitida. |

### 1.5. Tabla: `RolePermission` (Matriz de Permisos por Rol)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del vínculo. |
| `role_id` | String (`TEXT`) | No | **FK** | Referencia a `Role.id`. |
| `permission_id` | String (`TEXT`) | No | **FK** | Referencia a `Permission.id`. Llave única (`role_id`, `permission_id`). |

### 1.6. Tabla: `Session` (Control de Sesiones y Refresh Tokens)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la sesión. |
| `user_id` | String (`TEXT`) | No | **FK** | Referencia a `User.id`. |
| `refresh_token_hash`| String (`TEXT`) | No | **UK** | Hash del token de actualización. |
| `user_agent` | String (`TEXT`) | Sí | - | Información del navegador / cliente. |
| `ip_address` | String (`TEXT`) | No | - | IP de inicio de sesión. |
| `is_revoked` | Boolean (`INTEGER`) | No | - | Estado de revocación (`true` para invalidar). |
| `expires_at` | DateTime (`TEXT`) | No | - | Expiración del refresh token. |
| `created_at` | DateTime (`TEXT`) | No | - | Momento de login. |

---

## 2. Módulo de Socios y Patrimonio (3 Entidades)

### 2.1. Tabla: `Partner` (Padrón de Socios)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del socio. |
| `user_id` | String (`TEXT`) | Sí | **FK, UK** | Relación 1:1 con cuenta de usuario. |
| `legal_name` | String (`TEXT`) | No | - | Nombre legal o razón social (datos ficticios en pruebas). |
| `rfc` | String (`TEXT`) | Sí | **UK** | RFC de prueba o real cifrado fuera del repo público. |
| `phone` | String (`TEXT`) | Sí | - | Teléfono de contacto. |
| `status` | String (`TEXT`) | No | - | `ACTIVO` o `INACTIVO`. Default `ACTIVO`. |
| `joined_at` | DateTime (`TEXT`) | No | - | Fecha de adhesión. |

### 2.2. Tabla: `PartnerShare` (Participaciones Societarias Acordadas)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del registro. |
| `partner_id` | String (`TEXT`) | No | **FK** | Referencia a `Partner.id`. |
| `basis_points` | Int (`INTEGER`) | No | - | **Participación acordada inicial: 1000 = 10.00%**. |
| `agreement_notes` | String (`TEXT`) | Sí | - | Notas del acuerdo de voluntades inicial. |
| `effective_date` | DateTime (`TEXT`) | No | - | Fecha de vigencia. |

### 2.3. Tabla: `CapitalContribution` (Aportaciones de Capital al Fondo Común)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la aportación. |
| `partner_id` | String (`TEXT`) | No | **FK** | Referencia a `Partner.id` aportante. |
| `account_id` | String (`TEXT`) | No | **FK** | Cuenta de tesorería que recibe el depósito. |
| `amount_cents` | Int (`INTEGER`) | No | - | **Importe entero en centavos** aportado (positivo). |
| `receipt_number` | String (`TEXT`) | Sí | - | Folio del comprobante bancario. |
| `payment_method` | String (`TEXT`) | No | - | `TRANSFERENCIA_SPEI`, `DEPOSITO_VENTANILLA`, `CHEQUE`. |
| `contribution_date`| DateTime (`TEXT`) | No | - | Fecha efectiva del depósito. |

---

## 3. Módulo de Tesorería, Operaciones y Firmas (5 Entidades)

### 3.1. Tabla: `Account` (Cuentas Financieras)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la cuenta. |
| `name` | String (`TEXT`) | No | - | Nombre (ej. "Banorte Fondos"). |
| `account_type` | String (`TEXT`) | No | - | `BANCARIA`, `CAJA_CHICA`, `FONDO_INVERSION`. |
| `account_number` | String (`TEXT`) | Sí | - | Número de cuenta o CLABE interbancaria. |
| `currency` | String (`TEXT`) | No | - | Moneda base. Default `'MXN'`. |
| `is_active` | Boolean (`INTEGER`) | No | - | Habilitada para movimientos. |

### 3.2. Tabla: `FinancialOperation` (Solicitudes de Operación)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la operación. |
| `code` | String (`TEXT`) | No | **UK** | Folio de control (ej. `OP-2026-0001`). |
| `concept` | String (`TEXT`) | No | - | Justificación de la erogación o ingreso. |
| `amount_cents` | Int (`INTEGER`) | No | - | **Monto entero en centavos**. Siempre positivo. |
| `operation_type` | String (`TEXT`) | No | - | `EGRESO_OPERATIVO`, `INVERSION_PROYECTO`, `TRANSFERENCIA_INTERNA`, `REVERSION_COMPENSATORIA`, `INGRESO`. |
| `status` | String (`TEXT`) | No | - | `BORRADOR`, `PENDIENTE_1`, `PENDIENTE_2`, `AUTORIZADO`, `EJECUTADO`, `RECHAZADO`, `REVERTIDO`. |
| `source_account_id` | String (`TEXT`) | Sí | **FK** | Cuenta origen (requerida en egresos y transferencias). |
| `target_account_id` | String (`TEXT`) | Sí | **FK** | Cuenta destino (requerida en ingresos y transferencias). |
| `project_id` | String (`TEXT`) | Sí | **FK** | Proyecto imputado (opcional en gastos generales). |
| `requested_by_id` | String (`TEXT`) | No | **FK** | `User.id` del solicitante. |
| `original_operation_id`| String (`TEXT`) | Sí | **FK** | Referencia previa en caso de reversión. |
| `created_at` | DateTime (`TEXT`) | No | - | Fecha de emisión de la solicitud. |

### 3.3. Tabla: `ApprovalRequest` (Gestión de Doble Firma)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la solicitud de aprobación. |
| `financial_operation_id`| String (`TEXT`) | No | **FK, UK** | Relación 1:1 con la operación matriz. |
| `status` | String (`TEXT`) | No | - | `PENDIENTE`, `APROBADO`, `RECHAZADO`. |
| `required_signatures`| Int (`INTEGER`) | No | - | Fijado rígidamente en `2`. |
| `current_signatures` | Int (`INTEGER`) | No | - | Conteo de firmas válidas (0, 1 o 2). |

### 3.4. Tabla: `ApprovalSignature` (Firmas Digitales Independientes)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la firma individual. |
| `approval_request_id` | String (`TEXT`) | No | **FK** | Solicitud asociada. |
| `authorizer_user_id` | String (`TEXT`) | No | **FK** | `User.id` con rol `FINANCE_APPROVER` o `SUPER_ADMIN`. Excluye al solicitante. |
| `signature_order` | Int (`INTEGER`) | No | - | Orden de firma (`1` o `2`). |
| `action` | String (`TEXT`) | No | - | `APROBAR` o `RECHAZAR`. |
| `notes` | String (`TEXT`) | Sí | - | Motivo obligatorio en rechazo; observaciones en aprobación. |
| `ip_address` | String (`TEXT`) | No | - | IP cliente del autorizador. |
| `signed_at` | DateTime (`TEXT`) | No | - | Sello de tiempo ISO-8601 del servidor. |

### 3.5. Tabla: `AccountMovement` (Libro Mayor de Movimientos Ejecutados)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del movimiento contable inmutable. |
| `account_id` | String (`TEXT`) | No | **FK** | Cuenta financiera afectada. |
| `financial_operation_id`| String (`TEXT`) | No | **FK** | Operación matriz autorizada. |
| `movement_type` | String (`TEXT`) | No | - | `CARGO` (resta saldo) o `ABONO` (suma saldo). |
| `amount_cents` | Int (`INTEGER`) | No | - | Importe exacto en centavos. |
| `executed_by_id`| String (`TEXT`) | No | **FK** | `User.id` con rol `TREASURER` que ejecutó el pago. |
| `bank_reference`| String (`TEXT`) | Sí | - | Folio de rastreo SPEI o número de cheque. |
| `executed_at` | DateTime (`TEXT`) | No | - | Fecha y hora real de dispersión. |

---

## 4. Módulo de Proyectos de Inversión y Gestión Operativa (9 Entidades)

### 4.1. Tabla: `Project` (Proyectos de Inversión)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del proyecto. |
| `code` | String (`TEXT`) | No | **UK** | Código corto único (ej. `PRJ-AUTO-01`, `PRJ-INM-02`). |
| `name` | String (`TEXT`) | No | - | Nombre descriptivo del proyecto. |
| `description` | String (`TEXT`) | No | - | Alcance del proyecto. |
| `category` | String (`TEXT`) | No | - | `VEHICULAR`, `INMOBILIARIO`, `OTRO`. |
| `status` | String (`TEXT`) | No | - | `PLANEACION`, `ACTIVO`, `EN_CIERRE`, `CONCLUIDO`, `CANCELADO`. |
| `manager_partner_id`| String (`TEXT`) | No | **FK** | `Partner.id` del socio responsable directo. |
| `start_date` | DateTime (`TEXT`) | No | - | Fecha formal de inicio. |
| `estimated_end_date`| DateTime (`TEXT`) | No | - | Fecha estimada de conclusión. |
| `actual_end_date` | DateTime (`TEXT`) | Sí | - | Fecha real de cierre formal. |

### 4.2. Tabla: `ProjectMember` (Equipo del Proyecto)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la asignación. |
| `project_id` | String (`TEXT`) | No | **FK** | Referencia a `Project.id`. |
| `partner_id` | String (`TEXT`) | No | **FK** | Referencia a `Partner.id`. Llave única compuesta (`project_id`, `partner_id`). |
| `role_in_project` | String (`TEXT`) | No | - | Función asignada (ej. "Perito Mecánico", "Abogado Litigante"). |

### 4.3. Tabla: `ProjectBudget` (Partidas Presupuestales)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la partida. |
| `project_id` | String (`TEXT`) | No | **FK** | Referencia a `Project.id`. |
| `category_name` | String (`TEXT`) | No | - | Rubro (ej. "Adquisición Lote", "Hojalatería", "Escrituración"). |
| `budgeted_cents`| Int (`INTEGER`) | No | - | Monto máximo autorizado en centavos. |

### 4.4. Tabla: `Milestone` (Hitos y Cronograma)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del hito. |
| `project_id` | String (`TEXT`) | No | **FK** | Referencia a `Project.id`. |
| `title` | String (`TEXT`) | No | - | Nombre del hito. |
| `weight_percentage`| Int (`INTEGER`) | No | - | Ponderación del hito (0 a 100%). |
| `is_completed` | Boolean (`INTEGER`) | No | - | Estado de cumplimiento. Default `false`. |
| `due_date` | DateTime (`TEXT`) | No | - | Fecha límite programada. |
| `completed_at` | DateTime (`TEXT`) | Sí | - | Fecha efectiva de finalización. |

### 4.5. Tabla: `ProjectUpdate` (Bitácora de Avances)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la actualización. |
| `project_id` | String (`TEXT`) | No | **FK** | Referencia a `Project.id`. |
| `author_user_id`| String (`TEXT`) | No | **FK** | `User.id` del autor de la publicación. |
| `summary` | String (`TEXT`) | No | - | Resumen del reporte de situación. |
| `reported_progress_percentage`| Int (`INTEGER`)| No | - | Porcentaje estimado al momento. |
| `created_at` | DateTime (`TEXT`) | No | - | Fecha de registro. |

### 4.6. Tabla: `Meeting` (Reuniones de Seguimiento)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la reunión. |
| `project_id` | String (`TEXT`) | No | **FK** | Referencia a `Project.id`. |
| `title` | String (`TEXT`) | No | - | Asunto o título de la reunión. |
| `meeting_date` | DateTime (`TEXT`) | No | - | Fecha y hora convocada. |
| `location` | String (`TEXT`) | Sí | - | Lugar o enlace virtual. |

### 4.7. Tabla: `MeetingMinute` (Minutas y Acuerdos Formales)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la minuta. |
| `meeting_id` | String (`TEXT`) | No | **FK, UK** | Relación 1:1 con `Meeting.id`. |
| `attendees_summary`| String (`TEXT`) | No | - | Lista formal de asistentes. |
| `topics_discussed` | String (`TEXT`) | No | - | Temas abordados en la sesión. |
| `agreements_reached`| String (`TEXT`) | No | - | Acuerdos y resoluciones votadas. |
| `recorded_at` | DateTime (`TEXT`) | No | - | Fecha de levantamiento del acta. |

### 4.8. Tabla: `Activity` (Actividades y Tareas Operativas)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la tarea. |
| `project_id` | String (`TEXT`) | No | **FK** | Referencia a `Project.id`. |
| `assigned_to_user_id`| String (`TEXT`) | Sí | **FK** | Usuario responsable asignado. |
| `title` | String (`TEXT`) | No | - | Título de la actividad. |
| `status` | String (`TEXT`) | No | - | `PENDIENTE`, `EN_CURSO`, `TERMINADA`, `CANCELADA`. |
| `due_date` | DateTime (`TEXT`) | Sí | - | Fecha compromiso de entrega. |

### 4.9. Tabla: `ProjectDocument` (Evidencias y Documentos Probatorios)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del documento. |
| `project_id` | String (`TEXT`) | No | **FK** | Referencia a `Project.id`. |
| `title` | String (`TEXT`) | No | - | Título descriptivo (ej. "Factura Lote Auto 12", "Fotos Remozamiento"). |
| `document_type` | String (`TEXT`) | No | - | `FOTO_EVIDENCIA`, `FACTURA`, `ESCRITURA`, `CONTRATO`, `PERITAJE`. |
| `file_path` | String (`TEXT`) | No | - | Ruta relativa local (`uploads/...`) gestionada vía StorageService. |
| `file_hash_sha256`| String (`TEXT`) | No | - | Hash de integridad para auditoría de archivos. |
| `file_size_bytes` | Int (`INTEGER`) | No | - | Peso físico del archivo en bytes. |
| `uploaded_at` | DateTime (`TEXT`) | No | - | Fecha y hora de carga. |

---

## 5. Módulo de Cierres Financieros y Utilidades (4 Entidades)

### 5.1. Tabla: `ProfitAgreement` (Acuerdos Económicos por Proyecto)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del acuerdo. |
| `project_id` | String (`TEXT`) | No | **FK, UK** | Relación 1:1 con `Project.id`. |
| `status` | String (`TEXT`) | No | - | `BORRADOR` o `APROBADO`. |
| `total_basis_points`| Int (`INTEGER`) | No | - | **Fijado estrictamente en 10000 (100.00%)**. |
| `approved_at` | DateTime (`TEXT`) | Sí | - | Fecha de formalización por el `SUPER_ADMIN`. |

### 5.2. Tabla: `ProfitShareItem` (Puntos Base por Socio)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del registro. |
| `profit_agreement_id`| String (`TEXT`) | No | **FK** | Referencia a `ProfitAgreement.id`. |
| `partner_id` | String (`TEXT`) | No | **FK** | Referencia a `Partner.id`. Llave única compuesta (`agreement_id`, `partner_id`). |
| `basis_points` | Int (`INTEGER`) | No | - | Puntos base asignados (ej. `2500` = 25.00%). |

### 5.3. Tabla: `FinancialClose` (Cierre Financiero Formal)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del cierre financiero. |
| `project_id` | String (`TEXT`) | No | **FK, UK** | Relación 1:1 con `Project.id`. |
| `total_income_cents`| Int (`INTEGER`) | No | - | Total de ingresos confirmados por venta del activo. |
| `total_cost_cents` | Int (`INTEGER`) | No | - | Total de costos y gastos reales ejecutados en tesorería. |
| `net_profit_cents` | Int (`INTEGER`) | No | - | Utilidad neta resultante (`income - cost`). |
| `approved_by_id` | String (`TEXT`) | No | **FK** | `User.id` con rol `SUPER_ADMIN` que aprueba el cierre. |
| `closed_at` | DateTime (`TEXT`) | No | - | Fecha y hora formal del cierre. |

### 5.4. Tabla: `ProfitDistribution` (Órdenes de Dispersión de Utilidades)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 de la dispersión individual. |
| `financial_close_id`| String (`TEXT`) | No | **FK** | Referencia al cierre financiero aprobado. |
| `partner_id` | String (`TEXT`) | No | **FK** | Socio acreedor del dividendo. |
| `distributed_cents` | Int (`INTEGER`) | No | - | Monto exacto calculado en centavos. |
| `payment_status` | String (`TEXT`) | No | - | `PENDIENTE` o `DISPERSADO`. |
| `account_movement_id`| String (`TEXT`) | Sí | **FK** | Movimiento contable generado cuando el Tesorero ejecuta el pago. |

---

## 6. Módulo de Auditoría Integral (1 Entidad)

### 6.1. Tabla: `AuditLog` (Bitácora Inmutable de Eventos)
| Campo | Tipo SQLite / Prisma | Nulo | Llave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String (`TEXT`) | No | **PK** | UUID v4 del evento. |
| `user_id` | String (`TEXT`) | Sí | **FK** | Usuario responsable (`NULL` en eventos del sistema). |
| `action` | String (`TEXT`) | No | - | Clave de evento (ej. `TREASURY_EXECUTE`, `APPROVAL_SIGN_2`). |
| `entity_name` | String (`TEXT`) | No | - | Nombre de la entidad afectada. |
| `entity_id` | String (`TEXT`) | No | - | Identificador de la fila modificada. |
| `old_values_json` | String (`TEXT`) | Sí | - | Estado anterior serializado. |
| `new_values_json` | String (`TEXT`) | Sí | - | Estado posterior serializado. |
| `ip_address` | String (`TEXT`) | No | - | Dirección IP cliente. |
| `timestamp` | DateTime (`TEXT`) | No | - | Sello de tiempo ISO-8601 del servidor. |
