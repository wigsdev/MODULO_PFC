import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ShieldX, ShieldCheck, AlertOctagon, Scale } from 'lucide-react';

export default function SectorAreasSustraidas() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/sector/bpp.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading BPP data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando datos de BPP...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar bpp.json</div>;

    const { kpi, metadata, list } = data;
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(Math.round(val));

    return (
        <div className="space-y-4 animate-fade-in p-2">

            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ShieldX className="text-red-700" size={20} /> {metadata.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Actualizado: {metadata.lastUpdated}</span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-gray-400 flex flex-col justify-center">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1">Área Original (2002)</h3>
                    <p className="text-xl font-bold text-gray-800">{formatInt(kpi.totalOriginal)} <span className="text-[10px] text-gray-400 font-normal">ha</span></p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500 flex flex-col justify-center">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1">Área Vigente Actual</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-emerald-700">{formatInt(kpi.totalCurrent)}</p>
                        <ShieldCheck size={20} className="text-emerald-200" />
                    </div>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-red-500 flex flex-col justify-center">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1">Área Sustraída</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-red-700">{formatInt(kpi.totalSustracted)}</p>
                        <AlertOctagon size={20} className="text-red-200" />
                    </div>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-amber-500 flex flex-col justify-center">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1">Porcentaje de Pérdida</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-amber-600">-{kpi.percentSustracted.toFixed(1)}%</p>
                        <Scale size={20} className="text-amber-200" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Left: Chart */}
                <div className="lg:col-span-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Impacto por Departamento</h3>
                    <div className="flex-1 w-full text-xs min-h-0 relative overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={list} margin={{ top: 10, right: 10, left: 10, bottom: 5 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} fontSize={9} />
                                <YAxis type="category" dataKey="region" width={80} fontSize={9} />
                                <Tooltip formatter={(value) => formatInt(Number(value)) + ' ha'} contentStyle={{ fontSize: '11px' }} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Bar dataKey="currentArea" name="Vigente" stackId="a" fill="#10B981" />
                                <Bar dataKey="sustractedArea" name="Sustraída" stackId="a" fill="#EF4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Table */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-700 uppercase">Detalle de Bosques de Producción Permanente (BPP)</h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 sticky top-0 z-10 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-4 py-2 border-b">BPP / Región</th>
                                    <th className="px-4 py-2 border-b text-right">Área Original</th>
                                    <th className="px-4 py-2 border-b text-right">Área Vigente</th>
                                    <th className="px-4 py-2 border-b text-right">Sustraída</th>
                                    <th className="px-4 py-2 border-b">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-600">
                                {list.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-2">
                                            <p className="font-bold text-gray-800">{item.name}</p>
                                            <p className="text-[10px] text-gray-400">{item.region}</p>
                                        </td>
                                        <td className="px-4 py-2 text-right">{formatInt(item.originalArea)}</td>
                                        <td className="px-4 py-2 text-right font-medium text-emerald-600">{formatInt(item.currentArea)}</td>
                                        <td className="px-4 py-2 text-right font-medium text-red-600">{formatInt(item.sustractedArea)}</td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${item.status === 'VIGENTE' || item.status === 'ESTABLE' ? 'bg-emerald-100 text-emerald-700' :
                                                item.status === 'CRÍTICO' || item.status === 'ALTA RESTRICCIÓN' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {item.status}
                                            </span>
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
