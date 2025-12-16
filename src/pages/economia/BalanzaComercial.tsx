import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';
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

interface BalanzaData {
    metadata: { title: string; source: string; lastUpdated: string };
    kpi: {
        exportaciones2024: number;
        importaciones2024: number;
        deficit2024: number;
        variacionExportaciones: number;
        variacionImportaciones: number;
    };
    comparativo: Array<{ indicador: string; valor2023: number; valor2024: number; variacion: number }>;
}

const BalanzaComercial = () => {
    const [data, setData] = useState<BalanzaData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/balanza_comercial.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const isDeficit = data.kpi.deficit2024 < 0;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Scale className="text-indigo-600" size={24} />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Balanza Comercial Forestal</h1>
                            <p className="text-xs text-gray-500">Fuente: {data.metadata.source}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPIs + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1 space-y-3">
                    {/* Deficit/Superavit Card - Prominent */}
                    <div className={`rounded-lg shadow-sm p-4 ${isDeficit ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
                        <p className="text-xs font-semibold text-gray-500 uppercase">{isDeficit ? 'Déficit Comercial' : 'Superávit'} 2024</p>
                        <h3 className={`text-2xl font-bold flex items-center gap-1 ${isDeficit ? 'text-red-600' : 'text-green-600'}`}>
                            {isDeficit ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                            ${Math.abs(data.kpi.deficit2024 / 1000000).toFixed(0)}M
                        </h3>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Exportaciones 2024</p>
                        <h3 className="text-xl font-bold text-green-600">${(data.kpi.exportaciones2024 / 1000000).toFixed(0)}M</h3>
                        <p className="text-xs text-green-500">+{data.kpi.variacionExportaciones}% vs 2023</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Importaciones 2024</p>
                        <h3 className="text-xl font-bold text-blue-600">${(data.kpi.importaciones2024 / 1000000000).toFixed(2)}B</h3>
                        <p className="text-xs text-gray-500">+{data.kpi.variacionImportaciones}% vs 2023</p>
                    </div>
                </div>

                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[315px] flex flex-col">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Comparativo Exportaciones vs Importaciones (USD)</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.comparativo} margin={{ left: 20, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="indicador" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(v) => `$${(v / 1000000000).toFixed(1)}B`} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="valor2023" name="2023" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="valor2024" name="2024" fill="#6366F1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Summary Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                    <strong>Nota:</strong> El sector forestal peruano presenta un déficit comercial significativo.
                    Las importaciones superan a las exportaciones en aproximadamente <strong>${Math.abs(data.kpi.deficit2024 / 1000000).toFixed(0)} millones USD</strong>,
                    representando una oportunidad para fortalecer la producción nacional de plantaciones forestales comerciales.
                </p>
            </div>
        </div>
    );
};

export default BalanzaComercial;
