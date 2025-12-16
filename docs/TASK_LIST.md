# Task List: Observatorio PFC

Estado actual del desarrollo y tareas pendientes.
**Última actualización:** 2024-12-16

## 🚀 Inicialización y Configuración
- [x] Inicializar proyecto Vite + React + TypeScript.
- [x] Configurar Tailwind CSS.
- [x] Configurar React Router DOM.
- [x] Configurar estructura de carpetas (src/components, src/pages, src/hooks).

## 🏗️ Arquitectura y Layouts
- [x] Layout Principal (Sidebar, TopBar, Main Content).
- [x] Componente Sidebar con navegación anidada/recursiva.
- [x] Componente TopBar con logos institucionales (SERFOR/MIDAGRI).
- [x] Componente Footer.
- [x] Layouts específicos por módulo (SectorLayout, EconomiaLayout, EspacialLayout, NormativaLayout, InicioLayout).

## 📊 Dashboard: Sector (8/8 páginas implementadas)
- [x] Estructura de navegación lateral (SectorLayout.tsx).
- [x] Página de Inicio (SectorInicio.tsx).
- [x] **Deforestación** (SectorDeforestacion.tsx) - Gráficos de pérdida forestal 2023-2024.
- [x] **Volumen Decomisado** (SectorVolumenDecomisado.tsx) - Madera y carbón por departamento.
- [x] **Especies de Flora** (SectorEspecies.tsx) - Catálogo de especies con niveles de riesgo.
- [x] **Reservas de Biosfera** (SectorReservas.tsx) - Red mundial de reservas.
- [x] **Áreas Sustraídas (BPP)** (SectorAreasSustraidas.tsx) - Comparativo de áreas.
- [x] **Sitios Declarados** (SectorSitiosDeclarados.tsx) - Patrimonio mundial y Ramsar.
- [x] **Mapa de Carbono** (SectorCarbono.tsx) - Stock de carbono por región.

## 📈 Dashboard: Economía (5/17 páginas implementadas)
- [x] Estructura de navegación lateral (EconomiaLayout.tsx).
- [x] Página de Inicio (EconomiaInicio.tsx).
- [x] **Proveedores de Bienes y Servicios** (Proveedores.tsx) - Tabla con filtros.
- [x] **Especies Aprovechadas** (EspeciesAprovechadas.tsx) - Catálogo con gráficos.
- [x] **Precios de Madera** (Precios.tsx) - Evolución de precios por especie.
- [x] **Transformación Industrial (CTP)** (TransformacionIndustrial.tsx) - Centros de producción.
- [ ] Balanza Comercial (BalanzaComercial.tsx) - Placeholder.
- [ ] Exportaciones (Exportaciones.tsx) - Placeholder.
- [ ] Importaciones (Importaciones.tsx) - Placeholder.
- [ ] Concesiones (Concesiones.tsx) - Placeholder.
- [ ] Oferta Forestal (OfertaForestal.tsx) - Placeholder.
- [ ] Volumen Movilizado (VolumenMovilizado.tsx) - Placeholder.
- [ ] Consumo Intermedio (ConsumoIntermedio.tsx) - Placeholder.
- [ ] Consumo e Intensidad (ConsumoIntensidad.tsx) - Placeholder.
- [ ] Utilización Total (UtilizacionTotal.tsx) - Placeholder.
- [ ] Costos de Plantaciones (CostosPlantaciones.tsx) - Placeholder.
- [ ] Geovisor Costos (GeovisorCostos.tsx) - Placeholder.

## 📋 Dashboard: Normativa (Completo)
- [x] Estructura de navegación lateral (NormativaLayout.tsx).
- [x] Página de Inicio (NormativaInicio.tsx).
- [x] Sección: Planificación.
- [x] Sección: Lineamientos.
- [x] Sección: Manejo y Aprovechamiento.
- [x] Sección: Incentivos.

## 🌍 Dashboard: Espacial (34+ páginas implementadas)
### Geovisor
- [x] EspacialDashboard.tsx - Panel de navegación principal.
- [x] Integración con Geovisor externo.

### Planificación Rural Agropecuaria
- [x] **Frontera Agrícola Nacional** (FronteraAgricola.tsx).
- [x] **Zonificación de Cultivos** (ZonificacionCultivos.tsx).
- [x] Zonas Susceptibles (ZonasSusceptibles.tsx) - Placeholder.

### Monitoreo de Bosques y Carbono
- [x] **Superficie de Bosque** (SuperficieBosque.tsx).
- [x] **Cambio de Superficie** (CambioSuperficie.tsx).
- [x] **Indicadores de Bosque** (IndicadoresBosque.tsx).
- [x] **Inventario Nacional Forestal** (InventarioForestal.tsx).

### Sistema de Información Ambiental
- [x] **Superficie Cubierta** (SuperficieCubierta.tsx).
- [x] **Autoridades Ambientales** (AutoridadesAmbientales.tsx).
- [x] **Cambio Histórico** (CambioHistorico.tsx).

### SNIFFS (Sistema Nacional de Información)
- [x] **Aprovechamientos** (Aprovechamientos.tsx).
- [x] **Movilizaciones** (Movilizaciones.tsx).
- [x] **Decomisos** (Decomisos.tsx).
- [x] **Plantaciones** (Plantaciones.tsx).
- [x] **Registros de Viveros** (RegistrosViveros.tsx).
- [x] **Registros de Plantaciones** (RegistrosPlantaciones.tsx).
- [x] **Registros de Infracciones** (RegistrosInfracciones.tsx).
- [x] **Registros de Regentes** (RegistrosRegentes.tsx).

### Comercial e Inteligencia de Mercado
- [x] Estudios de Mercado (EstudiosMercado.tsx).
- [x] Estadísticas (Estadisticas.tsx).
- [x] Boletines (Boletines.tsx).

### Otros
- [x] Plantaciones Registradas (PlantacionesRegistradas.tsx).
- [x] Tierras PFC (TierrasPFC.tsx).
- [x] Mapa de Bosque (MapaBosque.tsx).
- [x] Sistemas Inversionista (SistemasInversionista.tsx).

## 🗂️ Archivos de Datos JSON
### /public/data/sector/ (7 archivos)
- [x] deforestacion.json
- [x] volumen_decomisado.json
- [x] especies.json
- [x] reservas.json
- [x] bpp.json (Áreas Sustraídas)
- [x] sitios.json
- [x] carbono.json

### /public/data/economia/ (4 archivos)
- [x] proveedores.json
- [x] especies_aprovechadas.json
- [x] precios_madera.json (7MB)
- [x] industria.json

### /public/data/espacial/ (17 archivos)
- [x] frontera.json
- [x] zonificacion_cultivos.json
- [x] superficie_bosque.json
- [x] cambio_superficie.json
- [x] indicadores_bosque.json
- [x] inventario_forestal.json
- [x] superficie_cubierta.json
- [x] autoridades_ambientales.json
- [x] cambio_historico.json
- [x] aprovechamientos.json
- [x] movilizaciones.json
- [x] decomisos.json
- [x] plantaciones.json
- [x] viveros.json
- [x] regentes.json
- [x] plantaciones_sniffs.json
- [x] infracciones.json

## 🎨 UI/UX y Polish
- [x] Estandarización de Logos.
- [x] Traslado de botón "IR AL SNIFFS" a navegación.
- [x] Centralización de assets en `public/images`.
- [x] Gráficos Recharts con diseño consistente.
- [ ] Optimización de imágenes.
- [ ] Revisión de Responsividad (Mobile/Tablet).
- [ ] Solución de warnings Recharts (-1 width/height).

## 📝 Documentación
- [x] ROADMAP.md
- [x] DEVELOPMENT_PHASES.md
- [x] IMPLEMENTATION_PLAN.md
- [x] ARCHITECTURE.md
- [x] CONTRIBUTING.md
- [x] CHANGELOG.md
- [x] task.md
- [x] roadmap_espacial.md
