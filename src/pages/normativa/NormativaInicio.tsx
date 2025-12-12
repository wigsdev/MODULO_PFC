import { Book, Gavel, Scale, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NormativaInicio() {
    const sections = [
        {
            title: 'Planificación',
            description: 'Instrumentos de gestión y planificación estratégica forestal.',
            icon: Book,
            link: '/normativa/planificacion',
            color: 'bg-blue-500'
        },
        {
            title: 'Lineamientos',
            description: 'Política Nacional Forestal y marco legislativo principal.',
            icon: Gavel,
            link: '/normativa/lineamientos',
            color: 'bg-emerald-600'
        },
        {
            title: 'Manejo',
            description: 'Normas técnicas para el manejo y aprovechamiento de PFC.',
            icon: Scale,
            link: '/normativa/manejo',
            color: 'bg-amber-500'
        },
        {
            title: 'Incentivos',
            description: 'Beneficios tributarios y programas de financiamiento.',
            icon: TrendingUp,
            link: '/normativa/incentivos',
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Marco Normativo</h1>
                <p className="text-gray-600">
                    Base legal consolidada y actualizada que rige el desarrollo de las Plantaciones Forestales Comerciales en el Perú.
                    Aquí encontrará desde la Ley Forestal (N° 29763) hasta las resoluciones técnicas específicas de SERFOR.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => (
                    <Link
                        key={section.title}
                        to={section.link}
                        className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-gray-200"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${section.color} text-white`}>
                                <section.icon size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
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

            {/* Quick Links / Resources */}
            <div className="bg-slate-800 text-white p-6 rounded-lg">
                <h3 className="font-semibold mb-4 text-lg">Enlaces Oficiales Externos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="https://www.gob.pe/serfor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        Plataforma SERFOR
                    </a>
                    <a
                        href="https://elperuano.pe/normas-legales"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        Diario El Peruano
                    </a>
                    <a
                        href="https://spij.minjus.gob.pe/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        SPIJ (Sistema Peruano de Inf. Jurídica)
                    </a>
                </div>
            </div>
        </div>
    );
}
