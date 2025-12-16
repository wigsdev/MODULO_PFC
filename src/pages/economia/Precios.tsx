import { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp,
    Search,
    ExternalLink,
    DollarSign,
    Calendar,
    BarChart3
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
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

// Unit labels for display
const UNIT_LABELS: Record<string, string> = {
    'PT': 'Pie Tablar',
    'M3': 'Metro Cúbico (m³)',
    'KG': 'Kilogramo',
    'U': 'Unidad'
};

const Precios = () => {
    const [data, setData] = useState<PriceData | null>(null);
    const [loading, setLoading] = useState(true);

    // Unified filters for chart and KPI
    const [selectedSpecies, setSelectedSpecies] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<string>('PT');
    const [selectedKpiYear, setSelectedKpiYear] = useState<number>(2024);

    // Filters for table
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('Todos');
    const [selectedDept, setSelectedDept] = useState('Todos');
    const [selectedProduct, setSelectedProduct] = useState('Todos');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/precios_madera.json?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(d => {
                setData(d);
                if (d.topSpecies.length > 0) setSelectedSpecies(d.topSpecies[0]);
            })
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    // Get available units and years from data
    const availableUnits = useMemo(() => {
        if (!data) return [];
        return Array.from(new Set(data.list.map(i => i.unit))).filter(u => u).sort();
    }, [data]);

    const availableYears = useMemo(() => {
        if (!data) return [];
        return Array.from(new Set(data.list.map(i => {
            const y = typeof i.year === 'number' ? i.year : parseInt(String(i.year));
            return y;
        }))).filter(y => !isNaN(y)).sort((a, b) => b - a);
    }, [data]);

    // Calculate evolution dynamically based on selected species AND unit
    const chartData = useMemo(() => {
        if (!data || !selectedSpecies || !selectedUnit) return [];

        const filtered = data.list.filter(
            item => item.species === selectedSpecies && item.unit === selectedUnit
        );

        const yearPrices: Record<string, { sum: number; count: number }> = {};
        filtered.forEach(item => {
            const year = String(item.year);
            const price = parseFloat(item.price);
            const yearNum = typeof item.year === 'number' ? item.year : parseInt(String(item.year));
            if (!isNaN(price)) { // Include all years including 2025
                if (!yearPrices[year]) yearPrices[year] = { sum: 0, count: 0 };
                yearPrices[year].sum += price;
                yearPrices[year].count += 1;
            }
        });

        return Object.keys(yearPrices)
            .sort()
            .map(year => ({
                year,
                price: parseFloat((yearPrices[year].sum / yearPrices[year].count).toFixed(2))
            }));
    }, [data, selectedSpecies, selectedUnit]);

    // Calculate average price for selected filters
    const avgPriceForFilters = useMemo(() => {
        if (!data || !selectedUnit || !selectedSpecies) return null;

        const filtered = data.list.filter(item => {
            const itemYear = typeof item.year === 'number' ? item.year : parseInt(String(item.year));
            return item.unit === selectedUnit &&
                item.species === selectedSpecies &&
                itemYear === selectedKpiYear;
        });

        if (filtered.length === 0) return null;

        const sum = filtered.reduce((acc, item) => acc + parseFloat(item.price), 0);
        return {
            value: (sum / filtered.length).toFixed(2),
            count: filtered.length
        };
    }, [data, selectedUnit, selectedSpecies, selectedKpiYear]);

    // Calculate price range (min/max) for current year
    const priceRange = useMemo(() => {
        if (!data || !selectedUnit || !selectedSpecies) return null;

        const filtered = data.list.filter(item => {
            const itemYear = typeof item.year === 'number' ? item.year : parseInt(String(item.year));
            return item.unit === selectedUnit &&
                item.species === selectedSpecies &&
                itemYear === selectedKpiYear;
        });

        if (filtered.length === 0) return null;

        const prices = filtered.map(i => parseFloat(i.price)).filter(p => !isNaN(p));
        return {
            min: Math.min(...prices).toFixed(2),
            max: Math.max(...prices).toFixed(2)
        };
    }, [data, selectedUnit, selectedSpecies, selectedKpiYear]);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const filteredList = data.list.filter(item => {
        const matchesSearch = item.species.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = selectedYear === 'Todos' || item.year.toString() === selectedYear;
        const matchesDept = selectedDept === 'Todos' || item.department === selectedDept;
        const matchesProduct = selectedProduct === 'Todos' || item.product === selectedProduct;
        return matchesSearch && matchesYear && matchesDept && matchesProduct;
    });

    const years = Array.from(new Set(data.list.map(i => String(i.year)))).sort((a, b) => b.localeCompare(a));
    const departments = Array.from(new Set(data.list.map(i => i.department))).sort();
    const products = Array.from(new Set(data.list.map(i => i.product))).sort();

    return (
        <div className="space-y-4">
            {/* Header with Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-3">
                        <DollarSign className="text-green-600" size={24} />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Precios de Madera</h1>
                            <p className="text-xs text-gray-500">Fuente: SNIFFS - Precios en Pie y Mercado</p>
                        </div>
                    </div>
                    {/* Filters in header - horizontal */}
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:ring-2 focus:ring-green-500 bg-gray-50 min-w-[140px]"
                            value={selectedSpecies}
                            onChange={(e) => setSelectedSpecies(e.target.value)}
                        >
                            {data.topSpecies.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <select
                            className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:ring-2 focus:ring-green-500 bg-gray-50 min-w-[120px]"
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                        >
                            {availableUnits.map(u => (
                                <option key={u} value={u}>{UNIT_LABELS[u] || u}</option>
                            ))}
                        </select>
                        <select
                            className="border border-gray-200 rounded px-3 py-1.5 text-xs focus:ring-2 focus:ring-green-500 bg-gray-50 min-w-[80px]"
                            value={selectedKpiYear}
                            onChange={(e) => setSelectedKpiYear(parseInt(e.target.value))}
                        >
                            {availableYears.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <a
                            href="https://sniffs.serfor.gob.pe/estadistica/es/tableros/industria-y-comercio/precios-forestales"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm ml-2"
                        >
                            Ver Fuente Oficial <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Grid: KPIs left + Chart right */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                {/* Left Column: KPIs only */}
                <div className="lg:col-span-1 space-y-3">

                    {/* KPI Card: Precio Promedio */}
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Precio Promedio</p>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {avgPriceForFilters ? avgPriceForFilters.value : '--'}
                                    <span className="text-sm font-normal text-gray-400 ml-1">S/.</span>
                                </h3>
                            </div>
                            <DollarSign className="text-green-200" size={28} />
                        </div>
                    </div>

                    {/* KPI Card: Rango de Precios */}
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Rango de Precios</p>
                                <h3 className="text-lg font-bold text-gray-800">
                                    {priceRange ? `${priceRange.min} - ${priceRange.max}` : '--'}
                                    <span className="text-sm font-normal text-gray-400 ml-1">S/.</span>
                                </h3>
                            </div>
                            <BarChart3 className="text-blue-200" size={28} />
                        </div>
                    </div>

                    {/* KPI Card: Registros */}
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Registros</p>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {avgPriceForFilters ? avgPriceForFilters.count : 0}
                                </h3>
                            </div>
                            <Calendar className="text-indigo-200" size={28} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Chart */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[315px] flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-gray-700 uppercase">
                            Evolución de Precios: {selectedSpecies}
                        </h3>
                        <span className="text-xs text-gray-400">
                            Unidad: {UNIT_LABELS[selectedUnit] || selectedUnit}
                        </span>
                    </div>

                    {chartData.length > 0 ? (
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                    <XAxis
                                        dataKey="year"
                                        tick={{ fontSize: 11, fill: '#6B7280' }}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#6B7280' }}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                        tickFormatter={(v) => `S/.${v}`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [`S/. ${value}`, 'Precio']}
                                        labelFormatter={(label) => `Año ${label}`}
                                        contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10B981', r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex-1 min-h-0 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <TrendingUp size={32} className="mx-auto mb-2" />
                                <p className="text-sm">No hay datos para esta combinación</p>
                                <p className="text-xs">Prueba con otra especie o unidad</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4">
                    <h3 className="text-sm font-bold text-gray-700 uppercase">Registros de Precios</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full xl:w-auto">
                        <div className="relative">
                            <Search className="absolute left-2 top-2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full pl-7 pr-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select className="border rounded px-2 py-1.5 text-xs bg-white" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="Todos">Todos Años</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select className="border rounded px-2 py-1.5 text-xs bg-white" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                            <option value="Todos">Todos Dept.</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select className="border rounded px-2 py-1.5 text-xs bg-white" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                            <option value="Todos">Todos Prod.</option>
                            {products.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2">Año/Mes</th>
                                <th className="px-3 py-2">Departamento</th>
                                <th className="px-3 py-2">Especie</th>
                                <th className="px-3 py-2">Producto</th>
                                <th className="px-3 py-2">Unidad</th>
                                <th className="px-3 py-2 text-right">Precio (S/.)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredList.slice(0, 8).map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 text-gray-500">{item.year} - {item.month}</td>
                                    <td className="px-3 py-2">{item.department}</td>
                                    <td className="px-3 py-2 font-medium text-gray-900">{item.species}</td>
                                    <td className="px-3 py-2">{item.product}</td>
                                    <td className="px-3 py-2 text-gray-500">{item.unit}</td>
                                    <td className="px-3 py-2 text-right font-bold text-green-600">{item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-2 text-center text-[10px] text-gray-400 border-t">
                        Mostrando {Math.min(8, filteredList.length)} de {filteredList.length.toLocaleString()} registros
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Precios;
