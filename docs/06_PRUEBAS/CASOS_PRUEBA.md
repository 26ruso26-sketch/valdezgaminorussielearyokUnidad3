# Catálogo de Casos de Prueba (Test Cases)
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento contiene los casos de prueba formales para verificar la conformidad del sistema frente a las reglas de negocio, la seguridad y la integridad financiera.

---

## 1. Casos de Prueba Financieros y Autorizaciones (CP-FIN)

### CP-FIN-01: Almacenamiento Estricto en Centavos Enteros
- **Módulo:** Tesorería
- **Precondición:** El usuario tiene permisos para solicitar movimientos financieros.
- **Pasos:**
  1. Ingresar un importe de `$14,890.65 MXN` en el formulario de solicitud de egreso.
  2. Enviar la petición al backend (`POST /api/v1/treasury/transactions`).
  3. Inspeccionar el registro creado en la base de datos SQLite.
- **Resultado Esperado:** El campo `amount_cents` almacena exactamente el valor entero `1489065` sin decimales ni redondeos no deseados.
- **Tipo de Prueba:** Integración / Base de Datos.

---

### CP-FIN-02: Bloqueo de Auto-autorización por el Solicitante
- **Módulo:** Autorizaciones (Regla 2-Man)
- **Precondición:** Existe una solicitud de egreso en estado `PENDIENTE_AUTORIZACION_1` creada por el usuario `Usuario_A`.
- **Pasos:**
  1. El `Usuario_A` se autentica en el sistema y obtiene su token JWT.
  2. El `Usuario_A` intenta firmar la aprobación (`POST /api/v1/approvals/:id/sign`).
- **Resultado Esperado:** El backend rechaza la petición con código **422 Unprocessable Entity** y mensaje explicativo: *"El usuario solicitante no puede autorizar su propia transacción"*. El estado permanece inalterado.
- **Tipo de Prueba:** Integración / Supertest.

---

### CP-FIN-03: Bloqueo de Segunda Firma por el Mismo Autorizador
- **Módulo:** Autorizaciones (Regla 2-Man)
- **Precondición:** La solicitud está en estado `PENDIENTE_AUTORIZACION_2` habiendo sido firmada previamente por el `Usuario_B`.
- **Pasos:**
  1. El `Usuario_B` intenta enviar una segunda firma sobre la misma solicitud.
- **Resultado Esperado:** El backend retorna **422 Unprocessable Entity** con mensaje: *"Se requiere un autorizador distinto para otorgar la segunda firma"*.
- **Tipo de Prueba:** Integración / Supertest.

---

### CP-FIN-04: Ejecución Exitosa con Dos Firmas Válidas y Separación de Ejecución
- **Módulo:** Autorizaciones y Tesorería
- **Requisitos Asociados:** `RF-AUT-01`, `RF-AUT-02`, `RF-AUT-05`, `RF-TES-05`
- **Precondición:** Operación creada por `Usuario_A` (`PROJECT_MANAGER`) y firmada por `Usuario_B` (`FINANCE_APPROVER`).
- **Pasos:**
  1. El `Usuario_C` (`FINANCE_APPROVER`, distinto de A y B) envía la Firma 2 (`POST /api/v1/approvals/:id/sign`).
  2. Se valida que la operación cambia a estado `AUTORIZADO` pero aún no descuenta saldo.
  3. El `Usuario_D` (`TREASURER`) ejecuta el desembolso bancario (`POST /api/v1/treasury/operations/:id/execute`).
- **Resultado Esperado:** La operación pasa a estado `EJECUTADO`, se genera el registro contable en `AccountMovement`, y el saldo disponible de la cuenta se descuenta exactamente en el monto en centavos indicado.
- **Tipo de Prueba:** E2E / Flujo Completo.

---

### CP-FIN-05: Inmutabilidad de Transacciones Ejecutadas
- **Módulo:** Tesorería
- **Precondición:** Existe una transacción en estado `EJECUTADO` con ID `#200`.
- **Pasos:**
  1. Enviar una petición HTTP `DELETE /api/v1/treasury/transactions/200`.
  2. Enviar una petición HTTP `PATCH /api/v1/treasury/transactions/200` intentando alterar el importe.
- **Resultado Esperado:** Ambas peticiones son rechazadas (405 Method Not Allowed o 400 Bad Request). El registro en base de datos no sufre alteración.
- **Tipo de Prueba:** Seguridad / Integridad.

---

### CP-FIN-06: Aplicación de Reversión Compensatoria (Contrasiento)
- **Módulo:** Tesorería
- **Precondición:** Movimiento ejecutado `#200` por `$50,000.00 MXN`.
- **Pasos:**
  1. Solicitar reversión compensatoria indicando motivo de error de captura.
  2. Procesar las dos firmas de autorización para la reversión.
  3. Ejecutar la reversión aprobada.
- **Resultado Esperado:** Se crea una nueva transacción `#201` de tipo `REVERSION_COMPENSATORIA` vinculada a `#200`, el saldo de la cuenta se restablece a su valor original, y la transacción `#200` pasa a estado `REVERTIDO`.
- **Tipo de Prueba:** Integración Contable.

---

## 2. Casos de Prueba de Proyectos y Acuerdos (CP-PRJ)

### CP-PRJ-01: Rechazo de Acuerdo de Utilidades Distinto a 100%
- **Módulo:** Utilidades
- **Precondición:** Proyecto en estado `ACTIVO`.
- **Pasos:**
  1. Configurar reparto entre 3 socios: 40.00%, 30.00% y 25.00% (Suma: 95.00%).
  2. Enviar petición para guardar el acuerdo.
- **Resultado Esperado:** El backend rechaza la operación con código **400 Bad Request** indicando que la suma de participaciones debe ser exactamente igual al 100.00% (10,000 puntos base).
- **Tipo de Prueba:** Reglas de Negocio / Unitaria.

---

### CP-PRJ-02: Aprobación de Acuerdo de Utilidades al 100%
- **Módulo:** Utilidades
- **Precondición:** Proyecto en estado `ACTIVO`.
- **Pasos:**
  1. Configurar reparto entre 4 socios: 25.00% cada uno (Suma: 100.00%).
  2. Enviar petición de formalización de acuerdo.
- **Resultado Esperado:** Petición aceptada con código **201 Created**, acuerdo registrado en estado `APROBADO`.
- **Tipo de Prueba:** Integración.

---

### CP-PRJ-03: Bloqueo de Dispersión sin Cierre Financiero
- **Módulo:** Utilidades
- **Precondición:** Proyecto en estado `ACTIVO` con acuerdo al 100% aprobado.
- **Pasos:**
  1. Intentar ejecutar el endpoint de dispersión de utilidades (`POST /api/v1/projects/:id/liquidate`).
- **Resultado Esperado:** Error **422 Unprocessable Entity**: *"El proyecto no cuenta con Cierre Financiero formalmente aprobado"*.
- **Tipo de Prueba:** Integración de Negocio.

---

## 3. Casos de Prueba de Seguridad y Acceso (CP-AUT)

### CP-AUT-01: Autenticación Exitosa con Generación de JWT
- **Pasos:** Enviar credenciales válidas a `POST /api/v1/auth/login`.
- **Resultado Esperado:** Código **200 OK**, retorno de `accessToken` y `refreshToken`, expiración válida y datos básicos del socio.

### CP-AUT-02: Bloqueo de Acceso con Contraseña Incorrecta
- **Pasos:** Enviar contraseña inválida a `POST /api/v1/auth/login`.
- **Resultado Esperado:** Código **401 Unauthorized**, mensaje genérico *"Credenciales incorrectas"* (sin revelar si el correo existe).

### CP-AUT-03: Protección de Endpoints sin Token Bearer
- **Pasos:** Realizar petición `GET /api/v1/treasury/accounts` sin encabezado Authorization.
- **Resultado Esperado:** Código **401 Unauthorized**.

### CP-AUT-04: Bloqueo de Privilegios Administrativos a Rol PARTNER
- **Módulo:** Seguridad y Roles
- **Requisitos Asociados:** `RF-SEC-01`, `RF-SOC-02`
- **Precondición:** Usuario autenticado con rol exclusivo `PARTNER` (sin rol `SUPER_ADMIN`).
- **Pasos:** Un usuario con rol `PARTNER` intenta actualizar las participaciones de socios (`PATCH /api/v1/partners/:id/shares`).
- **Resultado Esperado:** Código **403 Forbidden** por el Guard de roles y permisos. El padrón no sufre modificaciones.
- **Tipo de Prueba:** Seguridad / RBAC.

