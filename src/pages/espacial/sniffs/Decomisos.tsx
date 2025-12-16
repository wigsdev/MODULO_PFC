import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ShieldAlert, Flame, Ban } from 'lucide-react';

export default function Decomisos() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/decomisos.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading decomisos:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando decomisos...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar decomisos.json</div>;

    const { kpi, metadata, regions } = data;
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(val);

    return (
        <div className="space-y-3 animate-fade-in p-2">
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ShieldAlert className="text-red-600" size={20} /> {metadata.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Actualizado: {metadata.lastUpdated}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 content-start">
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-red-600">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500">Madera Aserrada</h3>
                            <Ban size={14} className="text-red-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-800">{formatInt(kpi.totalAserrada)} m³</p>
                    </div>
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-orange-600">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500">Madera Rolliza</h3>
                            <Ban size={14} className="text-orange-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-800">{formatInt(kpi.totalRolliza)} m³</p>
                    </div>
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-gray-800 col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500">Carbón Vegetal</h3>
                            <Flame size={14} className="text-gray-800" />
                        </div>
                        <p className="text-lg font-bold text-gray-800">{formatInt(kpi.totalCarbon)} kg</p>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[315px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Decomisos por Departamento (Aserrada vs Rolliza)</h3>
                        <div className="flex-1 w-full min-h-0 relative overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={regions} margin={{ top: 10, right: 30, left: 20, bottom: 5 }} stackOffset="sign">
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 9 }} interval={0} />
                                    <YAxis fontSize={10} />
                                    <Tooltip formatter={(value) => formatInt(Number(value))} />
                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                    <Bar dataKey="aserrada" name="Aserrada (m³)" stackId="a" fill="#DC2626" />
                                    <Bar dataKey="rolliza" name="Rolliza (m³)" stackId="a" fill="#EA580C" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
