# Requisitos No Funcionales (RNF)
## Prisma Business Dashboard - Grupo Prisma S.A.P.I. de C.V.

Este documento cataloga los requisitos no funcionales del sistema bajo el estándar **ISO/IEC 25010**. Conforme a la auditoría de gobernanza, se clasifican explícitamente entre **Decisiones Confirmadas** (aprobadas por el propietario) y **Propuestas Técnicas Preliminares** (pendientes de ratificación o definición de métrica final por el Product Owner).

---

## 1. Eficiencia de Desempeño (Performance)

| ID | Parámetro | Especificación Técnica | Estado de Decisión | Métrica de Aceptación (Propuesta) |
| :--- | :--- | :--- | :---: | :--- |
| **RNF-DES-01** | Tiempo de Respuesta de la API | Los endpoints REST estándar deben responder de manera ágil bajo carga normal de red local. | 🟡 **Propuesta Pendiente de Aprobación** | Meta preliminar: **<= 200 ms** para el 95% de las peticiones (sujeta a pruebas de carga). |
| **RNF-DES-02** | Tiempo de Carga de Vistas (FCP) | La interfaz web React optimizada con Vite debe presentar primer renderizado rápido. | 🟡 **Propuesta Pendiente de Aprobación** | Meta preliminar: First Contentful Paint **< 1.2 s** (sujeta a benchmark en entorno real). |
| **RNF-DES-03** | Consumo y Consultas en SQLite | Consultas de saldo e historial optimizadas con índices en llaves foráneas y estados. | 🟡 **Propuesta Pendiente de Aprobación** | Meta preliminar: Tiempo de consulta de agregación **< 30 ms**. |

---

## 2. Seguridad y Privacidad (Security)

| ID | Parámetro | Especificación Técnica | Estado de Decisión | Métrica / Regla Aplicable |
| :--- | :--- | :--- | :---: | :--- |
| **RNF-SEG-01** | Autenticación Segura | Identidad validada mediante JSON Web Tokens (JWT) con rotación de Refresh Token. | 🟡 **Propuesta Pendiente de Aprobación** (vigencias) | Propuesta: Access Token **15 min**, Refresh Token **7 días** (pendiente ratificar con PO). |
| **RNF-SEG-02** | Cifrado de Contraseñas | Las contraseñas se almacenan mediante algoritmo adaptativo bcrypt. | 🟡 **Propuesta Pendiente de Aprobación** (cost factor) | Propuesta: Cost factor **>= 10 rounds** (aprox. 80-100 ms por hash). |
| **RNF-SEG-03** | Aislamiento de Base de Datos | El frontend jamás tiene acceso directo ni conectividad al archivo físico `.sqlite`. | 🟢 **Decisión Confirmada** | Cero exposición de puertos o rutas directas al archivo SQLite. |
| **RNF-SEG-04** | Protección de Secretos | Base de datos SQLite y variables `.env` excluidas estrictamente del control de versiones. | 🟢 **Decisión Confirmada** | Inclusión y verificación en `.gitignore` sin excepciones. |
| **RNF-SEG-05** | Control de Acceso por Roles (RBAC) | Verificación de permisos granulares y combinación de roles oficiales mediante Guards. | 🟢 **Decisión Confirmada** | Bloqueo perimetral con código **403 Forbidden** ante accesos no autorizados. |
| **RNF-SEG-06** | Precisión Numérica Financiera | Importes monetarios almacenados en base de datos exclusivamente como enteros en centavos. | 🟢 **Decisión Confirmada** | 100% de campos de dinero tipificados como `Int` o `BigInt` (prohibido `float`). |

---

## 3. Confiabilidad e Integridad de Datos (Reliability)

| ID | Parámetro | Especificación Técnica | Estado de Decisión | Regla de Aceptación |
| :--- | :--- | :--- | :---: | :--- |
| **RNF-REL-01** | Atomicidad Transaccional | Operaciones compuestas (débito, crédito, autorizaciones, reversión) en `$transaction`. | 🟢 **Decisión Confirmada** | Principio ACID garantizado; rollback automático ante fallos. |
| **RNF-REL-02** | Inmutabilidad Contable | Operaciones financieras ejecutadas y registros de auditoría son de solo adición (Append-Only). | 🟢 **Decisión Confirmada** | Prohibido `DELETE` o `UPDATE` sobre movimientos ejecutados. |
| **RNF-REL-03** | Resiliencia en Servicios Externos | El fallo o lentitud del servicio externo de divisas no debe detener el sistema principal. | 🟡 **Propuesta Pendiente de Aprobación** (timeout) | Propuesta: Timeout de **3,000 ms** con fallback al último tipo de cambio registrado. |

---

## 4. Mantenibilidad y Modularidad (Maintainability)

| ID | Parámetro | Especificación Técnica | Estado de Decisión | Regla de Aceptación |
| :--- | :--- | :--- | :---: | :--- |
| **RNF-MAN-01** | Modularidad en NestJS | Desacoplamiento por dominios de negocio (Auth, Partners, Treasury, Approvals, Projects). | 🟢 **Decisión Confirmada** | Dependencias circulares igual a **0**. |
| **RNF-MAN-02** | Tipado Estricto de Código | TypeScript con `"strict": true` en frontend y backend. | 🟢 **Decisión Confirmada** | Cero uso de tipo `any` en modelos, contratos DTO y servicios. |
| **RNF-MAN-03** | Validación por DTOs | Validación automática de cargas útiles en entrada mediante `class-validator` y Pipes. | 🟢 **Decisión Confirmada** | Rechazo perimetral con código **400 Bad Request** ante payloads inválidos. |

---

## 5. Usabilidad y Accesibilidad (Usability)

| ID | Parámetro | Especificación Técnica | Estado de Decisión | Regla de Aceptación |
| :--- | :--- | :--- | :---: | :--- |
| **RNF-USA-01** | Diseño Adaptable (Responsive) | Interfaz web construida con React y Tailwind CSS adaptable a diferentes resoluciones. | 🟢 **Decisión Confirmada** | Operabilidad comprobada en pantallas móviles, tabletas y computadoras de escritorio. |
| **RNF-USA-02** | Formateo Visual Monetario | Todo importe almacenado en centavos se presenta visualmente formateado en pesos (`$ #,###.00 MXN`). | 🟢 **Decisión Confirmada** | Consistencia visual del 100% en todas las vistas del sistema. |
| **RNF-USA-03** | Gráficas Ejecutivas Claras | Visualizaciones interactivas con Recharts para indicadores directivos de proyectos y tesorería. | 🟢 **Decisión Confirmada** | Tooltips informativos, leyendas comprensibles y contraste visual accesible. |

---

## 6. Portabilidad y Cobertura de Calidad (Portability & Quality)

| ID | Parámetro | Especificación Técnica | Estado de Decisión | Métrica / Regla |
| :--- | :--- | :--- | :---: | :--- |
| **RNF-POR-01** | Compatibilidad de Entorno | Ejecución transparente en Windows (entorno local actual) y Linux (posible despliegue). | 🟢 **Decisión Confirmada** | Uso exclusivo de rutas relativas y normalizadas con Node.js `path`. |
| **RNF-CAL-01** | Cobertura de Pruebas Unitarias/E2E | Porcentaje de cobertura de código con Jest y Supertest en lógica financiera crítica. | 🟡 **Propuesta Pendiente de Aprobación** | Meta preliminar propuesta: **>= 80% de cobertura** en módulos de tesorería y firmas. |
