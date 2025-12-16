import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MapPin, ShieldAlert, FileText, AlertTriangle } from 'lucide-react';

export default function SectorSitiosDeclarados() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/sector/sitios.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading Sitios data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando sitios declarados...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar sitios.json</div>;

    const { kpi, metadata, categoryDistribution, list } = data;
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(Math.round(val));
    const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

    return (
        <div className="space-y-4 animate-fade-in p-2">

            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="text-indigo-600" size={20} /> {metadata.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Actualizado: {metadata.lastUpdated}</span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] uppercase font-bold text-gray-500">Sitios Declarados</h3>
                        <p className="text-2xl font-bold text-gray-800">{kpi.totalSites}</p>
                    </div>
                    <FileText size={24} className="text-indigo-100" />
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-violet-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] uppercase font-bold text-gray-500">Superficie Aprox.</h3>
                        <p className="text-2xl font-bold text-gray-800">{formatInt(kpi.totalArea)} <span className="text-xs font-normal text-gray-400">ha</span></p>
                    </div>
                    <MapPin size={24} className="text-violet-100" />
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-amber-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] uppercase font-bold text-gray-500">Restricción Alta/Absoluta</h3>
                        <p className="text-2xl font-bold text-gray-800">{kpi.highRestriction}</p>
                    </div>
                    <ShieldAlert size={24} className="text-amber-100" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Chart */}
                <div className="lg:col-span-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Por Categoría</h3>
                    <div className="flex-1 w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryDistribution.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Table */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-700 uppercase">Detalle de Sitios</h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 sticky top-0 z-10 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-4 py-2 border-b">Sitio / Región</th>
                                    <th className="px-4 py-2 border-b">Categoría</th>
                                    <th className="px-4 py-2 border-b text-right">Área (ha)</th>
                                    <th className="px-4 py-2 border-b">Restricción Inversión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-600">
                                {list.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-2">
                                            <p className="font-bold text-gray-800">{item.name}</p>
                                            <p className="text-[10px] text-gray-400">{item.region}</p>
                                            <p className="text-[8px] text-indigo-400">{item.legal}</p>
                                        </td>
                                        <td className="px-4 py-2 text-[10px]">{item.category}</td>
                                        <td className="px-4 py-2 text-right font-mono">{item.surfaceRaw}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-start gap-1">
                                                {(item.restriction.includes('Alta') || item.restriction.includes('Absoluta')) && <AlertTriangle size={12} className="text-amber-500 mt-0.5" />}
                                                <span className="text-[10px] max-w-[200px] block" title={item.restriction}>
                                                    {item.restriction.split('.')[0]}.
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
