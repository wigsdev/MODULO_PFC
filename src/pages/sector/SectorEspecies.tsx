import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Search, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function SectorEspecies() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // The setRiskFilter function is unused because the corresponding select element is commented out.
    // Removing the setRiskFilter function as per instruction.
    const [riskFilter] = useState('TODOS');

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL} data / sector / especies.json ? t = ${new Date().getTime()} `;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading species data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando catálogo de especies...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar especies.json</div>;

    const { kpi, metadata, riskDistribution, list } = data;

    // Colors for Risk Levels
    const COLORS = ['#EF4444', '#F59E0B', '#FCD34D', '#10B981']; // Red, Orange, Yellow, Green

    // Filter Logic
    const filteredList = list.filter((item: any) => {
        const matchesSearch = item.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = riskFilter === 'TODOS' || item.risk.includes(riskFilter);
        return matchesSearch && matchesRisk;
    });

    return (
        <div className="space-y-4 animate-fade-in p-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ShieldAlert className="text-amber-600" size={20} /> {metadata.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Actualizado: {metadata.lastUpdated}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Left Column: Stats & Chart */}
                <div className="space-y-3">
                    {/* KPIs */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                            <h3 className="text-[10px] uppercase font-bold text-red-500">Muy Alto Riesgo</h3>
                            <p className="text-2xl font-bold text-red-700">{kpi.highRisk}</p>
                            <p className="text-[10px] text-red-400">Especies Críticas</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-center">
                            <h3 className="text-[10px] uppercase font-bold text-amber-500">Alto/Medio</h3>
                            <p className="text-2xl font-bold text-amber-700">{kpi.mediumRisk}</p>
                            <p className="text-[10px] text-amber-400">Vulnerables</p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[280px]">
                        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Distribución por Nivel de Riesgo</h3>
                        <div className="flex-1 w-full text-xs">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={riskDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {riskDistribution.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: List */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-[500px]">
                    {/* Filters */}
                    <div className="p-3 border-b flex gap-2 bg-gray-50/50">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Buscar especie..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* <select 
                            className="px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-amber-500 bg-white"
                            value={riskFilter}
                            onChange={(e) => setRiskFilter(e.target.value)}
                        >
                            {uniqueRisks.map((r: any) => <option key={r} value={r}>{r}</option>)}
                        </select> */}
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 sticky top-0 z-10 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-4 py-2 border-b">Especie</th>
                                    <th className="px-4 py-2 border-b">Producto Más Decomisado</th>
                                    <th className="px-4 py-2 border-b">Regiones Críticas</th>
                                    <th className="px-4 py-2 border-b">Nivel de Riesgo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-600">
                                {filteredList.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-2">
                                            <p className="font-bold text-gray-800">{item.commonName}</p>
                                            <p className="text-[10px] italic text-gray-400">{item.scientificName}</p>
                                        </td>
                                        <td className="px-4 py-2">{item.product}</td>
                                        <td className="px-4 py-2 text-[10px]">{item.regions}</td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${item.risk.includes('Muy Alto') ? 'bg-red-50 text-red-700 border-red-100' :
                                                item.risk.includes('Alto') ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                }`}>
                                                {item.risk.includes('🔴') && <AlertTriangle size={10} />}
                                                {item.risk.replace(/🔴|🟠|🟡/g, '').trim()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gray-50 p-2 border-t text-[10px] text-gray-400 text-right">
                        Mostrando {filteredList.length} especies
                    </div>
                </div>
            </div>
        </div>
    );
}
