import { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Truck,
    MapPin
} from 'lucide-react';
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

interface VolumenData {
    metadata: {
        title: string;
        source: string;
        lastUpdated: string;
    };
    kpi: {
        totalVolumen: number;
        numRegiones: number;
        topRegion: string;
    };
    regions: Array<{
        region: string;
        volumen: number;
        especie: string;
        tipo: string;
        tendencia: string;
        tendenciaTexto: string;
    }>;
}

const TENDENCIA_COLORS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    'muy_alta': { bg: 'bg-green-100', text: 'text-green-700', icon: <TrendingUp size={14} /> },
    'alta': { bg: 'bg-green-50', text: 'text-green-600', icon: <TrendingUp size={14} /> },
    'media': { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: <Minus size={14} /> },
    'baja': { bg: 'bg-gray-100', text: 'text-gray-500', icon: <TrendingDown size={14} /> }
};

const TIPO_COLORS: Record<string, string> = {
    'Concesionada': '#10B981',
    'Comunitaria': '#3B82F6',
    'Privada': '#8B5CF6'
};

const VolumenMovilizado = () => {
    const [data, setData] = useState<VolumenData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/volumen_movilizado.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    // Sort regions by volume for chart
    const chartData = [...data.regions].sort((a, b) => b.volumen - a.volumen);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Truck className="text-green-600" size={24} />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Volumen Movilizado</h1>
                            <p className="text-xs text-gray-500">Fuente: {data.metadata.source}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPIs + Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                {/* Left: KPIs */}
                <div className="lg:col-span-1 space-y-3">
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Volumen Total</p>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {(data.kpi.totalVolumen / 1000).toFixed(1)}K
                                    <span className="text-sm font-normal text-gray-400 ml-1">m³</span>
                                </h3>
                            </div>
                            <Truck className="text-green-200" size={28} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Regiones</p>
                                <h3 className="text-2xl font-bold text-gray-800">{data.kpi.numRegiones}</h3>
                            </div>
                            <MapPin className="text-blue-200" size={28} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Top Región</p>
                                <h3 className="text-lg font-bold text-gray-800">{data.kpi.topRegion}</h3>
                            </div>
                            <TrendingUp className="text-indigo-200" size={28} />
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tipo de Plantación</p>
                        <div className="space-y-1">
                            {Object.entries(TIPO_COLORS).map(([tipo, color]) => (
                                <div key={tipo} className="flex items-center gap-2 text-xs">
                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
                                    <span>{tipo}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Chart */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[315px] flex flex-col">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">
                        Volumen por Región (m³)
                    </h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                                <XAxis
                                    type="number"
                                    tick={{ fontSize: 11, fill: '#6B7280' }}
                                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="region"
                                    tick={{ fontSize: 11, fill: '#6B7280' }}
                                    width={75}
                                />
                                <Tooltip
                                    formatter={(value: number) => [`${value.toLocaleString()} m³`, 'Volumen']}
                                    contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                                />
                                <Bar dataKey="volumen" radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={TIPO_COLORS[entry.tipo] || '#10B981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Detalle por Región</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2">Región</th>
                                <th className="px-3 py-2 text-right">Volumen (m³)</th>
                                <th className="px-3 py-2">Especie Principal</th>
                                <th className="px-3 py-2">Tipo</th>
                                <th className="px-3 py-2">Tendencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {chartData.map((item) => {
                                const tendenciaStyle = TENDENCIA_COLORS[item.tendencia] || TENDENCIA_COLORS['media'];
                                return (
                                    <tr key={item.region} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 font-medium text-gray-900">{item.region}</td>
                                        <td className="px-3 py-2 text-right font-bold text-green-600">
                                            {item.volumen.toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2">{item.especie}</td>
                                        <td className="px-3 py-2">
                                            <span
                                                className="px-2 py-0.5 rounded text-xs font-medium"
                                                style={{
                                                    backgroundColor: `${TIPO_COLORS[item.tipo]}20`,
                                                    color: TIPO_COLORS[item.tipo]
                                                }}
                                            >
                                                {item.tipo}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${tendenciaStyle.bg} ${tendenciaStyle.text}`}>
                                                {tendenciaStyle.icon}
                                                {item.tendenciaTexto}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VolumenMovilizado;
