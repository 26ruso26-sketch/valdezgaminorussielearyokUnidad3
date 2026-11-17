# Patrones de Diseño de Software
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento cataloga los patrones arquitectónicos, de diseño y financieros aplicados en el desarrollo de **Prisma Business Dashboard**, justificando su elección y señalando su impacto en la calidad del código.

---

## 1. Patrones de Diseño en la Capa Backend (NestJS)

### 1.1. Inversión de Control e Inyección de Dependencias (IoC / DI)
- **Propósito:** Desacoplar la creación de instancias de los componentes de su consumo directo.
- **Implementación:** NestJS gestiona el contenedor IoC mediante decoradores `@Injectable()`. Los controladores reciben servicios en sus constructores, permitiendo sustituir fácilmente dependencias reales por mocks durante las pruebas unitarias con Jest.

### 1.2. Data Transfer Object (DTO) & Validation Pipe
- **Propósito:** Definir el contrato formal de entrada para cada endpoint de la API y asegurar que los datos sean validados y sanitizados antes de alcanzar la capa de servicio.
- **Implementación:** Clases TypeScript decoradas con `class-validator` (ej. `@IsInt()`, `@Min(1)`, `@IsNotEmpty()`). El `ValidationPipe` global rechaza automáticamente payloads corruptos o con campos no permitidos (`whitelist: true`, `forbidNonWhitelisted: true`).

### 1.3. Strategy Pattern (Estrategia de Autenticación)
- **Propósito:** Permitir múltiples mecanismos de autenticación y autorización intercambiables de forma modular.
- **Implementación:** Implementado mediante Passport.js en NestJS con `JwtStrategy` para validar tokens en peticiones subsecuentes y `LocalStrategy` para el login inicial con usuario y contraseña.

### 1.4. Interceptor Pattern (Pistas de Auditoría y Transformación)
- **Propósito:** Interceptar el flujo de ejecución antes y después de procesar un controlador para aplicar tareas transversales (cross-cutting concerns).
- **Implementación:**
  - `AuditInterceptor`: Registra de forma transparente los cambios de estado en `AuditLog`.
  - `TransformInterceptor`: Estandariza las respuestas HTTP en un formato consistente `{ success: true, data: ..., timestamp: ... }`.

### 1.5. Unit of Work / Atomic Transaction Pattern
- **Propósito:** Garantizar que operaciones que afectan múltiples tablas (ej. débito de cuenta + crédito de cuenta + registro de aprobación) se ejecuten como una única unidad atómica bajo el principio ACID.
- **Implementación:** Uso de `prisma.$transaction([ ... ])` o transacciones interactivas de Prisma ORM.

---

## 2. Patrones de Diseño en la Capa Frontend (React)

### 2.1. Container - Presenter (Componentes Inteligentes vs Componentes Tontos)
- **Propósito:** Separar la lógica de negocio y consumo de datos de la interfaz visual de renderizado.
- **Implementación:**
  - *Presenters:* Componentes puros de Tailwind CSS que solo reciben `props` y emiten eventos (ej. `StatCard`, `TransactionTable`, `ProjectTimeline`).
  - *Containers / Pages:* Componentes de página que gestionan el estado, llaman a servicios de API y orquestan la navegación (ej. `TreasuryPage`, `ProjectDetailPage`).

### 2.2. Custom Hooks Pattern
- **Propósito:** Reutilizar y encapsular la lógica de estado y llamadas asíncronas sin ensuciar la vista.
- **Implementación:** Hooks específicos como `useAuth()`, `useTreasury()`, `useProjectApprovals()`, que aíslan el manejo de peticiones Axios/Fetch, estados de carga (`isLoading`) y captura de errores.

---

## 3. Patrones de Diseño Específicos de Dominio Financiero

### 3.1. The Money Pattern (Martin Fowler)
- **Problema:** El tipo de datos flotante (`Float`) en informática utiliza el estándar binario IEEE 754, lo que provoca errores sutiles de redondeo acumulativo (ej. `0.1 + 0.2 = 0.30000000000000004`).
- **Solución:** Representar todo monto de dinero como un par de valores: un **entero para la cantidad en la unidad mínima indivisible (centavos)** y un identificador de moneda ISO (ej. `amountCents: 1500050`, `currency: 'MXN'`).
- **Beneficio:** 100% de exactitud matemática y conciliación financiera sin discrepancias de centavos.

### 3.2. Two-Man Rule Pattern (Doble Firma de Seguridad)
- **Propósito:** Mitigar el riesgo de fraude interno y errores involuntarios en salidas de capital.
- **Implementación:** Máquina de estados finita que exige dos aprobaciones con claves públicas/IDs de usuarios distintos al originador antes de liberar el estado del movimiento a `EJECUTADO`.

### 3.3. Compensating Transaction Pattern (Reversión Compensatoria)
- **Problema:** En sistemas contables auditables, eliminar un registro (`DELETE`) destruye la trazabilidad histórica y viola normas de cumplimiento.
- **Solución:** Ante una transacción fallida o errónea ya ejecutada, se emite una transacción de reversión con signo inverso que cancela algebraicamente el impacto de la primera, manteniendo ambos registros en la base de datos con referencia cruzada.

### 3.4. Append-Only Ledger (Libro Mayor de Solo Agregado)
- **Propósito:** Asegurar la integridad histórica. Los balances no se editan directamente; se calculan como una función matemática pura sobre el historial inmutable de movimientos confirmados:
  $$\text{Saldo Disponible} = \sum \text{Créditos Confirmados} - \sum \text{Débitos Confirmados}$$

