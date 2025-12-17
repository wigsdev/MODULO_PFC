import { useState, useEffect } from 'react';
import { MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface GradoMercado {
    grado: string;
    superficie: number;
    porcentaje: string;
}

interface Provincia {
    nombre: string;
    superficie: number;
    registros: number;
}

interface TopDistrito {
    provincia: string;
    distrito: string;
    superficie: number;
}

interface SusceptibilidadData {
    metadata: { source: string; lastUpdated: string; departamento: string };
    kpi: {
        superficieTotal: number;
        totalRegistros: number;
        superficieAlta: number;
        superficieMedia: number;
        provinciaLider: string;
    };
    gradoMercado: GradoMercado[];
    provincias: Provincia[];
    topDistritos: TopDistrito[];
}

const GRADO_COLORS: Record<string, string> = {
    'OPTIMA': '#10B981',
    'ALTO POTENCIAL': '#3B82F6',
    'RIESGO / BAJA': '#EF4444'
};

export default function ZonasSusceptibles() {
    const [data, setData] = useState<SusceptibilidadData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/espacial/susceptibilidad.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const pctAlta = ((data.kpi.superficieAlta / data.kpi.superficieTotal) * 100).toFixed(1);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <TrendingUp className="text-green-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Zonas Susceptibles de Mercado</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | {data.metadata.departamento}</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Superficie Total Analizada</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        {data.kpi.superficieTotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-gray-400 ml-1">ha</span>
                    </h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Acceso Alto</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        {data.kpi.superficieAlta.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-gray-400 ml-1">ha</span>
                    </h3>
                    <p className="text-xs text-green-600">{pctAlta}% del total</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-purple-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Registros Analizados</p>
                    <h3 className="text-2xl font-bold text-gray-800">{data.kpi.totalRegistros.toLocaleString()}</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Provincia Líder</p>
                    <h3 className="text-lg font-bold text-gray-800">{data.kpi.provinciaLider}</h3>
                    <p className="text-xs text-gray-500">Mayor superficie</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Pie Chart - Grado de Mercado */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[320px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Distribución por Grado de Mercado</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                            <Pie
                                data={data.gradoMercado as any[]}
                                cx="50%"
                                cy="45%"
                                outerRadius={80}
                                dataKey="superficie"
                                nameKey="grado"
                                label={({ name, percent }) => `${String(name || '').split(' ')[0]}: ${((percent || 0) * 100).toFixed(1)}%`}
                                labelLine={false}
                            >
                                {data.gradoMercado.map((entry, index) => (
                                    <Cell key={index} fill={GRADO_COLORS[entry.grado] || '#94A3B8'} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: number) => `${v.toLocaleString()} ha`} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div>Óptima</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded"></div>Alto Potencial</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div>Riesgo/Baja</div>
                    </div>
                </div>

                {/* Bar Chart - Top Distritos */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[320px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Top 10 Distritos por Superficie (ha)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={data.topDistritos.slice(0, 10)} layout="vertical" margin={{ left: 100, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                            <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="distrito" tick={{ fontSize: 9 }} width={95} />
                            <Tooltip formatter={(v: number) => `${v.toLocaleString()} ha`} />
                            <Bar dataKey="superficie" fill="#10B981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Provincias Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Superficie por Provincia</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2"><MapPin size={12} className="inline mr-1" />Provincia</th>
                                <th className="px-3 py-2 text-right">Superficie (ha)</th>
                                <th className="px-3 py-2 text-right">Registros</th>
                                <th className="px-3 py-2 text-right">% del Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.provincias.map((p, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium text-gray-900">{p.nombre}</td>
                                    <td className="px-3 py-2 text-right font-bold text-green-600">{p.superficie.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-3 py-2 text-right">{p.registros.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right">
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                                            {((p.superficie / data.kpi.superficieTotal) * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Grado de Mercado Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.gradoMercado.map((g, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            {g.grado === 'RIESGO / BAJA' ? (
                                <AlertTriangle className="text-red-500" size={18} />
                            ) : (
                                <TrendingUp className={g.grado === 'OPTIMA' ? 'text-green-500' : 'text-blue-500'} size={18} />
                            )}
                            <h4 className="font-bold text-gray-800">{g.grado}</h4>
                        </div>
                        <p className="text-2xl font-bold" style={{ color: GRADO_COLORS[g.grado] || '#374151' }}>
                            {g.superficie.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha
                        </p>
                        <p className="text-xs text-gray-500">{g.porcentaje}% del total analizado</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
