# Plan de Reestructuración: Observatorio PFC (SNIFFS)

## Objetivo
Transformar el prototipo en una aplicación React profesional que cumpla con la visión del documento "Propuesta de Mapa de Sitio". El sistema servirá como herramienta de inteligencia comercial y territorial para el sector forestal.

## Arquitectura de la Aplicación

### Stack Tecnológico
- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS 3 (Diseño responsivo y fiel a la marca SERFOR/Minagri)
- **Routing**: React Router DOM (Estructura jerárquica)
- **Visualización**: Recharts (Gráficos estadísticos) + Mapas (Iframe/Leaflet placeholder)
- **Iconografía**: Lucide React

### Estructura de Navegación (Sitemap)

#### 1. INICIO (`/`)
- Presentación Institucional.
- Misión/Visión.
- Accesos directos a Geovisores y Dashboards.

#### 2. ESPACIAL (`/espacial`)
- **Geovisor Principal**: Integración del mapa existente (iframe).
- **Sub-módulos (Informativos)**:
  - Frontera Agrícola.
  - Zonificación Forestal.
  - Susceptibilidad de Mercado.

#### 3. SECTOR (`/sector`) - *Enfoque: Monitoreo y Control*
- **3.1 Deforestación Histórica**:
  - Gráfico de tendencia 2001-2024.
  - Indicador de "Presión de Deforestación" por región.
- **3.2 Control y Vigilancia (Decomisos)**:
  - Volumen de madera ilegal (Rolliza vs. Aserrada).
  - Mapa de calor de ilegalidad.
- **3.3 Especies Vulnerables**:
  - Ranking de especies más decomisadas.

#### 4. ECONOMÍA (`/economia`) - *Enfoque: Mercado e Inversión*
- **4.1 Productividad**:
  - **Especies PFC**: Ranking de especies plantadas (Pino, Eucalipto, Bolaina).
  - **Precios**: Monitor de precios referencias (Min/Max por región).
  - **Industria**: Directorio de CTPs (Centros de Transformación).
- **4.2 Mercado**:
  - Balanza Comercial (Exportaciones vs Importaciones).
  - Volúmenes movilizados.
- **4.3 Datos Financieros**:
  - Costos referenciales de plantación.

#### 5. NORMATIVA (`/normativa`)
- Repositorio de leyes y reglamentos.
- **5.1 Planificación**
- **5.2 Lineamientos de Política**
- **5.3 Manejo y Aprovechamiento**
- **5.4 Incentivos**

## Estructura de Carpetas (`src/`)

```
src/
├── components/
│   ├── layout/          # LayoutPrincipal, Sidebar, TopBar
│   ├── ui/              # Card, Button, Badge, DataTable
│   └── charts/          # Gráficos reutilizables (Recharts wrappers)
├── pages/
│   ├── inicio/
│   ├── sector/
│   │   ├── SectorDashboard.tsx
│   │   ├── Deforestacion.tsx
│   │   └── Decomisos.tsx
│   ├── economia/
│   │   ├── EconomiaDashboard.tsx
│   │   ├── Precios.tsx
│   │   └── Produccion.tsx
│   └── normativa/
│       ├── NormativaDashboard.tsx
│       └── [Submodulos].tsx
├── data/                # Mock data tipada (basada en los Excels del docs)
├── types/               # Definiciones TS
└── utils/               # Helpers de formato
```

## Plan de Ejecución

1.  **Configuración Inicial**:
    - Crear proyecto Vite + TS.
    - Instalar dependencias (`recharts`, `react-router-dom`, `lucide-react`, `clsx`).
    - Configurar Tailwind.

2.  **Desarrollo de Layout**:
    - Implementar `TopBar` con logos oficiales.
    - Implementar `Sidebar` dinámico para secciones internas.

3.  **Implementación de Módulos (Iterativo)**:
    - **Iteración 1: Core & Estilo**: Estilos globales, tipografía, paleta de colores (Verde Institucional).
    - **Iteración 2: Dashboards SECTOR**: Mocks de deforestación y decomisos basados en la propuesta.
    - **Iteración 3: Dashboards ECONOMÍA**: Mocks de precios y producción.
    - **Iteración 4: INICIO & NORMATIVA**: Contenido estático.

4.  **Integración y Pulido**:
    - Revisión de responsividad.
    - Verificación de navegación.
