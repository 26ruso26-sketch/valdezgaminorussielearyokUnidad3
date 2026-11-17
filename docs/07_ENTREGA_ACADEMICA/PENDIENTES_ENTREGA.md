# Pendientes y Checklist de Entrega Académica
## Prisma Business Dashboard - UTC 9 IDGSA

Este documento recopila la lista de verificación final previa a la entrega y evaluación de la Unidad 3 de Desarrollo Web Integral.

---

## 1. Checklist de Entregables Formales

### 1.1. Repositorio de Código Fuente (`prisma-business-dashboard`)
- [ ] Repositorio limpio inicializado con historial de commits descriptivos en Git.
- [ ] Archivo `.gitignore` verificado (sin base de datos `.db` ni secretos `.env` expuestos).
- [ ] Código fuente del Backend (NestJS) libre de errores y advertencias de TypeScript.
- [ ] Código fuente del Frontend (React + Vite + Tailwind) libre de errores de compilación.
- [ ] Archivo `README.md` en la raíz con instrucciones paso a paso para arranque local.

### 1.2. Base de Datos y Semillas
- [ ] Archivo `schema.prisma` formalizado con los 12 modelos relacionales.
- [ ] Carpeta de migraciones generada mediante `prisma migrate dev`.
- [ ] Script `seed.ts` funcional que puebla:
  - Los 10 socios fundadores al 10% de participación.
  - El usuario `SUPER_ADMIN` vinculado a un socio fundador.
  - Cuentas de tesorería base y proyectos de ejemplo (autos de remate e inmuebles).

### 1.3. Servicios Web y Documentación Interactiva
- [ ] Endpoints RESTful operando con respuestas estructuradas en JSON.
- [ ] Documentación Swagger / OpenAPI disponible y ejecutable en `/api/docs`.
- [ ] Consumo de servicio web externo (divisas) funcionando con fallback en caso de error.

### 1.4. Calidad y Pruebas de Software
- [ ] Suite de pruebas unitarias con Jest ejecutada exitosamente.
- [ ] Pruebas de integración con Supertest sobre endpoints críticos (doble firma, centavos).
- [ ] Reporte de cobertura de pruebas generado con métrica >= 80% en lógica crítica.

### 1.5. Documento Técnico Académico (PDF)
- [ ] Portada institucional oficial de la Universidad Tecnológica de Coahuila (UTC).
- [ ] Resumen ejecutivo y justificación del caso Grupo Prisma S.A.P.I. de C.V.
- [ ] Diagramas de arquitectura: C4, Modelo Entidad-Relación y Máquina de Estados.
- [ ] Catálogo de servicios web (tabla de endpoints, verbos y códigos HTTP).
- [ ] Capturas de pantalla de la interfaz de usuario (Dashboard con Recharts, bandeja de firmas).
- [ ] Capturas de pantalla de la ejecución de pruebas y terminal de compilación.
- [ ] Conclusiones personales y referencias bibliográficas en formato APA.

---

## 2. Estado de Preparación para la Entrega

| Rubro | Porcentaje de Avance | Responsable | Estado |
| :--- | :---: | :--- | :---: |
| **Documentación y Planificación** | **100%** | Russiele Valdez / Arquitecto | 🟢 Concluido (Fase 0) |
| **Infraestructura y Código** | **0%** | Desarrollador | ⚪ Pendiente (Fases 1 a 7) |
| **Pruebas y Certificación QA** | **0%** | QA / Desarrollador | ⚪ Pendiente (Fase 8) |
| **Compilación Memoria PDF** | **10%** | Russiele Valdez | ⚪ Pendiente (Fase 9) |

