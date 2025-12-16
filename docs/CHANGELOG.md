# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added (2024-12-16)
- **Dashboard Sector completo**: 8 páginas con visualizaciones Recharts.
  - SectorDeforestacion, SectorVolumenDecomisado, SectorEspecies
  - SectorReservas, SectorAreasSustraidas, SectorSitiosDeclarados, SectorCarbono
- **Dashboard Economía parcial**: 5 de 17 páginas implementadas.
  - Proveedores, EspeciesAprovechadas, Precios (rediseñado), TransformacionIndustrial
- **Dashboard Espacial completo**: 34+ páginas organizadas en subsecciones.
  - Planificación: FronteraAgricola, ZonificacionCultivos
  - Monitoreo: SuperficieBosque, CambioSuperficie, IndicadoresBosque, InventarioForestal
  - Ambiental: SuperficieCubierta, AutoridadesAmbientales, CambioHistorico
  - SNIFFS: Aprovechamientos, Movilizaciones, Decomisos, Plantaciones, Registros (4 tipos)
- **Archivos de datos JSON**: 28 archivos en public/data/ (sector, economia, espacial).
- Gráficos interactivos con Recharts en todos los módulos implementados.

### Changed (2024-12-16)
- **Precios.tsx**: Rediseño completo con filtros interactivos en header.
  - Filtros de especie, unidad de medida y año en barra de título (54px).
  - KPIs dinámicos: Precio Promedio, Rango de Precios, Registros.
  - Gráfico de evolución a 315px con datos hasta 2025.
  - Botón "Ver Fuente Oficial" verde y visible.

### Changed
- Reorganización completa de la estructura de navegación lateral.
- Mejoras de diseño en tarjetas KPI y tablas de datos.
- Estandarización de colores y tipografía según guía SERFOR.

### Fixed
- Errores TS6133 (imports no utilizados) en múltiples archivos.
- URLs de fetch malformadas con espacios extra.
- Clases CSS corruptas ("inline - block" → "inline-block").
- Contenedores de gráficos Recharts con alturas negativas (parcialmente resuelto).

---

## [0.2.0] - 2024-12-15

### Added
- Dashboard "Sector" con estructura base y páginas placeholder.
- Dashboard "Economía" con estructura base.
- Dashboard "Espacial" con integración Geovisor.
- Dashboard "Normativa" completo (Planificación, Lineamientos, Manejo, Incentivos).
- Documentación técnica: ARCHITECTURE.md, CONTRIBUTING.md, ADR_001_data_viz.md.

### Changed
- Reorganización de assets: imágenes movidas a `public/images`.
- Estandarización de logos en TopBar (MIDAGRI + SERFOR).
- Refactorización de Sidebar para soportar menús anidados.

### Fixed
- Error de compilación TS6133 en Sidebar.tsx.
- Rutas rotas en despliegue GitHub Pages (base path).

---

## [0.1.0] - 2024-12-12

### Added
- Configuración inicial del proyecto (Vite + React + TS + Tailwind).
- Layout principal app shell.
- Componentes base: TopBar, Sidebar, Footer.
- Integración básica de React Router DOM.
