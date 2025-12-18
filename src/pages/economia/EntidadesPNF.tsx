import { useState, useEffect } from 'react';
import { Users, MapPin, Award, Search, Filter } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts';

interface Entidad {
    id: number;
    entidad: string;
    distrito: string;
    provincia: string;
    region: string;
    convocatoria: string;
    concurso: string;
    anio: number;
}

interface EntidadesData {
    metadata: { source: string; lastUpdated: string };
    kpi: {
        totalEntidades: number;
        topRegion: string;
        topRegionCount: number;
        anio: number;
    };
    charts: {
        byRegion: { name: string; value: number }[];
        byConcurso: { name: string; value: number }[];
    };
    lista: Entidad[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function EntidadesPNF() {
    const [data, setData] = useState<EntidadesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [regionFilter, setRegionFilter] = useState('Todas');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/entidades_pnf.json`)
            .then(res => {
                if (!res.ok) throw new Error('Error loading data');
                return res.json();
            })
            .then(setData)
            .catch(err => {
                console.error(err);
                setData(null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando información...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos.</div>;

    // Filter Logic
    const filteredList = (data.lista || []).filter(item => {
        const matchesSearch = item.entidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.provincia.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = regionFilter === 'Todas' || item.region === regionFilter;
        return matchesSearch && matchesRegion;
    });

    const regions = Array.from(new Set(data.lista.map(i => i.region)));

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Entidades Ejecutoras de Planes de Negocios</h1>
                        <p className="text-sm text-gray-500">Fuente: {data.metadata.source}</p>
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-gray-400 uppercase">Actualización</p>
                    <p className="text-sm font-medium text-gray-700">{data.metadata.lastUpdated}</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Total Entidades</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{data.kpi.totalEntidades}</h3>
                        </div>
                        <Users className="text-blue-200" size={32} />
                    </div>
                    <p className="text-xs text-blue-600 mt-2 font-medium">Año {data.kpi.anio}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Región Líder</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{data.kpi.topRegion}</h3>
                        </div>
                        <MapPin className="text-green-200" size={32} />
                    </div>
                    <p className="text-xs text-green-600 mt-2 font-medium">{data.kpi.topRegionCount} entidades registradas</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Concursos</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{data.charts.byConcurso.length}</h3>
                        </div>
                        <Award className="text-amber-200" size={32} />
                    </div>
                    <p className="text-xs text-amber-600 mt-2 font-medium">Convocatorias activas</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart - Region */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Distribución por Región</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.charts.byRegion} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" fontSize={12} />
                                <YAxis dataKey="name" type="category" width={100} fontSize={11} />
                                <Tooltip />
                                <Bar dataKey="value" name="Entidades" fill="#10B981" radius={[0, 4, 4, 0]}>
                                    {data.charts.byRegion.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - Concurso */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Por Tipo de Concurso</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.charts.byConcurso}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                >
                                    {data.charts.byConcurso.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <Users size={16} /> Directorio Detallado
                    </h3>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-2 top-2.5 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Buscar entidad o provincia..."
                                className="w-full pl-8 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-2 top-2.5 text-gray-400" size={14} />
                            <select
                                className="pl-8 pr-3 py-2 text-sm border rounded-md focus:outline-none bg-white"
                                value={regionFilter}
                                onChange={(e) => setRegionFilter(e.target.value)}
                            >
                                <option value="Todas">Todas las Regiones</option>
                                {regions.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Entidad Ejecutora</th>
                                <th className="px-6 py-3">Ubicación</th>
                                <th className="px-6 py-3">Concurso</th>
                                <th className="px-6 py-3">Convocatoria</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredList.length > 0 ? (
                                filteredList.map((item) => (
                                    <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-gray-900">
                                            {item.entidad}
                                            <span className="block text-xs text-gray-400 mt-1">ID: {item.id}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-1">
                                                <span className="font-semibold text-gray-700">{item.region}</span>
                                            </div>
                                            <span className="text-xs text-gray-500">{item.provincia}, {item.distrito}</span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-600">
                                            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-100">
                                                {item.concurso}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-xs text-gray-500">
                                            {item.convocatoria}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron resultados para la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-right text-xs text-gray-500">
                    Mostrando {filteredList.length} de {data.lista.length} entidades
                </div>
            </div>
        </div>
    );
}
