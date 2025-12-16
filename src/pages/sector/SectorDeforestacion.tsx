
import { useState, useEffect } from 'react';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Trees, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

export default function SectorDeforestacion() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/sector/deforestacion.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading sector deforestacion data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando datos de deforestación...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar deforestacion.json</div>;

    const { kpi, metadata, regionalData, historyData } = data;
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(val);

    // Calculate variations for KPI display
    const variationTotal = ((kpi.totalLoss2024 - kpi.totalLoss2023) / kpi.totalLoss2023) * 100;
    const isReduction = variationTotal < 0;

    // Get region keys for line chart (excluding 'year')
    const regionKeys = historyData.length > 0 ? Object.keys(historyData[0]).filter(k => k !== 'year') : [];
    const colors = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#6366F1'];

    return (
        <div className="space-y-4 animate-fade-in p-2">

            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Trees className="text-emerald-700" size={20} /> {metadata.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Actualizado: {metadata.lastUpdated}</span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                        Pérdida Total 2024 <AlertTriangle size={10} />
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">{formatInt(kpi.totalLoss2024)} <span className="text-xs font-normal text-gray-400">ha</span></p>
                </div>

                <div className={`px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 ${isReduction ? 'border-emerald-500' : 'border-red-500'}`}>
                    <h3 className="text-[10px] uppercase font-bold text-gray-500">Variación Nac. (2023-24)</h3>
                    <div className="flex items-center gap-2">
                        <p className={`text-2xl font-bold ${isReduction ? 'text-emerald-600' : 'text-red-600'}`}>
                            {variationTotal > 0 ? '+' : ''}{variationTotal.toFixed(1)}%
                        </p>
                        {isReduction ? <TrendingDown size={20} className="text-emerald-500" /> : <TrendingUp size={20} className="text-red-500" />}
                    </div>
                </div>

                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-amber-500">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500">Región Más Crítica 2024</h3>
                    <p className="text-lg font-bold text-gray-800 truncate" title={kpi.maxLossRegion}>{kpi.maxLossRegion}</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                {/* 1. Bar Chart: 2023 vs 2024 */}
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[350px]">
                    <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Comparativo 2023 vs 2024 por Región</h3>
                    <div className="flex-1 w-full text-xs min-h-0 relative overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={regionalData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="region" interval={0} angle={-30} textAnchor="end" height={60} tick={{ fontSize: 9 }} />
                                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} fontSize={10} width={30} />
                                <Tooltip formatter={(value) => formatInt(Number(value))} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Bar dataKey="loss2023" name="2023" fill="#9CA3AF" barSize={12} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="loss2024" name="2024" fill="#EF4444" barSize={12} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Line Chart: Historical Trend */}
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[350px]">
                    <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Evolución Histórica (2001 - 2024)</h3>
                    <div className="flex-1 w-full text-xs min-h-0 relative overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="year" fontSize={10} />
                                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} fontSize={10} width={30} />
                                <Tooltip formatter={(value) => formatInt(Number(value))} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                {regionKeys.map((region, idx) => (
                                    <Line
                                        key={region}
                                        type="monotone"
                                        dataKey={region}
                                        name={region}
                                        stroke={colors[idx % colors.length]}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table Detail */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-700 uppercase">Detalle Regional de Deforestación</h3>
                    <span className="text-[10px] text-gray-500">Ordenado por Pérdida 2024</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-4 py-2">Región</th>
                                <th className="px-4 py-2 text-right">Pérdida 2023 (ha)</th>
                                <th className="px-4 py-2 text-right">Pérdida 2024 (ha)</th>
                                <th className="px-4 py-2 text-center">Variación</th>
                                <th className="px-4 py-2">Tendencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {regionalData.map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="px-4 py-2 font-medium text-gray-700">{row.region}</td>
                                    <td className="px-4 py-2 text-right">{formatInt(row.loss2023)}</td>
                                    <td className="px-4 py-2 text-right font-bold text-gray-800">{formatInt(row.loss2024)}</td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`inline-block px-1.5 py-0.5 rounded ${(row.variation && String(row.variation).includes('-')) ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {row.variation || '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-1.5">
                                            {/* Parse the circle emoji manually if needed, or just display string */}
                                            {row.trend.includes('🔴') && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                                            {row.trend.includes('🟠') && <span className="w-2 h-2 rounded-full bg-orange-500"></span>}
                                            {row.trend.includes('🟢') && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                                            {row.trend.includes('⚪') && <span className="w-2 h-2 rounded-full bg-gray-300"></span>}
                                            <span className="text-gray-600">{row.trend.replace(/🔴|🟠|🟢|⚪/g, '').trim()}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
