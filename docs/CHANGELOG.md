# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentación inicial: ROADMAP, TASK_LIST, IMPLEMENTATION_PLAN, DEVELOPMENT_PHASES.
- Guías de contribución (CONTRIBUTING.md) y Arquitectura (ARCHITECTURE.md).
- Dashboard "Sector" (Estructura base y páginas placeholder).
- Dashboard "Economía" (Estructura base).
- Dashboard "Espacial" (Integración Geovisor).
- Botones de navegación externos (SNIFFS, Geovisor).

### Changed
- Reorganización de assets: imágenes movidas a `public/images`.
- Estandarización de logos en TopBar (midagri con serfor).
- Refactorización de Sidebar para soportar menús anidados.

### Fixed
- Error de compilación TS6133 en Sidebar.tsx.
- Rutas rotas en despliegue GitHub Pages (base path).

## [0.1.0] - 2024-12-12
### Added
- Configuración inicial del proyecto (Vite + React + TS + Tailwind).
- Layout principal app shell.
