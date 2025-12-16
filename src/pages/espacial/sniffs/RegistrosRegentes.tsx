
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ShieldCheck, UserCheck, AlertCircle, HelpCircle, Search, ExternalLink } from 'lucide-react';

export default function RegistrosRegentes() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');
    const [deptFilter, setDeptFilter] = useState('TODOS');

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/registros_regentes.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading regentes data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando regentes...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar registros_regentes.json</div>;

    const { kpi, metadata, regions, list } = data;
    const formatInt = (val: number) => new Intl.NumberFormat('es-PE').format(val);

    // Derived Lists for Selects
    const departments = ['TODOS', ...Array.from(new Set(list.map((i: any) => i.departamento))).sort() as string[]];
    const statuses = ['TODOS', ...Array.from(new Set(list.map((i: any) => i.estadoLicencia))).sort() as string[]];

    // Filter Logic
    const filteredList = list.filter((item: any) => {
        const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.licencia.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'TODOS' || item.estadoLicencia === statusFilter;
        const matchesDept = deptFilter === 'TODOS' || item.departamento === deptFilter;
        return matchesSearch && matchesStatus && matchesDept;
    });

    return (
        <div className="space-y-4 animate-fade-in p-2">

            {/* Header with Source Link */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100 gap-3">
                <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <ShieldCheck className="text-blue-700" size={20} /> {metadata.title}
                    </h1>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span>Actualizado: {metadata.lastUpdated}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href="https://sniffs.serfor.gob.pe/estadistica/es/tableros/registros-nacionales/regentes"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-100 transition-colors"
                    >
                        Fuente Oficial <ExternalLink size={12} />
                    </a>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] uppercase font-bold text-gray-500">Licencias Vigentes</h3>
                        <p className="text-2xl font-bold text-gray-800">{formatInt(kpi.totalVigente)}</p>
                    </div>
                    <UserCheck size={24} className="text-emerald-100" />
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-amber-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] uppercase font-bold text-gray-500">Indeterminadas</h3>
                        <p className="text-2xl font-bold text-gray-800">{formatInt(kpi.totalIndeterminada)}</p>
                    </div>
                    <HelpCircle size={24} className="text-amber-100" />
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-red-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] uppercase font-bold text-gray-500">Inhabilitadas / No Vigentes</h3>
                        <p className="text-2xl font-bold text-gray-800">{formatInt(kpi.totalNoVigente)}</p>
                    </div>
                    <AlertCircle size={24} className="text-red-100" />
                </div>
            </div>

            {/* Main Content Info: Chart + Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

                {/* Chart (Left Column - Smaller) */}
                <div className="lg:col-span-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[500px]">
                    <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Distribución Regional</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={regions} margin={{ top: 10, right: 10, left: 10, bottom: 5 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                <XAxis type="number" fontSize={9} />
                                <YAxis type="category" dataKey="region" width={80} fontSize={9} interval={0} />
                                <Tooltip formatter={(value) => formatInt(Number(value))} contentStyle={{ fontSize: '11px' }} />
                                <Legend wrapperStyle={{ fontSize: '9px' }} />
                                <Bar dataKey="vigente" name="Vigente" stackId="a" fill="#10B981" />
                                <Bar dataKey="indeterminada" name="Indeterm." stackId="a" fill="#F59E0B" />
                                <Bar dataKey="noVigente" name="No Vigente" stackId="a" fill="#EF4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Table (Right Column - Wider - Main Focus) */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-[500px]">
                    {/* Table Filters */}
                    <div className="p-3 border-b flex flex-col gap-2 bg-gray-50/50">
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre..."
                                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select
                                className="px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                                value={deptFilter}
                                onChange={(e) => setDeptFilter(e.target.value)}
                            >
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 sticky top-0 z-10 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-4 py-2 border-b">Regente</th>
                                    <th className="px-4 py-2 border-b">Licencia</th>
                                    <th className="px-4 py-2 border-b text-center">Estado</th>
                                    <th className="px-4 py-2 border-b">Ubicación</th>
                                    <th className="px-4 py-2 border-b">Categoría</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-600">
                                {filteredList.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-2 font-medium text-gray-800">{item.nombre}</td>
                                        <td className="px-4 py-2 font-mono text-[10px]">{item.licencia}</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${item.estadoLicencia === 'VIGENTE' ? 'bg-emerald-100 text-emerald-700' :
                                                item.estadoLicencia === 'NO VIGENTE' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {item.estadoLicencia}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{item.departamento}</td>
                                        <td className="px-4 py-2 text-[10px] max-w-[150px] truncate" title={item.categoria}>
                                            {item.categoria}
                                        </td>
                                    </tr>
                                ))}
                                {filteredList.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-400">
                                            No se encontraron resultados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-50 p-2 border-t text-[10px] text-gray-400 text-right">
                        Mostrando {filteredList.length} registros
                    </div>
                </div>
            </div>
        </div>
    );
}
