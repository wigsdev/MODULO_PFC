import { Outlet } from 'react-router-dom';
import Sidebar, { SidebarItem } from '@/components/layout/Sidebar';
import {
    Home,
    TrendingUp,
    TreePine,
    Factory,
    DollarSign,
    BarChart3,
    Truck,
    FileText,
    Globe,
    Anchor,
    Scale,
    PieChart,
    Smartphone
} from 'lucide-react';

const ECONOMIA_ITEMS: SidebarItem[] = [
    {
        id: 'inicio',
        label: 'Inicio',
        icon: Home,
        path: '/economia/inicio'
    },
    {
        id: 'productividad',
        label: '4.1 Productividad y Rendimiento',
        icon: TrendingUp,
        subItems: [
            { id: 'especies', label: '4.1.1 Especies Aprovechadas', icon: TreePine, path: '/economia/especies' },
            { id: 'precios', label: '4.1.2 Precios Maderas', icon: DollarSign, path: '/economia/precios' },
            { id: 'industria', label: '4.1.3 Transformación Industrial', icon: Factory, path: '/economia/industria' },
        ]
    },
    {
        id: 'mercado',
        label: '4.2 Datos de Mercado',
        icon: BarChart3,
        subItems: [
            { id: 'movilizado', label: '4.2.1 Volumen Movilizado', icon: Truck, path: '/economia/movilizado' },
            { id: 'concesiones', label: '4.2.2 Concesiones', icon: FileText, path: '/economia/concesiones' },
            { id: 'exportaciones', label: '4.2.3 Exportaciones', icon: Globe, path: '/economia/exportaciones' },
            { id: 'importaciones', label: '4.2.4 Importaciones', icon: Anchor, path: '/economia/importaciones' },
            { id: 'balanza', label: '4.2.5 Balanza Comercial', icon: Scale, path: '/economia/balanza' },
        ]
    },
    {
        id: 'macro',
        label: '4.3 Importancia Macroeconómica',
        icon: PieChart,
        subItems: [
            { id: 'oferta', label: '4.3.1 Oferta Forestal', icon: TreePine, path: '/economia/oferta' },
            { id: 'consumo_intermedio', label: '4.3.2 Consumo Intermedio', icon: Factory, path: '/economia/consumo-intermedio' },
            { id: 'utilizacion', label: '4.3.3 Utilización Total', icon: BarChart3, path: '/economia/utilizacion' },
            { id: 'intensidad', label: '4.3.4 Consumo e Intensidad', icon: TrendingUp, path: '/economia/intensidad' },
        ]
    },
    {
        id: 'financiero',
        label: '4.4 Datos Financieros',
        icon: DollarSign,
        subItems: [
            { id: 'costos', label: '4.4.1 Costos Plantaciones', icon: DollarSign, path: '/economia/costos' },
            { id: 'geovisor_costos', label: '4.4.2 Geovisor de Costos', icon: Smartphone, path: '/economia/geovisor-costos' },
        ]
    }
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
