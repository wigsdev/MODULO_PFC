# 🌲 MODULO PFC - Sistema de Información para Plantaciones Forestales Comerciales

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-green.svg" alt="Version"/>
  <img src="https://img.shields.io/badge/React-19.x-blue.svg" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-7.x-purple.svg" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-cyan.svg" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/License-ISC-yellow.svg" alt="License"/>
</p>

<p align="center">
  <strong>Plataforma de visualización y análisis de datos para inversión en plantaciones forestales comerciales en Perú</strong>
</p>

<p align="center">
  <a href="https://wigsdev.github.io/MODULO_PFC">🔗 Demo en Vivo</a>
</p>

---

## 📋 Descripción

**MODULO PFC** es una aplicación web interactiva desarrollada para el **Servicio Nacional Forestal y de Fauna Silvestre (SERFOR)** del Perú. Proporciona herramientas de visualización y análisis de datos geoespaciales, económicos y sectoriales orientados a facilitar la toma de decisiones para inversiones en plantaciones forestales comerciales.

### 🎯 Objetivo Principal

Centralizar y visualizar información relevante para inversionistas interesados en el sector forestal peruano, presentando datos de:
- Zonificación y aptitud de tierras
- Información ambiental y cobertura boscosa
- Estadísticas de producción y comercio
- Indicadores económicos del sector
- Sistemas de información disponibles

---

## ✨ Características Principales

### 📊 Visualizaciones Interactivas
- **KPIs dinámicos** con indicadores clave por sección
- **Gráficos interactivos** (barras, líneas, tortas, áreas apiladas) con Recharts
- **Tablas filtables y paginadas** para grandes conjuntos de datos
- **Mapas de calor** y distribución geográfica

### 🗂️ Módulos del Sistema

| Módulo | Descripción |
|--------|-------------|
| **I. Sector Forestal** | Indicadores macro del sector forestal peruano |
| **II. Espacial** | Datos geoespaciales, zonificación, planificación y comercio |
| **III. Economía** | Análisis económico, oferta forestal y proveedores |
| **IV. Geovisor** | Visualización cartográfica interactiva |

### 🔧 Arquitectura Técnica
- **ETL automatizado**: Scripts Node.js para procesamiento de CSV/Excel → JSON
- **Build pipeline**: Generación automática de datos en cada despliegue
- **Responsive design**: Adaptable a cualquier dispositivo
- **Deploy automático**: GitHub Actions + GitHub Pages

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 7.x | Build Tool |
| TailwindCSS | 3.x | Estilos |
| Recharts | 3.x | Gráficos |
| React Router | 7.x | Navegación |
| Lucide React | 0.5x | Iconografía |

### ETL & Data Processing
| Tecnología | Propósito |
|------------|-----------|
| Node.js | Scripts de procesamiento |
| xlsx | Parsing de Excel |

### DevOps
| Herramienta | Propósito |
|-------------|-----------|
| GitHub Actions | CI/CD Pipeline |
| GitHub Pages | Hosting |
| gh-pages | Deployment |

---

## 📁 Estructura del Proyecto

```
MODULO_PFC/
├── 📂 data/                    # Datos fuente (CSV, Excel)
│   └── II. ESPACIAL/
│       └── 02_DATA_ATRIBUTOS/  # Archivos CSV originales
├── 📂 public/
│   └── data/                   # JSON generados (consumidos por frontend)
│       ├── espacial/
│       ├── economia/
│       └── sector/
├── 📂 scripts/                 # ETL Scripts (Node.js)
│   ├── update_data.js          # Orquestador principal
│   ├── process_*.js            # Scripts de procesamiento individual
│   └── ...
├── 📂 src/
│   ├── components/             # Componentes reutilizables
│   ├── pages/                  # Páginas por módulo
│   │   ├── espacial/           # Módulo Espacial (zonificación, comercial, etc.)
│   │   ├── economia/           # Módulo Economía
│   │   └── sector/             # Módulo Sector
│   ├── App.tsx                 # Router principal
│   └── main.tsx                # Entry point
├── 📂 docs/                    # Documentación técnica
├── 📜 package.json
├── 📜 vite.config.ts
├── 📜 tailwind.config.js
└── 📜 tsconfig.json
```

---

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm 9+

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/wigsdev/MODULO_PFC.git
cd MODULO_PFC

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Aplicación disponible en http://localhost:5173
```

### Build de Producción

```bash
# Genera JSON desde datos fuente + compila TypeScript + build Vite
npm run build

# Preview del build
npm run preview
```

### Despliegue

```bash
# Deploy a GitHub Pages
npm run deploy
```

---

## 📊 Pipeline de Datos (ETL)

El sistema incluye un pipeline ETL automatizado que transforma los datos fuente en JSON optimizados para el frontend.

```mermaid
graph LR
    A[CSV/Excel] -->|Node.js Scripts| B[JSON Procesados]
    B -->|Vite Build| C[Aplicación React]
    C -->|GitHub Actions| D[GitHub Pages]
```

### Scripts ETL Disponibles

| Script | Datos Procesados |
|--------|------------------|
| `process_bosques.js` | Superficie cubierta por bosque |
| `process_cambio.js` | Cambio histórico de cobertura |
| `process_comercial.js` | Estadísticas comerciales |
| `process_otros.js` | Registro PFC, Tierras, Bosque/No Bosque |
| `process_economia_*.js` | Datos económicos (precios, industria) |
| ... | + 30 scripts adicionales |

### Ejecutar ETL Manualmente

```bash
# Ejecutar script específico
node scripts/process_bosques.js

# Ejecutar todos los scripts
node scripts/update_data.js
```

---

## 🌐 Demo

La aplicación está desplegada en GitHub Pages:

🔗 **[https://wigsdev.github.io/MODULO_PFC](https://wigsdev.github.io/MODULO_PFC)**

---

## 📈 Módulos Implementados

### II. Espacial

| Subsección | Página | Estado |
|------------|--------|--------|
| 2.1 Zonificación | Aptitud de Tierras, Frontera Agrícola | ✅ |
| 2.2 Cobertura Boscosa | Superficie, Cambio Histórico, Indicadores | ✅ |
| 2.3 Información Ambiental | Superficie Cubierta, Autoridades, Cambio Histórico | ✅ |
| 2.4 Producción Forestal | Aprovechamientos, Movilizaciones, Decomisos, Viveros, Regentes | ✅ |
| 2.5 Información Comercial | Estudios de Mercado, Estadísticas, Boletines | ✅ |
| 2.6 Otros Datos | Registro PFC, Tierras, Bosque/No Bosque, Sistemas Info | ✅ |
| 2.7 Planificación | Zonas Susceptibles, Áreas de Formalización | ✅ |

### III. Economía

| Subsección | Página | Estado |
|------------|--------|--------|
| 4.1 Oferta Forestal | Regional, Especies, Precios, Industria | ✅ |
| 4.2 Proveedores | Bienes y Servicios | ✅ |

### I. Sector Forestal

| Página | Estado |
|--------|--------|
| Dashboard Principal | ✅ |
| Deforestación | ✅ |
| Especies Forestales | ✅ |
| Reservas y BPP | ✅ |

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

### Convención de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Documentación
- `style:` Estilos (sin cambios de lógica)
- `refactor:` Refactorización
- `data:` Cambios en datos/ETL

---

## 📄 Licencia

Este proyecto está bajo la licencia **ISC**.

---

## 👥 Equipo

Desarrollado para el **Servicio Nacional Forestal y de Fauna Silvestre (SERFOR)** - Perú

---

## 📞 Contacto

- **Repositorio**: [github.com/wigsdev/MODULO_PFC](https://github.com/wigsdev/MODULO_PFC)
- **Demo**: [wigsdev.github.io/MODULO_PFC](https://wigsdev.github.io/MODULO_PFC)

---

<p align="center">
  <sub>Hecho con ❤️ para el sector forestal peruano</sub>
</p>
