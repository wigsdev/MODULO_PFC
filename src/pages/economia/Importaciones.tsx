import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
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

interface ImportacionesData {
    metadata: { title: string; source: string; lastUpdated: string };
    kpi: { total2024: number; variacionTotal: number };
    categories: Array<{ categoria: string; valor2023: number; valor2024: number; variacion: number }>;
}

const COLORS = ['#3B82F6', '#10B981'];

const Importaciones = () => {
    const [data, setData] = useState<ImportacionesData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/importaciones.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const pieData = data.categories.map(c => ({ name: c.categoria, value: c.valor2024 }));

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="text-blue-600" size={24} />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Importaciones Forestales</h1>
                            <p className="text-xs text-gray-500">Fuente: {data.metadata.source}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPIs + Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1 space-y-3">
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Total 2024</p>
                        <h3 className="text-2xl font-bold text-gray-800">${(data.kpi.total2024 / 1000000000).toFixed(2)}B</h3>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-gray-400 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Variación vs 2023</p>
                        <h3 className="text-2xl font-bold text-gray-600 flex items-center gap-1">
                            +{data.kpi.variacionTotal}%
                        </h3>
                    </div>
                    {data.categories.map(cat => (
                        <div key={cat.categoria} className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                            <p className="text-xs font-semibold text-gray-500">{cat.categoria}</p>
                            <p className="text-lg font-bold text-gray-800">${(cat.valor2024 / 1000000000).toFixed(2)}B</p>
                            <p className={`text-xs ${cat.variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {cat.variacion >= 0 ? '+' : ''}{cat.variacion}% vs 2023
                            </p>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[315px] flex flex-col">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Comparativo 2023 vs 2024 (USD)</h3>
                    <div className="flex-1 min-h-0 grid grid-cols-2 gap-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.categories} margin={{ left: 0, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="categoria" tick={{ fontSize: 10 }} />
                                <YAxis tickFormatter={(v) => `$${(v / 1000000000).toFixed(1)}B`} tick={{ fontSize: 10 }} />
                                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Bar dataKey="valor2023" name="2023" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="valor2024" name="2024" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}>
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, '']} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Importaciones;
