# Modelo Entidad-Relación (MER)
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento presenta el diseño conceptual y lógico integral de la base de datos relacional para el sistema, normalizado y optimizado para **SQLite** gestionado a través de **Prisma ORM**. El modelo está constituido por exactamente **28 entidades relacionales físicas** estructuradas para gobernar los 6 módulos funcionales del negocio.

---

## 1. Matriz de Correspondencia de las 28 Entidades

A continuación se certifica la correspondencia unívoca entre las 28 entidades del diagrama MER, el Diccionario de Datos y las Reglas de Integridad:

| # | Nombre Exacto de Entidad | Módulo Funcional | Presencia en Diagrama MER | Presencia en Diccionario | Reglas de Integridad Principales |
| :-: | :--- | :--- | :---: | :---: | :--- |
| **1** | `User` | Seguridad y Accesos | ✅ Sí (Línea 51) | ✅ Sí (Sec. 1.1) | ON DELETE RESTRICT en Partner, Operaciones, Firmas, Movimientos; CASCADE en Session. |
| **2** | `Role` | Seguridad y Accesos | ✅ Sí (Línea 60) | ✅ Sí (Sec. 1.2) | ON DELETE RESTRICT en UserRole y RolePermission; código único UK. |
| **3** | `UserRole` | Seguridad y Accesos | ✅ Sí (Línea 67) | ✅ Sí (Sec. 1.3) | ON DELETE CASCADE de User y Role; llave única compuesta (user_id, role_id). |
| **4** | `Permission` | Seguridad y Accesos | ✅ Sí (Línea 73) | ✅ Sí (Sec. 1.4) | ON DELETE RESTRICT en RolePermission; código de permiso único UK. |
| **5** | `RolePermission` | Seguridad y Accesos | ✅ Sí (Línea 79) | ✅ Sí (Sec. 1.5) | ON DELETE CASCADE de Role y Permission; llave única compuesta (role_id, permission_id). |
| **6** | `Session` | Seguridad y Accesos | ✅ Sí (Línea 85) | ✅ Sí (Sec. 1.6) | ON DELETE CASCADE de User; refresh_token_hash único; revocación remota. |
| **7** | `Partner` | Socios y Patrimonio | ✅ Sí (Línea 96) | ✅ Sí (Sec. 2.1) | ON DELETE RESTRICT de User; RESTRICT en Participaciones, Aportaciones, Proyectos. |
| **8** | `PartnerShare` | Socios y Patrimonio | ✅ Sí (Línea 106) | ✅ Sí (Sec. 2.2) | ON DELETE RESTRICT de Partner; Check basis_points (1000 = 10% acuerdo inicial). |
| **9** | `CapitalContribution` | Socios y Patrimonio | ✅ Sí (Línea 114) | ✅ Sí (Sec. 2.3) | ON DELETE RESTRICT de Partner y Account; Check amount_cents > 0. |
| **10** | `Account` | Tesorería y Fondos | ✅ Sí (Línea 124) | ✅ Sí (Sec. 3.1) | ON DELETE RESTRICT en AccountMovement y CapitalContribution; moneda base MXN. |
| **11** | `FinancialOperation` | Tesorería y Fondos | ✅ Sí (Línea 133) | ✅ Sí (Sec. 3.2) | ON DELETE RESTRICT de User(solicitante) y Project; CASCADE en ApprovalRequest; inmutable al ejecutar. |
| **12** | `ApprovalRequest` | Autorizaciones (2-Man) | ✅ Sí (Línea 148) | ✅ Sí (Sec. 3.3) | ON DELETE CASCADE de FinancialOperation; RESTRICT en ApprovalSignature; 2 firmas requeridas. |
| **13** | `ApprovalSignature` | Autorizaciones (2-Man) | ✅ Sí (Línea 156) | ✅ Sí (Sec. 3.4) | ON DELETE RESTRICT de ApprovalRequest y User; exclusión estricta de solicitante y firma duplicada. |
| **14** | `AccountMovement` | Tesorería (Libro Mayor)| ✅ Sí (Línea 167) | ✅ Sí (Sec. 3.5) | ON DELETE RESTRICT de Account, FinancialOperation y User(TREASURER); inmutable (Append-Only). |
| **15** | `Project` | Proyectos de Inversión | ✅ Sí (Línea 178) | ✅ Sí (Sec. 4.1) | ON DELETE RESTRICT de Partner(manager); RESTRICT si tiene operaciones o cierre; CASCADE en subentidades operativas. |
| **16** | `ProjectMember` | Proyectos de Inversión | ✅ Sí (Línea 191) | ✅ Sí (Sec. 4.2) | ON DELETE CASCADE de Project; RESTRICT de Partner; llave única compuesta (project_id, partner_id). |
| **17** | `ProjectBudget` | Proyectos de Inversión | ✅ Sí (Línea 198) | ✅ Sí (Sec. 4.3) | ON DELETE CASCADE de Project; Check budgeted_cents > 0 por partida. |
| **18** | `Milestone` | Proyectos de Inversión | ✅ Sí (Línea 205) | ✅ Sí (Sec. 4.4) | ON DELETE CASCADE de Project; Check weight_percentage (0 a 100). |
| **19** | `ProjectUpdate` | Proyectos de Inversión | ✅ Sí (Línea 215) | ✅ Sí (Sec. 4.5) | ON DELETE CASCADE de Project; SET NULL de User(autor). |
| **20** | `Meeting` | Proyectos de Inversión | ✅ Sí (Línea 224) | ✅ Sí (Sec. 4.6) | ON DELETE CASCADE de Project; CASCADE en MeetingMinute. |
| **21** | `MeetingMinute` | Proyectos de Inversión | ✅ Sí (Línea 232) | ✅ Sí (Sec. 4.7) | ON DELETE CASCADE de Meeting; llave única meeting_id (relación 1:1). |
| **22** | `Activity` | Proyectos de Inversión | ✅ Sí (Línea 241) | ✅ Sí (Sec. 4.8) | ON DELETE CASCADE de Project; SET NULL de User(asignado); control de estatus. |
| **23** | `ProjectDocument` | Proyectos de Inversión | ✅ Sí (Línea 250) | ✅ Sí (Sec. 4.9) | ON DELETE CASCADE de Project; hash SHA-256 de integridad y abstracción de StorageService. |
| **24** | `ProfitAgreement` | Cierres y Utilidades | ✅ Sí (Línea 261) | ✅ Sí (Sec. 5.1) | ON DELETE RESTRICT de Project; Check total_basis_points == 10000 (100.00% estricto); 1:1 con Project. |
| **25** | `ProfitShareItem` | Cierres y Utilidades | ✅ Sí (Línea 269) | ✅ Sí (Sec. 5.2) | ON DELETE CASCADE de ProfitAgreement; RESTRICT de Partner; Suma obligatoria de 10,000 puntos base. |
| **26** | `FinancialClose` | Cierres y Utilidades | ✅ Sí (Línea 276) | ✅ Sí (Sec. 5.3) | ON DELETE RESTRICT de Project y User(SUPER_ADMIN); RESTRICT en ProfitDistribution; cierre formal previo. |
| **27** | `ProfitDistribution` | Cierres y Utilidades | ✅ Sí (Línea 286) | ✅ Sí (Sec. 5.4) | ON DELETE RESTRICT de FinancialClose y Partner; SET NULL en AccountMovement; dispersión en centavos. |
| **28** | `AuditLog` | Auditoría Integral | ✅ Sí (Línea 295) | ✅ Sí (Sec. 6.1) | Inmutable (Append-Only); ON DELETE SET NULL de User; prohibición total de sentencias DELETE o UPDATE. |

---

## 2. Diagrama Entidad-Relación Completo

```mermaid
erDiagram
    User ||--o{ UserRole : "tiene asignados"
    Role ||--o{ UserRole : "agrupa usuarios"
    Role ||--o{ RolePermission : "contiene"
    Permission ||--o{ RolePermission : "concede"
    User ||--o| Partner : "representa a socio"
    User ||--o{ Session : "mantiene sesiones"
    User ||--o{ AuditLog : "genera acciones"

    Partner ||--o{ PartnerShare : "posee participacion acordada"
    Partner ||--o{ CapitalContribution : "aporta capital"
    Partner ||--o{ ProjectMember : "participa en equipo"
    Partner ||--o{ Project : "lidera como responsable"
    Partner ||--o{ ProfitShareItem : "figura en reparto"
    Partner ||--o{ ProfitDistribution : "recibe dividendo"

    Account ||--o{ CapitalContribution : "recibe fondeo"
    Account ||--o{ AccountMovement : "registra cargos y abonos"
    
    FinancialOperation ||--o{ AccountMovement : "genera tras ejecucion"
    FinancialOperation ||--o| ApprovalRequest : "requiere firmas"
    FinancialOperation }o--o| Project : "imputada a"
    User ||--o{ FinancialOperation : "solicita"

    ApprovalRequest ||--o{ ApprovalSignature : "registra firmas 1 y 2"
    User ||--o{ ApprovalSignature : "emite firma"

    Project ||--o{ ProjectMember : "integra equipo"
    Project ||--o{ ProjectBudget : "desglosa presupuesto"
    Project ||--o{ Milestone : "define hitos"
    Project ||--o{ ProjectUpdate : "registra avances"
    Project ||--o{ Meeting : "convoca reuniones"
    Meeting ||--o| MeetingMinute : "produce minuta"
    Project ||--o{ Activity : "controla tareas"
    Project ||--o{ ProjectDocument : "resguarda evidencias"
    Project ||--o| ProfitAgreement : "formaliza reparto"
    ProfitAgreement ||--|{ ProfitShareItem : "distribuye 100% entre"
    Project ||--o| FinancialClose : "concluye en"
    FinancialClose ||--|{ ProfitDistribution : "liquida utilidades"

    User {
        string id PK
        string email UK
        string password_hash
        string full_name
        boolean is_active
        datetime created_at
    }

    Role {
        string id PK
        string code UK "SUPER_ADMIN | PARTNER | TREASURER | FINANCE_APPROVER | PROJECT_MANAGER | PROJECT_MEMBER"
        string name
        string description
    }

    UserRole {
        string id PK
        string user_id FK
        string role_id FK
    }

    Permission {
        string id PK
        string code UK "ej. treasury:request | finance:approve"
        string description
    }

    RolePermission {
        string id PK
        string role_id FK
        string permission_id FK
    }

    Session {
        string id PK
        string user_id FK
        string refresh_token_hash
        string user_agent
        string ip_address
        boolean is_revoked
        datetime expires_at
        datetime created_at
    }

    Partner {
        string id PK
        string user_id FK UK "nullable"
        string legal_name
        string rfc UK "nullable"
        string phone
        string status "ACTIVO | INACTIVO"
        datetime joined_at
    }

    PartnerShare {
        string id PK
        string partner_id FK
        int basis_points "1000 = 10.00% acuerdo inicial"
        string agreement_notes
        datetime effective_date
    }

    CapitalContribution {
        string id PK
        string partner_id FK
        string account_id FK
        int amount_cents "Entero en centavos"
        string receipt_number
        string payment_method
        datetime contribution_date
    }

    Account {
        string id PK
        string name
        string account_type "BANCARIA | CAJA_CHICA | FONDO_INVERSION"
        string account_number
        string currency "MXN"
        boolean is_active
    }

    FinancialOperation {
        string id PK
        string code UK
        string concept
        int amount_cents "Entero en centavos"
        string operation_type "EGRESO_OPERATIVO | INVERSION_PROYECTO | TRANSFERENCIA_INTERNA | REVERSION_COMPENSATORIA | INGRESO"
        string status "BORRADOR | PENDIENTE_1 | PENDIENTE_2 | AUTORIZADO | EJECUTADO | RECHAZADO | REVERTIDO"
        string source_account_id FK "nullable"
        string target_account_id FK "nullable"
        string project_id FK "nullable"
        string requested_by_id FK
        string original_operation_id FK "nullable para reversiones"
        datetime created_at
    }

    ApprovalRequest {
        string id PK
        string financial_operation_id FK UK
        string status "PENDIENTE | APROBADO | RECHAZADO"
        int required_signatures "2"
        int current_signatures
    }

    ApprovalSignature {
        string id PK
        string approval_request_id FK
        string authorizer_user_id FK
        int signature_order "1 | 2"
        string action "APROBAR | RECHAZAR"
        string notes
        string ip_address
        datetime signed_at
    }

    AccountMovement {
        string id PK
        string account_id FK
        string financial_operation_id FK
        string movement_type "CARGO | ABONO"
        int amount_cents "Entero en centavos"
        string executed_by_id FK
        string bank_reference
        datetime executed_at
    }

    Project {
        string id PK
        string code UK
        string name
        string description
        string category "VEHICULAR | INMOBILIARIO | OTRO"
        string status "PLANEACION | ACTIVO | EN_CIERRE | CONCLUIDO | CANCELADO"
        string manager_partner_id FK
        datetime start_date
        datetime estimated_end_date
        datetime actual_end_date "nullable"
    }

    ProjectMember {
        string id PK
        string project_id FK
        string partner_id FK
        string role_in_project
    }

    ProjectBudget {
        string id PK
        string project_id FK
        string category_name
        int budgeted_cents
    }

    Milestone {
        string id PK
        string project_id FK
        string title
        int weight_percentage
        boolean is_completed
        datetime due_date
        datetime completed_at "nullable"
    }

    ProjectUpdate {
        string id PK
        string project_id FK
        string author_user_id FK
        string summary
        int reported_progress_percentage
        datetime created_at
    }

    Meeting {
        string id PK
        string project_id FK
        string title
        datetime meeting_date
        string location
    }

    MeetingMinute {
        string id PK
        string meeting_id FK UK
        string attendees_summary
        string topics_discussed
        string agreements_reached
        datetime recorded_at
    }

    Activity {
        string id PK
        string project_id FK
        string assigned_to_user_id FK "nullable"
        string title
        string status "PENDIENTE | EN_CURSO | TERMINADA | CANCELADA"
        datetime due_date
    }

    ProjectDocument {
        string id PK
        string project_id FK
        string title
        string document_type "FOTO_EVIDENCIA | FACTURA | ESCRITURA | CONTRATO | PERITAJE"
        string file_path
        string file_hash_sha256
        int file_size_bytes
        datetime uploaded_at
    }

    ProfitAgreement {
        string id PK
        string project_id FK UK
        string status "BORRADOR | APROBADO"
        int total_basis_points "10000 = 100.00%"
        datetime approved_at "nullable"
    }

    ProfitShareItem {
        string id PK
        string profit_agreement_id FK
        string partner_id FK
        int basis_points "Base 10000"
    }

    FinancialClose {
        string id PK
        string project_id FK UK
        int total_income_cents
        int total_cost_cents
        int net_profit_cents
        string approved_by_id FK
        datetime closed_at
    }

    ProfitDistribution {
        string id PK
        string financial_close_id FK
        string partner_id FK
        int distributed_cents
        string payment_status "PENDIENTE | DISPERSADO"
        string account_movement_id FK "nullable"
    }

    AuditLog {
        string id PK
        string user_id FK "nullable"
        string action
        string entity_name
        string entity_id
        string old_values_json "nullable"
        string new_values_json "nullable"
        string ip_address
        datetime timestamp
    }
```

---

## 3. Cobertura de los 6 Módulos y sus 28 Entidades Físicas

1. **Seguridad y Control de Acceso (6 entidades):** `User`, `Role`, `UserRole`, `Permission`, `RolePermission`, `Session`.
2. **Socios y Patrimonio (3 entidades):** `Partner`, `PartnerShare` (participación acordada inicial del 10%), `CapitalContribution` (aportaciones reales al fondo común).
3. **Tesorería y Flujo 2-Man (5 entidades):** `Account`, `FinancialOperation` (solicitud de fondos), `ApprovalRequest` y `ApprovalSignature` (doble firma independiente), `AccountMovement` (ejecución y cargos/abonos reales en centavos).
4. **Proyectos de Inversión y Gestión Operativa (9 entidades):** `Project`, `ProjectMember`, `ProjectBudget`, `Milestone`, `ProjectUpdate`, `Meeting`, `MeetingMinute`, `Activity`, `ProjectDocument`.
5. **Cierres Financieros y Utilidades (4 entidades):** `ProfitAgreement`, `ProfitShareItem` (suma estricta 100%), `FinancialClose` (cierre formal previo auditado), `ProfitDistribution` (dispersión calculada por socio).
6. **Auditoría Integral (1 entidad):** `AuditLog` (registro inmutable de todas las mutaciones).

Total exacto: **28 entidades físicas relacionales**, perfectamente coordinadas con el Diccionario de Datos y las Reglas de Integridad.
