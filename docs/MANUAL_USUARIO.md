# 📘 Manual de Usuario - MODULO PFC

## Plataforma de Información para Plantaciones Forestales Comerciales

---

## 📑 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Acceso a la Plataforma](#acceso-a-la-plataforma)
3. [Navegación General](#navegación-general)
4. [Módulo I: Sector Forestal](#módulo-i-sector-forestal)
5. [Módulo II: Información Espacial](#módulo-ii-información-espacial)
6. [Módulo III: Información Económica](#módulo-iii-información-económica)
7. [Módulo IV: Normativa](#módulo-iv-normativa)
8. [Interacción con Gráficos y Tablas](#interacción-con-gráficos-y-tablas)
9. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

### ¿Qué es MODULO PFC?

MODULO PFC es una plataforma web interactiva desarrollada para el **Servicio Nacional Forestal y de Fauna Silvestre (SERFOR)** que centraliza información relevante para inversionistas interesados en el sector de plantaciones forestales comerciales en Perú.

### ¿Para quién está diseñada?

- **Inversionistas nacionales e internacionales** interesados en el sector forestal
- **Funcionarios públicos** del sector forestal y ambiental
- **Investigadores y académicos** del área forestal
- **Profesionales del sector** (regentes, ingenieros forestales)
- **Público en general** interesado en información del sector

### Requisitos del Sistema

| Requisito | Especificación |
|-----------|----------------|
| Navegador | Chrome 90+, Firefox 88+, Edge 90+, Safari 14+ |
| Conexión | Internet estable |
| Resolución | Mínimo 1024x768 (Recomendado: 1920x1080) |

---

## Acceso a la Plataforma

### Paso 1: Ingresar a la URL

Abra su navegador web y diríjase a:

```
https://wigsdev.github.io/MODULO_PFC
```

### Paso 2: Página de Inicio

Al ingresar, visualizará la **página de inicio** con:
- Barra de navegación superior con los módulos principales
- Resumen general del sistema
- Accesos directos a las secciones más importantes

---

## Navegación General

### Barra de Navegación Principal

La barra superior contiene los siguientes módulos:

| Módulo | Icono | Descripción |
|--------|-------|-------------|
| **Inicio** | 🏠 | Página principal con resumen |
| **Espacial** | 🗺️ | Datos geoespaciales y zonificación |
| **Sector** | 📊 | Indicadores del sector forestal |
| **Economía** | 💰 | Información económica y comercial |
| **Normativa** | 📜 | Marco legal y regulatorio |

### Menú Lateral (Sidebar)

Cada módulo tiene un **menú lateral izquierdo** que muestra:
- Subsecciones organizadas por categoría
- Indicador visual de la página actual (resaltada)
- Iconos descriptivos para cada opción

### Breadcrumbs

En la parte superior de cada página encontrará **migas de pan** que indican:
- Su ubicación actual en la jerarquía
- Opciones para regresar a niveles anteriores

---

## Módulo I: Sector Forestal

### Acceso
1. Clic en **"Sector"** en la barra de navegación
2. Se mostrará el menú lateral con las opciones disponibles

### Páginas Disponibles

#### 1.1 Dashboard Sector (`/sector/inicio`)
**Propósito:** Vista general de indicadores del sector forestal peruano.

**Contenido:**
- KPIs principales (superficie boscosa, deforestación, etc.)
- Gráficos resumen
- Accesos directos a secciones detalladas

#### 1.2 Deforestación (`/sector/deforestacion`)
**Propósito:** Análisis de pérdida de cobertura boscosa.

**Contenido:**
- Tendencia histórica de deforestación
- Comparativa por regiones
- Años con mayor impacto

**Cómo usar:**
1. Observe los KPIs en la parte superior
2. Analice el gráfico de líneas para ver tendencias
3. Compare regiones en el gráfico de barras

#### 1.3 Especies Decomisadas (`/sector/especies`)
**Propósito:** Información sobre especies forestales decomisadas.

**Contenido:**
- Ranking de especies más decomisadas
- Distribución por tipo de producto
- Volúmenes por año

#### 1.4 Volumen Decomisado (`/sector/decomisos`)
**Propósito:** Estadísticas de decomisos forestales.

**Contenido:**
- Total de volumen decomisado
- Tendencia por años
- Principales regiones

#### 1.5 Reservas y BPP (`/sector/reservas`)
**Propósito:** Información sobre Bosques de Producción Permanente y Reservas.

**Contenido:**
- Superficie de BPP por región
- Estado de las reservas de biosfera
- Áreas protegidas

#### 1.6 Sitios Declarados (`/sector/sitios`)
**Propósito:** Patrimonio forestal declarado.

**Contenido:**
- Sitios de importancia forestal
- Clasificación por tipo
- Ubicación geográfica

#### 1.7 Carbono (`/sector/carbono`)
**Propósito:** Información sobre captura de carbono forestal.

**Contenido:**
- Stock de carbono por región
- Potencial de captura
- Iniciativas REDD+

---

## Módulo II: Información Espacial

### Acceso
1. Clic en **"Espacial"** en la barra de navegación
2. Navegue por las subsecciones en el menú lateral

### 2.1 Planificación

#### Zonificación de Cultivos (`/espacial/planificacion/zonificacion-cultivos`)
**Propósito:** Aptitud de tierras para diferentes cultivos forestales.

**Contenido:**
- Mapa de zonas aptas
- Distribución por aptitud (alta, media, baja)
- Superficie disponible por región

**Cómo interpretar:**
- 🟢 Verde = Alta aptitud
- 🟡 Amarillo = Aptitud media
- 🔴 Rojo = Baja aptitud

#### Frontera Agrícola (`/espacial/planificacion/frontera-agricola`)
**Propósito:** Análisis del límite entre uso agrícola y forestal.

#### Zonas Susceptibles (`/espacial/planificacion/zonas-susceptibles`)
**Propósito:** Identificación de áreas con potencial para inversión.

**Contenido:**
- Distribución por grado de mercado
- Top distritos por superficie
- Indicadores de viabilidad

#### Áreas de Formalización (`/espacial/planificacion/areas-formalizacion`)
**Propósito:** Brecha de titulación de tierras.

**Contenido:**
- Superficie por titular
- Predios estimados
- Prioridad de formalización (Muy Alta / Alta)

### 2.2 Monitoreo Forestal

#### Superficie Cubierta por Bosque Natural (`/espacial/monitoreo/superficie-bosque`)
**Propósito:** Estado actual de la cobertura boscosa.

**Contenido:**
- Superficie total por región
- Porcentaje de cobertura
- Comparativa entre regiones

#### Cambio de Superficie (`/espacial/monitoreo/cambio-superficie`)
**Propósito:** Variación anual de cobertura.

**Contenido:**
- Gráfico de pérdida anual
- Tendencia histórica
- Años críticos

#### Indicadores de Bosque (`/espacial/monitoreo/indicadores-bosque`)
**Propósito:** Métricas de salud forestal.

#### Inventario Forestal (`/espacial/monitoreo/inventario-forestal`)
**Propósito:** Registro de recursos forestales disponibles.

### 2.3 Información Ambiental

#### Superficie Cubierta (`/espacial/ambiental/superficie-cubierta`)
**Propósito:** Cobertura por tipo de bosque.

#### Autoridades Ambientales (`/espacial/ambiental/autoridades-ambientales`)
**Propósito:** Directorio de entidades ambientales.

**Contenido:**
- Listado de autoridades nacionales y regionales
- Información de contacto
- Enlaces a portales oficiales

**Cómo usar:**
1. Use el filtro de tipo (Nacional/Regional)
2. Busque por nombre de institución
3. Clic en el enlace para acceder al portal

#### Cambio Histórico (`/espacial/ambiental/cambio-historico`)
**Propósito:** Evolución de la deforestación desde 2001.

### 2.4 Producción Forestal (SNIFFS)

#### Aprovechamientos (`/espacial/sniffs/aprovechamientos`)
**Propósito:** Permisos de aprovechamiento forestal otorgados.

#### Movilizaciones (`/espacial/sniffs/movilizaciones`)
**Propósito:** Guías de transporte forestal emitidas.

#### Decomisos (`/espacial/sniffs/decomisos`)
**Propósito:** Productos forestales decomisados.

#### Plantaciones (`/espacial/sniffs/plantaciones`)
**Propósito:** Registro de plantaciones forestales.

#### Registros Especiales
- **Viveros** (`/espacial/sniffs/registros/viveros`): Viveros forestales registrados
- **Plantaciones** (`/espacial/sniffs/registros/plantaciones`): Detalle de plantaciones
- **Infracciones** (`/espacial/sniffs/registros/infracciones`): Sanciones forestales
- **Regentes** (`/espacial/sniffs/registros/regentes`): Profesionales habilitados

### 2.5 Información Comercial

#### Estudios de Mercado (`/espacial/comercial/estudios-mercado`)
**Propósito:** Investigaciones de mercado disponibles.

**Cómo usar:**
1. Filtre por región de interés
2. Use la barra de búsqueda para términos específicos
3. Clic en el enlace para acceder al documento

#### Estadísticas de Comercio (`/espacial/comercial/estadisticas`)
**Propósito:** Producción, importación y exportación de PFC.

**Contenido:**
- KPIs de producción total
- Balanza comercial (déficit/superávit)
- Gráficos comparativos

#### Boletines Comerciales (`/espacial/comercial/boletines`)
**Propósito:** Publicaciones periódicas del sector.

### 2.6 Otros Datos Espaciales

#### Plantaciones Registradas (`/espacial/otros/plantaciones-registradas`)
**Propósito:** Registro histórico de certificados PFC.

**Contenido:**
- +11,000 registros de plantaciones
- Filtros por departamento, año, tipo de persona
- Búsqueda por titular o certificado
- Gráficos de tendencia y distribución

**Cómo usar:**
1. Observe los KPIs principales
2. Analice los gráficos de tendencia por año
3. Use los filtros para segmentar información
4. Navegue la tabla con paginación

#### Tierras para PFC (`/espacial/otros/tierras-pfc`)
**Propósito:** Clasificación de tierras por aptitud.

**Contenido:**
- Distribución por tipo de aptitud (Forestal Productivo, Protección, etc.)
- Top departamentos por superficie
- Porcentajes y totales

#### Mapa Bosque/No Bosque (`/espacial/otros/mapa-bosque`)
**Propósito:** Estado de cobertura y área potencial.

**Contenido:**
- Bosque remanente por región
- Pérdida acumulada 2001-2024
- Área potencial elegible para plantaciones

#### Sistemas de Información (`/espacial/otros/sistemas-inversionista`)
**Propósito:** Directorio de plataformas útiles para inversionistas.

**Contenido:**
- SNIFFS, GeoBosques, SINAFOR, etc.
- Tipo de dato que ofrece cada sistema
- Nivel de acceso (Público/Restringido)
- Enlaces directos

**Cómo usar:**
1. Filtre por tipo de dato
2. Revise la descripción de utilidad
3. Clic en el enlace para acceder al sistema

---

## Módulo III: Información Económica

### Acceso
1. Clic en **"Economía"** en la barra de navegación
2. Navegue por las subsecciones

### 3.1 Oferta Forestal (`/economia/oferta`)
**Propósito:** Volumen de madera ofertada por región.

**Contenido:**
- Volumen total (industrial + energética)
- Distribución por región PI1
- Región líder en producción

### 3.2 Especies Aprovechadas (`/economia/especies`)
**Propósito:** Especies maderables más utilizadas.

### 3.3 Precios de Madera (`/economia/precios`)
**Propósito:** Cotizaciones de productos maderables.

**Contenido:**
- Precios por especie y producto
- Comparativa entre mercados
- Tendencias de precios

### 3.4 Transformación Industrial (`/economia/industria`)
**Propósito:** Capacidad industrial del sector.

### 3.5 Proveedores (`/economia/proveedores`)
**Propósito:** Directorio de proveedores de bienes y servicios.

**Cómo usar:**
1. Filtre por tipo de servicio
2. Filtre por departamento
3. Use la búsqueda por nombre
4. Vea contacto y ubicación

### 3.6 Comercio Internacional
- **Exportaciones** (`/economia/exportaciones`): Productos exportados
- **Importaciones** (`/economia/importaciones`): Productos importados
- **Balanza Comercial** (`/economia/balanza`): Déficit/Superávit

### 3.7 Costos de Plantaciones (`/economia/costos`)
**Propósito:** Estructura de costos para inversión.

**Contenido:**
- Costos por hectárea
- Desglose por actividad
- Comparativa por especie

---

## Módulo IV: Normativa

### Acceso
1. Clic en **"Normativa"** en la barra de navegación

### Páginas Disponibles

- **Inicio** (`/normativa/inicio`): Resumen del marco legal
- **Planificación** (`/normativa/planificacion`): Normativa de planificación
- **Lineamientos** (`/normativa/lineamientos`): Guías técnicas
- **Manejo y Aprovechamiento** (`/normativa/manejo`): Regulaciones de manejo
- **Incentivos** (`/normativa/incentivos`): Beneficios e incentivos disponibles

---

## Interacción con Gráficos y Tablas

### Gráficos Interactivos

Todos los gráficos de la plataforma son interactivos:

| Acción | Resultado |
|--------|-----------|
| **Hover** (pasar el mouse) | Muestra tooltip con valor exacto |
| **Clic en leyenda** | Oculta/muestra la serie seleccionada |
| **Scroll** (en algunos) | Zoom en el área del gráfico |

### Tablas con Filtros

Las tablas permiten:

| Función | Cómo usar |
|---------|-----------|
| **Filtrar** | Seleccione valores en los dropdowns |
| **Buscar** | Escriba en el campo de búsqueda |
| **Paginar** | Use los botones "Anterior/Siguiente" |
| **Limpiar** | Clic en "Limpiar filtros" |

### KPIs (Indicadores Clave)

Los recuadros de KPIs muestran:
- **Valor principal** en tamaño grande
- **Etiqueta** descripción del indicador
- **Color lateral** indica la categoría
- **Información adicional** en texto pequeño

---

## Preguntas Frecuentes

### ¿Cada cuánto se actualizan los datos?
Los datos se actualizan periódicamente según la fuente:
- Datos SERFOR/SNIFFS: Trimestral
- GeoBosques: Anual
- Estadísticas comerciales: Mensual/Anual

### ¿Puedo descargar los datos?
Actualmente la plataforma es de consulta. Para descargas, acceda a los sistemas fuente (SNIFFS, GeoBosques, SINAFOR) a través de los enlaces proporcionados.

### ¿Los datos son oficiales?
Sí, todos los datos provienen de fuentes oficiales del Estado Peruano (SERFOR, MINAM, SUNAT, etc.).

### ¿Puedo usar los gráficos en reportes?
Sí, puede capturar pantalla de los gráficos para uso no comercial citando la fuente.

### ¿Qué navegador es recomendado?
Google Chrome en su última versión ofrece la mejor experiencia.

### ¿La plataforma funciona en móviles?
Sí, el diseño es responsive y se adapta a tablets y smartphones.

---

## Soporte Técnico

Para consultas sobre la plataforma:

- **Repositorio:** [github.com/wigsdev/MODULO_PFC](https://github.com/wigsdev/MODULO_PFC)
- **Issues:** Reporte problemas en la sección Issues del repositorio

---

<p align="center">
  <sub>Versión 1.0 | Diciembre 2024 | SERFOR - Perú</sub>
</p>
