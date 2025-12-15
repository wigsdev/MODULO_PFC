import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Download, Info, CheckCircle, Share2, FileText, AlertTriangle } from 'lucide-react';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

export default function ZonificacionCultivos() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Use local JSON data with cache busting
        const url = `${import.meta.env.BASE_URL}data/espacial/zonificacion.json?t=${new Date().getTime()}`;
        console.log("Fetching: ", url);

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load data");
                return res.json();
            })
            .then(jsonData => {
                console.log("Loaded Charts Data:", jsonData.charts);
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando monitoreo...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error de datos: No se pudo cargar zonificacion.json</div>;

    const { kpi, charts, metadata } = data;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-100 shadow-lg rounded text-xs z-50">
                    <p className="font-bold text-gray-700 mb-1">{label || payload[0].name}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }} className="font-medium">
                            {entry.name}: {new Intl.NumberFormat('es-PE').format(entry.value)}
                            {label ? ' ha' : ''}
                            {/* If label exists, it's likely the bar chart with hectares. If not, maybe the pie chart with counts. 
                                Actually for the Pie/Simple Bar, payload[0].value is the count. 
                            */}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-3 animate-fade-in p-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-emerald-600" size={20} />
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
                {/* Left KPIs */}
                <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 content-start">
                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-gray-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Evaluadas</h3>
                            <FileText size={14} className="text-gray-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {kpi.totalRegiones}
                        </p>
                    </div>

                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Completa</h3>
                            <CheckCircle size={14} className="text-emerald-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {kpi.completa}
                        </p>
                    </div>

                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-orange-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Parcial</h3>
                            <Info size={14} className="text-orange-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {kpi.parcial}
                        </p>
                    </div>

                    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Sin Zonificación</h3>
                            <AlertTriangle size={14} className="text-red-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                            {kpi.sinZonificacion}
                        </p>
                    </div>

                    {/* External Dashboard Link */}
                    <a
                        href="https://lookerstudio.google.com/u/0/reporting/1rBWIgdSv6bguI4RaAyMnpnW9myR3t-sB/page/qCMh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg shadow-sm transition-all duration-300 cursor-pointer group flex flex-row justify-center items-center text-center gap-2"
                    >
                        <Share2 size={16} className="text-white" />
                        <span className="text-[10px] font-bold text-white uppercase leading-tight text-left">
                            Ver Avance de la Zonificación Forestal
                        </span>
                    </a>
                </div>

                {/* Right Charts */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Status Pie Chart */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Estado de Implementación</h3>
                        <div className="flex-1 w-full min-h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.byStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {charts.byStatus.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* NEW: Status by Region Chart (Replaces Instrumento) */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[300px] overflow-y-auto">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Detalle por Región</h3>
                        <div className="flex-1 w-full min-h-[200px]">
                            <ResponsiveContainer width="99%" height={data.table.length * 30 + 50}>
                                <BarChart
                                    data={data.table}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                    <XAxis type="number" hide domain={[0, 1]} />
                                    <YAxis
                                        dataKey="region"
                                        type="category"
                                        width={100}
                                        tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 500 }}
                                        interval={0}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F9FAFB' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const d = payload[0].payload;
                                                return (
                                                    <div className="bg-white p-2 border border-gray-100 shadow-lg rounded text-xs z-50">
                                                        <p className="font-bold text-gray-800">{d.region}</p>
                                                        <p className="mb-1">{d.estado}</p>
                                                        <p className="text-gray-500 italic text-[10px]">{d.instrumento}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey={() => 1} name="Estado" radius={[4, 4, 4, 4]} barSize={15}>
                                        {data.table.map((entry: any, index: number) => {
                                            let color = '#9CA3AF'; // Default gray
                                            if (entry.estado.includes('Completo') || entry.estado.includes('Aprobada')) color = '#10B981'; // Green
                                            else if (entry.estado.includes('Parcial') || entry.estado.includes('En proceso')) color = '#F97316'; // Orange
                                            else if (entry.estado.includes('Sin') || entry.estado.includes('Pendiente')) color = '#EF4444'; // Red
                                            return <Cell key={`cell-${index}`} fill={color} />;
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Aptitud Productiva Chart (Full Width Span) */}
                    <div className="col-span-1 md:col-span-2 mt-2">
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col">
                            <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Distribución de Aptitud Productiva</h3>
                            <div className="w-full h-[320px]">
                                <ResponsiveContainer width="99%" height="100%">
                                    <BarChart
                                        data={charts?.byAptitud || []}
                                        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 500 }}
                                            interval={0}
                                        />
                                        <YAxis
                                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => new Intl.NumberFormat('es-PE').format(value) + ' ha'}
                                            labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                                            contentStyle={{ fontSize: '12px', borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            cursor={{ fill: '#F9FAFB' }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                                        <Bar dataKey="AGRICOLA" name="Agrícola" fill="#10B981" stackId="a" />
                                        <Bar dataKey="FORESTAL PRODUCTIVO" name="Forestal Productivo" fill="#EA580C" stackId="a" />
                                        <Bar dataKey="PECUARIO" name="Pecuario" fill="#0EA5E9" stackId="a" />
                                        <Bar dataKey="PROTECCION" name="Protección" fill="#8B5CF6" stackId="a" />
                                        <Bar dataKey="OTROS" name="Otros" fill="#9CA3AF" stackId="a" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    );
}
