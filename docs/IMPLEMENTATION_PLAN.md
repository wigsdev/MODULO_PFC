# Implementation Plan - Espacial Dashboard Structure

## Goal
Implement the approved structure for the "Espacial" section dashboard, organizing it into 6 main categories with specific subsections, using a Sidebar for navigation.

## User Review Required
> [!NOTE]
> I will be using generic placeholder components for the leaf pages initially to establish the structure and navigation. Content will be populated in subsequent steps.

## Proposed Changes

### `src/pages/espacial`
#### [MODIFY] [EspacialLayout.tsx](file:///c:/Users/WIGUSA/Documents/GitHub/MODULO_PFC/src/pages/espacial/EspacialLayout.tsx)
- Import `Sidebar` and icons.
- Define `ESPACIAL_ITEMS` array with the structure (Planificación, Monitoreo, Ambiental, SNIFFS, Comercial, Otros) and icons.
- Update layout to use `Sidebar`.

#### [NEW] Sub-directories and Pages
Create folder structure and basic components:
- `src/pages/espacial/planificacion/`
    - `FronteraAgricola.tsx`
    - `ZonificacionCultivos.tsx`
    - `ZonasSusceptibles.tsx`
    - `AreasFormalizacion.tsx`
- `src/pages/espacial/monitoreo/`
    - `SuperficieBosque.tsx`
    - `CambioSuperficie.tsx`
    - `IndicadoresBosque.tsx`
    - `InventarioForestal.tsx`
- `src/pages/espacial/ambiental/`
    - `SuperficieCubierta.tsx`
    - `AutoridadesAmbientales.tsx`
    - `CambioHistorico.tsx`
- `src/pages/espacial/sniffs/`
    - `Aprovechamientos.tsx`
    - `Movilizaciones.tsx`
    - `Decomisos.tsx`
    - `Plantaciones.tsx`
    - `Registros.tsx`
- `src/pages/espacial/comercial/`
    - `EstudiosMercado.tsx`
    - `Estadisticas.tsx`
    - `Boletines.tsx`
- `src/pages/espacial/otros/`
    - `PlantacionesRegistradas.tsx`
    - `TierrasPFC.tsx`
    - `MapaBosque.tsx`
    - `SistemasInversionista.tsx`

### `src/pages/espacial/docs`
#### [NEW] Documentation Pages
- `DocsInicio.tsx`: Landing page for documentation (similar to NormativaInicio).
- `ManualesTecnicos.tsx`: List of technical manuals with "Ver" (open in new tab) and "Descargar" functionality.
- `ProtocolosInteroperabilidad.tsx`: List of protocols with "Ver" and "Descargar" functionality.
- `OtrosDocs.tsx`: Other documents.

### Future Work Planning
- Define a roadmap for remaining tasks.
- Update `task.md` with the new roadmap.

### `src/pages/espacial`
#### [MODIFY] [EspacialLayout.tsx](file:///c:/Users/WIGUSA/Documents/GitHub/MODULO_PFC/src/pages/espacial/EspacialLayout.tsx)
- Add "Documentación Técnica" to `ESPACIAL_ITEMS` with sub-items:
    - Inicio (`/espacial/docs/inicio`)
    - Manuales Técnicos (`/espacial/docs/manuales`)
    - Protocolos de Interoperabilidad (`/espacial/docs/protocolos`)
    - Otros (`/espacial/docs/otros`)

### `src/App.tsx`
#### [MODIFY] [App.tsx](file:///c:/Users/WIGUSA/Documents/GitHub/MODULO_PFC/src/App.tsx)
- Update routes under `espacial` to include the new documentation routes.
- Remove old `docs` route.

## Verification Plan
### Automated Tests
- Run `npm run build` to ensure no import or routing errors.

### Manual Verification
- Navigate to `/espacial` and verify the Sidebar appears with the correct structure.
- Click through each menu item to ensure it routes to the correct placeholder page.
