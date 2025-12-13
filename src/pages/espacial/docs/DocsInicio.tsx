import { BookOpen, ShieldCheck, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DocsInicio() {
    const sections = [
        {
            title: 'Manuales Técnicos',
            description: 'Guías detalladas para la interpretación y uso de la información espacial.',
            icon: BookOpen,
            link: '/espacial/docs/manuales',
            color: 'bg-blue-500'
        },
        {
            title: 'Protocolos',
            description: 'Estándares de interoperabilidad y WMS para el intercambio de datos.',
            icon: ShieldCheck,
            link: '/espacial/docs/protocolos',
            color: 'bg-emerald-600'
        },
        {
            title: 'Otros Documentos',
            description: 'Documentación complementaria, fichas técnicas y reportes.',
            icon: FolderOpen,
            link: '/espacial/docs/otros',
            color: 'bg-amber-500'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Documentación Técnica Espacial</h1>
                <p className="text-gray-600">
                    Centro de recursos técnicos del componente espacial. Aquí encontrará manuales de usuario,
                    diccionarios de datos y protocolos de intercambio de información estandarizados.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                    <Link
                        key={section.title}
                        to={section.link}
                        className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-gray-200"
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className={`p-4 rounded-full ${section.color} text-white`}>
                                <section.icon size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {section.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {section.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">¿Necesita ayuda adicional?</h3>
                <p className="text-slate-600 text-sm">
                    Si no encuentra la documentación que busca, puede consultar el
                    <a href="https://geo.serfor.gob.pe/geoserfor/" target="_blank" rel="noopener noreferrer" className="text-serfor font-medium hover:underline ml-1">
                        Metadato Oficial de GEOSERFOR
                    </a>.
                </p>
            </div>
        </div>
    );
}
