import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, Info, Map as MapIcon, Share2, Layers } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

export default function FronteraAgricola() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/frontera.json`;
        console.log("Fetching data from:", url);

        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Cargando datos...</div>;
    }

    if (!data) return <div className="p-10 text-center text-red-500">No se pudieron cargar los datos.</div>;

    const { kpi, charts, metadata } = data;

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg z-50">
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className="text-emerald-600 font-medium">
                        {new Intl.NumberFormat('es-PE').format(payload[0].value)} ha
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-3 animate-fade-in p-2">
            {/* Ultra Compact Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <MapIcon className="text-emerald-600" size={20} />
                        {metadata?.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="hidden md:inline">Actualizado: {metadata?.lastUpdated}</span>
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
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Nacional</h3>
                            <Info size={14} className="text-emerald-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 }).format(kpi?.totalAreaHa || 0)}
                            <span className="text-[10px] font-normal text-gray-400 ml-1">ha</span>
                        </p>
                    </div>

                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Regiones</h3>
                            <MapIcon size={14} className="text-blue-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {kpi?.departmentCount || 0}
                        </p>
                    </div>

                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-amber-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Provincias</h3>
                            <Info size={14} className="text-amber-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {kpi?.provinceCount || 0}
                        </p>
                    </div>

                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Distritos</h3>
                            <Layers size={14} className="text-purple-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {kpi?.districtCount || 0}
                        </p>
                    </div>
                </div>

                {/* Right Column: Charts Side-by-Side */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
                    {/* Superficie por Departamento */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[300px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Superficie por Región (Top 7)</h3>
                        <div className="flex-1 w-full min-h-0 relative overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={charts?.byDepartment || []}
                                    layout="vertical"
                                    margin={{ top: 0, right: 20, left: 40, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={85}
                                        tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 500 }}
                                        interval={0}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
                                    <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={20}>
                                        {charts?.byDepartment?.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top 10 Provincias */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[300px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Top 10 Provincias</h3>
                        <div className="flex-1 w-full min-h-0 relative overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={charts?.topProvinces || []}
                                    layout="vertical"
                                    margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={90}
                                        tick={{ fill: '#6B7280', fontSize: 10 }}
                                        interval={0}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
                                    <Bar dataKey="value" fill="#3B82F6" radius={[0, 3, 3, 0]} barSize={14} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
