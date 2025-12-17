import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface Item {
    producto: string;
    detalle: string;
    unidad: string;
    cantidad: number;
}

interface EstadData {
    metadata: { source: string; lastUpdated: string };
    kpi: {
        totalProduccion: number;
        totalImportacion: number;
        totalExportacion: number;
        balanzaComercial: number;
        deficitComercial: number;
    };
    produccion: Item[];
    importacion: Item[];
    exportacion: Item[];
}

const COLORS = {
    produccion: '#10B981',
    importacion: '#EF4444',
    exportacion: '#3B82F6'
};

export default function EstadisticasComercio() {
    const [data, setData] = useState<EstadData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/espacial/estadisticas_comercio.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    // Chart data for production
    const produccionChart = data.produccion.map(p => ({
        name: p.detalle.split('(')[0].trim(),
        value: p.cantidad
    })).filter(p => p.value > 0);

    // Chart data for trade
    const comercioChart = [
        { name: 'Exportación', value: data.kpi.totalExportacion, color: COLORS.exportacion },
        { name: 'Importación', value: data.kpi.totalImportacion, color: COLORS.importacion }
    ];

    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${value.toFixed(0)}`;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <TrendingUp className="text-green-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Estadísticas de Producción y Comercio PFC</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source}</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Package size={12} /> Producción Total
                    </p>
                    <h3 className="text-xl font-bold text-gray-800">
                        {data.kpi.totalProduccion.toLocaleString()}
                        <span className="text-sm font-normal text-gray-400 ml-1">m³</span>
                    </h3>
                    <p className="text-xs text-gray-500">Madera rolliza + aserrada</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <TrendingDown size={12} /> Total Importaciones
                    </p>
                    <h3 className="text-xl font-bold text-red-600">
                        {formatCurrency(data.kpi.totalImportacion)}
                    </h3>
                    <p className="text-xs text-gray-500">US$ CIF</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <TrendingUp size={12} /> Total Exportaciones
                    </p>
                    <h3 className="text-xl font-bold text-blue-600">
                        {formatCurrency(data.kpi.totalExportacion)}
                    </h3>
                    <p className="text-xs text-gray-500">US$ FOB</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-orange-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <AlertTriangle size={12} /> Déficit Comercial
                    </p>
                    <h3 className="text-xl font-bold text-orange-600">
                        {formatCurrency(data.kpi.deficitComercial)}
                    </h3>
                    <p className="text-xs text-gray-500">Importación - Exportación</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Production Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[280px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Producción por Especie (m³)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={produccionChart} layout="vertical" margin={{ left: 80, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                            <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={75} />
                            <Tooltip formatter={(v: number) => `${v.toLocaleString()} m³`} />
                            <Bar dataKey="value" fill={COLORS.produccion} radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Trade Balance Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[280px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Balanza Comercial (US$)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={comercioChart} margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 10 }} />
                            <Tooltip formatter={(v: number) => `US$ ${v.toLocaleString()}`} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {comercioChart.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Producción Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h3 className="text-sm font-bold text-green-700 uppercase mb-3 flex items-center gap-2">
                        <Package size={14} /> Producción
                    </h3>
                    <table className="w-full text-xs">
                        <thead className="bg-green-50 text-gray-600 font-semibold">
                            <tr>
                                <th className="px-2 py-1.5 text-left">Producto</th>
                                <th className="px-2 py-1.5 text-right">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.produccion.map((p, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-2 py-1.5">{p.detalle}</td>
                                    <td className="px-2 py-1.5 text-right font-bold text-green-600">
                                        {p.cantidad.toLocaleString()} {p.unidad}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Importación Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h3 className="text-sm font-bold text-red-700 uppercase mb-3 flex items-center gap-2">
                        <TrendingDown size={14} /> Importación
                    </h3>
                    <table className="w-full text-xs">
                        <thead className="bg-red-50 text-gray-600 font-semibold">
                            <tr>
                                <th className="px-2 py-1.5 text-left">Producto</th>
                                <th className="px-2 py-1.5 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.importacion.map((p, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-2 py-1.5">{p.detalle}</td>
                                    <td className="px-2 py-1.5 text-right font-bold text-red-600">
                                        {formatCurrency(p.cantidad)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Exportación Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h3 className="text-sm font-bold text-blue-700 uppercase mb-3 flex items-center gap-2">
                        <TrendingUp size={14} /> Exportación
                    </h3>
                    <table className="w-full text-xs">
                        <thead className="bg-blue-50 text-gray-600 font-semibold">
                            <tr>
                                <th className="px-2 py-1.5 text-left">Producto</th>
                                <th className="px-2 py-1.5 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.exportacion.map((p, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-2 py-1.5">{p.detalle}</td>
                                    <td className="px-2 py-1.5 text-right font-bold text-blue-600">
                                        {formatCurrency(p.cantidad)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Deficit Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-orange-500 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-bold text-orange-800">Déficit Comercial Significativo</h4>
                        <p className="text-sm text-orange-700">
                            El sector PFC presenta un déficit de <strong>{formatCurrency(data.kpi.deficitComercial)}</strong>,
                            principalmente por la alta importación de papel, cartón y tableros. Esto representa una oportunidad
                            para el desarrollo de plantaciones productivas orientadas a la sustitución de importaciones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
