import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, Package } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface ExportacionesData {
    metadata: { title: string; source: string; lastUpdated: string };
    kpi: { total2024: number; variacionTotal: number };
    categories: Array<{ categoria: string; valor2023: number; valor2024: number; variacion: number }>;
}

const Exportaciones = () => {
    const [data, setData] = useState<ExportacionesData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/exportaciones.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Package className="text-green-600" size={24} />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Exportaciones Forestales</h1>
                            <p className="text-xs text-gray-500">Fuente: {data.metadata.source}</p>
                        </div>
                    </div>
                    <a href="https://sniffs.serfor.gob.pe/estadistica/es/tableros/comercio-exterior/exportaciones" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                        Ver Fuente Oficial <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            {/* KPIs + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1 space-y-3">
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Total 2024</p>
                        <h3 className="text-2xl font-bold text-gray-800">
                            ${(data.kpi.total2024 / 1000000).toFixed(1)}M
                        </h3>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Variación vs 2023</p>
                        <h3 className={`text-2xl font-bold flex items-center gap-1 ${data.kpi.variacionTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <TrendingUp size={20} />
                            +{data.kpi.variacionTotal}%
                        </h3>
                    </div>
                    {data.categories.map(cat => (
                        <div key={cat.categoria} className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                            <p className="text-xs font-semibold text-gray-500">{cat.categoria}</p>
                            <p className="text-lg font-bold text-gray-800">${(cat.valor2024 / 1000000).toFixed(1)}M</p>
                            <p className={`text-xs ${cat.variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {cat.variacion >= 0 ? '+' : ''}{cat.variacion}% vs 2023
                            </p>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[315px] flex flex-col">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Comparativo 2023 vs 2024 (USD)</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.categories} margin={{ left: 20, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="categoria" tick={{ fontSize: 11 }} />
                                <YAxis tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="valor2023" name="2023" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="valor2024" name="2024" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exportaciones;
