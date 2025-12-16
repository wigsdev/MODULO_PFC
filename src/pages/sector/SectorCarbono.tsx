import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CloudRain, Sprout, TrendingUp, DollarSign, Leaf } from 'lucide-react';

export default function SectorCarbono() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/sector/carbono.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading Carbono data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando mapa de carbono...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar carbono.json</div>;

    const { kpi, metadata, list } = data;

    // Icon mapping logic for cards
    const getIcon = (vocation: string) => {
        if (vocation.includes('REDD+')) return <CloudRain size={20} className="text-blue-500" />;
        if (vocation.includes('Reforestación') || vocation.includes('ARR')) return <Sprout size={20} className="text-emerald-500" />;
        if (vocation.includes('Agroforestería')) return <Leaf size={20} className="text-amber-500" />;
        return <TrendingUp size={20} className="text-gray-500" />;
    };

    return (
        <div className="space-y-4 animate-fade-in p-2">

            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <CloudRain className="text-cyan-600" size={20} /> {metadata.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Actualizado: {metadata.lastUpdated}</span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-cyan-500">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1">Stock Promedio Nacional</h3>
                    <p className="text-2xl font-bold text-gray-800">{kpi.avgStockC.toFixed(1)} <span className="text-sm font-normal text-gray-400">tC/ha</span></p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1">Región con Mayor Stock</h3>
                    <p className="text-lg font-bold text-gray-800 truncate">{kpi.maxStockRegion}</p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-gray-400">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1">Zonas Potenciales Evaluadas</h3>
                    <p className="text-2xl font-bold text-gray-800">{kpi.totalPotentialRegions}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

                {/* Chart Left */}
                <div className="lg:col-span-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[450px]">
                    <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Stock de Carbono por Región (tC/ha)</h3>
                    <div className="flex-1 w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={list} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="region" interval={0} angle={-20} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} label={{ value: 'tC/ha', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} wrapperStyle={{ fontSize: '11px' }} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Bar dataKey="stockC" name="Stock Carbono (tC/ha)" fill="#06B6D4" barSize={30} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="stockCO2" name="Equiv. CO2 (tCO2e/ha)" fill="#94A3B8" barSize={30} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Business Vocation Cards */}
                <div className="lg:col-span-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[450px] overflow-hidden">
                    <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Vocación de Negocio (Mercado)</h3>
                    <div className="flex-1 overflow-auto pr-1 space-y-3">
                        {list.map((item: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-xs font-bold text-gray-800">{item.region}</h4>
                                    {getIcon(item.vocation)}
                                </div>
                                <div className="text-[10px] text-gray-500 italic mb-2">{item.ecozone}</div>
                                <div className="text-[10px] text-gray-700 bg-white p-2 rounded border border-gray-100">
                                    <span className="font-semibold text-blue-800">{item.vocation.split(':')[0]}:</span>
                                    {item.vocation.split(':')[1]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
