import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    TrendingUp,
    Calendar,
    Search,
    Filter,
    ExternalLink
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface PriceData {
    metadata: {
        title: string;
        source: string;
        latestYear: number;
    };
    kpi: {
        totalRecords: number;
        monitoredSpecies: number;
        avgPriceCurrent: number;
    };
    topSpecies: string[];
    evolution: Array<{
        species: string;
        data: Array<{ year: string; price: number }>;
    }>;
    productPrices: Array<{ name: string; value: number }>;
    list: Array<{
        id: string;
        department: string;
        year: string;
        month: string;
        species: string;
        product: string;
        unit: string;
        price: string;
    }>;
}

const Precios = () => {
    const [data, setData] = useState<PriceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSpeciesForChart, setSelectedSpeciesForChart] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    // Filters
    const [selectedYear, setSelectedYear] = useState('Todos');
    const [selectedDept, setSelectedDept] = useState('Todos');
    const [selectedProduct, setSelectedProduct] = useState('Todos');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/precios_madera.json?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(d => {
                setData(d);
                if (d.topSpecies.length > 0) setSelectedSpeciesForChart(d.topSpecies[0]);
            })
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    // Prepare chart data for the selected species
    const speciesEvolution = data.evolution.find(e => e.species === selectedSpeciesForChart);
    const chartData = speciesEvolution ? speciesEvolution.data : [];

    const filteredList = data.list.filter(item => {
        const matchesSearch = item.species.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = selectedYear === 'Todos' || item.year.toString() === selectedYear;
        const matchesDept = selectedDept === 'Todos' || item.department === selectedDept;
        const matchesProduct = selectedProduct === 'Todos' || item.product === selectedProduct;

        return matchesSearch && matchesYear && matchesDept && matchesProduct;
    });

    // Unique values for filters
    const years = Array.from(new Set(data.list.map(i => String(i.year)))).sort((a, b) => b.localeCompare(a));
    const departments = Array.from(new Set(data.list.map(i => i.department))).sort();
    const products = Array.from(new Set(data.list.map(i => i.product))).sort();

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <DollarSign className="text-green-600" />
                        Precios de Madera
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Monitoreo de precios de productos forestales en pie y mercado.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <a
                        href="https://sniffs.serfor.gob.pe/estadistica/es/tableros/industria-y-comercio/precios-forestales"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        Ver Fuente Oficial <ExternalLink size={16} />
                    </a>
                    <div className="text-sm text-gray-500 text-right">
                        <p>Año más reciente: {data.metadata.latestYear}</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Especies Monitoreadas</p>
                            <h3 className="text-2xl font-bold text-gray-800">{data.kpi.monitoredSpecies}</h3>
                        </div>
                        <TrendingUp className="text-green-200" size={32} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Precio Promedio (Actual)</p>
                            <h3 className="text-2xl font-bold text-gray-800">S/. {data.kpi.avgPriceCurrent}</h3>
                        </div>
                        <DollarSign className="text-blue-200" size={32} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Registros Totales</p>
                            <h3 className="text-2xl font-bold text-gray-800">{data.kpi.totalRecords}</h3>
                        </div>
                        <Calendar className="text-indigo-200" size={32} />
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Evolution Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Evolución de Precios</h3>
                        <select
                            className="border rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-green-500"
                            value={selectedSpeciesForChart}
                            onChange={(e) => setSelectedSpeciesForChart(e.target.value)}
                        >
                            {data.topSpecies.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => [`S/. ${value}`, 'Precio']} />
                                <Legend />
                                <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} name="Precio Promedio" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Product Type Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Precios por Tipo ({data.metadata.latestYear})</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.productPrices} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={120} style={{ fontSize: '12px' }} />
                                <Tooltip formatter={(value: number) => [`S/. ${value}`, 'Precio Promedio']} />
                                <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Precio Promedio" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                    <h3 className="text-lg font-semibold">Últimos Registros</h3>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full xl:w-auto">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar especie..."
                                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="border rounded-lg px-3 py-2 text-sm bg-white"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="Todos">Todos Años</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>

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
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            <option value="Todos">Todos Prod.</option>
                            {products.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Año/Mes</th>
                                <th className="px-4 py-3">Departamento</th>
                                <th className="px-4 py-3">Especie</th>
                                <th className="px-4 py-3">Producto</th>
                                <th className="px-4 py-3">Unidad</th>
                                <th className="px-4 py-3 text-right">Precio (S/.)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredList.slice(0, 10).map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">{item.year} - {item.month}</td>
                                    <td className="px-4 py-3">{item.department}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{item.species}</td>
                                    <td className="px-4 py-3">{item.product}</td>
                                    <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900">{item.price}</td>
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

export default Precios;
