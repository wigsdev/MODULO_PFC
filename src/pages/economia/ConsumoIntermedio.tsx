import { useState, useEffect } from 'react';
import { Cog, MapPin } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface SectorData {
    region: string;
    producto: string;
    sectorConsumidor: string;
    volumen: number;
    rendimiento: string;
    productoFinal: string;
    observacion: string;
}

interface ConsumoData {
    metadata: { source: string; lastUpdated: string };
    kpi: { volumenTotal: number; numSectores: number; sectorPrincipal: string };
    sectores: SectorData[];
}

const ConsumoIntermedio = () => {
    const [data, setData] = useState<ConsumoData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/consumo_intermedio.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    // Chart data sorted by volume
    const chartData = [...data.sectores].sort((a, b) => b.volumen - a.volumen);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <Cog className="text-blue-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Consumo Intermedio</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | Sector Industrial PI1</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Volumen Total Consumido</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        {data.kpi.volumenTotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-gray-400 ml-1">m³</span>
                    </h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Sectores Analizados</p>
                    <h3 className="text-2xl font-bold text-gray-800">{data.kpi.numSectores}</h3>
                    <p className="text-xs text-gray-500">Regiones productivas</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Sector Principal</p>
                    <h3 className="text-sm font-bold text-gray-800 truncate" title={data.kpi.sectorPrincipal}>
                        {data.kpi.sectorPrincipal.split('/')[0]}
                    </h3>
                    <p className="text-xs text-gray-500">Mayor consumidor</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[300px]">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Volumen Consumido por Región (m³)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 100, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                        <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="region" tick={{ fontSize: 11 }} width={95} />
                        <Tooltip formatter={(v: number) => v.toLocaleString() + ' m³'} />
                        <Bar dataKey="volumen" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Detalle de Consumo Intermedio por Región</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2"><MapPin size={12} className="inline mr-1" />Región</th>
                                <th className="px-3 py-2">Producto Forestal</th>
                                <th className="px-3 py-2">Sector Consumidor</th>
                                <th className="px-3 py-2 text-right">Volumen (m³)</th>
                                <th className="px-3 py-2 text-center">Rendimiento</th>
                                <th className="px-3 py-2">Producto Final</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.sectores.map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium text-gray-900">{r.region}</td>
                                    <td className="px-3 py-2 text-gray-600 max-w-[150px] truncate" title={r.producto}>{r.producto}</td>
                                    <td className="px-3 py-2 text-gray-700">{r.sectorConsumidor}</td>
                                    <td className="px-3 py-2 text-right font-bold text-blue-600">{r.volumen.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-center">
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                                            {r.rendimiento}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 max-w-[200px] truncate" title={r.productoFinal}>{r.productoFinal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Observations Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.sectores.slice(0, 6).map((r, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                        <h4 className="font-bold text-gray-800 mb-1">{r.region}</h4>
                        <p className="text-xs text-gray-600">{r.observacion}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConsumoIntermedio;
