import { useState, useEffect } from 'react';
import { TrendingDown, Calendar, AlertTriangle } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    Cell
} from 'recharts';

interface SerieData {
    year: number;
    total: number;
    [key: string]: number;
}

interface TotalRegion {
    region: string;
    total: number;
}

interface CambioData {
    metadata: { source: string; lastUpdated: string; nota: string };
    kpi: {
        totalAcumulado: number;
        añoPico: number;
        deforestacionPico: number;
        ultimoAño: number;
        deforestacionUltimoAño: number;
        tendencia: string;
    };
    regiones: string[];
    serieHistorica: SerieData[];
    totalesPorRegion: TotalRegion[];
}

const REGION_COLORS: Record<string, string> = {
    'HUÁNUCO': '#EF4444',
    'SAN MARTÍN': '#F59E0B',
    'MADRE DE DIOS': '#10B981',
    'JUNÍN': '#3B82F6',
    'PASCO': '#8B5CF6',
    'CAJAMARCA': '#EC4899'
};

export default function CambioHistorico() {
    const [data, setData] = useState<CambioData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timestamp = new Date().getTime();
        fetch(`${import.meta.env.BASE_URL}data/espacial/cambio_historico.json?v=${timestamp}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(d => {
                console.log('🔍 [DEBUG] CambioHistorico Data Received:', d);
                console.log('🔍 [DEBUG] KPIs:', d?.kpi);
                console.log('🔍 [DEBUG] Serie:', d?.serieHistorica);
                setData(d);
            })
            .catch(err => {
                console.error('Error loading data:', err);
                setData(null); // Ensure data is null on error
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos (Verifique conexión o archivo JSON)</div>;

    const tendenciaNum = parseFloat(data?.kpi?.tendencia || '0');
    const metadata = data?.metadata || { source: '', lastUpdated: '', nota: '' };
    const regiones = data?.regiones || [];
    const serieHistorica = data?.serieHistorica || [];
    const totalesPorRegion = data?.totalesPorRegion || [];
    const activeRegions = regiones.filter(r => r !== 'ÁNCASH*');

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <TrendingDown className="text-red-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Cambio Histórico de Superficie de Bosque</h1>
                        <p className="text-xs text-gray-500">Fuente: {metadata.source} | {metadata.nota}</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Deforestación Acumulada</p>
                    <h3 className="text-xl font-bold text-red-600">
                        {((data?.kpi?.totalAcumulado || 0) / 1000000).toFixed(2)}M
                        <span className="text-sm font-normal text-gray-400 ml-1">ha</span>
                    </h3>
                    <p className="text-xs text-gray-500">2001 - 2024</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-orange-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <AlertTriangle size={12} /> Año Pico
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800">{data?.kpi?.añoPico || '-'}</h3>
                    <p className="text-xs text-orange-600">{(data?.kpi?.deforestacionPico || 0).toLocaleString()} ha</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Calendar size={12} /> Último Año ({data?.kpi?.ultimoAño || '-'})
                    </p>
                    <h3 className="text-xl font-bold text-gray-800">{(data?.kpi?.deforestacionUltimoAño || 0).toLocaleString()} ha</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-purple-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Tendencia Anual</p>
                    <h3 className={`text-2xl font-bold ${tendenciaNum >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {tendenciaNum >= 0 ? '+' : ''}{data?.kpi?.tendencia || 0}%
                    </h3>
                    <p className="text-xs text-gray-500">vs año anterior</p>
                </div>
            </div>

            {/* Line Chart - Time Series */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[400px] min-h-[400px]">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Serie Histórica de Deforestación (2001-2024)</h3>
                {serieHistorica.length > 0 ? (
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={serieHistorica} margin={{ left: 10, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                            <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                            <Tooltip
                                formatter={(v: number) => `${v.toLocaleString()} ha`}
                                labelFormatter={(label) => `Año ${label}`}
                            />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            {activeRegions.map((region) => (
                                <Line
                                    key={region}
                                    type="monotone"
                                    dataKey={region}
                                    name={region}
                                    stroke={REGION_COLORS[region] || '#94A3B8'}
                                    strokeWidth={2}
                                    dot={{ r: 2 }}
                                    activeDot={{ r: 4 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        No hay datos históricos disponibles
                    </div>
                )}
            </div>

            {/* Bar Chart - Total by Region */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[300px] min-h-[300px]">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Deforestación Acumulada por Región (2001-2024)</h3>
                {totalesPorRegion.length > 0 ? (
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={totalesPorRegion} layout="vertical" margin={{ left: 100, right: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                            <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="region" tick={{ fontSize: 11 }} width={95} />
                            <Tooltip formatter={(v: number) => `${v.toLocaleString()} ha`} />
                            <Bar dataKey="total" name="Total Acumulado" radius={[0, 4, 4, 0]}>
                                {totalesPorRegion.map((entry, index) => (
                                    <Cell key={index} fill={REGION_COLORS[entry.region] || '#94A3B8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        No hay datos acumulados disponibles
                    </div>
                )}
            </div>

            {/* Table - Last 5 years */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Últimos 5 Años - Deforestación por Región (ha)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2">Año</th>
                                {activeRegions.map(r => (
                                    <th key={r} className="px-3 py-2 text-right">{r}</th>
                                ))}
                                <th className="px-3 py-2 text-right font-bold">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {serieHistorica.slice(-5).reverse().map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-bold text-gray-900">{row.year}</td>
                                    {activeRegions.map(r => (
                                        <td key={r} className="px-3 py-2 text-right" style={{ color: REGION_COLORS[r] }}>
                                            {row[r]?.toLocaleString() || 0}
                                        </td>
                                    ))}
                                    <td className="px-3 py-2 text-right font-bold text-red-600">{row.total.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
