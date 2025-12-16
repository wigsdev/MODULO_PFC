import React, { useState, useEffect } from 'react';
import {
    TreeDeciduous,
    Sprout,
    Globe,
    Search,
    Filter,
    Download
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface SpeciesData {
    metadata: {
        title: string;
        source: string;
        lastUpdated: string;
    };
    kpi: {
        totalSpecies: number;
        nativeCount: number;
        exoticCount: number;
    };
    typeDistribution: Array<{ name: string; value: number }>;
    list: Array<{
        commonName: string;
        scientificName: string;
        type: string;
        region: string;
        use: string;
    }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EspeciesAprovechadas = () => {
    const [data, setData] = useState<SpeciesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('Todos');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/especies_aprovechadas.json?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const filteredList = data.list.filter(item => {
        const matchesSearch = item.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'Todos' || item.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <TreeDeciduous className="text-green-600" />
                        Especies Aprovechadas
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Catálogo de especies forestales maderables y sus características principales.
                    </p>
                </div>
                <div className="text-sm text-gray-500 text-right">
                    <p>Fuente: {data.metadata.source}</p>
                    <p>Actualizado: {data.metadata.lastUpdated}</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Total Especies</p>
                            <h3 className="text-2xl font-bold text-gray-800">{data.kpi.totalSpecies}</h3>
                        </div>
                        <TreeDeciduous className="text-green-200" size={32} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Nativas</p>
                            <h3 className="text-2xl font-bold text-gray-800">{data.kpi.nativeCount}</h3>
                        </div>
                        <Sprout className="text-blue-200" size={32} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Exóticas/Otras</p>
                            <h3 className="text-2xl font-bold text-gray-800">{data.kpi.exoticCount}</h3>
                        </div>
                        <Globe className="text-orange-200" size={32} />
                    </div>
                </div>
            </div>

            {/* Charts & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-4">Distribución por Tipo</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.typeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.typeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* List */}
                <div className="bg-white p-6 rounded-lg shadow lg:col-span-2 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <h3 className="text-lg font-semibold">Listado de Especies</h3>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar especie..."
                                    className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="Todos">Todos los tipos</option>
                                <option value="Nativa">Nativa</option>
                                <option value="Exótica">Exótica</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Nombre Común</th>
                                    <th className="px-4 py-3">Nombre Científico</th>
                                    <th className="px-4 py-3">Tipo</th>
                                    <th className="px-4 py-3">Región</th>
                                    <th className="px-4 py-3">Uso Principal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredList.slice(0, 10).map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{item.commonName}</td>
                                        <td className="px-4 py-3 italic text-gray-600">{item.scientificName}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${item.type === 'Nativa' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                                            `}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{item.region}</td>
                                        <td className="px-4 py-3 text-gray-600">{item.use}</td>
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
        </div>
    );
};

export default EspeciesAprovechadas;
