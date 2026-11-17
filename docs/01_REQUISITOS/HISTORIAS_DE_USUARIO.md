# Historias de Usuario (User Stories)
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento contiene las Historias de Usuario formalizadas con criterios de aceptación estructurados en formato **Gherkin (Dado / Cuando / Entonces)** y trazabilidad directa con los Requisitos Funcionales (RF).

---

## HU-01: Padrón y Consulta de Socios Fundadores
- **Identificador:** HU-01
- **Módulo:** Socios y Gobernanza
- **Requisitos Asociados:** `RF-SOC-01`, `RF-SOC-02`, `RF-SOC-03`, `RF-SEC-01`
- **Prioridad:** Alta (P1)
- **Estimación Relativa:** 5 Puntos de Historia
- **Descripción:**
  > **Como** SUPER_ADMIN de Grupo Prisma S.A.P.I. de C.V.,  
  > **Quiero** visualizar y administrar el padrón oficial de los 10 socios fundadores y registrar su participación inicial acordada del 10%,  
  > **Para** mantener la gobernanza corporativa y el registro fidedigno de los miembros del grupo.

### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Visualización inicial de socios fundadores
  Dado que el usuario ha iniciado sesión con el rol "SUPER_ADMIN"
  Cuando ingresa al módulo de "Socios"
  Entonces el sistema muestra una lista con exactamente 10 socios fundadores
  Y cada socio refleja una participación inicial acordada del 10.00%
  Y el sistema explicita que corresponde a un acuerdo inicial entre fundadores
  Y la suma total de las participaciones reflejadas es igual al 100.00%.

Escenario: Restricción de acceso para roles sin facultad de administración
  Dado que un usuario ha iniciado sesión únicamente con el rol "PARTNER" o "PROJECT_MEMBER"
  Cuando intenta modificar la participación acordada de un socio
  Entonces el sistema bloquea la acción con un mensaje de permisos insuficientes (403 Forbidden)
  Y no se aplica ningún cambio en la base de datos.
```

---

## HU-02: Solicitud de Operación Financiera de Egreso
- **Identificador:** HU-02
- **Módulo:** Tesorería
- **Requisitos Asociados:** `RF-TES-02`, `RF-TES-03`, `RF-AUT-01`
- **Prioridad:** Alta (P1)
- **Estimación Relativa:** 5 Puntos de Historia
- **Descripción:**
  > **Como** Tesorero (`TREASURER`) o Gestor de Proyecto (`PROJECT_MANAGER`),  
  > **Quiero** registrar una solicitud de egreso monetario vinculada a una cuenta y opcionalmente a un proyecto,  
  > **Para** someter dicha operación al flujo obligatorio de doble autorización antes de su ejecución.

### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Registro exitoso de solicitud de egreso
  Dado que el usuario autenticado tiene el rol "TREASURER" o "PROJECT_MANAGER"
  Cuando completa el formulario indicando cuenta de origen, importe en pesos, concepto y proyecto
  Entonces el sistema convierte el importe a centavos enteros (ej. $15,000.50 -> 1500050)
  Y crea la entidad FinancialOperation en estado "PENDIENTE_AUTORIZACION_1"
  Y el saldo contable de la cuenta origen NO se descuenta en este momento.

Escenario: Validación de campos obligatorios
  Dado que el usuario intenta enviar una solicitud sin justificación o con importe menor o igual a cero
  Cuando presiona el botón "Solicitar Fondos"
  Entonces el sistema detiene el envío, resalta los campos con error
  Y no crea ningún registro en la base de datos.
```

---

## HU-03: Doble Autorización Independiente y Separación de Ejecución
- **Identificador:** HU-03
- **Módulo:** Autorizaciones y Tesorería
- **Requisitos Asociados:** `RF-AUT-01`, `RF-AUT-02`, `RF-AUT-03`, `RF-AUT-04`, `RF-AUT-05`, `RF-AUT-06`
- **Prioridad:** Alta (P1)
- **Estimación Relativa:** 8 Puntos de Historia
- **Descripción:**
  > **Como** Autorizador Financiero (`FINANCE_APPROVER`),  
  > **Quiero** firmar digitalmente una solicitud de operación pendiente,  
  > **Para** garantizar que dos personas distintas revisen y aprueben el gasto antes de que el Tesorero lo ejecute.

### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Primera autorización exitosa
  Dado que existe una operación en estado "PENDIENTE_AUTORIZACION_1" solicitada por el "Usuario_A"
  Cuando el "Usuario_B" (con rol FINANCE_APPROVER) firma la aprobación
  Entonces la operación cambia al estado "PENDIENTE_AUTORIZACION_2"
  Y se registra la firma en ApprovalSignature con orden 1, fecha, hora y dirección IP.

Escenario: Bloqueo de auto-aprobación por el solicitante
  Dado que existe una operación solicitada por el "Usuario_A"
  Cuando el "Usuario_A" intenta firmar la Autorización 1 o la Autorización 2
  Entonces el sistema rechaza la operación (422 Unprocessable Entity)
  Y el estado de la operación permanece inalterado.

Escenario: Bloqueo de segunda firma por el mismo autorizador
  Dado que el "Usuario_B" ya firmó la Autorización 1
  Cuando el "Usuario_B" intenta otorgar también la Autorización 2
  Entonces el sistema rechaza la petición indicando que se requiere un autorizador diferente
  Y la operación no pasa a estado "AUTORIZADO".

Escenario: Transición a AUTORIZADO tras dos firmas válidas
  Dado que la operación cuenta con la firma del "Usuario_B"
  Cuando el "Usuario_C" (con rol FINANCE_APPROVER, distinto de A y B) firma la Autorización 2
  Entonces la operación pasa a estado "AUTORIZADO"
  Y el saldo de la cuenta aún NO se ve afectado.

Escenario: Ejecución bancaria independiente por el Tesorero
  Dado que la operación se encuentra en estado "AUTORIZADO"
  Cuando el "Usuario_D" (con rol TREASURER) registra formalmente la dispersión y folio bancario
  Entonces la operación pasa a estado "EJECUTADO"
  Y se genera el registro contable en AccountMovement
  Y el saldo disponible de la cuenta bancaria origen se descuenta exactamente en el monto en centavos.
```

---

## HU-04: Registro y Control de Proyecto de Remate Vehicular
- **Identificador:** HU-04
- **Módulo:** Proyectos
- **Requisitos Asociados:** `RF-PRJ-01`, `RF-PRJ-02`, `RF-PRJ-09`, `RF-PRJ-10`
- **Prioridad:** Alta (P1)
- **Estimación Relativa:** 8 Puntos de Historia
- **Descripción:**
  > **Como** Gestor de Proyecto (`PROJECT_MANAGER`),  
  > **Quiero** registrar un proyecto de adquisición y reventa de automóvil adquirido en remate,  
  > **Para** controlar los gastos de compra, traslado, hojalatería, mecánica y medir el margen neto de reventa.

### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Alta de proyecto vehicular con datos de remate
  Dado que el usuario tiene el rol "PROJECT_MANAGER"
  Cuando registra un proyecto vehicular con VIN, Marca, Modelo, Precio de Remate y Presupuesto de Adecuación
  Entonces el proyecto se crea en estado "ACTIVO"
  Y el sistema calcula la inversión requerida y establece la fecha límite estimada de venta.

Escenario: Monitoreo de atrasos en comercialización
  Dado un proyecto vehicular cuya fecha estimada de venta era el 2026-10-01
  Cuando hoy es 2026-11-05 y el proyecto sigue en estado "ACTIVO"
  Entonces la vista del proyecto muestra una alerta de "35 días de atraso"
  Y el indicador visual de tiempo se resalta en advertencia.
```

---

## HU-05: Registro y Control de Proyecto de Remate Inmobiliario
- **Identificador:** HU-05
- **Módulo:** Proyectos
- **Requisitos Asociados:** `RF-PRJ-01`, `RF-PRJ-02`, `RF-PRJ-04`, `RF-PRJ-08`, `RF-PRJ-09`
- **Prioridad:** Alta (P1)
- **Estimación Relativa:** 8 Puntos de Historia
- **Descripción:**
  > **Como** Gestor de Proyecto (`PROJECT_MANAGER`),  
  > **Quiero** registrar un proyecto de cesión de derechos/remate bancario y remodelación de inmueble,  
  > **Para** dar seguimiento a las etapas legales, obras físicas, avalúos y venta final.

### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Registro de inmueble y seguimiento de hitos legales
  Dado que se registra un proyecto inmobiliario indicando clave catastral, juzgado y expediente
  Cuando se agregan los hitos "Toma de Posesión", "Escrituración", "Remodelación" y "Venta"
  Entonces el sistema permite registrar el cumplimiento de cada hito en Milestone
  Y recalcula el porcentaje global de avance ponderado del proyecto.
```

---

## HU-06: Configuración de Acuerdo de Utilidades al 100%
- **Identificador:** HU-06
- **Módulo:** Cierres y Utilidades
- **Requisitos Asociados:** `RF-UTI-01`, `RF-UTI-02`
- **Prioridad:** Alta (P1)
- **Estimación Relativa:** 5 Puntos de Historia
- **Descripción:**
  > **Como** SUPER_ADMIN de Grupo Prisma,  
  > **Quiero** definir el porcentaje de reparto de utilidades entre los socios participantes de un proyecto específico en `ProfitAgreement`,  
  > **Para** garantizar que la liquidación final corresponda exactamente a lo pactado sin exceder ni faltar un solo centavo.

### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Rechazo de suma diferente a 100%
  Dado que se configura el reparto de utilidades de un proyecto para 3 socios
  Cuando los porcentajes asignados suman 95.00% o 100.01%
  Entonces el sistema impide guardar el acuerdo (400 Bad Request)
  Y muestra un mensaje indicando que los porcentajes deben totalizar exactamente el 100.00%.

Escenario: Aprobación del acuerdo económico
  Dado que los porcentajes asignados suman exactamente 100.00% (10,000 puntos base)
  Cuando el SUPER_ADMIN formaliza el acuerdo
  Entonces el acuerdo se registra en estado "APROBADO" y queda bloqueado para modificaciones informales.
```

---

## HU-07: Visualización de KPIs en Tablero Ejecutivo
- **Identificador:** HU-07
- **Módulo:** Dashboard
- **Requisitos Asociados:** `RF-DSH-01`, `RF-DSH-02`, `RF-DSH-03`
- **Prioridad:** Media (P2)
- **Estimación Relativa:** 5 Puntos de Historia
- **Descripción:**
  > **Como** Socio Inversionista (`PARTNER`),  
  > **Quiero** acceder a un tablero con gráficas de balance consolidado, estado de proyectos y retorno de inversión,  
  > **Para** conocer la salud financiera del grupo y la situación de mis inversiones en tiempo real.

### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Despliegue correcto de métricas consolidadas
  Dado que el socio accede a la vista principal del Dashboard
  Cuando el componente de Recharts solicita los datos a la API
  Entonces se muestran las tarjetas con: "Capital Total Disponible", "Capital Comprometido en Proyectos" y "Utilidad Neta del Ejercicio"
  Y los valores se presentan formateados en moneda mexicana ($ #,###.00 MXN)
  Y los valores coinciden exactamente con la suma en centavos de los movimientos ejecutados.
```

---

## HU-08: Reversión Compensatoria de Operación Errónea
- **Identificador:** HU-08
- **Módulo:** Tesorería y Auditoría
- **Requisitos Asociados:** `RF-TES-06`, `RF-TES-07`, `RF-AUT-01`
- **Prioridad:** Alta (P1)
- **Estimación Relativa:** 8 Puntos de Historia
- **Descripción:**
  > **Como** Tesorero (`TREASURER`),  
  > **Quiero** solicitar una reversión contable sobre una operación ejecutada que presentó error de captura o bancario,  
  > **Para** restablecer los saldos correctos sin borrar registros y manteniendo una auditoría total.

### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Ejecución de reversión compensatoria
  Dado un movimiento ejecutado por $25,000.00 MXN con ID #105
  Cuando el usuario solicita su reversión especificando la justificación obligatoria "Cargo bancario duplicado"
  Y la reversión es autorizada con el flujo de doble firma independiente
  Y el Tesorero ejecuta la compensación
  Entonces el sistema genera un contrasiento en AccountMovement por -$25,000.00 MXN vinculado a #105
  Y la operación original #105 permanece visible en el historial marcada como "REVERTIDO"
  Y el saldo de la cuenta se ajusta automáticamente.
```

---

## HU-09: Registro de Aportación de Capital al Fondo Común
- **Identificador:** HU-09
- **Módulo:** Socios y Tesorería
- **Requisitos Asociados:** `RF-SOC-03`, `RF-SOC-04`, `RF-TES-01`
- **Prioridad:** Alta (P1)
- **Estimación Relativa:** 5 Puntos de Historia
- **Descripción:**
  > **Como** Tesorero (`TREASURER`),  
  > **Quiero** registrar una aportación de capital dineraria realizada por un socio al fondo común,  
  > **Para** acreditar los fondos en la cuenta de tesorería correspondiente manteniendo registro independiente de su participación societaria.

### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Registro exitoso de aportación de capital
  Dado que un socio transfiere fondos a la cuenta bancaria del grupo
  Cuando el Tesorero registra la aportación en CapitalContribution vinculando al socio, monto en centavos y cuenta destino
  Entonces se incrementa el saldo de la cuenta bancaria
  Y la aportación queda registrada como capital aportado del socio
  Y la participación societaria acordada (10%) permanece inalterada.
```

---

## HU-10: Cierre Financiero Formal y Dispersión de Utilidades
- **Identificador:** HU-10
- **Módulo:** Cierres y Utilidades
- **Requisitos Asociados:** `RF-UTI-03`, `RF-UTI-04`, `RF-AUT-05`
- **Prioridad:** Alta (P1)
- **Estimación Relativa:** 8 Puntos de Historia
- **Descripción:**
  > **Como** SUPER_ADMIN,  
  > **Quiero** formalizar el Cierre Financiero de un proyecto concluido y generar las dispersiones de dividendos según el acuerdo económico,  
  > **Para** liquidar las ganancias a los socios participantes con exactitud al centavo.

### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Bloqueo de cierre financiero con gastos pendientes
  Dado un proyecto que tiene operaciones financieras en estado "PENDIENTE" o no ejecutadas
  Cuando el SUPER_ADMIN intenta aprobar el Cierre Financiero
  Entonces el sistema bloquea la acción informando que existen operaciones financieras sin conciliar.

Escenario: Aprobación de cierre y generación de dispersiones
  Dado un proyecto con todos sus ingresos y gastos reales en estado "EJECUTADO" y acuerdo al 100% aprobado
  Cuando el SUPER_ADMIN confirma el Cierre Financiero formal (FinancialClose)
  Entonces el sistema calcula la utilidad neta exacta en centavos
  Y genera los registros de dispersión individual en ProfitDistribution para cada socio participante
  Y las órdenes de pago quedan listas para su ejecución por el Tesorero.
```
