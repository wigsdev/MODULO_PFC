// Normativa Imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NormativaLayout from './pages/normativa/NormativaLayout';
import NormativaInicio from './pages/normativa/NormativaInicio';
import Planificacion from './pages/normativa/Planificacion';
import Lineamientos from './pages/normativa/Lineamientos';
import ManejoAprovechamiento from './pages/normativa/ManejoAprovechamiento';
import Incentivos from './pages/normativa/Incentivos';
import Layout from '@/components/layout/Layout';
import SectorLayout from '@/pages/sector/SectorLayout';
import EconomiaLayout from '@/pages/economia/EconomiaLayout';
import EspacialLayout from '@/pages/espacial/EspacialLayout';
import EspacialDashboard from '@/pages/espacial/EspacialDashboard';
import EspacialDocsLayout from '@/pages/espacial/docs/EspacialDocsLayout';
import DocsInicio from '@/pages/espacial/docs/DocsInicio';
import ManualesTecnicos from '@/pages/espacial/docs/ManualesTecnicos';
import ProtocolosInteroperabilidad from '@/pages/espacial/docs/ProtocolosInteroperabilidad';
import OtrosDocs from '@/pages/espacial/docs/OtrosDocs';
import Deforestacion from '@/pages/sector/Deforestacion';
import Precios from '@/pages/economia/Precios';
import Inicio from '@/pages/inicio/Inicio';
import GestionOrganizacional from '@/pages/inicio/GestionOrganizacional';
import Decomisos from '@/pages/sector/Decomisos';
import EspeciesDecomisadas from '@/pages/sector/EspeciesDecomisadas';
import ReservasBiosfera from '@/pages/sector/ReservasBiosfera';
import AreasDeclaradas from '@/pages/sector/AreasDeclaradas';
import SitiosDeclarados from '@/pages/sector/SitiosDeclarados';
import Carbono from '@/pages/sector/Carbono';
import SectorInicio from './pages/sector/SectorInicio';
import EconomiaInicio from './pages/economia/EconomiaInicio';
import EspeciesAprovechadas from './pages/economia/EspeciesAprovechadas';
import TransformacionIndustrial from './pages/economia/TransformacionIndustrial';
import VolumenMovilizado from './pages/economia/VolumenMovilizado';
import Concesiones from './pages/economia/Concesiones';
import Exportaciones from './pages/economia/Exportaciones';
import Importaciones from './pages/economia/Importaciones';
import BalanzaComercial from './pages/economia/BalanzaComercial';
import OfertaForestal from './pages/economia/OfertaForestal';
import ConsumoIntermedio from './pages/economia/ConsumoIntermedio';
import UtilizacionTotal from './pages/economia/UtilizacionTotal';
import ConsumoIntensidad from './pages/economia/ConsumoIntensidad';
import CostosPlantaciones from './pages/economia/CostosPlantaciones';
import GeovisorCostos from './pages/economia/GeovisorCostos';
import FronteraAgricola from '@/pages/espacial/planificacion/FronteraAgricola';
import ZonificacionCultivos from '@/pages/espacial/planificacion/ZonificacionCultivos';
import ZonasSusceptibles from '@/pages/espacial/planificacion/ZonasSusceptibles';
import AreasFormalizacion from '@/pages/espacial/planificacion/AreasFormalizacion';
import SuperficieBosque from '@/pages/espacial/monitoreo/SuperficieBosque';
import CambioSuperficie from '@/pages/espacial/monitoreo/CambioSuperficie';
import IndicadoresBosque from '@/pages/espacial/monitoreo/IndicadoresBosque';
import InventarioForestal from '@/pages/espacial/monitoreo/InventarioForestal';
import SuperficieCubierta from '@/pages/espacial/ambiental/SuperficieCubierta';
import AutoridadesAmbientales from '@/pages/espacial/ambiental/AutoridadesAmbientales';
import CambioHistorico from '@/pages/espacial/ambiental/CambioHistorico';
import Aprovechamientos from '@/pages/espacial/sniffs/Aprovechamientos';
import Movilizaciones from '@/pages/espacial/sniffs/Movilizaciones';
import DecomisosEspacial from '@/pages/espacial/sniffs/Decomisos';
import Plantaciones from '@/pages/espacial/sniffs/Plantaciones';
import Registros from '@/pages/espacial/sniffs/Registros';
import EstudiosMercado from '@/pages/espacial/comercial/EstudiosMercado';
import Estadisticas from '@/pages/espacial/comercial/Estadisticas';
import Boletines from '@/pages/espacial/comercial/Boletines';
import PlantacionesRegistradas from '@/pages/espacial/otros/PlantacionesRegistradas';
import TierrasPFC from '@/pages/espacial/otros/TierrasPFC';
import MapaBosque from '@/pages/espacial/otros/MapaBosque';
import SistemasInversionista from '@/pages/espacial/otros/SistemasInversionista';



function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="inicio" element={<Navigate to="/" replace />} />
          <Route path="gestion/*" element={<GestionOrganizacional />} />
          <Route path="gestion/*" element={<GestionOrganizacional />} />

          {/* Espacial Routes */}
          {/* Espacial Routes */}
          <Route path="espacial" element={<EspacialLayout />}>
            <Route index element={<Navigate to="/espacial/inicio" replace />} />
            <Route path="dashboard" element={<Navigate to="/espacial/inicio" replace />} />
            <Route path="inicio" element={<EspacialDashboard />} />

            {/* Planificación */}
            <Route path="planificacion/frontera-agricola" element={<FronteraAgricola />} />
            <Route path="planificacion/zonificacion-cultivos" element={<ZonificacionCultivos />} />
            <Route path="planificacion/zonas-susceptibles" element={<ZonasSusceptibles />} />
            <Route path="planificacion/areas-formalizacion" element={<AreasFormalizacion />} />

            {/* Monitoreo */}
            <Route path="monitoreo/superficie-bosque" element={<SuperficieBosque />} />
            <Route path="monitoreo/cambio-superficie" element={<CambioSuperficie />} />
            <Route path="monitoreo/indicadores-bosque" element={<IndicadoresBosque />} />
            <Route path="monitoreo/inventario-forestal" element={<InventarioForestal />} />

            {/* Ambiental */}
            <Route path="ambiental/superficie-cubierta" element={<SuperficieCubierta />} />
            <Route path="ambiental/autoridades-ambientales" element={<AutoridadesAmbientales />} />
            <Route path="ambiental/cambio-historico" element={<CambioHistorico />} />

            {/* SNIFFS */}
            <Route path="sniffs/aprovechamientos" element={<Aprovechamientos />} />
            <Route path="sniffs/movilizaciones" element={<Movilizaciones />} />
            <Route path="sniffs/decomisos" element={<DecomisosEspacial />} />
            <Route path="sniffs/plantaciones" element={<Plantaciones />} />
            <Route path="sniffs/registros" element={<Registros />} />

            {/* Comercial */}
            <Route path="comercial/estudios-mercado" element={<EstudiosMercado />} />
            <Route path="comercial/estadisticas" element={<Estadisticas />} />
            <Route path="comercial/boletines" element={<Boletines />} />

            {/* Otros */}
            <Route path="otros/plantaciones-registradas" element={<PlantacionesRegistradas />} />
            <Route path="otros/tierras-pfc" element={<TierrasPFC />} />
            <Route path="otros/mapa-bosque" element={<MapaBosque />} />
            <Route path="otros/sistemas-inversionista" element={<SistemasInversionista />} />
            <Route path="*" element={<Navigate to="/espacial/inicio" replace />} />
          </Route>

          {/* Espacial Documentation Routes (Independent Layout) */}
          <Route path="espacial/docs" element={<EspacialDocsLayout />}>
            <Route index element={<Navigate to="inicio" replace />} />
            <Route path="inicio" element={<DocsInicio />} />
            <Route path="manuales" element={<ManualesTecnicos />} />
            <Route path="protocolos" element={<ProtocolosInteroperabilidad />} />
            <Route path="otros" element={<OtrosDocs />} />
            <Route path="*" element={<Navigate to="inicio" replace />} />
          </Route>

          {/* Sector Routes */}
          <Route path="sector" element={<SectorLayout />}>
            <Route index element={<Navigate to="inicio" replace />} />
            <Route path="inicio" element={<SectorInicio />} />
            <Route path="deforestacion" element={<Deforestacion />} />
            <Route path="decomisos" element={<Decomisos />} />
            <Route path="especies" element={<EspeciesDecomisadas />} />
            <Route path="reservas" element={<ReservasBiosfera />} />
            <Route path="areas" element={<AreasDeclaradas />} />
            <Route path="sitios" element={<SitiosDeclarados />} />
            <Route path="carbono" element={<Carbono />} />
          </Route>

          {/* Economia Routes */}
          <Route path="economia" element={<EconomiaLayout />}>
            <Route index element={<Navigate to="inicio" replace />} />
            <Route path="inicio" element={<EconomiaInicio />} />
            <Route path="especies" element={<EspeciesAprovechadas />} />
            <Route path="precios" element={<Precios />} />
            <Route path="industria" element={<TransformacionIndustrial />} />
            <Route path="movilizado" element={<VolumenMovilizado />} />
            <Route path="concesiones" element={<Concesiones />} />
            <Route path="exportaciones" element={<Exportaciones />} />
            <Route path="importaciones" element={<Importaciones />} />
            <Route path="balanza" element={<BalanzaComercial />} />
            <Route path="oferta" element={<OfertaForestal />} />
            <Route path="consumo-intermedio" element={<ConsumoIntermedio />} />
            <Route path="utilizacion" element={<UtilizacionTotal />} />
            <Route path="intensidad" element={<ConsumoIntensidad />} />
            <Route path="costos" element={<CostosPlantaciones />} />
            <Route path="geovisor-costos" element={<GeovisorCostos />} />
          </Route>

          {/* Rutas de Normativa */}
          <Route path="/normativa" element={<NormativaLayout />}>
            <Route index element={<Navigate to="/normativa/inicio" replace />} />
            <Route path="inicio" element={<NormativaInicio />} />
            {/* Pendientes de implementar */}
            <Route path="planificacion" element={<Planificacion />} />
            <Route path="lineamientos" element={<Lineamientos />} />
            <Route path="manejo" element={<ManejoAprovechamiento />} />
            <Route path="incentivos" element={<Incentivos />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
