import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Trees, AlertTriangle, ShieldAlert, Globe, MapPin, Cloud, PackageX } from 'lucide-react';

const SECTOR_ITEMS = [
    { id: 'deforestacion', label: '3.1 Tasa Anual de Deforestación', icon: AlertTriangle, path: '/sector/deforestacion' },
    { id: 'decomisos', label: '3.2 Volumen Decomisado', icon: PackageX, path: '/sector/decomisos' },
    { id: 'especies', label: '3.3 Especies Decomisadas', icon: Trees, path: '/sector/especies' },
    { id: 'reservas', label: '3.4 Reservas de Biosfera', icon: Globe, path: '/sector/reservas' },
    { id: 'areas', label: '3.5 Áreas Declaradas', icon: ShieldAlert, path: '/sector/areas' },
    { id: 'sitios', label: '3.6 Sitios Declarados', icon: MapPin, path: '/sector/sitios' },
    { id: 'carbono', label: '3.7 Contenidos de Carbono', icon: Cloud, path: '/sector/carbono' },
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
