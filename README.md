# VISUALIZACIÓN INTERACTIVA DE LA PROPUESTA DE MAPA DE SITIO (OBSE-PFC)

<p align="center">
  <img src="https://img.shields.io/badge/Estado-Prototipo%20de%20Validación-blue.svg" alt="Estado"/>
  <img src="https://img.shields.io/badge/Alcance-Propuesta%20de%20Arquitectura-green.svg" alt="Alcance"/>
</p>

<p align="center">
  <strong>Herramienta de demostración funcional desarrollada para visualizar la arquitectura de información propuesta para el Observatorio de Plantaciones Forestales Comerciales.</strong>
</p>

<p align="center">
  <a href="https://wigsdev.github.io/MODULO_PFC">🔗 VER DEMO INTERACTIVA</a>
</p>

> [!NOTE]
> **Aviso de Alcance:** Este desarrollo informático **excede los requisitos contractuales** (Mapa de Sitio Documental) y se entrega como un "Valor Agregado" del equipo consultor. Su objetivo es permitir a los tomadores de decisiones (SERFOR) visualizar de manera realista cómo se organizará la información. **La implementación final, despliegue y mantenimiento de la plataforma recaerá sobre las áreas de TI competentes del Estado.**

---

## 🏗️ Propósito del Repositorio

Este código fuente constituye la **materialización digital de la "Propuesta de Mapa de Sitio"**. A diferencia de un diagrama estático en papel, este prototipo permite navegar por la estructura propuesta para validar la experiencia de usuario (UX) y la lógica de negocio antes de su desarrollo oficial.

### Objetivos del Prototipo
1.  **Validar la Arquitectura:** Demostrar que la organización propuesta (Espacial, Economía, Sector) es intuitiva y funcional.
2.  **Facilitar la Decisión:** Permitir a los funcionarios "tocar" la propuesta y entender el flujo de datos.
3.  **Reducir Riesgos:** Identificar brechas de información o inconsistencias lógicas antes de invertir en el desarrollo de software definitivo.

---

## 🗺️ Estructura de la Propuesta (Mapa de Sitio)

La navegación del prototipo refleja fielmente la jerarquía de información presentada en el informe técnico, sirviendo como **medio de demostración** de las capacidades funcionales propuestas:

### 1. 🌍 Módulo Espacial (Geovisor de Mapas)
*   **Concepto:** Visualizador demostrativo de interoperabilidad espacial.
*   **Propósito de la Demostración:** Ilustrar **cómo se podrían presentar y gestionar** las capas vectoriales oficiales (Zonificación, Bosques) en un entorno web ágil, permitiendo a la autoridad validar la utilidad de la superposición de datos para la toma de decisiones.

### 2. 💰 Módulo de Economía (Geovisor de Costos)
*   **Concepto:** Calculadora demostrativa de inversión.
*   **Propósito de la Demostración:** Enseñar **cómo se pueden calcular de forma interactiva** los costos de inversión, transformando datos estáticos en simulaciones dinámicas. Permite visualizar el potencial de una herramienta que diferencie costos por especie (Pino, Eucalipto) y zona geográfica.

### 3. 📊 Módulo Sectorial
*   **Propuesta:** Tableros de control (Dashboards) para la Alta Dirección.
*   **Demostración:** Gráficos reactivos que visualizan la producción nacional y balanza comercial.

---

## 🛠️ Stack Tecnológico (Demo)

Para construir esta visualización, se utilizaron tecnologías web modernas que permiten una rápida iteración. *Nota: Este stack es referencial para el prototipo; la implementación final dependerá de los estándares de la Oficina de Tecnologías de la Información (OTI) del SERFOR.*

| Capa | Tecnología Usada (Demo) | Propósito en la Propuesta |
|------|-------------------------|---------------------------|
| **Frontend** | React 19 + TypeScript | Demostrar interactividad y respuesta inmediata. |
| **Estilos** | TailwindCSS | Proponer una línea gráfica moderna y limpia (UI). |
| **Mapas** | Leaflet | Validar la visualización de capas WMS/GeoJSON. |
| **Gráficos** | Recharts | Visualizar la presentación de indicadores KPIs. |

---

## 🚀 Acceso a la Visualización

*   **URL Pública:** [https://wigsdev.github.io/MODULO_PFC](https://wigsdev.github.io/MODULO_PFC)
*   **Código Fuente:** [https://github.com/wigsdev/MODULO_PFC](https://github.com/wigsdev/MODULO_PFC)

---
<p align="center">
  <sub>Este software es un entregable instrumental para la validación de la Actividad 1.2.1.1 (Diseño del Observatorio). No constituye el sistema final en producción.</sub>
</p>
