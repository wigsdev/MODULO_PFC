import { useState, useEffect } from 'react';
import { Activity, MapPin, TrendingUp } from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from 'recharts';

interface SerieData {
    year: number;
    produccionTotal: number;
    produccionIndustrial: number;
    importaciones: number;
    exportaciones: number;
    consumoTotal: number;
    consumoIndustrial: number;
    poblacion: number;
    perCapitaTotal: number;
    perCapitaIndustrial: number;
}

interface RegionData {
    region: string;
    consumoTotal: number;
    poblacion: number;
    pbiRegional: number;
    perCapita: number;
    intensidad: number;
    tipoConsumo: string;
}

interface IntensidadData {
    metadata: { source: string; lastUpdated: string };
    kpi: { consumoPerCapita: number; consumoIndustrialPerCapita: number; consumoTotal: number; yearActual: number };
    serieHistorica: SerieData[];
    regiones?: RegionData[];
}

const TIPO_COLORS: Record<string, string> = {
    'ENERGETICO': '#F59E0B',
    'INDUSTRIAL': '#3B82F6',
    'MIXTO': '#8B5CF6'
};

const ConsumoIntensidad = () => {
    const [data, setData] = useState<IntensidadData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/intensidad_uso.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <Activity className="text-purple-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Intensidad de Uso</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | Consumo per cápita y regional</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-purple-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Consumo Per Cápita Total</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                        {data.kpi.consumoPerCapita.toFixed(3)}
                        <span className="text-sm font-normal text-gray-400 ml-1">m³/hab</span>
                    </h3>
                    <p className="text-xs text-gray-500">{data.kpi.yearActual}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Per Cápita Industrial</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                        {data.kpi.consumoIndustrialPerCapita.toFixed(3)}
                        <span className="text-sm font-normal text-gray-400 ml-1">m³/hab</span>
                    </h3>
                    <p className="text-xs text-blue-600">Solo madera industrial</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Consumo Total Nacional</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        {(data.kpi.consumoTotal / 1000000).toFixed(2)}M
                        <span className="text-sm font-normal text-gray-400 ml-1">m³</span>
                    </h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-orange-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Regiones Analizadas</p>
                    <h3 className="text-2xl font-bold text-gray-800">{data.regiones?.length || 7}</h3>
                    <p className="text-xs text-gray-500">Ámbito PI1</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Line Chart - Historical Series */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[320px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
                        <TrendingUp size={14} /> Evolución del Consumo Per Cápita (2020-2024)
                    </h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={data.serieHistorica} margin={{ left: 10, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} domain={[0, 0.35]} tickFormatter={(v) => v.toFixed(2)} />
                            <Tooltip formatter={(v: number) => v.toFixed(3) + ' m³/hab'} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="perCapitaTotal"
                                name="Total"
                                stroke="#8B5CF6"
                                strokeWidth={3}
                                dot={{ fill: '#8B5CF6', r: 5 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="perCapitaIndustrial"
                                name="Industrial"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                dot={{ fill: '#3B82F6', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart - Regional Intensity */}
                {data.regiones && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[320px]">
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">
                            Intensidad de Uso Regional (m³/Millón PBI)
                        </h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={data.regiones.sort((a, b) => b.intensidad - a.intensidad)} layout="vertical" margin={{ left: 80, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                                <XAxis type="number" tick={{ fontSize: 11 }} />
                                <YAxis type="category" dataKey="region" tick={{ fontSize: 10 }} width={75} />
                                <Tooltip formatter={(v: number) => v.toFixed(2) + ' m³/Mill. PBI'} />
                                <Bar dataKey="intensidad" radius={[0, 4, 4, 0]}>
                                    {data.regiones.map((entry, index) => (
                                        <Cell key={index} fill={TIPO_COLORS[entry.tipoConsumo] || '#94A3B8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 text-xs -mt-2">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-400 rounded"></div>Energético</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded"></div>Industrial</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded"></div>Mixto</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Historical Data Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Serie Histórica Nacional</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2">Año</th>
                                <th className="px-3 py-2 text-right">Producción Total (m³)</th>
                                <th className="px-3 py-2 text-right">Producción Industrial (m³)</th>
                                <th className="px-3 py-2 text-right">Consumo Total (m³)</th>
                                <th className="px-3 py-2 text-right">Población</th>
                                <th className="px-3 py-2 text-right">Per Cápita Total</th>
                                <th className="px-3 py-2 text-right">Per Cápita Industrial</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.serieHistorica.map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-bold text-gray-900">{r.year}</td>
                                    <td className="px-3 py-2 text-right">{r.produccionTotal.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right text-blue-600">{r.produccionIndustrial.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right font-bold">{r.consumoTotal.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right text-gray-500">{r.poblacion.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right font-bold text-purple-600">{r.perCapitaTotal.toFixed(3)}</td>
                                    <td className="px-3 py-2 text-right text-blue-600">{r.perCapitaIndustrial.toFixed(3)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Regional Table */}
            {data.regiones && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Intensidad de Uso por Región</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                                <tr>
                                    <th className="px-3 py-2"><MapPin size={12} className="inline mr-1" />Región</th>
                                    <th className="px-3 py-2 text-right">Consumo Total (m³)</th>
                                    <th className="px-3 py-2 text-right">Población</th>
                                    <th className="px-3 py-2 text-right">PBI Regional (Mill. S/.)</th>
                                    <th className="px-3 py-2 text-right">Per Cápita (m³/hab)</th>
                                    <th className="px-3 py-2 text-right">Intensidad (m³/Mill. PBI)</th>
                                    <th className="px-3 py-2 text-center">Tipo Consumo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.regiones.map((r, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 font-medium text-gray-900">{r.region}</td>
                                        <td className="px-3 py-2 text-right">{r.consumoTotal.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-right text-gray-500">{r.poblacion.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-right">{r.pbiRegional.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-right font-bold text-purple-600">{r.perCapita.toFixed(3)}</td>
                                        <td className="px-3 py-2 text-right font-bold text-green-600">{r.intensidad.toFixed(2)}</td>
                                        <td className="px-3 py-2 text-center">
                                            <span
                                                className="px-2 py-0.5 rounded text-xs font-medium"
                                                style={{
                                                    backgroundColor: `${TIPO_COLORS[r.tipoConsumo] || '#94A3B8'}20`,
                                                    color: TIPO_COLORS[r.tipoConsumo] || '#94A3B8'
                                                }}
                                            >
                                                {r.tipoConsumo}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsumoIntensidad;
