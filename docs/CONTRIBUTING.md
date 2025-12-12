# Guía de Contribución y Reglas de Desarrollo

¡Gracias por contribuir al Observatorio PFC! Este documento establece las normas y estándares para asegurar la calidad y consistencia del código.

## 1. Flujo de Trabajo (Git Workflow)

Utilizamos un modelo basado en **Feature Branches**:

1.  **Rama Principal (`main`)**: Contiene siempre código estable y desplegable. **Nunca** hacer commit directo aquí.
2.  **Crear una Rama**: Para cada nueva funcionalidad o corrección:
    ```bash
    git checkout -b feature/nombre-descriptivo
    # o
    git checkout -b fix/nombre-del-bug
    ```
3.  **Commits Atómicos**: Haz commits pequeños y frecuentes que hagan una sola cosa bien.

### Convención de Commits (Conventional Commits)
Seguimos el estándar [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Una nueva funcionalidad (correlaciona con MINOR en versionado semántico).
- `fix:` Una corrección de bug (correlaciona con PATCH).
- `docs:` Cambios solo en documentación.
- `style:` Cambios que no afectan el significado del código (espacios, formato, falta de puntos y coma, etc).
- `refactor:` Un cambio de código que no arregla un bug ni añade una funcionalidad.
- `perf:` Un cambio de código que mejora el rendimiento.
- `chore:` Tareas de construcción, configuración de herramientas, etc.

**Ejemplo:**
```bash
git commit -m "feat(sidebar): add recursive navigation support"
```

## 2. Estándares de Código (React + TypeScript)

### TypeScript
- **Strict Mode**: `strict: true` en `tsconfig.json` es obligatorio. No usar `any` explícito a menos que sea absolutamente inevitable.
- **Interfaces vs Types**: Preferir `interface` para definiciones de objetos y `type` para uniones o alias simples.
- **Props**: Definir siempre la interfaz de props para cada componente.

### React
- **Componentes Funcionales**: Usar siempre `React.FC` o funciones declaradas.
- **Hooks**: Reglas de hooks son sagradas. Evitar lógica compleja dentro del render; extraer a Custom Hooks (`useNombreHook`).
- **Nombres de Archivos**:
  - Componentes: `PascalCase.tsx` (ej. `TopBar.tsx`).
  - Hooks: `camelCase.ts` (ej. `useAuth.ts`).
  - Utilidades: `camelCase.ts` (ej. `formatDate.ts`).

### Estilos (Tailwind CSS)
- **Utilidades**: Usar clases de utilidad siempre que sea posible.
- **Consistencia**: Seguir el orden de clases recomendado (Layout -> Box Model -> Typography -> Visuals -> Misc).
- **Evitar `@apply` excesivo**: No recrear CSS tradicional dentro de Tailwind a menos que se repita mucho un patrón.

## 3. Estructura de Proyecto

Mantener la arquitectura modular (Feature-based):
- Colocar componentes específicos de una página *cerca* de esa página, no en una carpeta global de componentes a menos que sean verdaderamente genéricos (UI Kit).

## 4. Pull Requests (PR)

- **Título Descriptivo**: Que explique qué hace el PR.
- **Descripción**: Vincular el Issue o Tarea que resuelve.
- **Review**: Al menos una aprobación requerida antes de mergear.
- **CI/CD**: El build debe pasar exitosamente.

## 5. Reporte de Bugs

Al reportar un bug, incluir:
- Pasos para reproducir.
- Comportamiento esperado.
- Comportamiento actual.
- Capturas de pantalla o video si aplica.
