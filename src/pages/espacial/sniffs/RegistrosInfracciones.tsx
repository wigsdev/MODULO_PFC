import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, Gavel, ExternalLink } from 'lucide-react';

export default function RegistrosInfracciones() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/registros_infracciones.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading infracciones data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando infracciones...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar registros_infracciones.json</div>;

    const { kpi, metadata, entities } = data;
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(val);

    return (
        <div className="space-y-3 animate-fade-in p-2">
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <AlertTriangle className="text-red-700" size={20} /> {metadata.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Actualizado: {metadata.lastUpdated}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 content-start">

                    {/* KPI Card */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-red-600 col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500">Infractores Totales</h3>
                            <Gavel size={14} className="text-red-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-800">{formatInt(kpi.totalInfractores)}</p>
                    </div>

                    {/* External Link Button - Style KPI */}
                    <a
                        href="https://sniffs.serfor.gob.pe/estadistica/es/tableros/registros-nacionales/registro-nacional-de-infractores-ffs"
                        target="_blank"
                        rel="noreferrer"
                        className="col-span-2 lg:col-span-1 px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg shadow-sm transition-all flex items-center justify-between group cursor-pointer"
                    >
                        <div>
                            <h3 className="text-xs font-bold text-red-800 group-hover:underline">VER INFRACCIONES</h3>
                            <p className="text-[10px] text-red-600 mt-0.5">Fuente Oficial SNIFFS</p>
                        </div>
                        <ExternalLink size={16} className="text-red-500 group-hover:text-red-700" />
                    </a>

                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[315px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Infractores por Entidad Sancionadora</h3>
                        <div className="flex-1 w-full min-h-0 relative overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={entities} margin={{ top: 10, right: 30, left: 100, bottom: 5 }} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                                    <XAxis type="number" fontSize={10} />
                                    <YAxis type="category" dataKey="entidad" width={140} fontSize={9} />
                                    <Tooltip formatter={(value) => formatInt(Number(value))} />
                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                    <Bar dataKey="infractores" name="Infractores" fill="#DC2626" barSize={20} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
