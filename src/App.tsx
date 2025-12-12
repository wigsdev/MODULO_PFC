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
import EspacialDocs from '@/pages/espacial/EspacialDocs';
import Deforestacion from '@/pages/sector/Deforestacion';
import Precios from '@/pages/economia/Precios';
import Inicio from '@/pages/inicio/Inicio';
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



function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="inicio" element={<Navigate to="/" replace />} />

          {/* Espacial Routes */}
          <Route path="espacial" element={<EspacialLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EspacialDashboard />} />
            <Route path="docs" element={<EspacialDocs />} />
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
