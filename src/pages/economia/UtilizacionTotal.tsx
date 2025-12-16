import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, ShoppingCart } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from 'recharts';

interface IndicadorData {
    componente: string;
    unidad: string;
    valor: number;
    interpretacion: string;
}

interface UtilizacionData {
    metadata: { source: string; lastUpdated: string };
    kpi: { produccionNacional: number; exportaciones: number; importaciones: number; brechaComercial: number };
    indicadores: IndicadorData[];
}

const UtilizacionTotal = () => {
    const [data, setData] = useState<UtilizacionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/utilizacion_total.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    // Prepare balance chart data
    const balanceData = [
        { name: 'Exportaciones', valor: data.kpi.exportaciones, tipo: 'export' },
        { name: 'Importaciones', valor: -data.kpi.importaciones, tipo: 'import' }
    ];

    const formatCurrency = (value: number) => {
        const absValue = Math.abs(value);
        if (absValue >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
        if (absValue >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        return value.toLocaleString();
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <Package className="text-indigo-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Utilización Total</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | Balanza Comercial Forestal 2024</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Producción Nacional</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        {(data.kpi.produccionNacional).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-gray-400 ml-1">m³</span>
                    </h3>
                    <p className="text-xs text-gray-500">Madera rolliza</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <TrendingUp size={12} className="text-blue-500" /> Exportaciones
                    </p>
                    <h3 className="text-xl font-bold text-blue-600">
                        ${formatCurrency(data.kpi.exportaciones)}
                        <span className="text-sm font-normal text-gray-400 ml-1">USD</span>
                    </h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-orange-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <ShoppingCart size={12} className="text-orange-500" /> Importaciones
                    </p>
                    <h3 className="text-xl font-bold text-orange-600">
                        ${formatCurrency(data.kpi.importaciones)}
                        <span className="text-sm font-normal text-gray-400 ml-1">USD</span>
                    </h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <TrendingDown size={12} className="text-red-500" /> Déficit Comercial
                    </p>
                    <h3 className="text-xl font-bold text-red-600">
                        ${formatCurrency(Math.abs(data.kpi.brechaComercial))}
                        <span className="text-sm font-normal text-gray-400 ml-1">USD</span>
                    </h3>
                    <p className="text-xs text-red-500">Brecha estructural</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Balance Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[280px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Balanza Comercial Forestal (USD)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={balanceData} margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tickFormatter={(v) => `${formatCurrency(v)}`} tick={{ fontSize: 10 }} />
                            <Tooltip formatter={(v: number) => ['$' + Math.abs(v).toLocaleString() + ' USD', v > 0 ? 'Salida' : 'Entrada']} />
                            <ReferenceLine y={0} stroke="#374151" />
                            <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                                {balanceData.map((entry, index) => (
                                    <Cell key={index} fill={entry.tipo === 'export' ? '#10B981' : '#EF4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-sm border border-red-100 p-6 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-red-800 mb-3">⚠️ Déficit Estructural</h3>
                    <p className="text-3xl font-bold text-red-600 mb-2">
                        -${formatCurrency(Math.abs(data.kpi.brechaComercial))} USD
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                        El país importa <strong>2.5x más</strong> de lo que exporta en productos forestales.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-white/60 rounded p-2">
                            <p className="text-gray-500">Ratio Import/Export</p>
                            <p className="font-bold text-orange-700">{(data.kpi.importaciones / data.kpi.exportaciones).toFixed(1)}x</p>
                        </div>
                        <div className="bg-white/60 rounded p-2">
                            <p className="text-gray-500">Oportunidad PI1</p>
                            <p className="font-bold text-green-700">Sustitución de importaciones</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicators Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Indicadores de Utilización 2024</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2">Componente / Indicador</th>
                                <th className="px-3 py-2">Unidad</th>
                                <th className="px-3 py-2 text-right">Valor 2024</th>
                                <th className="px-3 py-2">Interpretación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.indicadores.filter(i => i.valor !== 0 || i.componente.includes('.')).map((ind, idx) => (
                                <tr key={idx} className={`hover:bg-gray-50 ${ind.componente.includes('.') ? 'bg-gray-50 font-semibold' : ''}`}>
                                    <td className="px-3 py-2 text-gray-900">{ind.componente}</td>
                                    <td className="px-3 py-2 text-gray-500">{ind.unidad}</td>
                                    <td className="px-3 py-2 text-right font-bold">
                                        <span className={ind.valor < 0 ? 'text-red-600' : 'text-green-600'}>
                                            {ind.valor !== 0 ? (ind.unidad.includes('US') ? '$' : '') + ind.valor.toLocaleString() : '-'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 max-w-[300px]">{ind.interpretacion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UtilizacionTotal;
