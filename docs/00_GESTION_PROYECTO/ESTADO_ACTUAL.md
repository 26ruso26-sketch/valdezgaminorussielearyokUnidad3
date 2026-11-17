# Estado Actual del Proyecto
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

**Última actualización:** 2026-11-06 (Cierre Formal de Sesión — Dictamen del Propietario sobre Fase 2)  
**Fase Vigente:** **FASE 2: MODELO DE DATOS Y MIGRACIONES SQLITE (NO APROBADA — AUDITORÍA TÉCNICA FOCALIZADA Y DECISIONES PENDIENTES)**  
**Estado General:** 🟢 **FASE 0 Y FASE 1 APROBADAS FORMALMENTE — FASE 2 NO APROBADA (ARQUITECTURA CON AVANCES PERO NO LISTA PARA IMPLEMENTAR — PROHIBIDO CREAR ESQUEMA O MIGRACIONES)**

---

## 1. Semáforo de Fases del Proyecto

| Fase | Descripción | Estado | Avance | Criterio de Transición |
| :---: | :--- | :---: | :---: | :--- |
| **0** | **Definición y Documentación** | 🟢 **Aprobada** | 100% | **Aprobada formalmente por el Product Owner (Russiele Valdez) el 2026-11-05.** |
| **1** | **Configuración del Entorno y Repositorio Monorepo** | 🟢 **Aprobada** | 100% | **Aprobada formalmente por el Product Owner (Russiele Valdez) el 2026-11-06 tras auditoría técnica de 5 ejes.** |
| **2** | **Modelo de Datos y Migraciones SQLite** | 🟡 **En Revisión Técnica (NO APROBADA)** | 60% | La arquitectura presenta avances tras la 4ta revisión correctiva, pero todavía NO está lista para implementar. Se mantienen pendientes las decisiones de negocio y los hallazgos técnicos. No se autoriza iniciar la creación o modificación de schema.prisma ni migraciones. |
| **3** | Autenticación, Usuarios, Socios y Permisos | ⚪ No Iniciada | 0% | Requiere Fase 2 aprobada |
| **4** | Tesorería, Cuentas, Movimientos y Autorizaciones | ⚪ No Iniciada | 0% | Requiere Fase 3 aprobada |
| **5** | Administración de Proyectos y Seguimiento | ⚪ No Iniciada | 0% | Requiere Fase 4 aprobada |
| **6** | Dashboard Ejecutivo | ⚪ No Iniciada | 0% | Requiere Fase 5 aprobada |
| **7** | Web Services Propios y Terceros | ⚪ No Iniciada | 0% | Requiere Fase 6 aprobada |
| **8** | Pruebas, Seguridad y QA | ⚪ No Iniciada | 0% | Requiere Fase 7 aprobada |
| **9** | Publicación, Evidencias y Documento Académico PDF | ⚪ No Iniciada | 0% | Requiere Fase 8 aprobada |

---

## 2. Decisiones Confirmadas por el Propietario (Inmutables)

1. **Aprobación Formal de Fase 0 (2026-11-05):**
   - Documentación técnica, gobernanza, reglas de negocio y modelo conceptual de 28 entidades aprobados al 100%.
2. **Aprobación Formal de Fase 1 (2026-11-06):**
   - Auditoría técnica satisfactoria en sus 5 ejes: versiones de Prisma ORM, exclusiones en `.gitignore`, repositorio Git independiente, estructura física de monorepo y configuración SQLite.
   - La discrepancia nominal entre `^6.4.1` y `6.19.3` quedó explicada y validada como compatible por SemVer. Se mantiene `package-lock.json` como referencia reproducible obligatoria sin alterar versiones.
3. **Observación Financiera Obligatoria (Doble Autorización Universal):**
   - Las **dos autorizaciones independientes** por usuarios facultados (`FINANCE_APPROVER`) aplican obligatoriamente a **todas las operaciones financieras sujetas a autorización**, no solamente a egresos:
     - **Aportaciones de capital** (`APORTACION_CAPITAL`).
     - **Ingresos** (`INGRESO`).
     - **Egresos** (`EGRESO`).
     - **Transferencias entre cuentas** (`TRANSFERENCIA`).
     - **Distribuciones de utilidades** (`DISTRIBUCION_UTILIDADES`).
   - No existe autoautorización (solicitante excluido).
   - El `SUPER_ADMIN` no tiene bypass de seguridad.
   - **Separación de Ejecución:** La autorización (`AUTORIZADO`) no descuenta ni acredita fondos; el desembolso y afectación de saldo (`EJECUTADO`) lo registra de manera independiente el Tesorero (`TREASURER`), generando inmutablemente `AccountMovement`.
   - Inmutabilidad estricta de movimientos contables ejecutados (prohibido `DELETE`/`UPDATE`); correcciones exclusivamente mediante reversión compensatoria con contrasiento.
4. **Regla Crítica de Fase 2 (Modelo de Datos):**
   - Prohibido generar migraciones o crear tablas físicas en SQLite hasta que el diseño completo de las 28 entidades en `schema.prisma` sea revisado y aprobado formalmente por el Propietario.
5. **Constitución Societaria y Derechos:**
   - 10 socios fundadores iniciales con participación paritaria acordada del 10.00% cada uno.
   - Independencia conceptual estricta: 1) Participación societaria acordada base, 2) Aportaciones reales de capital al fondo común, y 3) Acuerdos de utilidades por proyecto al 100%.
6. **Estructura del Repositorio y Arquitectura de Paquetes:**
   - Monorepo gestionado mediante npm workspaces: `apps/web` (React/Vite), `apps/api` (NestJS) y `docs/` en la raíz.
   - Persistencia SQLite y Prisma ORM alojados exclusivamente en `apps/api/prisma/`.
7. **Almacenamiento de Evidencias:**
   - Almacenamiento local en `apps/api/uploads/` con capa de abstracción desacoplada (`StorageService` / `IStorageProvider`).
8. **Privacidad y Datos de Socios:**
   - Seed inicial configurado con 10 socios ficticios para desarrollo y pruebas. Prohibido registrar datos reales de socios en repositorios públicos.
9. **Dictamen de Cierre de Sesión sobre Fase 2 (2026-11-06):**
   - Se revisó la cuarta revisión correctiva de arquitectura.
   - La Fase 2 continúa formalmente **NO APROBADA**.
   - La arquitectura presenta avances notables, pero **todavía no está lista para implementar**.
   - Se mantienen pendientes las decisiones de negocio y los hallazgos técnicos identificados durante la revisión.
   - **No se autoriza iniciar la creación o modificación del esquema de Prisma (`schema.prisma`) ni las migraciones**.

---

## 3. Estado de Auditoría de Criterios de Fase 1

La Fase 1 concluyó con dictamen **SATISFACTORIO** en los 5 puntos técnicos auditados:
1. **Versiones de Prisma:** `@prisma/client` y `prisma` CLI fijados en `6.19.3` en `package-lock.json`, deduplicados y 100% compatibles con `^6.4.1`.
2. **Protección de `.gitignore`:** Verificado con `git check-ignore -v`. Secretos `.env`, bases de datos SQLite `*.db` y evidencias `uploads/` estrictamente ignorados; plantillas `.env.example` versionables.
3. **Repositorio Git Independiente:** `git rev-parse --show-toplevel` confirma que la raíz corresponde exactamente a `Prisma Workspace`, aislado de repositorios superiores.
4. **Estructura Física:** Existencia íntegra de `apps/api`, `apps/web`, `docs`, `package.json`, `package-lock.json`, `.gitignore`, `.env.example` y `README.md`.
5. **Persistencia SQLite:** `schema.prisma` configurado con `provider = "sqlite"`, `DATABASE_URL="file:./dev.db"`, sin migraciones ejecutadas ni tablas de negocio adelantadas.

---

## 4. Decisiones Pendientes de Intervención del Propietario

Las siguientes 5 definiciones de gobernanza y negocio permanecen abiertas para decisión exclusiva de Russiele Valdez (PO):
- [ ] **Decisión 1 — Alcance de Reversiones Financieras (Corrección 1):** Elegir entre Alternativa A (Reversión exclusivamente total del 100%, cardinalidad 1:1 con `@unique`) o Alternativa B (Reversiones parciales acumulables, cardinalidad 1:N sin unique y control de acumulados concurrentes).
- [ ] **Decisión 2 — Formato de Código / Folio de Operación (Corrección 2):** Elegir entre Opción A (Código autónomo alfanumérico basado en tiempo y entropía `OP-YYYY-HASH`, sin contención y 28 entidades) u Opción C (Código correlativo numérico generado en transacción `BEGIN IMMEDIATE`, sin tablas adicionales y 28 entidades).
- [ ] **Decisión 3 — Absorción de Déficits por Cierre Rectificatorio (Corrección 5):** Definir tratamiento ante costos omitidos post-dispersión: Opción A (Retención automática en futuras utilidades), Opción B (Cuenta por cobrar y reembolso bancario directo) u Opción C (Absorción corporativa por el fondo común).
- [ ] **Decisión 4 — Política de Doble Firma Financiera (Punto 6):** Elegir entre Política A (Cualquier combinación de 2 usuarios distintos con rol y permiso `FINANCE_APPROVER`) o Política B (Exclusivamente 2 Socios Activos con permiso `FINANCE_APPROVER`).
- [ ] **Decisión 5 — Distribución de Centavos Residuales (Punto 3):** Elegir entre Alternativa A (Distribución determinista entre socios con Método de Hamilton), Alternativa B (Acreditación al Fondo Común corporativo) o Alternativa C (Asignación al Socio Administrador de proyecto).
- [ ] **Clasificación y Destino de Archivos Preexistentes:** Decidir el destino de `New Text Document.txt` (archivo vacío) y `prompt inicio de proyecto.txt` (especificación histórica original).
- [ ] **Primer Commit de Git:** Autorizar la ejecución de `git add` y `git commit` inicial del monorepo base.
- [ ] **Aprobación Formal del Esquema de Datos de Fase 2:** Revisión y sign-off del diseño de las 28 entidades tras incorporar las decisiones del PO, previa a cualquier migración en SQLite.
- [ ] **Proveedor de Web Service Externo de Divisas (Fase 7):** Ratificar la API a consumir para tipo de cambio/UDIs (Banxico API, DOF u Open Exchange Rates).

---

## 5. Próxima Actividad Inmediata

**Objetivo de la próxima sesión:** Realizar una última auditoría técnica focalizada de Fase 2, sin modificar código, para resolver los puntos pendientes:
1. **Política de reversión total o parcial.**
2. **Diseño definitivo de folios e identificación de operaciones.**
3. **Contrato completo de idempotencia y protección contra ejecuciones duplicadas.**
4. **Integridad histórica de `PartnerShare`, incluyendo `INSERT` y `UPDATE`.**
5. **Tratamiento contable y operativo de ajustes derivados de nuevos cierres financieros.**
6. **Matriz completa de transiciones de estados, actores, condiciones y auditoría.**

*Adicionalmente:* Documentar formalmente las cinco decisiones de negocio que requieren autorización expresa del Propietario.

> [!CAUTION]
> **RESTRICCIONES OBLIGATORIAS VIGENTES:**  
> No modificar código • No modificar `schema.prisma` • No crear migraciones • No modificar la base de datos • No instalar dependencias • No ejecutar pruebas ni validaciones • No iniciar servidores • No declarar aprobada la Fase 2.
