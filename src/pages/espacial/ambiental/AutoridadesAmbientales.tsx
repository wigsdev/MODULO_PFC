import { useState, useEffect } from 'react';
import { Building2, ExternalLink, Globe, MapPin } from 'lucide-react';

interface Entidad {
    nivel: string;
    entidad: string;
    siglas: string;
    funcion: string;
    ambito: string;
    enlace: string;
}

interface AutoridadesData {
    metadata: { source: string; lastUpdated: string };
    kpi: {
        totalEntidades: number;
        nacionales: number;
        regionales: number;
    };
    byNivel: {
        nacional: Entidad[];
        regional: Entidad[];
    };
}

export default function AutoridadesAmbientales() {
    const [data, setData] = useState<AutoridadesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterNivel, setFilterNivel] = useState<string>('');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/espacial/autoridades_ambientales.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    // Defensive check: ensure byNivel exists, otherwise use empty arrays
    const nacional = data?.byNivel?.nacional || [];
    const regional = data?.byNivel?.regional || [];
    const allEntidades = [...nacional, ...regional];

    const filteredEntidades = filterNivel
        ? allEntidades.filter(e => e.nivel === filterNivel)
        : allEntidades;

    // Defensive check for KPIs
    const kpi = data?.kpi || { totalEntidades: 0, nacionales: 0, regionales: 0 };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <Building2 className="text-blue-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Autoridades Ambientales</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source}</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Total Entidades</p>
                    <h3 className="text-2xl font-bold text-gray-800">{kpi.totalEntidades}</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Globe size={12} /> Nivel Nacional
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800">{kpi.nacionales}</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <MapPin size={12} /> Nivel Regional
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800">{kpi.regionales}</h3>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-700 uppercase">Directorio de Entidades</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterNivel('')}
                            className={`px-3 py-1 text-xs rounded-full ${!filterNivel ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setFilterNivel('NACIONAL')}
                            className={`px-3 py-1 text-xs rounded-full ${filterNivel === 'NACIONAL' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Nacional
                        </button>
                        <button
                            onClick={() => setFilterNivel('REGIONAL')}
                            className={`px-3 py-1 text-xs rounded-full ${filterNivel === 'REGIONAL' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Regional
                        </button>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEntidades.map((e, idx) => (
                        <div key={idx} className={`rounded-lg border p-4 hover:shadow-md transition-shadow ${e.nivel === 'NACIONAL' ? 'bg-indigo-50 border-indigo-200' : 'bg-green-50 border-green-200'
                            }`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${e.nivel === 'NACIONAL' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {e.nivel}
                                </span>
                                <span className="text-xs text-gray-500">{e.ambito}</span>
                            </div>
                            <h4 className="font-bold text-gray-800 text-sm mb-1">{e.siglas}</h4>
                            <p className="text-xs text-gray-600 mb-2">{e.entidad}</p>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{e.funcion}</p>
                            <a
                                href={e.enlace}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 text-xs font-medium hover:underline ${e.nivel === 'NACIONAL' ? 'text-indigo-600' : 'text-green-600'
                                    }`}
                            >
                                Visitar sitio <ExternalLink size={10} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Full Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Vista Detallada</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2">Nivel</th>
                                <th className="px-3 py-2">Siglas</th>
                                <th className="px-3 py-2">Entidad</th>
                                <th className="px-3 py-2">Función Principal</th>
                                <th className="px-3 py-2">Ámbito</th>
                                <th className="px-3 py-2 text-center">Enlace</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEntidades.map((e, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${e.nivel === 'NACIONAL' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {e.nivel}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 font-bold text-gray-900">{e.siglas}</td>
                                    <td className="px-3 py-2 text-gray-700 max-w-[200px]">{e.entidad}</td>
                                    <td className="px-3 py-2 text-gray-600 max-w-[250px]">{e.funcion}</td>
                                    <td className="px-3 py-2 text-gray-500">{e.ambito}</td>
                                    <td className="px-3 py-2 text-center">
                                        <a
                                            href={e.enlace}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
