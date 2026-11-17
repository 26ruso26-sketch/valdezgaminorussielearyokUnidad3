# Reglas de Integridad de la Base de Datos (28 Entidades)
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento establece las políticas de integridad referencial, restricciones de dominio (Constraints), reglas de coherencia transaccional y validaciones lógicas para el modelo de **28 entidades relacionales físicas** gobernadas por **Prisma ORM** sobre motor **SQLite**.

---

## 1. Matriz de Correspondencia e Integridad de las 28 Entidades

| # | Entidad | Diagrama MER | Diccionario | Política Referencial ON DELETE | Restricciones de Dominio / Integridad |
| :-: | :--- | :---: | :---: | :--- | :--- |
| **1** | `User` | ✅ Sí | ✅ Sec. 1.1 | RESTRICT en Partner, Operaciones, Firmas, Movimientos; CASCADE en Session | Email con formato válido y único; contraseña cifrada con bcrypt. |
| **2** | `Role` | ✅ Sí | ✅ Sec. 1.2 | RESTRICT en UserRole y RolePermission | Código único UK perteneciente a los 6 roles oficiales. |
| **3** | `UserRole` | ✅ Sí | ✅ Sec. 1.3 | CASCADE de User y Role | Llave única compuesta (`user_id`, `role_id`). Evita roles duplicados. |
| **4** | `Permission` | ✅ Sí | ✅ Sec. 1.4 | RESTRICT en RolePermission | Código único UK de nomenclatura `recurso:accion`. |
| **5** | `RolePermission` | ✅ Sí | ✅ Sec. 1.5 | CASCADE de Role y Permission | Llave única compuesta (`role_id`, `permission_id`). |
| **6** | `Session` | ✅ Sí | ✅ Sec. 1.6 | CASCADE de User | Hash único de refresh token; validación de `expires_at` y `is_revoked`. |
| **7** | `Partner` | ✅ Sí | ✅ Sec. 2.1 | RESTRICT de User; RESTRICT en Participaciones, Aportaciones, Proyectos | RFC único si está presente; status IN ('ACTIVO', 'INACTIVO'). |
| **8** | `PartnerShare` | ✅ Sí | ✅ Sec. 2.2 | RESTRICT de Partner | `basis_points >= 0 AND basis_points <= 10000` (1000 = 10% acuerdo inicial). |
| **9** | `CapitalContribution` | ✅ Sí | ✅ Sec. 2.3 | RESTRICT de Partner y Account | `amount_cents > 0` obligatorio; folio de comprobante registrado. |
| **10** | `Account` | ✅ Sí | ✅ Sec. 3.1 | RESTRICT en AccountMovement y CapitalContribution | account_type IN ('BANCARIA', 'CAJA_CHICA', 'FONDO_INVERSION'); currency = 'MXN'. |
| **11** | `FinancialOperation` | ✅ Sí | ✅ Sec. 3.2 | RESTRICT de User(solicitante) y Project; CASCADE en ApprovalRequest | `amount_cents > 0`; status IN ('BORRADOR', 'PENDIENTE_1', 'PENDIENTE_2', 'AUTORIZADO', 'EJECUTADO', 'RECHAZADO', 'REVERTIDO'). |
| **12** | `ApprovalRequest` | ✅ Sí | ✅ Sec. 3.3 | CASCADE de FinancialOperation; RESTRICT en ApprovalSignature | 1:1 con FinancialOperation; required_signatures = 2. |
| **13** | `ApprovalSignature` | ✅ Sí | ✅ Sec. 3.4 | RESTRICT de ApprovalRequest y User(autorizador) | `authorizer_user_id != requested_by_id`; `signature_1 != signature_2`. |
| **14** | `AccountMovement` | ✅ Sí | ✅ Sec. 3.5 | RESTRICT de Account, FinancialOperation y User(TREASURER) | Inmutable (Append-Only); movement_type IN ('CARGO', 'ABONO'); `amount_cents > 0`. |
| **15** | `Project` | ✅ Sí | ✅ Sec. 4.1 | RESTRICT de Partner(manager); RESTRICT si tiene operaciones o cierre | code único UK; category IN ('VEHICULAR', 'INMOBILIARIO', 'OTRO'); fechas válidas. |
| **16** | `ProjectMember` | ✅ Sí | ✅ Sec. 4.2 | CASCADE de Project; RESTRICT de Partner | Llave única compuesta (`project_id`, `partner_id`). |
| **17** | `ProjectBudget` | ✅ Sí | ✅ Sec. 4.3 | CASCADE de Project | `budgeted_cents > 0` obligatorio por partida. |
| **18** | `Milestone` | ✅ Sí | ✅ Sec. 4.4 | CASCADE de Project | `weight_percentage >= 0 AND weight_percentage <= 100`. |
| **19** | `ProjectUpdate` | ✅ Sí | ✅ Sec. 4.5 | CASCADE de Project; SET NULL de User(autor) | `reported_progress_percentage >= 0 AND <= 100`. |
| **20** | `Meeting` | ✅ Sí | ✅ Sec. 4.6 | CASCADE de Project; CASCADE en MeetingMinute | Fecha de reunión no nula. |
| **21** | `MeetingMinute` | ✅ Sí | ✅ Sec. 4.7 | CASCADE de Meeting | 1:1 con Meeting; resumen de acuerdos obligatorio. |
| **22** | `Activity` | ✅ Sí | ✅ Sec. 4.8 | CASCADE de Project; SET NULL de User(asignado) | status IN ('PENDIENTE', 'EN_CURSO', 'TERMINADA', 'CANCELADA'). |
| **23** | `ProjectDocument` | ✅ Sí | ✅ Sec. 4.9 | CASCADE de Project | `file_size_bytes > 0`; hash SHA-256 no nulo; gestión vía StorageService. |
| **24** | `ProfitAgreement` | ✅ Sí | ✅ Sec. 5.1 | RESTRICT de Project; CASCADE en ProfitShareItem | 1:1 con Project; `total_basis_points == 10000` (100.00% exacto). |
| **25** | `ProfitShareItem` | ✅ Sí | ✅ Sec. 5.2 | CASCADE de ProfitAgreement; RESTRICT de Partner | Llave única compuesta (`agreement_id`, `partner_id`); suma obligatoria de 10,000 puntos base. |
| **26** | `FinancialClose` | ✅ Sí | ✅ Sec. 5.3 | RESTRICT de Project y User(SUPER_ADMIN); RESTRICT en ProfitDistribution | 1:1 con Project; conciliación obligatoria de `total_income_cents` y `total_cost_cents`. |
| **27** | `ProfitDistribution`| ✅ Sí | ✅ Sec. 5.4 | RESTRICT de FinancialClose y Partner; SET NULL en AccountMovement | `distributed_cents > 0`; payment_status IN ('PENDIENTE', 'DISPERSADO'). |
| **28** | `AuditLog` | ✅ Sí | ✅ Sec. 6.1 | Inmutable (Append-Only); ON DELETE SET NULL de User | Prohibición estricta de UPDATE o DELETE en controladores y servicios. |

---

## 2. Reglas Financieras y de Control Interno

### 2.1. Almacenamiento en Centavos Enteros
- Todos los campos monetarios (`amount_cents`, `budgeted_cents`, `total_income_cents`, `total_cost_cents`, `net_profit_cents`, `distributed_cents`) se almacenan de manera estricta como números enteros que representan centavos de peso (MXN). Se prohíbe el uso de tipos de coma flotante en SQLite.

### 2.2. Flujo 2-Man de Doble Autorización y Segregación de Ejecución
- **Inexistencia de Autoautorización:** El usuario que solicita una operación financiera no puede firmarla como Autorizador 1 ni como Autorizador 2 (`authorizer_user_id != requested_by_id`).
- **Inviolabilidad por SUPER_ADMIN:** El rol `SUPER_ADMIN` no cuenta con permisos de bypass ni firma única. Toda erogación exige dos firmas de usuarios distintos con rol `FINANCE_APPROVER` o facultados.
- **Separación de Operaciones:**
  - El estado `AUTORIZADO` indica que la operación reunió las dos firmas independientes, pero **no afecta saldos**.
  - El estado `EJECUTADO` es registrado de forma separada por el usuario con rol `TREASURER`, quien verifica la doble firma y registra la dispersión bancaria real en `AccountMovement`.

### 2.3. Trazabilidad e Inmutabilidad de Reversiones
- Las operaciones en estado `EJECUTADO` y los registros de `AccountMovement` no se eliminan jamás (`DELETE` bloqueado).
- Los errores contables se subsanan mediante una nueva `FinancialOperation` de tipo `REVERSION_COMPENSATORIA` que pasa por el mismo flujo de doble autorización y genera un contrasiento en `AccountMovement`, actualizando el registro matriz a `REVERTIDO` con referencia cruzada indeleble.

---

## 3. Garantías ACID y Balance Dinámico

El saldo contable disponible de cualquier cuenta financiera $A$ se calcula en tiempo real:

$$\text{Saldo Disponible}(A) = \sum_{m \in \text{AccountMovement}(A), m.\text{type} = \text{'ABONO'}} m.\text{amount\_cents} - \sum_{m \in \text{AccountMovement}(A), m.\text{type} = \text{'CARGO'}} m.\text{amount\_cents}$$

Cada desembolso se encapsula dentro de una transacción interactiva de Prisma ORM (`$transaction`):
1. Validación de estado `AUTORIZADO`.
2. Verificación de saldo suficiente en la cuenta origen.
3. Creación del registro `AccountMovement`.
4. Transición de estado a `EJECUTADO`.
5. Inserción automática en `AuditLog`.
Si cualquiera de los pasos falla, SQLite revierte la operación en su totalidad garantizando consistencia absoluta.
