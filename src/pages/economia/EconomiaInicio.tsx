import { Link } from 'react-router-dom';
import {
    TrendingUp,
    Factory,
    Truck,
    Briefcase,
    Plane,
    Ship,
    Scale,
    Box,
    Layers,
    PieChart,
    Activity,
    Coins,
    Map,
    Sprout,
    Users,
    Award
} from 'lucide-react';

const EconomiaInicio = () => {
    const sections = [
        {
            title: 'Proveedores',
            description: 'Directorio de proveedores de bienes y servicios.',
            icon: Users,
            link: '/economia/proveedores',
            color: 'bg-indigo-600'
        },
        {
            title: 'Entidades PNF',
            description: 'Entidades Ejecutoras de Planes de Negocios Forestales.',
            icon: Award,
            link: '/economia/entidades-pnf',
            color: 'bg-emerald-600'
        },
        {
            title: 'Esp. Aprovechadas',
            description: 'Volúmenes y valores de las principales especies aprovechadas.',
            icon: Sprout,
            link: '/economia/especies',
            color: 'bg-emerald-500'
        },
        {
            title: 'Precios',
            description: 'Evolución de precios de madera y productos forestales.',
            icon: TrendingUp,
            link: '/economia/precios',
            color: 'bg-green-600'
        },
        {
            title: 'Industria',
            description: 'Transformación industrial y valor agregado.',
            icon: Factory,
            link: '/economia/industria',
            color: 'bg-slate-600'
        },
        {
            title: 'Vol. Movilizado',
            description: 'Registro de transporte y movilización de productos.',
            icon: Truck,
            link: '/economia/movilizado',
            color: 'bg-amber-600'
        },
        {
            title: 'Concesiones',
            description: 'Estado y producción de concesiones forestales.',
            icon: Briefcase,
            link: '/economia/concesiones',
            color: 'bg-blue-600'
        },
        {
            title: 'Exportaciones',
            description: 'Ventas al mercado internacional y principales destinos.',
            icon: Plane,
            link: '/economia/exportaciones',
            color: 'bg-sky-500'
        },
        {
            title: 'Importaciones',
            description: 'Compras del exterior y origen de productos.',
            icon: Ship,
            link: '/economia/importaciones',
            color: 'bg-indigo-500'
        },
        {
            title: 'Balanza Comercial',
            description: 'Comparativo entre exportaciones e importaciones.',
            icon: Scale,
            link: '/economia/balanza',
            color: 'bg-violet-500'
        },
        {
            title: 'Oferta Forestal',
            description: 'Disponibilidad de productos en el mercado nacional.',
            icon: Box,
            link: '/economia/oferta',
            color: 'bg-orange-600'
        },
        {
            title: 'Consumo Intermedio',
            description: 'Insumos utilizados en procesos productivos.',
            icon: Layers,
            link: '/economia/consumo-intermedio',
            color: 'bg-teal-600'
        },
        {
            title: 'Utilización Total',
            description: 'Demanda total y usos finales de productos.',
            icon: PieChart,
            link: '/economia/utilizacion',
            color: 'bg-cyan-600'
        },
        {
            title: 'Intensidad',
            description: 'Indicadores de consumo per cápita e intensidad de uso.',
            icon: Activity,
            link: '/economia/intensidad',
            color: 'bg-rose-500'
        },
        {
            title: 'Costos Plantaciones',
            description: 'Estructura de costos de instalación y mantenimiento.',
            icon: Coins,
            link: '/economia/costos',
            color: 'bg-yellow-600'
        },
        {
            title: 'Geovisor Costos',
            description: 'Mapa interactivo de costos logísticos y operativos.',
            icon: Map,
            link: '/economia/geovisor-costos',
            color: 'bg-blue-500'
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Información Económica</h1>
                <p className="text-gray-600">
                    En esta sección podrá explorar los datos e indicadores económicos asociados al sector forestal, incluyendo cifras de consumo, costos y productividad.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sections.map((section) => (
                    <Link
                        key={section.title}
                        to={section.link}
                        className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-transparent hover:border-gray-200 flex items-start gap-4"
                    >
                        <div className={`p-3 rounded-lg ${section.color} text-white shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}>
                            <section.icon size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">
                                {section.title}
                            </h3>
                            <p className="text-[11px] text-gray-500 leading-tight">
                                {section.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default EconomiaInicio;
