# Guía de Inicio para la Próxima Sesión
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento proporciona las instrucciones precisas para el arranque inmediato de la siguiente sesión de trabajo.

---

## 1. Dónde Nos Quedamos
Se formalizó el **Cierre de la Sesión #07** y la evaluación de la **Cuarta Revisión Correctiva de Arquitectura**:
- **Fase 0 (Definición y Documentación):** 🟢 **APROBADA** el 2026-11-05.
- **Fase 1 (Entorno y Repositorio Monorepo):** 🟢 **APROBADA FORMALMENTE** el 2026-11-06 por el Product Owner (Russiele Valdez).
- **Fase 2 (Modelo de Datos y Migraciones SQLite):** 🟡 **NO APROBADA (EN REVISIÓN TÉCNICA FOCALIZADA)**.
- **Dictamen del Propietario:**
  - Se revisó la cuarta revisión correctiva de arquitectura ([`docs/02_ARQUITECTURA/CUARTA_REVISION_CORRECTIVA_CIERRE_TECNICO.md`](file:///C:/Users/Russiele.Valdez/Documents/Ruso/UTC/ING/9%20IDGSA/Desarrollo%20web%20Integral/Prisma%20Workspace/docs/02_ARQUITECTURA/CUARTA_REVISION_CORRECTIVA_CIERRE_TECNICO.md)).
  - **La Fase 2 continúa NO APROBADA.**
  - **La arquitectura presenta avances, pero todavía no está lista para implementar.**
  - Se mantienen pendientes las decisiones de negocio y los hallazgos técnicos identificados durante la revisión.
  - **No se autoriza iniciar la creación o modificación del esquema de Prisma ni las migraciones.**
- **Control de Cambios:** `RFC-007` registrado en `CONTROL_DE_CAMBIOS.md` en estado de no aprobación.
- **Persistencia Física y Código:** Intactos. No se modificó `schema.prisma`, no se crearon tablas SQLite ni migraciones.

---

## 2. Qué Debemos Hacer Primero al Regresar

### Objetivo de la Próxima Sesión:
**REALIZAR UNA ÚLTIMA AUDITORÍA TÉCNICA FOCALIZADA DE FASE 2, SIN MODIFICAR CÓDIGO, PARA RESOLVER LOS PUNTOS PENDIENTES:**

1. **Política de reversión total o parcial.**
2. **Diseño definitivo de folios e identificación de operaciones.**
3. **Contrato completo de idempotencia y protección contra ejecuciones duplicadas.**
4. **Integridad histórica de `PartnerShare`, incluyendo `INSERT` y `UPDATE`.**
5. **Tratamiento contable y operativo de ajustes derivados de nuevos cierres financieros.**
6. **Matriz completa de transiciones de estados, actores, condiciones y auditoría.**

*Adicionalmente:* Documentar formalmente las **cinco decisiones de negocio** que requieren autorización expresa del Propietario.

> [!CAUTION]
> **RESTRICCIONES OBLIGATORIAS VIGENTES PARA LA PRÓXIMA SESIÓN:**  
> - No modificar código.  
> - No modificar `schema.prisma`.  
> - No crear migraciones.  
> - No modificar la base de datos.  
> - No instalar dependencias.  
> - No ejecutar pruebas ni validaciones.  
> - No iniciar servidores.  
> - No declarar aprobada la Fase 2.

> [!IMPORTANT]
> **Universalización de Control Financiero (RFC-004):**  
> La doble autorización independiente aplica obligatoriamente a todas las operaciones financieras con impacto en tesorería: Aportaciones, Ingresos, Egresos, Transferencias y Distribuciones de utilidades.

---

## 3. Archivos que Debemos Consultar
- [`docs/00_GESTION_PROYECTO/ESTADO_ACTUAL.md`](file:///C:/Users/Russiele.Valdez/Documents/Ruso/UTC/ING/9%20IDGSA/Desarrollo%20web%20Integral/Prisma%20Workspace/docs/00_GESTION_PROYECTO/ESTADO_ACTUAL.md): Para verificar el semáforo de fases y decisiones del Propietario.
- [`docs/03_BASE_DE_DATOS/MODELO_ENTIDAD_RELACION.md`](file:///C:/Users/Russiele.Valdez/Documents/Ruso/UTC/ING/9%20IDGSA/Desarrollo%20web%20Integral/Prisma%20Workspace/docs/03_BASE_DE_DATOS/MODELO_ENTIDAD_RELACION.md): Diagrama Mermaid y Matriz de Correspondencia de las 28 entidades.
- [`docs/03_BASE_DE_DATOS/DICCIONARIO_DE_DATOS.md`](file:///C:/Users/Russiele.Valdez/Documents/Ruso/UTC/ING/9%20IDGSA/Desarrollo%20web%20Integral/Prisma%20Workspace/docs/03_BASE_DE_DATOS/DICCIONARIO_DE_DATOS.md): Definición campo a campo, tipos y restricciones.
- [`docs/03_BASE_DE_DATOS/REGLAS_INTEGRIDAD.md`](file:///C:/Users/Russiele.Valdez/Documents/Ruso/UTC/ING/9%20IDGSA/Desarrollo%20web%20Integral/Prisma%20Workspace/docs/03_BASE_DE_DATOS/REGLAS_INTEGRIDAD.md): Políticas `ON DELETE`, llaves foráneas y checks de integridad.
- [`docs/04_SEGURIDAD_Y_FINANZAS/REGLAS_FINANCIERAS.md`](file:///C:/Users/Russiele.Valdez/Documents/Ruso/UTC/ING/9%20IDGSA/Desarrollo%20web%20Integral/Prisma%20Workspace/docs/04_SEGURIDAD_Y_FINANZAS/REGLAS_FINANCIERAS.md): Reglas de importes en centavos y doble firma universal.
- [`docs/04_SEGURIDAD_Y_FINANZAS/FLUJO_AUTORIZACIONES.md`](file:///C:/Users/Russiele.Valdez/Documents/Ruso/UTC/ING/9%20IDGSA/Desarrollo%20web%20Integral/Prisma%20Workspace/docs/04_SEGURIDAD_Y_FINANZAS/FLUJO_AUTORIZACIONES.md): Máquina de estados de autorizaciones financieras.

---

## 4. Dependencias y Estado del Entorno
- **Monorepo:** Vinculado con npm workspaces (`apps/api` y `apps/web`).
- **Prisma:** Cliente tipado generado en versión 6.19.3.
- **SQLite:** Configurado en `apps/api/prisma/schema.prisma` con URL `"file:./dev.db"`.
- **Git:** Repositorio limpio con `.gitignore` exhaustivo activo.

---

## 5. Resultado Esperado en la Próxima Sesión
- Informe de última auditoría técnica focalizada de Fase 2 completado, sin modificar código, resolviendo formalmente los 6 puntos técnicos:
  1. Política de reversión total o parcial.
  2. Diseño definitivo de folios e identificación de operaciones.
  3. Contrato completo de idempotencia y protección contra ejecuciones duplicadas.
  4. Integridad histórica de `PartnerShare`, incluyendo `INSERT` y `UPDATE`.
  5. Tratamiento contable y operativo de ajustes derivados de nuevos cierres financieros.
  6. Matriz completa de transiciones de estados, actores, condiciones y auditoría.
- Documentación formal de las cinco decisiones de negocio que requieren autorización del propietario.
- Modelo de 28 entidades técnicamente blindado y listo para que el Propietario evalúe la autorización del paso a implementación física.
