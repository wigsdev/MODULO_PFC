import { Link } from 'react-router-dom';
import {
    Map,
    TreePine,
    Leaf,
    Info,
    DollarSign,
    Globe,
    Database
} from 'lucide-react';

const EspacialDashboard = () => {
    const sections = [
        {
            title: 'Planificación Rural',
            description: 'Frontera agrícola, zonificación de cultivos y áreas para formalización.',
            icon: Map,
            link: '/espacial/planificacion/frontera-agricola',
            color: 'bg-blue-600'
        },
        {
            title: 'Monitoreo de Bosques',
            description: 'Superficie de bosque natural, cambios y carbono.',
            icon: TreePine,
            link: '/espacial/monitoreo/superficie-bosque',
            color: 'bg-green-600'
        },
        {
            title: 'Información Ambiental',
            description: 'Autoridades ambientales y superficies cubiertas.',
            icon: Leaf,
            link: '/espacial/ambiental/superficie-cubierta',
            color: 'bg-emerald-600'
        },
        {
            title: 'Sistema SNIFFS',
            description: 'Aprovechamientos, movilizaciones, decomisos y registros.',
            icon: Info,
            link: '/espacial/sniffs/aprovechamientos',
            color: 'bg-purple-600'
        },
        {
            title: 'Información Comercial',
            description: 'Estudios de mercado y estadísticas de producción.',
            icon: DollarSign,
            link: '/espacial/comercial/estudios-mercado',
            color: 'bg-amber-600'
        },
        {
            title: 'Otros Datos',
            description: 'Plantaciones registradas, tierras PFC y sistemas de inversión.',
            icon: Globe,
            link: '/espacial/otros/plantaciones-registradas',
            color: 'bg-slate-600'
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                            <Database size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard de Atributos Espaciales</h1>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                        En esta sección encontrará los geoportales oficiales para realizar la consulta o descarga de capas espaciales.
                        Adicionalmente, podrá acceder al geovisor diseñados para el observatorio, en los cuales podrá realizar consultas y descargar datos fuente.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <a
                        href="https://wigsdev.github.io/GEOVISOR/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-serfor-light hover:bg-[#43a047] text-white px-8 py-3 rounded font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                    >
                        <Map size={18} />
                        ACCEDER AL GEOVISOR
                    </a>
                </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map((section) => (
                    <Link
                        key={section.title}
                        to={section.link}
                        className="group bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all border border-transparent hover:border-blue-100 flex items-start gap-4"
                    >
                        <div className={`p-3 rounded-lg ${section.color} text-white shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}>
                            <section.icon size={24} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">
                                {section.title}
                            </h3>
                            <p className="text-xs text-gray-500 leading-tight">
                                {section.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default EspacialDashboard;
