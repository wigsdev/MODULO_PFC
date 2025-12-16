import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sprout, Award, Layers } from 'lucide-react';

export default function Plantaciones() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/plantaciones.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading plantaciones:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando plantaciones...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar plantaciones.json</div>;

    const { kpi, metadata, regions } = data;
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(val);

    return (
        <div className="space-y-3 animate-fade-in p-2">
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Sprout className="text-emerald-600" size={20} /> {metadata.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Actualizado: {metadata.lastUpdated}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 content-start">
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-600">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500">Certificados</h3>
                            <Award size={14} className="text-emerald-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-800">{formatInt(kpi.totalCertificados)}</p>
                    </div>
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-teal-600">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500">Superficie Total</h3>
                            <Layers size={14} className="text-teal-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-800">{formatInt(kpi.totalArea)} ha</p>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[315px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Plantaciones por Finalidad</h3>
                        <div className="flex-1 w-full min-h-0 relative overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={regions} margin={{ top: 10, right: 30, left: 20, bottom: 5 }} stackOffset="sign">
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 9 }} interval={0} />
                                    <YAxis fontSize={10} />
                                    <Tooltip formatter={(value) => formatInt(Number(value))} />
                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                    <Bar dataKey="produccion" name="Producción (ha)" stackId="a" fill="#10B981" />
                                    <Bar dataKey="proteccion" name="Protección (ha)" stackId="a" fill="#3B82F6" />
                                    <Bar dataKey="restauracion" name="Restauración (ha)" stackId="a" fill="#F59E0B" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
