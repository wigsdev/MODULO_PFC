import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Share2, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

export default function CambioHistorico() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/cambio_historico.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading historico data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando histórico...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar cambio_historico.json</div>;

    const { kpi, metadata, timeline, regionsList } = data;

    // Formatting Helpers
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(val);

    // Color Palette for Lines
    const colors = [
        '#2563EB', '#16A34A', '#D97706', '#DC2626', '#9333EA', '#0891B2'
    ];

    return (
        <div className="space-y-3 animate-fade-in p-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="text-rose-600" size={20} />
                        {metadata.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="hidden md:inline">Actualizado: {metadata.lastUpdated}</span>
                    <div className="h-4 w-px bg-gray-200 mx-1 hidden md:block"></div>
                    <button className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                        <Share2 size={13} />
                    </button>
                    <button className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                        <Download size={13} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                {/* Left Column: Stacked KPIs */}
                <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3 content-start">

                    {/* KPI 1: Total Acumulado */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-rose-600">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Pérdida Acumulada</h3>
                            <TrendingUp size={14} className="text-rose-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-800 leading-tight">
                            {formatInt(kpi.totalAccumulated)} <span className="text-[10px] text-gray-400 font-normal">ha</span>
                        </p>
                        <p className="text-[10px] text-gray-400">Total 2001-2024</p>
                    </div>

                    {/* KPI 2: Promedio Anual */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-amber-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Promedio Anual</h3>
                            <Calendar size={14} className="text-amber-500" />
                        </div>
                        <p className="text-lg font-bold text-gray-800 leading-tight truncate">
                            {formatInt(kpi.avgYearly)} <span className="text-[10px] text-gray-400 font-normal">ha/año</span>
                        </p>
                    </div>

                    {/* KPI 3: Año Crítico */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-slate-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Año Crítico</h3>
                            <AlertTriangle size={14} className="text-slate-500" />
                        </div>
                        <p className="text-lg font-bold text-gray-800 leading-tight truncate">
                            {kpi.maxLossYear}
                        </p>
                        <p className="text-xs text-gray-500">{formatInt(kpi.maxLossValue)} ha</p>
                    </div>
                </div>

                {/* Right Column: Multi-Line Chart */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[315px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Evolución de Pérdida por Departamento (2001-2024)</h3>

                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={timeline}
                                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10, fill: '#6B7280' }}
                                        interval={1}
                                        angle={-45}
                                        textAnchor="end"
                                        height={40}
                                    />
                                    <YAxis
                                        width={45}
                                        tick={{ fill: '#4B5563', fontSize: 10 }}
                                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => formatInt(value)}
                                        contentStyle={{ fontSize: '12px' }}
                                        labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />

                                    {regionsList.map((region: string, i: number) => (
                                        <Line
                                            key={region}
                                            type="monotone"
                                            dataKey={region}
                                            stroke={colors[i % colors.length]}
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 4 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
