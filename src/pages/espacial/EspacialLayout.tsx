import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import {
    Map,
    TreePine,
    Leaf,
    Info,
    FileText,
    BarChart3,
    Scale,
    ShieldCheck,
    Sprout,
    ClipboardList,
    DollarSign,
    Globe,
    Home,
} from 'lucide-react';

const ESPACIAL_ITEMS = [
    { id: 'inicio', label: 'Inicio', icon: Home, path: '/espacial/inicio' },
    {
        id: 'planificacion',
        label: 'Planificación Rural Agropecuaria',
        icon: Map,
        subItems: [
            { id: 'frontera', label: 'Frontera Agrícola Nacional', path: '/espacial/planificacion/frontera-agricola', icon: Sprout },
            { id: 'zonificacion', label: 'Zonificación de Cultivos', path: '/espacial/planificacion/zonificacion-cultivos', icon: Map },
            { id: 'susceptibles', label: 'Zonas Susceptibles de Mercado', path: '/espacial/planificacion/zonas-susceptibles', icon: DollarSign },
            { id: 'formalizacion', label: 'Áreas para Formalización', path: '/espacial/planificacion/areas-formalizacion', icon: ClipboardList },
        ]
    },
    {
        id: 'monitoreo',
        label: 'Monitoreo de Bosques y Carbono',
        icon: TreePine,
        subItems: [
            { id: 'superficie-bosque', label: 'Superficie Bosque Natural', path: '/espacial/monitoreo/superficie-bosque', icon: TreePine },
            { id: 'cambio-superficie', label: 'Cambio Superficie Bosque', path: '/espacial/monitoreo/cambio-superficie', icon: BarChart3 },
            { id: 'indicadores', label: 'Indicadores de Bosque', path: '/espacial/monitoreo/indicadores-bosque', icon: ClipboardList },
            { id: 'inventario', label: 'Inventario Forestal', path: '/espacial/monitoreo/inventario-forestal', icon: ClipboardList },
        ]
    },
    {
        id: 'ambiental',
        label: 'Sistema de Información Ambiental',
        icon: Leaf,
        subItems: [
            { id: 'superficie-cubierta', label: 'Superficie Cubierta (Región)', path: '/espacial/ambiental/superficie-cubierta', icon: Map },
            { id: 'autoridades', label: 'Autoridades Ambientales', path: '/espacial/ambiental/autoridades-ambientales', icon: ShieldCheck },
            { id: 'cambio-historico', label: 'Cambio Histórico', path: '/espacial/ambiental/cambio-historico', icon: BarChart3 },
        ]
    },
    {
        id: 'sniffs',
        label: 'Sistema Nacional (SNIFFS)',
        icon: Info,
        subItems: [
            { id: 'aprovechamientos', label: 'Aprovechamientos', path: '/espacial/sniffs/aprovechamientos', icon: TreePine },
            { id: 'movilizaciones', label: 'Movilizaciones', path: '/espacial/sniffs/movilizaciones', icon: Map },
            { id: 'decomisos', label: 'Decomisos', path: '/espacial/sniffs/decomisos', icon: Scale },
            { id: 'plantaciones', label: 'Plantaciones', path: '/espacial/sniffs/plantaciones', icon: Sprout },
            { id: 'registros', label: 'Registros (Viveros/Regentes)', path: '/espacial/sniffs/registros', icon: ClipboardList },
        ]
    },
    {
        id: 'comercial',
        label: 'Información Comercial',
        icon: DollarSign,
        subItems: [
            { id: 'estudios', label: 'Estudios de Mercado', path: '/espacial/comercial/estudios-mercado', icon: BarChart3 },
            { id: 'estadisticas', label: 'Estadísticas Producción', path: '/espacial/comercial/estadisticas', icon: BarChart3 },
            { id: 'boletines', label: 'Boletines Anuales', path: '/espacial/comercial/boletines', icon: FileText },
        ]
    },
    {
        id: 'otros',
        label: 'Otros Datos Espaciales',
        icon: Globe,
        subItems: [
            { id: 'plantaciones-registradas', label: 'Plantaciones Registradas', path: '/espacial/otros/plantaciones-registradas', icon: Sprout },
            { id: 'tierras-pfc', label: 'Tierras para PFC', path: '/espacial/otros/tierras-pfc', icon: Map },
            { id: 'mapa-bosque', label: 'Mapa Bosque / No Bosque', path: '/espacial/otros/mapa-bosque', icon: TreePine },
            { id: 'sistemas-inversionista', label: 'Sistemas para Inversionista', path: '/espacial/otros/sistemas-inversionista', icon: Info },
        ]
    },
];

export default function EspacialLayout() {
    return (
        <div className="flex h-full bg-gray-100 overflow-hidden">
            <Sidebar title="ESPACIAL" items={ESPACIAL_ITEMS} />
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <Outlet />
            </div>
        </div>
    );
}
