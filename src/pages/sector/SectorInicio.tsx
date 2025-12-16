import { Link } from 'react-router-dom';
import {
    Trees,
    Box,
    Bird,
    Globe,
    Map as MapIcon,
    MapPin,
    CloudRain
} from 'lucide-react';

const SectorInicio = () => {
    const sections = [
        {
            title: 'Deforestación',
            description: 'Monitoreo de la pérdida de cobertura de bosques húmedos amazónicos.',
            icon: Trees,
            link: '/sector/deforestacion',
            color: 'bg-red-500'
        },
        {
            title: 'Volumen Decomisado',
            description: 'Registro de volúmenes de madera y carbón incautados por departamentos.',
            icon: Box,
            link: '/sector/decomisos',
            color: 'bg-amber-600'
        },
        {
            title: 'Especies de Flora',
            description: 'Catálogo de especies de flora decomisadas y su nivel de riesgo.',
            icon: Bird,
            link: '/sector/especies',
            color: 'bg-orange-500'
        },
        {
            title: 'Reservas de Biosfera',
            description: 'Cronología y ubicación de las Reservas de Biosfera reconocidas por UNESCO.',
            icon: Globe,
            link: '/sector/reservas',
            color: 'bg-blue-500'
        },
        {
            title: 'Áreas Sustraídas (BPP)',
            description: 'Análisis de áreas sustraídas de los Bosques de Producción Permanente.',
            icon: MapIcon,
            link: '/sector/areas',
            color: 'bg-indigo-600'
        },
        {
            title: 'Sitios Declarados',
            description: 'Inventario de Ecosistemas Frágiles y Sitios Prioritarios para la conservación.',
            icon: MapPin,
            link: '/sector/sitios',
            color: 'bg-violet-500'
        },
        {
            title: 'Mapa de Carbono',
            description: 'Stock de carbono almacenado y vocación de negocio (Mercado de Carbono).',
            icon: CloudRain,
            link: '/sector/carbono',
            color: 'bg-cyan-500'
        }
    ];

    const sources = [
        { name: 'Geobosques (MINAM)', url: 'https://geobosques.minam.gob.pe/' },
        { name: 'SERFOR (SNIFFS)', url: 'https://sniffs.serfor.gob.pe/' },
        { name: 'SERNANP', url: 'https://www.gob.pe/sernanp' },
        { name: 'UNESCO MAB', url: 'https://www.unesco.org/en/mab' }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Información del Sector</h1>
                <p className="text-gray-600 mb-4">
                    En esta sección encontrará la recopilación de información relativa al sector y los enlaces para consultar las fuentes oficiales encargadas de gestionar y publicar los datos presentados.
                </p>

                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-1">Fuentes Oficiales:</span>
                    {sources.map((src, idx) => (
                        <a
                            key={idx}
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                        >
                            {src.name}
                        </a>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map((section) => (
                    <Link
                        key={section.title}
                        to={section.link}
                        className="group bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all border border-transparent hover:border-gray-200 flex items-start gap-4"
                    >
                        <div className={`p-3 rounded-lg ${section.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                            <section.icon size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">
                                {section.title}
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {section.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SectorInicio;
