import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Trees, Info, Share2, Map as MapIcon } from 'lucide-react';

export default function SuperficieBosque() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/bosques.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading bosques data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando monitoreo de bosques...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar bosques.json</div>;

    const { kpi, metadata, regions } = data;

    // Format helpers
    const formatHa = (val: number) => new Intl.NumberFormat('es-PE').format(val) + ' ha';

    return (
        <div className="space-y-3 animate-fade-in p-2">
            {/* Ultra Compact Header - Standardized */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Trees className="text-emerald-600" size={20} />
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
                {/* Left Column: Dense Stacked KPIs */}
                <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3 content-start">
                    {/* KPI 1: Total Nacional */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Bosque Natural</h3>
                            <Info size={14} className="text-emerald-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {formatHa(kpi.totalSuperficie).replace(' ha', '')}
                            <span className="text-[10px] font-normal text-gray-400 ml-1">ha</span>
                        </p>
                    </div>

                    {/* KPI 2: Regiones Count */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Regiones</h3>
                            <MapIcon size={14} className="text-blue-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {regions.length}
                        </p>
                    </div>
                </div>

                {/* Right Column: Charts (Full Width for single chart) */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[315px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Superficie de Bosque Natural por Región</h3>
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
                                        width={90}
                                        tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 500 }}
                                        interval={0}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => formatHa(value)}
                                        contentStyle={{ fontSize: '12px' }}
                                        cursor={{ fill: '#F9FAFB' }}
                                    />
                                    <Bar dataKey="superficie2024" name="Superficie" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
