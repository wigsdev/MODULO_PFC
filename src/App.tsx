import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const Normativa = () => <div className="p-8"><h1>Normativa y Documentación</h1></div>;

// Placeholders for other routes
const Pending = ({ title }: { title: string }) => <div className="p-4"><h2 className="text-xl font-bold">{title}</h2><p className="text-gray-500">En construcción</p></div>;

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
            <Route index element={<Navigate to="deforestacion" replace />} />
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
            <Route index element={<Navigate to="especies" replace />} />
            <Route path="especies" element={<Pending title="Especies Priorizadas" />} />
            <Route path="precios" element={<Precios />} />
            <Route path="industria" element={<Pending title="Transformación Industrial" />} />
            <Route path="comercio" element={<Pending title="Balanza Comercial" />} />
            <Route path="costos" element={<Pending title="Costos Referenciales" />} />
          </Route>

          <Route path="normativa" element={<Normativa />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
