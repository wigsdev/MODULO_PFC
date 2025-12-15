import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Share2, ClipboardList, Leaf, Scale, Database } from 'lucide-react';

export default function IndicadoresBosque() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/indicadores_bosque.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading indicadores data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando indicadores...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar indicadores_bosque.json</div>;

    const { kpi, metadata, ecozones, regions } = data;

    // Formatting Helpers
    const formatDec = (val: number) => new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 }).format(val);

    return (
        <div className="space-y-3 animate-fade-in p-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <ClipboardList className="text-emerald-600" size={20} />
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

                    {/* KPI 1: Carbono */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Promedio Carbono</h3>
                            <Leaf size={14} className="text-emerald-500" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {formatDec(kpi.avgCarbon)} <span className="text-[10px] text-gray-400 font-normal">tC/ha</span>
                        </p>
                    </div>

                    {/* KPI 2: Biomasa */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-600">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Promedio Biomasa</h3>
                            <Scale size={14} className="text-emerald-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {formatDec(kpi.avgBiomass)} <span className="text-[10px] text-gray-400 font-normal">t/ha</span>
                        </p>
                    </div>

                    {/* KPI 3: Volumen */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Promedio Volumen</h3>
                            <Database size={14} className="text-blue-500" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {formatDec(kpi.avgVolume)} <span className="text-[10px] text-gray-400 font-normal">m³/ha</span>
                        </p>
                    </div>
                </div>

                {/* Right Column: Stacked Charts (Ecozones + Regions) */}
                <div className="lg:col-span-3 space-y-3">
                    {/* Chart 1: Ecozones */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[315px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Comparativo por Ecozona</h3>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={ecozones}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={110}
                                        tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 500 }}
                                        interval={0}
                                    />
                                    <Tooltip formatter={(value: number) => formatDec(value)} contentStyle={{ fontSize: '12px' }} />
                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                    <Bar dataKey="carbono" name="Carbono (tC/ha)" fill="#10B981" radius={[0, 3, 3, 0]} barSize={12} />
                                    <Bar dataKey="biomasa" name="Biomasa (t/ha)" fill="#059669" radius={[0, 3, 3, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Regions (Departamentos) */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[315px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Comparativo por Departamento</h3>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={regions}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="region"
                                        type="category"
                                        width={110}
                                        tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 500 }}
                                        interval={0}
                                    />
                                    <Tooltip formatter={(value: number) => formatDec(value)} contentStyle={{ fontSize: '12px' }} />
                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                    <Bar dataKey="carbono" name="Carbono (tC/ha)" fill="#3B82F6" radius={[0, 3, 3, 0]} barSize={12} />
                                    <Bar dataKey="biomasa" name="Biomasa (t/ha)" fill="#2563EB" radius={[0, 3, 3, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
