import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, Search } from 'lucide-react';

interface Boletin {
    nombre: string;
    institucion: string;
    frecuencia: string;
    tematica: string;
    enlace: string;
}

interface BoletinesData {
    metadata: { source: string; lastUpdated: string };
    kpi: { totalBoletines: number };
    boletines: Boletin[];
    frecuencias: string[];
}

const FRECUENCIA_COLORS: Record<string, string> = {
    'Diaria': '#EF4444',
    'Mensual': '#3B82F6',
    'Trimestral': '#10B981',
    'Anual': '#8B5CF6',
    'Variable': '#F59E0B'
};

export default function BoletinesComerciales() {
    const [data, setData] = useState<BoletinesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterFrecuencia, setFilterFrecuencia] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/espacial/boletines_comerciales.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const filteredBoletines = data.boletines.filter(b => {
        const matchFrecuencia = !filterFrecuencia || b.frecuencia === filterFrecuencia;
        const matchSearch = !searchText ||
            b.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            b.institucion.toLowerCase().includes(searchText.toLowerCase()) ||
            b.tematica.toLowerCase().includes(searchText.toLowerCase());
        return matchFrecuencia && matchSearch;
    });

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <Newspaper className="text-purple-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Boletines Comerciales</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | {data.kpi.totalBoletines} fuentes</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <select
                            value={filterFrecuencia}
                            onChange={(e) => setFilterFrecuencia(e.target.value)}
                            className="text-sm border border-gray-200 rounded px-3 py-1.5"
                        >
                            <option value="">Todas las Frecuencias</option>
                            {data.frecuencias.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                        <Search size={14} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, institución o temática..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="text-sm border border-gray-200 rounded px-3 py-1.5 w-full"
                        />
                    </div>
                    {(filterFrecuencia || searchText) && (
                        <button
                            onClick={() => { setFilterFrecuencia(''); setSearchText(''); }}
                            className="text-xs text-purple-600 hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2">Nombre del Boletín</th>
                                <th className="px-3 py-2 w-32">Institución</th>
                                <th className="px-3 py-2 w-24 text-center">Frecuencia</th>
                                <th className="px-3 py-2">Temática Principal</th>
                                <th className="px-3 py-2 w-20 text-center">Enlace</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBoletines.map((b, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium text-gray-900">{b.nombre}</td>
                                    <td className="px-3 py-2 text-gray-600">{b.institucion}</td>
                                    <td className="px-3 py-2 text-center">
                                        <span
                                            className="px-2 py-0.5 rounded text-xs font-medium"
                                            style={{
                                                backgroundColor: `${FRECUENCIA_COLORS[b.frecuencia] || '#94A3B8'}20`,
                                                color: FRECUENCIA_COLORS[b.frecuencia] || '#94A3B8'
                                            }}
                                        >
                                            {b.frecuencia}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-gray-500">{b.tematica}</td>
                                    <td className="px-3 py-2 text-center">
                                        <a
                                            href={b.enlace}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800"
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

            {/* Frecuencia Legend */}
            <div className="flex justify-center gap-4 text-xs">
                {Object.entries(FRECUENCIA_COLORS).map(([freq, color]) => (
                    <div key={freq} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
                        {freq}
                    </div>
                ))}
            </div>
        </div>
    );
}
