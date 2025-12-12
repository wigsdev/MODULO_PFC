import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { DollarSign, Factory, TrendingUp, BarChart2, Sprout } from 'lucide-react';

const ECONOMIA_ITEMS = [
    { id: 'especies', label: 'Especies Priorizadas', icon: Sprout, path: '/economia/especies' },
    { id: 'precios', label: 'Precios de Mercado', icon: DollarSign, path: '/economia/precios' },
    { id: 'industria', label: 'Transformación Industrial', icon: Factory, path: '/economia/industria' },
    { id: 'balanza', label: 'Balanza Comercial', icon: TrendingUp, path: '/economia/comercio' },
    { id: 'costos', label: 'Costos Referenciales', icon: BarChart2, path: '/economia/costos' },
];

export default function EconomiaLayout() {
    return (
        <div className="flex h-full bg-gray-100 overflow-hidden">
            <Sidebar title="ECONOMÍA Y MERCADO" items={ECONOMIA_ITEMS} />
            <div className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </div>
        </div>
    );
}
