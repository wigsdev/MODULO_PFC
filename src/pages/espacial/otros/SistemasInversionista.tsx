import { useState, useEffect } from 'react';
import { Info, ExternalLink, Globe, Lock, Search } from 'lucide-react';

interface Sistema {
    nombre: string;
    siglas: string;
    institucion: string;
    utilidad: string;
    tipoDato: string;
    nivelAcceso: string;
    enlace: string;
}

interface SistemasData {
    metadata: { source: string; lastUpdated: string };
    kpi: { totalSistemas: number; sistemasPublicos: number };
    sistemas: Sistema[];
    tiposDato: string[];
}

const TIPO_COLORS: Record<string, string> = {
    'Espacial (Mapas)': '#10B981',
    'Espacial / Satelital': '#059669',
    'Administrativo / Estadístico': '#3B82F6',
    'Legal / Fiscalización': '#EF4444',
    'Comercial': '#F59E0B',
    'Proyectos': '#8B5CF6',
    'Base Cartográfica': '#06B6D4',
    'Trámites': '#EC4899',
    'Agrícola': '#84CC16',
    'Tributario': '#64748B'
};

export default function SistemasInversionista() {
    const [data, setData] = useState<SistemasData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterTipo, setFilterTipo] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/espacial/sistemas_info.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const filteredSistemas = data.sistemas.filter(s => {
        const matchTipo = !filterTipo || s.tipoDato === filterTipo;
        const matchSearch = !searchText ||
            s.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            s.siglas.toLowerCase().includes(searchText.toLowerCase()) ||
            s.institucion.toLowerCase().includes(searchText.toLowerCase());
        return matchTipo && matchSearch;
    });

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <Info className="text-indigo-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Sistemas de Información para el Inversionista</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | {data.kpi.totalSistemas} sistemas</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Total Sistemas</p>
                    <h3 className="text-xl font-bold text-gray-800">{data.kpi.totalSistemas}</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Globe size={12} /> Acceso Público
                    </p>
                    <h3 className="text-xl font-bold text-green-600">{data.kpi.sistemasPublicos}</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-amber-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Lock size={12} /> Acceso Restringido
                    </p>
                    <h3 className="text-xl font-bold text-amber-600">{data.kpi.totalSistemas - data.kpi.sistemasPublicos}</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Info size={14} className="text-gray-400" />
                        <select
                            value={filterTipo}
                            onChange={(e) => setFilterTipo(e.target.value)}
                            className="text-sm border border-gray-200 rounded px-3 py-1.5"
                        >
                            <option value="">Todos los Tipos de Dato</option>
                            {data.tiposDato.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                        <Search size={14} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, siglas o institución..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="text-sm border border-gray-200 rounded px-3 py-1.5 w-full"
                        />
                    </div>
                    {(filterTipo || searchText) && (
                        <button
                            onClick={() => { setFilterTipo(''); setSearchText(''); }}
                            className="text-xs text-indigo-600 hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSistemas.map((s, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">{s.siglas}</h3>
                                <p className="text-xs text-gray-500">{s.nombre}</p>
                            </div>
                            <a
                                href={s.enlace}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-indigo-600"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{s.utilidad}</p>
                        <div className="flex flex-wrap gap-2">
                            <span
                                className="px-2 py-0.5 rounded text-[10px] font-medium"
                                style={{
                                    backgroundColor: `${TIPO_COLORS[s.tipoDato] || '#94A3B8'}20`,
                                    color: TIPO_COLORS[s.tipoDato] || '#94A3B8'
                                }}
                            >
                                {s.tipoDato}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${s.nivelAcceso.includes('Público')
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                {s.nivelAcceso.includes('Público') ? '🌐 Público' : '🔒 Restringido'}
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">{s.institucion}</p>
                    </div>
                ))}
            </div>

            {/* Full Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Directorio Completo</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2 w-20">Siglas</th>
                                <th className="px-3 py-2">Sistema</th>
                                <th className="px-3 py-2 w-24">Institución</th>
                                <th className="px-3 py-2">Utilidad para el Inversionista</th>
                                <th className="px-3 py-2 w-28">Tipo Dato</th>
                                <th className="px-3 py-2 w-20 text-center">Acceso</th>
                                <th className="px-3 py-2 w-16 text-center">Enlace</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSistemas.map((s, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-bold text-indigo-600">{s.siglas}</td>
                                    <td className="px-3 py-2">{s.nombre}</td>
                                    <td className="px-3 py-2 text-gray-500">{s.institucion}</td>
                                    <td className="px-3 py-2 text-gray-600 text-[11px]">{s.utilidad}</td>
                                    <td className="px-3 py-2">
                                        <span
                                            className="px-1.5 py-0.5 rounded text-[10px]"
                                            style={{
                                                backgroundColor: `${TIPO_COLORS[s.tipoDato] || '#94A3B8'}20`,
                                                color: TIPO_COLORS[s.tipoDato] || '#94A3B8'
                                            }}
                                        >
                                            {s.tipoDato}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        {s.nivelAcceso.includes('Público')
                                            ? <span className="text-green-600">🌐</span>
                                            : <span className="text-amber-600">🔒</span>
                                        }
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <a
                                            href={s.enlace}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800"
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

            {/* Type Legend */}
            <div className="flex justify-center gap-3 flex-wrap text-xs">
                {Object.entries(TIPO_COLORS).slice(0, 6).map(([tipo, color]) => (
                    <div key={tipo} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
                        {tipo}
                    </div>
                ))}
            </div>
        </div>
    );
}
