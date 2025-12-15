import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Share2, Trees, Map, Percent } from 'lucide-react';

export default function SuperficieCubierta() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/superficie_cubierta.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading superficie data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando superficie...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar superficie_cubierta.json</div>;

    const { kpi, metadata, regions } = data;

    // Formatting Helpers
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(val);
    const formatDec = (val: number) => new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 }).format(val);

    return (
        <div className="space-y-3 animate-fade-in p-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Trees className="text-green-600" size={20} />
                        {metadata.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="hidden md:inline">Actualizado: {metadata.lastUpdated}</span>
                    <div className="h-4 w-px bg-gray-200 mx-1 hidden md:block"></div>
                    <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                        <Share2 size={13} />
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                        <Download size={13} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                {/* Left Column: Stacked KPIs */}
                <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3 content-start">

                    {/* KPI 1: Cobertura Promedio */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Cobertura Promedio</h3>
                            <Percent size={14} className="text-green-500" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {formatDec(kpi.avgCobertura)}%
                        </p>
                    </div>

                    {/* KPI 2: Superficie Bosque */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-600">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Bosque</h3>
                            <Trees size={14} className="text-emerald-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-800 leading-tight truncate">
                            {formatInt(kpi.totalBosque)} <span className="text-[10px] text-gray-400 font-normal">ha</span>
                        </p>
                    </div>

                    {/* KPI 3: Top Region */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Mayor Bosque</h3>
                            <Map size={14} className="text-blue-500" />
                        </div>
                        <p className="text-lg font-bold text-gray-800 leading-tight truncate">
                            {kpi.topRegionName}
                        </p>
                        <p className="text-xs text-gray-500">{formatInt(kpi.topRegionValue)} ha</p>
                    </div>
                </div>

                {/* Right Column: Chart */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[315px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Cobertura Forestal por Departamento (Bosque vs No Bosque)</h3>

                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={regions}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    stackOffset="sign"
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#F3F4F6" />
                                    <XAxis
                                        dataKey="region"
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                        tick={{ fontSize: 9, fill: '#6B7280' }}
                                        interval={0}
                                    />
                                    <YAxis
                                        width={45}
                                        tick={{ fill: '#4B5563', fontSize: 10 }}
                                        tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => formatInt(value)}
                                        contentStyle={{ fontSize: '12px' }}
                                        cursor={{ fill: '#F9FAFB' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                    <Bar dataKey="bosque" name="Bosque (ha)" stackId="a" fill="#16A34A" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="noBosque" name="No Bosque (ha)" stackId="a" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
