import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingDown, TrendingUp, AlertTriangle, Share2 } from 'lucide-react';

export default function CambioSuperficie() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/cambio_bosque.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading cambio data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando datos de cambio...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar cambio_bosque.json</div>;

    const { kpi, metadata, regions } = data;

    // Formatting Helpers
    const formatHa = (val: number) => new Intl.NumberFormat('es-PE').format(val);
    const formatPct = (val: number) => new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 }).format(val) + '%';

    // Sort regions by Loss 2024 for better visualization
    const chartData = [...regions].sort((a, b) => b.perdida2024 - a.perdida2024);

    return (
        <div className="space-y-3 animate-fade-in p-2">
            {/* Header - Standardized */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <TrendingDown className="text-emerald-600" size={20} />
                        {metadata.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="hidden md:inline">Actualizado: {metadata.lastUpdated}</span>
                    <div className="h-4 w-px bg-gray-200 mx-1 hidden md:block"></div>
                    <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                        <Share2 size={13} />
                    </button>
                    <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                        <Download size={13} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                {/* Left Column: Stacked KPIs */}
                <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3 content-start">

                    {/* KPI 1: Pérdida 2024 */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Pérdida Total 2024</h3>
                            <TrendingDown size={14} className="text-red-500" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {formatHa(kpi.totalLoss2024)} <span className="text-[10px] text-gray-400">ha</span>
                        </p>
                    </div>

                    {/* KPI 2: Variación vs 2023 */}
                    <div className={`px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 ${kpi.variacionPct > 0 ? 'border-red-500' : 'border-emerald-500'}`}>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Variación 2023-2024</h3>
                            {kpi.variacionPct > 0 ? <TrendingUp size={14} className="text-red-500" /> : <TrendingDown size={14} className="text-emerald-500" />}
                        </div>
                        <p className={`text-xl font-bold leading-tight ${kpi.variacionPct > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {kpi.variacionPct > 0 ? '+' : ''}{formatPct(kpi.variacionPct)}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            vs {formatHa(kpi.totalLoss2023)} ha (2023)
                        </p>
                    </div>

                    {/* KPI 3: Regiones Críticas */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-amber-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Regiones Alertadas</h3>
                            <AlertTriangle size={14} className="text-amber-500" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {kpi.regionsCritical} <span className="text-xs font-normal text-gray-500">Críticas</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            {kpi.regionsReduction} en reducción
                        </p>
                    </div>
                </div>

                {/* Right Column: Comparison Chart */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[70vh] min-h-[400px]">
                        <div className="flex justify-between items-center border-b pb-1 mb-2">
                            <h3 className="text-xs font-bold text-gray-700 uppercase">Comparativo de Pérdida 2023 vs 2024 (Ha)</h3>
                            <div className="flex items-center gap-4 text-[10px] text-gray-500">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300"></div> 2023</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> 2024</div>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="region"
                                        type="category"
                                        width={90}
                                        tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 500 }}
                                        interval={0}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => formatHa(value) + ' ha'}
                                        contentStyle={{ fontSize: '12px' }}
                                        cursor={{ fill: '#F9FAFB' }}
                                        labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                                    />
                                    <Bar dataKey="perdida2023" name="2023" fill="#E5E7EB" radius={[0, 4, 4, 0]} barSize={10} />
                                    <Bar dataKey="perdida2024" name="2024" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={10} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
