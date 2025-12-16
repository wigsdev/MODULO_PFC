import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sprout, FileCheck, Layers, ExternalLink } from 'lucide-react';

export default function RegistrosPlantaciones() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/registros_plantaciones.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading plantaciones data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando plantaciones...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar registros_plantaciones.json</div>;

    const { kpi, metadata, regions } = data;
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(val);

    return (
        <div className="space-y-3 animate-fade-in p-2">
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Sprout className="text-emerald-700" size={20} /> {metadata.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Actualizado: {metadata.lastUpdated}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 content-start">

                    {/* KPI 1 */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-600">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500">Área Registrada</h3>
                            <Layers size={14} className="text-emerald-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-800">{formatInt(kpi.totalArea)} <span className="text-xs font-normal text-gray-500">ha</span></p>
                    </div>

                    {/* KPI 2 */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-teal-600">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500">Certificados</h3>
                            <FileCheck size={14} className="text-teal-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-800">{formatInt(kpi.totalCertificados)}</p>
                    </div>

                    {/* External Link Button - Style KPI */}
                    <a
                        href="https://sniffs.serfor.gob.pe/estadistica/es/tableros/registros-nacionales/plantaciones"
                        target="_blank"
                        rel="noreferrer"
                        className="col-span-2 lg:col-span-1 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-sm transition-all flex items-center justify-between group cursor-pointer"
                    >
                        <div>
                            <h3 className="text-xs font-bold text-emerald-800 group-hover:underline">PLANTACIONES REGISTRADAS</h3>
                            <p className="text-[10px] text-emerald-600 mt-0.5">Fuente Oficial SNIFFS</p>
                        </div>
                        <ExternalLink size={16} className="text-emerald-500 group-hover:text-emerald-700" />
                    </a>

                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[315px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Plantaciones por Departamento (Área)</h3>
                        <div className="flex-1 w-full min-h-0 relative overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={regions} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 9 }} interval={0} />
                                    <YAxis fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(value) => formatInt(Number(value))} />
                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                    <Bar dataKey="area" name="Área (ha)" fill="#10B981" barSize={30} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
