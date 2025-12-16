
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Trees, Flame } from 'lucide-react';

export default function SectorVolumenDecomisado() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/sector/volumen_decomisado.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading volumen decomisado data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando datos de decomisos...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar volumen_decomisado.json</div>;

    const { kpi, metadata, list } = data;
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(Math.round(val));
    const formatDec = (val: number) => new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

    return (
        <div className="space-y-4 animate-fade-in p-2">

            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Box className="text-amber-700" size={20} /> {metadata.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Actualizado: {metadata.lastUpdated}</span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-amber-500">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1">
                        Madera Aserrada <Trees size={12} />
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">{formatDec(kpi.totalAserrada)} <span className="text-sm font-normal text-gray-400">m³</span></p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-600">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1">
                        Madera Rolliza <Trees size={12} />
                    </h3>
                    <p className="text-2xl font-bold text-emerald-700">{formatDec(kpi.totalRolliza)} <span className="text-sm font-normal text-emerald-400">m³</span></p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-gray-800">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1">
                        Carbón <Flame size={12} />
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">{formatInt(kpi.totalCarbon)} <span className="text-sm font-normal text-gray-400">kg</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                {/* Chart 1: Madera (m3) */}
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[350px]">
                    <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Volumen de Madera por Departamento (m³)</h3>
                    <div className="flex-1 w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={list} margin={{ top: 10, right: 30, left: 0, bottom: 5 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" fontSize={10} />
                                <YAxis type="category" dataKey="region" width={80} fontSize={10} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(value) => formatDec(Number(value)) + ' m³'} wrapperStyle={{ fontSize: '11px' }} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Bar dataKey="aserrada" name="Aserrada" stackId="a" fill="#F59E0B" barSize={15} />
                                <Bar dataKey="rolliza" name="Rolliza" stackId="a" fill="#059669" barSize={15} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Carbon (kg) - Only showing regions with carbon > 0 to save space */}
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[350px]">
                    <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Carbón Decomisado (kg)</h3>
                    <div className="flex-1 w-full text-xs">
                        {list.filter((i: any) => i.carbon > 0).length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={list.filter((i: any) => i.carbon > 0)} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="region" angle={-20} textAnchor="end" fontSize={10} height={60} interval={0} />
                                    <YAxis fontSize={10} width={40} />
                                    <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(value) => formatInt(Number(value)) + ' kg'} wrapperStyle={{ fontSize: '11px' }} />
                                    <Bar dataKey="carbon" name="Carbón Vegetal" fill="#1F2937" barSize={30} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 italic">No hay registros de carbón</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Detail */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-700 uppercase">Detalle Regional</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-4 py-2">Departamento</th>
                                <th className="px-4 py-2 text-right">Madera Aserrada (m³)</th>
                                <th className="px-4 py-2 text-right">Madera Rolliza (m³)</th>
                                <th className="px-4 py-2 text-right">Total Madera (m³)</th>
                                <th className="px-4 py-2 text-right">Carbón (kg)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {list.map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="px-4 py-2 font-medium text-gray-700">{row.region}</td>
                                    <td className="px-4 py-2 text-right text-amber-700">{formatDec(row.aserrada)}</td>
                                    <td className="px-4 py-2 text-right text-emerald-700">{formatDec(row.rolliza)}</td>
                                    <td className="px-4 py-2 text-right font-bold text-gray-800 bg-gray-50">{formatDec(row.totalWood)}</td>
                                    <td className="px-4 py-2 text-right text-gray-600">{formatInt(row.carbon)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
