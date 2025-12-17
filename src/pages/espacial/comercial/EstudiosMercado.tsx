import { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, MapPin, Search } from 'lucide-react';

interface Estudio {
    region: string;
    titulo: string;
    institucion: string;
    descripcion: string;
    enlace: string;
}

interface EstudiosData {
    metadata: { source: string; lastUpdated: string };
    kpi: { totalEstudios: number; regionesConEstudios: number };
    estudios: Estudio[];
    regiones: string[];
}

export default function EstudiosMercado() {
    const [data, setData] = useState<EstudiosData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterRegion, setFilterRegion] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/espacial/estudios_mercado.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const filteredEstudios = data.estudios.filter(e => {
        const matchRegion = !filterRegion || e.region === filterRegion;
        const matchSearch = !searchText ||
            e.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
            e.institucion.toLowerCase().includes(searchText.toLowerCase()) ||
            e.descripcion.toLowerCase().includes(searchText.toLowerCase());
        return matchRegion && matchSearch;
    });

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <BookOpen className="text-blue-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Estudios de Mercado PFC</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | {data.kpi.totalEstudios} documentos</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <select
                            value={filterRegion}
                            onChange={(e) => setFilterRegion(e.target.value)}
                            className="text-sm border border-gray-200 rounded px-3 py-1.5"
                        >
                            <option value="">Todas las Regiones</option>
                            {data.regiones.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                        <Search size={14} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por título, institución o descripción..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="text-sm border border-gray-200 rounded px-3 py-1.5 w-full"
                        />
                    </div>
                    {(filterRegion || searchText) && (
                        <button
                            onClick={() => { setFilterRegion(''); setSearchText(''); }}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">
                        Mostrando {filteredEstudios.length} de {data.estudios.length}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2 w-24">Región</th>
                                <th className="px-3 py-2">Título del Estudio</th>
                                <th className="px-3 py-2 w-32">Institución</th>
                                <th className="px-3 py-2">Descripción</th>
                                <th className="px-3 py-2 w-20 text-center">Enlace</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEstudios.map((e, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${e.region === 'NACIONAL'
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            {e.region}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 font-medium text-gray-900">{e.titulo}</td>
                                    <td className="px-3 py-2 text-gray-600">{e.institucion}</td>
                                    <td className="px-3 py-2 text-gray-500 max-w-[300px]">{e.descripcion}</td>
                                    <td className="px-3 py-2 text-center">
                                        <a
                                            href={e.enlace}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
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
