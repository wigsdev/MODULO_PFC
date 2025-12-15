# ADR 001: Estrategia de Visualización de Datos

## Contexto
El proyecto requiere visualizar indicadores (gráficos, mapas) a partir de datos estructurados (Excel). Actualmente se implementó una solución nativa en React transformando Excel -> JSON -> Recharts.
El usuario expresa preocupación por:
1.  **Complejidad:** El proceso de crear gráficos manuales puede ser largo.
2.  **Mantenibilidad:** Los datos estáticos (compilados) requieren un nuevo "build" y despliegue para actualizarse.

## Opciones Evaluadas

### 1. NFA (Native Frontend Analytics) - Enfoque Actual
Se usa **React + Recharts** con datos procesados desde Excel a JSON.
*   **Pros:**
    *   🎨 **UX Premium:** Visualización 100% integrada, responsive y con estilos personalizados (colores corporativos, tooltips rápidos). No parece un "parche".
    *   ⚡ **Rendimiento:** Carga instantánea, sin iframes pesados.
    *   🔒 **Seguridad:** Los datos viven en el cliente/servidor, no en plataformas de terceros.
*   **Contras:**
    *   🛠️ **Desarrollo:** Cada gráfico requiere código.
    *   🔄 **Actualización:** Si el JSON se importa (`import data from...`), requiere recompilar (`npm run build`) para actualizar datos.

### 2. Embedded BI (Power BI / Looker Studio)
Incrustar dashboards creados en herramientas BI mediante `iframe`.
*   **Pros:**
    *   🚀 **Rapidez de creación:** Arrastrar y soltar para crear gráficos.
    *   🔄 **Data Viva:** Se conecta a Google Sheets/DB y se actualiza solo.
*   **Contras:**
    *   💰 **Costo/Licencias:** Power BI Embedded es costoso. La versión gratuita/pública expone los datos. Looker Studio es gratis pero tiene límites.
    *   🐌 **Rendimiento:** Cargar un iframe es lento y consume mucha memoria.
    *   📱 **UX Pobre:** Dificultad para adaptar a móviles. Se ve como una "ventana externa" dentro de la web.

### 3. Solución Híbrida Recomendada: "Runtime Data Fetching" + Google Sheets
Mantener **React/Recharts** (para la calidad visual) o usar una librería de "Low-Code Charts", pero cambiar la fuente de datos.

#### ¿Cómo funciona?
1.  **Fuente:** Los datos no están en el código, sino en un **Google Sheet** (publicado como CSV) o en un archivo JSON en la carpeta `public/`.
2.  **Frontend:** El componente React no importa el dato, sino que lo **descarga** al abrirse (`fetch()`).
    ```javascript
    // Ejemplo
    useEffect(() => {
       fetch('https://docs.google.com/.../output=csv')
         .then(data => setChartData(parse(data)))
    }, []);
    ```

*   **Beneficio:** El cliente actualiza el Excel/Sheet -> La web se actualiza al instante (F5). **Cero código para mantenimientos.**
*   **Costo:** Un poco más de configuración inicial (crear el parser genérico), pero mantenimiento cero.

## Recomendación de Experto

Para un **Portal Institucional** (como parece ser este Módulo PFC), la **Calidad Visual y la Experiencia de Usuario** son prioritarias.
*   **NO RECOMIENDO** iframes de Power BI/Looker si el objetivo es un producto digital profesional y público (se ven ajenos y cargan lento).
*   **RECOMIENDO** el **Enfoque Híbrido**:
    1.  Mantener la visualización en **React (Recharts)** para que se vea profesional.
    2.  **Mejorar el flujo de datos:**
        *   **Opción A (Fácil):** Subir el archivo JSON a una carpeta pública o S3. El frontend lo lee dinámicamente. Para actualizar, solo reemplazas el archivo, sin tocar código.
        *   **Opción B (Ideal):** Conectar a Google Sheets. El usuario edita el Sheet, la web vuela.

### Propuesta de Trabajo
Si la preocupación es el tiempo de desarrollo ("proceso largo"), podemos crear un **"Componente Maestro de Gráficos"**.
En lugar de programar cada gráfico, creamos un componente `<UniversalChart config={json} />` que lea un JSON estándar (Típo de gráfico, Ejes, Colores) y pinte el gráfico automáticamente. Así, añadir una nueva sección es solo crear un JSON, no programar React.
