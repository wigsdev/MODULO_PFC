import { useState, useEffect } from 'react';
import { Map, Layers, TreePine, Shield, Search } from 'lucide-react';
import {
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

interface Tierra {
    aptitud: string;
    departamento: string;
    provincia: string;
    distrito: string;
    superficie: number;
}

interface TierrasData {
    metadata: { source: string; lastUpdated: string };
    kpi: {
        superficieTotal: number;
        superficieForestalProductivo: number;
        porcentajeForestalProductivo: number;
        superficieProteccion: number;
        porcentajeProteccion: number;
        topDepartamento: string;
    };
    tierras: Tierra[];
    porAptitud: { aptitud: string; superficie: number }[];
    porDepartamento: { departamento: string; total: number }[];
    aptitudes: string[];
    departamentos: string[];
}

const APTITUD_COLORS: Record<string, string> = {
    'FORESTAL PRODUCTIVO': '#10B981',
    'PROTECCION': '#3B82F6',
    'AGRICOLA': '#F59E0B',
    'PECUARIO': '#8B5CF6',
    'OTROS / SIN CLASIFICAR': '#94A3B8'
};

export default function TierrasPFC() {
    const [data, setData] = useState<TierrasData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterAptitud, setFilterAptitud] = useState<string>('');
    const [filterDep, setFilterDep] = useState<string>('');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/espacial/tierras_pfc.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const filteredTierras = data.tierras.filter(t => {
        const matchAptitud = !filterAptitud || t.aptitud === filterAptitud;
        const matchDep = !filterDep || t.departamento === filterDep;
        return matchAptitud && matchDep;
    });

    const formatNumber = (n: number) => {
        if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
        if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
        return n.toLocaleString();
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <Map className="text-amber-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Tierras para Plantaciones PFC</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | {data.tierras.length.toLocaleString()} registros</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-amber-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Layers size={12} /> Superficie Total
                    </p>
                    <h3 className="text-xl font-bold text-gray-800">{formatNumber(data.kpi.superficieTotal)} ha</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <TreePine size={12} /> Forestal Productivo
                    </p>
                    <h3 className="text-xl font-bold text-green-600">{formatNumber(data.kpi.superficieForestalProductivo)} ha</h3>
                    <p className="text-xs text-gray-500">{data.kpi.porcentajeForestalProductivo}% del total</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Shield size={12} /> Protección
                    </p>
                    <h3 className="text-xl font-bold text-blue-600">{formatNumber(data.kpi.superficieProteccion)} ha</h3>
                    <p className="text-xs text-gray-500">{data.kpi.porcentajeProteccion}% del total</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-purple-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Top Departamento</p>
                    <h3 className="text-lg font-bold text-purple-600">{data.kpi.topDepartamento}</h3>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Pie Chart - Por Aptitud */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[300px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Distribución por Aptitud</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={data.porAptitud}
                                dataKey="superficie"
                                nameKey="aptitud"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label={({ aptitud, percent }) => `${aptitud.substring(0, 12)}... ${(percent * 100).toFixed(1)}%`}
                                labelLine={false}
                            >
                                {data.porAptitud.map((entry, index) => (
                                    <Cell key={index} fill={APTITUD_COLORS[entry.aptitud] || '#94A3B8'} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: number) => `${formatNumber(v)} ha`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart - Top Departamentos */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[300px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Top 10 Departamentos (Superficie)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={data.porDepartamento.slice(0, 10)} layout="vertical" margin={{ left: 80, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                            <XAxis type="number" tickFormatter={(v) => formatNumber(v)} tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="departamento" tick={{ fontSize: 10 }} width={75} />
                            <Tooltip formatter={(v: number) => `${formatNumber(v)} ha`} />
                            <Bar dataKey="total" fill="#F59E0B" radius={[0, 4, 4, 0]} name="Superficie (ha)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Layers size={14} className="text-gray-400" />
                        <select
                            value={filterAptitud}
                            onChange={(e) => setFilterAptitud(e.target.value)}
                            className="text-sm border border-gray-200 rounded px-3 py-1.5"
                        >
                            <option value="">Todas las Aptitudes</option>
                            {data.aptitudes.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Search size={14} className="text-gray-400" />
                        <select
                            value={filterDep}
                            onChange={(e) => setFilterDep(e.target.value)}
                            className="text-sm border border-gray-200 rounded px-3 py-1.5"
                        >
                            <option value="">Todos los Departamentos</option>
                            {data.departamentos.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    {(filterAptitud || filterDep) && (
                        <button
                            onClick={() => { setFilterAptitud(''); setFilterDep(''); }}
                            className="text-xs text-amber-600 hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">
                        {filteredTierras.length.toLocaleString()} registros
                    </span>
                </div>
            </div>

            {/* Summary Table by Aptitud */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Resumen por Aptitud</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2">Aptitud</th>
                                <th className="px-3 py-2 text-right">Superficie (ha)</th>
                                <th className="px-3 py-2 text-right">% del Total</th>
                                <th className="px-3 py-2">Indicador</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.porAptitud.map((a, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded"
                                                style={{ backgroundColor: APTITUD_COLORS[a.aptitud] || '#94A3B8' }}
                                            ></div>
                                            {a.aptitud}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-right font-bold">{a.superficie.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right text-gray-500">
                                        {((a.superficie / data.kpi.superficieTotal) * 100).toFixed(1)}%
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full"
                                                style={{
                                                    width: `${(a.superficie / data.kpi.superficieTotal) * 100}%`,
                                                    backgroundColor: APTITUD_COLORS[a.aptitud] || '#94A3B8'
                                                }}
                                            ></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Aptitud Legend */}
            <div className="flex justify-center gap-4 text-xs flex-wrap">
                {Object.entries(APTITUD_COLORS).map(([apt, color]) => (
                    <div key={apt} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
                        {apt}
                    </div>
                ))}
            </div>
        </div>
    );
}
