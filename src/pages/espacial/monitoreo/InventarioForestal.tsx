import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Share2, Sprout, ExternalLink, FileText, Database, Info } from 'lucide-react';

export default function InventarioForestal() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/inventario_forestal.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading inventario data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando inventario...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar inventario_forestal.json</div>;

    const { kpi, metadata, regions } = data;

    // Formatting Helpers
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(val);

    return (
        <div className="space-y-3 animate-fade-in p-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Sprout className="text-emerald-600" size={20} />
                        {metadata.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="hidden md:inline">Actualizado: {metadata.lastUpdated}</span>
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
                {/* Left Column: Stacked KPIs + Action Cards */}
                <div className="lg:col-span-1 flex flex-col gap-2 lg:gap-3">

                    {/* KPI 1: Total Especies */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Especies Registradas</h3>
                            <Sprout size={14} className="text-emerald-500" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {formatInt(kpi.totalEspecies)}
                        </p>
                    </div>

                    {/* KPI 2: Top Region */}
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-lime-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Mayor Diversidad</h3>
                            <ExternalLink size={14} className="text-lime-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-800 leading-tight truncate">
                            {kpi.topRegionName}
                        </p>
                        <p className="text-xs text-gray-500">{formatInt(kpi.topRegionValue)} especies</p>
                    </div>

                    {/* --- BUTTONS SECTION --- */}
                    {/* --- BUTTONS SECTION --- */}
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 mt-2">
                        <a href="https://sniffs.serfor.gob.pe/inventarios/#/" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors shadow-sm group">
                            <Database size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold leading-tight uppercase">PORTAL MODULO DE INVENTARIOS</span>
                        </a>

                        <a href="https://sniffs.serfor.gob.pe/inventarios/biodiv/" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors shadow-sm group">
                            <Sprout size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold leading-tight uppercase">DASHBOARD BIODIV</span>
                        </a>

                        <a href="https://sniffs.serfor.gob.pe/inventarios/pu/panel1/descargas/INFFS_PANEL_1_libro_ok.pdf" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-colors shadow-sm group">
                            <FileText size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold leading-tight uppercase">DESCARGAR INFORME</span>
                        </a>

                        <a href="https://storymaps.arcgis.com/stories/a74c428b6c7a4762adf50ceabcdc2ea6" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors shadow-sm group">
                            <Info size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold leading-tight uppercase">MAS INFORMACION</span>
                        </a>
                    </div>

                </div>

                {/* Right Column: Chart */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[315px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Riqueza de Especies de Flora por Departamento</h3>

                        <div className="flex-1 w-full min-h-0 relative overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={regions}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                                        width={40}
                                        tick={{ fill: '#4B5563', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => formatInt(value)}
                                        contentStyle={{ fontSize: '12px' }}
                                        cursor={{ fill: '#F9FAFB' }}
                                    />
                                    <Bar dataKey="especies" name="Especies" fill="#10B981" radius={[4, 4, 0, 0]} barSize={25} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
