import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, TreePine, Filter, Search, X } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface TipoData {
    tipo: string;
    tipoFull: string;
    count: number;
    superficie: number;
}

interface DepartamentoData {
    nombre: string;
    count: number;
    superficie: number;
}

interface RecordData {
    contrato: string;
    titular: string;
    departamento: string;
    distrito: string;
    superficie: number;
    tipo: string;
    year: number;
}

interface ConcesionesData {
    metadata: { title: string; source: string; lastUpdated: string; totalRecords: number };
    kpi: { totalConcesiones: number; superficieTotal: number; topDepartamento: string };
    tiposData: TipoData[];
    departamentos: DepartamentoData[];
    records: RecordData[];
}

const TIPO_COLORS: Record<string, string> = {
    'FINES MADERABLES': '#10B981',
    'PRODUCTOS FORESTALES DIFERENTES A LA MADERA': '#3B82F6',
    'FORESTACIÓN Y/O REFORESTACIÓN': '#8B5CF6',
    'PLANTACIONES FORESTALES': '#F59E0B'
};

const getTipoLabel = (tipo: string) => {
    if (tipo.includes('MADERABLES')) return 'Maderable';
    if (tipo.includes('PRODUCTOS FORESTALES')) return 'PFDM';
    if (tipo.includes('FORESTACIÓN')) return 'Reforest.';
    if (tipo.includes('PLANTACIONES')) return 'Plantación';
    return tipo;
};

const getTipoColor = (tipo: string) => {
    if (tipo.includes('MADERABLES')) return TIPO_COLORS['FINES MADERABLES'];
    if (tipo.includes('PRODUCTOS FORESTALES')) return TIPO_COLORS['PRODUCTOS FORESTALES DIFERENTES A LA MADERA'];
    if (tipo.includes('FORESTACIÓN')) return TIPO_COLORS['FORESTACIÓN Y/O REFORESTACIÓN'];
    if (tipo.includes('PLANTACIONES')) return TIPO_COLORS['PLANTACIONES FORESTALES'];
    return '#94A3B8';
};

const Concesiones = () => {
    const [data, setData] = useState<ConcesionesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterDepartamento, setFilterDepartamento] = useState<string>('');
    const [filterTipo, setFilterTipo] = useState<string>('');
    const [filterYear, setFilterYear] = useState<string>('');
    const [searchTitular, setSearchTitular] = useState<string>('');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/concesiones.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    // Get unique years from records
    const years = useMemo(() => {
        if (!data) return [];
        const uniqueYears = [...new Set(data.records.map(r => r.year))].sort((a, b) => b - a);
        return uniqueYears;
    }, [data]);

    const filteredRecords = useMemo(() => {
        if (!data) return [];
        return data.records.filter(r => {
            const matchDepto = !filterDepartamento || r.departamento === filterDepartamento;
            const matchTipo = !filterTipo || r.tipo.toUpperCase().includes(filterTipo.toUpperCase());
            const matchYear = !filterYear || r.year === parseInt(filterYear);
            const matchSearch = !searchTitular || r.titular.toLowerCase().includes(searchTitular.toLowerCase()) || r.contrato.toLowerCase().includes(searchTitular.toLowerCase());
            return matchDepto && matchTipo && matchYear && matchSearch;
        });
    }, [data, filterDepartamento, filterTipo, filterYear, searchTitular]);

    const clearFilters = () => {
        setFilterDepartamento('');
        setFilterTipo('');
        setFilterYear('');
        setSearchTitular('');
    };

    const hasFilters = filterDepartamento || filterTipo || filterYear || searchTitular;

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-3">
                        <TreePine className="text-green-600" size={24} />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Concesiones Forestales</h1>
                            <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | {data.metadata.totalRecords.toLocaleString()} registros</p>
                        </div>
                    </div>
                    <a
                        href="https://sniffs.serfor.gob.pe/estadistica/es/tableros/titulos-habilitantes/concesiones"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        Ver Fuente Oficial <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            {/* KPIs + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1 space-y-3">
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Total Concesiones</p>
                        <h3 className="text-2xl font-bold text-gray-800">{data.kpi.totalConcesiones.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Superficie Total</p>
                        <h3 className="text-xl font-bold text-gray-800">
                            {data.kpi.superficieTotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="text-sm font-normal text-gray-400 ml-1">ha</span>
                        </h3>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Departamento Líder</p>
                        <h3 className="text-lg font-bold text-gray-800">{data.kpi.topDepartamento}</h3>
                        <p className="text-xs text-gray-500">
                            {data.departamentos.find(d => d.nombre === data.kpi.topDepartamento)?.count.toLocaleString()} concesiones
                        </p>
                    </div>

                    {/* Legend */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tipos de Concesión</p>
                        <div className="space-y-1">
                            {data.tiposData.map((t) => (
                                <div key={t.tipo} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: getTipoColor(t.tipoFull) }}></div>
                                        <span className="truncate max-w-[120px]" title={t.tipoFull}>{getTipoLabel(t.tipoFull)}</span>
                                    </div>
                                    <span className="font-medium">{t.count.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[315px] flex flex-col">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Superficie por Tipo de Concesión (ha)</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.tiposData} layout="vertical" margin={{ left: 100, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                                <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
                                <YAxis
                                    type="category"
                                    dataKey="tipoFull"
                                    tick={{ fontSize: 9 }}
                                    width={95}
                                    tickFormatter={(v) => getTipoLabel(v)}
                                />
                                <Tooltip
                                    formatter={(value: number) => [`${value.toLocaleString()} ha`, 'Superficie']}
                                />
                                <Bar dataKey="superficie" radius={[0, 4, 4, 0]}>
                                    {data.tiposData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getTipoColor(entry.tipoFull)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table with Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col gap-3 mb-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-700 uppercase">Detalle de Concesiones</h3>
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                            >
                                <X size={12} /> Limpiar filtros
                            </button>
                        )}
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-2 justify-end">
                        <Filter size={14} className="text-gray-400" />

                        {/* Search */}
                        <div className="relative">
                            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTitular}
                                onChange={(e) => setSearchTitular(e.target.value)}
                                placeholder="Buscar titular o contrato..."
                                className="text-xs border border-gray-200 rounded pl-7 pr-2 py-1 w-48 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </div>

                        {/* Departamento */}
                        <select
                            value={filterDepartamento}
                            onChange={(e) => setFilterDepartamento(e.target.value)}
                            className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="">Todos los Departamentos</option>
                            {data.departamentos.map(d => (
                                <option key={d.nombre} value={d.nombre}>{d.nombre} ({d.count})</option>
                            ))}
                        </select>

                        {/* Tipo */}
                        <select
                            value={filterTipo}
                            onChange={(e) => setFilterTipo(e.target.value)}
                            className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="">Todos los Tipos</option>
                            <option value="FINES MADERABLES">Fines Maderables</option>
                            <option value="PRODUCTOS FORESTALES DIFERENTES">PFDM (Castaña/Shiringa)</option>
                            <option value="FORESTACIÓN">Forestación/Reforestación</option>
                            <option value="PLANTACIONES FORESTALES">Plantaciones Forestales</option>
                        </select>

                        {/* Año */}
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="">Todos los Años</option>
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase sticky top-0">
                            <tr>
                                <th className="px-3 py-2">Contrato</th>
                                <th className="px-3 py-2">Titular</th>
                                <th className="px-3 py-2">Departamento</th>
                                <th className="px-3 py-2">Distrito</th>
                                <th className="px-3 py-2 text-right">Superficie (ha)</th>
                                <th className="px-3 py-2">Tipo</th>
                                <th className="px-3 py-2 text-center">Año</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRecords.slice(0, 50).map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-mono text-gray-600 text-[10px]">{r.contrato}</td>
                                    <td className="px-3 py-2 font-medium text-gray-900 max-w-[200px] truncate" title={r.titular}>{r.titular}</td>
                                    <td className="px-3 py-2">{r.departamento}</td>
                                    <td className="px-3 py-2">{r.distrito}</td>
                                    <td className="px-3 py-2 text-right font-bold text-green-600">{r.superficie.toLocaleString()}</td>
                                    <td className="px-3 py-2">
                                        <span
                                            className="px-2 py-0.5 rounded text-xs font-medium"
                                            style={{
                                                backgroundColor: `${getTipoColor(r.tipo)}20`,
                                                color: getTipoColor(r.tipo)
                                            }}
                                        >
                                            {getTipoLabel(r.tipo)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-center">{r.year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredRecords.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No se encontraron registros con los filtros seleccionados</div>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Mostrando {Math.min(50, filteredRecords.length)} de {filteredRecords.length} registros filtrados
                    {hasFilters && <span className="text-green-600 ml-2">(filtros activos)</span>}
                </p>
            </div>
        </div>
    );
};

export default Concesiones;
