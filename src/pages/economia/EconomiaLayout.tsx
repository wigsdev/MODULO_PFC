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
        label: 'Productividad y Rendimiento',
        icon: TrendingUp,
        subItems: [
            { id: 'especies', label: 'Especies Aprovechadas', icon: TreePine, path: '/economia/especies' },
            { id: 'precios', label: 'Precios Maderas', icon: DollarSign, path: '/economia/precios' },
            { id: 'industria', label: 'Transformación Industrial', icon: Factory, path: '/economia/industria' },
        ]
    },
    {
        id: 'mercado',
        label: 'Datos de Mercado',
        icon: BarChart3,
        subItems: [
            { id: 'movilizado', label: 'Volumen Movilizado', icon: Truck, path: '/economia/movilizado' },
            { id: 'concesiones', label: 'Concesiones', icon: FileText, path: '/economia/concesiones' },
            { id: 'exportaciones', label: 'Exportaciones', icon: Globe, path: '/economia/exportaciones' },
            { id: 'importaciones', label: 'Importaciones', icon: Anchor, path: '/economia/importaciones' },
            { id: 'balanza', label: 'Balanza Comercial', icon: Scale, path: '/economia/balanza' },
        ]
    },
    {
        id: 'macro',
        label: 'Importancia Macroeconómica',
        icon: PieChart,
        subItems: [
            { id: 'oferta', label: 'Oferta Forestal', icon: TreePine, path: '/economia/oferta' },
            { id: 'consumo_intermedio', label: 'Consumo Intermedio', icon: Factory, path: '/economia/consumo-intermedio' },
            { id: 'utilizacion', label: 'Utilización Total', icon: BarChart3, path: '/economia/utilizacion' },
            { id: 'intensidad', label: 'Consumo e Intensidad', icon: TrendingUp, path: '/economia/intensidad' },
        ]
    },
    {
        id: 'financiero',
        label: 'Datos Financieros',
        icon: DollarSign,
        subItems: [
            { id: 'costos', label: 'Costos Plantaciones', icon: DollarSign, path: '/economia/costos' },
            { id: 'geovisor_costos', label: 'Geovisor de Costos', icon: Smartphone, path: '/economia/geovisor-costos' },
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
