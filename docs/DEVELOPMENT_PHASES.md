# Fases de Desarrollo Web: Observatorio PFC

Este documento establece los estándares y metodologías para garantizar que el aplicativo web del Observatorio PFC sea **robusto, escalable y mantenible**.

## 1. Fase de Análisis y Requerimientos 
**Objetivo:** Definir claramente qué se va a construir.
- **Acciones Realizadas:** Análisis del documento "Propuesta map site-mod.txt".
- **Artefactos:** `ROADMAP.md`, `TASK_LIST.md`.
- **Estándar:** Todo requerimiento nuevo debe ser documentado antes de pasar a código.

## 2. Fase de Diseño y Arquitectura
**Objetivo:** Estructura sólida que soporte crecimiento.
- **Patrón de Arquitectura:** Component-Based Architecture (React).
- **Enrutamiento:** Cliente-side routing con `react-router-dom` v6, usando Layouts anidados para modularidad.
- **Estructura de Directorios:** "Feature-based" (agrupar por dominio: `/sector`, `/economia`) en lugar de por tipo de archivo, facilitando la escalabilidad.
- **Gestión de Estado:** `useState` + `Context API` para estado global ligero. Considerar `Zustand` o `Redux Toolkit` si la complejidad aumenta.
- **Estilos:** Utility-first con **Tailwind CSS** para consistencia y carga rápida.

## 3. Fase de Implementación (Desarrollo)
**Objetivo:** Código limpio, tipado y reutilizable.
- **Lenguaje:** **TypeScript** estricto para prevenir errores en tiempo de compilación.
- **Componentes:**
  - **Atomos:** Botones, Inputs, Iconos (UI pura).
  - **Moleculas:** Tarjetas, Elementos de lista.
  - **Organismos:** Sidebars, Gráficos complejos.
- **Buenas Prácticas:**
  - **DRY (Don't Repeat Yourself):** Abstraer lógica repetida en Hooks personalizados (`useFetch`, `useAuth`).
  - **KISS (Keep It Simple, Stupid):** Soluciones directas y legibles.
  - **Separation of Concerns:** UI separada de la Lógica de Negocio.

## 4. Fase de Pruebas (QA)
**Objetivo:** Asegurar la estabilidad.
- **Unit Testing:** (Futuro) Vitest + React Testing Library para componentes críticos.
- **E2E Testing:** (Futuro) Cypress para flujos de usuario completos (Navegación -> Visualización).
- **Linting:** ESLint y Prettier configurados para mantener calidad de código.

## 5. Fase de Optimización y Performance
**Objetivo:** Experiencia de usuario fluida.
- **Code Splitting:** Uso de `React.lazy` y `Suspense` para cargar módulos (Sector, Economía) solo cuando se necesitan.
- **Assets:** Imágenes optimizadas (WebP/AVIF) en `public/images`.
- **Bundle Size:** Monitoreo del tamaño del build de Vite.

## 6. Fase de Despliegue y CI/CD
**Objetivo:** Entrega continua y fiable.
- **Plataforma:** GitHub Pages (Actual).
- **Pipeline:** GitHub Actions (`deploy.yml`) automatiza el build y deploy en cada push a `main`.
- **Pre-checks:** El pipeline debe ejecutar `npm run build` y verificar que no haya errores de TS (`tsc`) antes de desplegar.

## 7. Fase de Mantenimiento y Escalabilidad
**Objetivo:** Vida útil larga del software.
- **Documentación:** Mantener `docs/` actualizado.
- **Control de Versiones:** Uso de Git Semántico (Commits descriptivos).
- **Refactorización:** Deuda técnica se paga periódicamente (ej. reorganización de imports, limpieza de código muerto).
