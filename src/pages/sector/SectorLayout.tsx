import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Trees, AlertTriangle, ShieldAlert, Globe, MapPin, Cloud, PackageX, Home } from 'lucide-react';

const SECTOR_ITEMS = [
    { id: 'inicio', label: 'Inicio', icon: Home, path: '/sector/inicio' },
    { id: 'deforestacion', label: 'Tasa Anual de Deforestación', icon: AlertTriangle, path: '/sector/deforestacion' },
    { id: 'decomisos', label: 'Volumen Decomisado', icon: PackageX, path: '/sector/decomisos' },
    { id: 'especies', label: 'Especies Decomisadas', icon: Trees, path: '/sector/especies' },
    { id: 'reservas', label: 'Reservas de Biosfera', icon: Globe, path: '/sector/reservas' },
    { id: 'areas', label: 'Áreas Declaradas', icon: ShieldAlert, path: '/sector/areas' },
    { id: 'sitios', label: 'Sitios Declarados', icon: MapPin, path: '/sector/sitios' },
    { id: 'carbono', label: 'Contenidos de Carbono', icon: Cloud, path: '/sector/carbono' },
];

export default function SectorLayout() {
    return (
        <div className="flex h-full bg-gray-100 overflow-hidden">
            <Sidebar title="SECTOR FORESTAL" items={SECTOR_ITEMS} />
            <div className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </div>
        </div>
    );
}
