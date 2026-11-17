# Criterios de Aceptación, DoR y DoD
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento formaliza las definiciones de preparación (Definition of Ready - DoR) y de terminación (Definition of Done - DoD) que rigen la calidad del software en todo el ciclo de desarrollo.

---

## 1. Definición de Preparado (Definition of Ready - DoR)

Una historia de usuario, requerimiento o elemento del backlog (PBI) se considera **LISTO (Ready)** para ser programado únicamente cuando cumple los siguientes criterios:

- [ ] **Descripción Clara:** Redactada en formato estándar (*Como [Rol], Quiero [Acción], Para [Valor]*).
- [ ] **Criterios de Aceptación BDD/Gherkin:** Al menos dos escenarios formulados con *Dado / Cuando / Entonces*.
- [ ] **Reglas de Negocio Identificadas:** Se explicitan las reglas inmutables asociadas (ej. montos en centavos, doble firma, exclusión de solicitante).
- [ ] **Diseño de Interfaz o Contrato de API:** Se define la estructura del endpoint (DTO) o el mock visual de la pantalla.
- [ ] **Estimación Relativa:** El elemento cuenta con puntos de historia asignados.
- [ ] **Dependencias Resueltas:** No tiene bloqueos de fases o módulos previos no concluidos.

---

## 2. Definición de Terminado (Definition of Done - DoD)

> [!CAUTION]
> **Regla de Trabajo #7:** No asumir jamás que una tarea o funcionalidad está terminada únicamente porque el código compila.

Una funcionalidad o PBI se considera **TERMINADA (Done)** y aceptada para entrega únicamente cuando satisface el 100% de la siguiente lista de verificación:

### 2.1. Calidad de Código y Estándares
- [ ] **Compilación Limpia:** El código compila sin errores ni warnings en TypeScript en modo estricto (`"strict": true`).
- [ ] **Linter y Formato:** Supera las reglas de ESLint y Prettier sin excepciones no justificadas.
- [ ] **Tipado Seguro:** Cero uso del tipo `any` en modelos, contratos y servicios.
- [ ] **Manejo de Errores:** Excepciones capturadas y transformadas en respuestas HTTP estandarizadas con mensajes claros.

### 2.2. Pruebas y Cobertura
- [ ] **Pruebas Unitarias:** Creadas y ejecutadas con Jest para la lógica de negocio y servicios matemáticos/financieros.
- [ ] **Pruebas de Integración / E2E:** Endpoints críticos cubiertos con Supertest validando códigos de estado HTTP (200, 201, 400, 401, 403, 422).
- [ ] **Casos de Borde Financieros:** Pruebas específicas para importes en centavos, intentos de auto-aprobación y suma de acuerdos al 100%.

### 2.3. Seguridad y Persistencia
- [ ] **Protección RBAC:** Endpoint decorado con Guards de autenticación y rol.
- [ ] **Inmutabilidad:** Verificación de que no existen operaciones `DELETE` sobre registros contables ejecutados.
- [ ] **Pistas de Auditoría:** Toda mutación de estado genera su registro correspondiente en `AuditLog`.

### 2.4. Documentación y Trazabilidad
- [ ] **Documentación OpenAPI:** Endpoint decorado con anotaciones Swagger (`@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`).
- [ ] **Bitácora de Sesión:** Registro del cambio realizado en `docs/BITACORA/BITACORA_SESIONES.md`.
- [ ] **Validación del Product Owner:** Demostración y visto bueno formal del propietario del proyecto.

