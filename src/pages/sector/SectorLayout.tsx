import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Trees, AlertTriangle, ShieldAlert, Map } from 'lucide-react';

const SECTOR_ITEMS = [
    { id: 'deforestacion', label: 'Deforestación Histórica', icon: Trees, path: '/sector/deforestacion' },
    { id: 'decomisos', label: 'Control y Vigilancia', icon: AlertTriangle, path: '/sector/decomisos' },
    { id: 'especies', label: 'Especies Vulnerables', icon: ShieldAlert, path: '/sector/especies' },
    { id: 'zonificacion', label: 'Áreas de Conservación', icon: Map, path: '/sector/conservacion' },
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
