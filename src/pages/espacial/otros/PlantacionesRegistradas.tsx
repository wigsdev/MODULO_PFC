import { useState, useEffect } from 'react';
import { TreePine, MapPin, User, Search, TrendingUp, Layers } from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface Registro {
    anio: number;
    certificado: string;
    titular: string;
    tipoPersona: string;
    regimen: string;
    finalidad: string;
    departamento: string;
    provincia: string;
    distrito: string;
    area: number;
}

interface RegistroData {
    metadata: { source: string; lastUpdated: string };
    kpi: {
        totalRegistros: number;
        totalArea: number;
        topDepartamento: string;
        promedioAreaPorRegistro: number;
    };
    registros: Registro[];
    porAnio: { year: number; count: number }[];
    porDepartamento: { departamento: string; count: number; area: number }[];
    porTipoPersona: { tipo: string; count: number }[];
    departamentos: string[];
    anios: number[];
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function PlantacionesRegistradas() {
    const [data, setData] = useState<RegistroData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterDep, setFilterDep] = useState<string>('');
    const [filterAnio, setFilterAnio] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/espacial/registro_pfc.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const filteredRegistros = data.registros.filter(r => {
        const matchDep = !filterDep || r.departamento === filterDep;
        const matchAnio = !filterAnio || r.anio === parseInt(filterAnio);
        const matchSearch = !searchText ||
            r.titular.toLowerCase().includes(searchText.toLowerCase()) ||
            r.certificado.toLowerCase().includes(searchText.toLowerCase());
        return matchDep && matchAnio && matchSearch;
    });

    const totalPages = Math.ceil(filteredRegistros.length / itemsPerPage);
    const paginatedRegistros = filteredRegistros.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <TreePine className="text-green-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Registro de Plantaciones PFC</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | {data.kpi.totalRegistros.toLocaleString()} registros</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Total Registros</p>
                    <h3 className="text-xl font-bold text-gray-800">{data.kpi.totalRegistros.toLocaleString()}</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Área Total</p>
                    <h3 className="text-xl font-bold text-blue-600">{data.kpi.totalArea.toLocaleString()} ha</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-amber-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Promedio por Registro</p>
                    <h3 className="text-xl font-bold text-amber-600">{data.kpi.promedioAreaPorRegistro} ha</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-purple-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Top Departamento</p>
                    <h3 className="text-lg font-bold text-purple-600">{data.kpi.topDepartamento}</h3>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Line Chart - Registros por Año */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[260px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
                        <TrendingUp size={14} /> Registros por Año
                    </h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={data.porAnio} margin={{ left: 0, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Registros" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart - Top Departamentos */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[260px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
                        <Layers size={14} /> Top 8 Departamentos
                    </h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={data.porDepartamento.slice(0, 8)} layout="vertical" margin={{ left: 60, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                            <XAxis type="number" tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="departamento" tick={{ fontSize: 9 }} width={55} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Registros" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart - Tipo Persona */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[260px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
                        <User size={14} /> Por Tipo de Persona
                    </h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={data.porTipoPersona}
                                dataKey="count"
                                nameKey="tipo"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                label={({ tipo, percent }) => `${tipo.substring(0, 10)}... ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {data.porTipoPersona.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <select
                            value={filterDep}
                            onChange={(e) => { setFilterDep(e.target.value); setCurrentPage(1); }}
                            className="text-sm border border-gray-200 rounded px-3 py-1.5"
                        >
                            <option value="">Todos los Departamentos</option>
                            {data.departamentos.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <select
                        value={filterAnio}
                        onChange={(e) => { setFilterAnio(e.target.value); setCurrentPage(1); }}
                        className="text-sm border border-gray-200 rounded px-3 py-1.5"
                    >
                        <option value="">Todos los Años</option>
                        {data.anios.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                        <Search size={14} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por titular o certificado..."
                            value={searchText}
                            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                            className="text-sm border border-gray-200 rounded px-3 py-1.5 w-full"
                        />
                    </div>
                    {(filterDep || filterAnio || searchText) && (
                        <button
                            onClick={() => { setFilterDep(''); setFilterAnio(''); setSearchText(''); setCurrentPage(1); }}
                            className="text-xs text-green-600 hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">
                        {filteredRegistros.length.toLocaleString()} de {data.registros.length.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-2 py-2 w-16">Año</th>
                                <th className="px-2 py-2">Certificado</th>
                                <th className="px-2 py-2">Titular</th>
                                <th className="px-2 py-2 w-24">Tipo</th>
                                <th className="px-2 py-2">Departamento</th>
                                <th className="px-2 py-2">Provincia</th>
                                <th className="px-2 py-2 text-right">Área (ha)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedRegistros.map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-2 py-1.5 font-medium">{r.anio}</td>
                                    <td className="px-2 py-1.5 text-gray-600 text-[10px]">{r.certificado}</td>
                                    <td className="px-2 py-1.5">{r.titular}</td>
                                    <td className="px-2 py-1.5">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${r.tipoPersona.includes('NATURAL') ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {r.tipoPersona.includes('NATURAL') ? 'Natural' : 'Jurídica'}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1.5">{r.departamento}</td>
                                    <td className="px-2 py-1.5 text-gray-500">{r.provincia}</td>
                                    <td className="px-2 py-1.5 text-right font-bold text-green-600">{r.area.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-xs bg-gray-100 rounded disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="px-3 py-1 text-xs">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-xs bg-gray-100 rounded disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
