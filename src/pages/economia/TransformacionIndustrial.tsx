import { useState, useEffect } from 'react';
import {
    Factory,
    MapPin,
    Search,
    ExternalLink,
    Building2,
    CheckCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface IndustryData {
    metadata: {
        title: string;
        source: string;
        count: number;
    };
    kpi: {
        totalCTP: number;
        activeCount: number;
        topRegion: string;
    };
    byDept: Array<{ name: string; value: number }>;
    byGiro: Array<{ name: string; value: number }>;
    byYear: Array<{ year: string; count: number }>;
    list: Array<{
        id: number;
        year: string;
        auth: string;
        department: string;
        province: string;
        district: string;
        giro: string;
        holder: string;
        state: string;
    }>;
}

const TransformacionIndustrial = () => {
    const [data, setData] = useState<IndustryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filters
    const [selectedDept, setSelectedDept] = useState('Todos');
    const [selectedGiro, setSelectedGiro] = useState('Todos');
    const [selectedState, setSelectedState] = useState('Todos');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/industria.json?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const filteredList = data.list.filter(item => {
        const matchesSearch = item.holder.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.auth.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'Todos' || item.department === selectedDept;
        const matchesGiro = selectedGiro === 'Todos' || item.giro === selectedGiro;
        const matchesState = selectedState === 'Todos' || item.state === selectedState;

        return matchesSearch && matchesDept && matchesGiro && matchesState;
    });

    // Unique values for filters
    const departments = Array.from(new Set(data.list.map(i => i.department))).sort();
    const giros = Array.from(new Set(data.list.map(i => i.giro))).sort();
    const states = Array.from(new Set(data.list.map(i => i.state))).sort();

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Factory className="text-green-600" />
                        Industria (CTP)
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Registro de Centros de Transformación Primaria (CTP) autorizados.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <a
                        href="https://sniffs.serfor.gob.pe/estadistica/es/tableros/industria-y-comercio/plantas-de-transformacion"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        Ver Fuente Oficial <ExternalLink size={16} />
                    </a>
                    <div className="text-sm text-gray-500 text-right">
                        <p>Total Registros: {data.metadata.count}</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Total CTPs</p>
                            <h3 className="text-2xl font-bold text-gray-800">{data.kpi.totalCTP}</h3>
                        </div>
                        <Building2 className="text-green-200" size={32} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Vigentes (Aprox)</p>
                            <h3 className="text-2xl font-bold text-gray-800">{data.kpi.activeCount}</h3>
                        </div>
                        <CheckCircle className="text-blue-200" size={32} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Región Principal</p>
                            <h3 className="text-2xl font-bold text-gray-800 truncate">{data.kpi.topRegion}</h3>
                        </div>
                        <MapPin className="text-purple-200" size={32} />
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Distribución Regional (Top 10)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.byDept.slice(0, 10)} layout="vertical" margin={{ left: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={100} style={{ fontSize: '11px' }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} name="N° CTPs" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Giro Chart - CHANGED TO BAR CHART */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Distribución por Giro</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.byGiro} layout="vertical" margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={150} style={{ fontSize: '10px' }} interval={0} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" name="Cantidad" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Annual Evolution */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Evolución de Registros por Año</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.byYear}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#6366F1" name="N° Registros" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                    <h3 className="text-lg font-semibold whitespace-nowrap">Registro Nominal</h3>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full xl:w-auto">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar empresa..."
                                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="border rounded-lg px-3 py-2 text-sm bg-white"
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option value="Todos">Todos Dept.</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>

                        <select
                            className="border rounded-lg px-3 py-2 text-sm bg-white"
                            value={selectedGiro}
                            onChange={(e) => setSelectedGiro(e.target.value)}
                        >
                            <option value="Todos">Todos Giros</option>
                            {giros.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>

                        <select
                            className="border rounded-lg px-3 py-2 text-sm bg-white"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            <option value="Todos">Todos Estados</option>
                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Autorización</th>
                                <th className="px-4 py-3">Titular</th>
                                <th className="px-4 py-3">Ubicación</th>
                                <th className="px-4 py-3">Giro</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3">Año</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredList.slice(0, 10).map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.auth}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{item.holder}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.department} - {item.province}</td>
                                    <td className="px-4 py-3">{item.giro}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${item.state === 'VIGENTE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                                        `}>
                                            {item.state}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{item.year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 text-center text-xs text-gray-500 border-t">
                        Mostrando {Math.min(10, filteredList.length)} de {filteredList.length} registros
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransformacionIndustrial;
