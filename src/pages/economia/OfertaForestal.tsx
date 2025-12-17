import { useState, useEffect } from 'react';
import { Factory, Flame, MapPin } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface RegionData {
    region: string;
    industrial: number;
    energetica: number;
    total: number;
    especies: string;
    vocacion: string;
}

interface ValorPIBData {
    region: string;
    vbpMadera: number;
    vbpLena: number;
    valorTotal: number;
    aportePBI: string;
    observacion: string;
}

interface OfertaData {
    metadata: { source: string; lastUpdated: string };
    kpi: { volumenTotal: number; industrial: number; energetica: number; regionLider: string };
    regiones: RegionData[];
    valorPIB?: ValorPIBData[];
}



const OfertaForestal = () => {
    const [data, setData] = useState<OfertaData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/oferta_forestal.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const pctIndustrial = ((data.kpi.industrial / data.kpi.volumenTotal) * 100).toFixed(1);

    // Data for pie chart (tipos de oferta)
    const pieData = [
        { name: 'Industrial', value: data.kpi.industrial },
        { name: 'Energética', value: data.kpi.energetica }
    ];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <Factory className="text-green-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Oferta Forestal Regional</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | 7 regiones PI1</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Volumen Total</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        {data.kpi.volumenTotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-gray-400 ml-1">m³</span>
                    </h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Oferta Industrial</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        {data.kpi.industrial.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-gray-400 ml-1">m³</span>
                    </h3>
                    <p className="text-xs text-green-600">{pctIndustrial}% del total</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-orange-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Oferta Energética</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        {data.kpi.energetica.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-gray-400 ml-1">m³</span>
                    </h3>
                    <p className="text-xs text-orange-600">{(100 - parseFloat(pctIndustrial)).toFixed(1)}% del total</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Región Líder</p>
                    <h3 className="text-lg font-bold text-gray-800">{data.kpi.regionLider}</h3>
                    <p className="text-xs text-gray-500">Mayor volumen movilizado</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Stacked Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[320px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Oferta por Región (m³)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={data.regiones} margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="region" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
                            <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v: number) => v.toLocaleString() + ' m³'} />
                            <Legend />
                            <Bar dataKey="industrial" name="Industrial" stackId="a" fill="#3B82F6" />
                            <Bar dataKey="energetica" name="Energética" stackId="a" fill="#F59E0B" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[320px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Distribución por Tipo</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="45%"
                                outerRadius={70}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                                labelLine={false}
                            >
                                <Cell fill="#3B82F6" />
                                <Cell fill="#F59E0B" />
                            </Pie>
                            <Tooltip formatter={(v: number) => v.toLocaleString() + ' m³'} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded"></div>Industrial</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-400 rounded"></div>Energética</div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Detalle por Región</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2"><MapPin size={12} className="inline mr-1" />Región</th>
                                <th className="px-3 py-2 text-right"><Factory size={12} className="inline mr-1" />Industrial (m³)</th>
                                <th className="px-3 py-2 text-right"><Flame size={12} className="inline mr-1" />Energética (m³)</th>
                                <th className="px-3 py-2 text-right">Total (m³)</th>
                                <th className="px-3 py-2">Especies Principales</th>
                                <th className="px-3 py-2">Vocación Productiva</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.regiones.map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium text-gray-900">{r.region}</td>
                                    <td className="px-3 py-2 text-right text-blue-600 font-bold">{r.industrial.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right text-orange-600 font-bold">{r.energetica.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right font-bold text-gray-800">{r.total.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-gray-600 max-w-[200px] truncate" title={r.especies}>{r.especies}</td>
                                    <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 rounded text-xs" style={{
                                            backgroundColor: r.vocacion.includes('Energética') ? '#FEF3C7' :
                                                r.vocacion.includes('Mixta') ? '#E0E7FF' : '#D1FAE5',
                                            color: r.vocacion.includes('Energética') ? '#92400E' :
                                                r.vocacion.includes('Mixta') ? '#3730A3' : '#065F46'
                                        }}>
                                            {r.vocacion.split('(')[0].trim()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Valor y PIB Table */}
            {data.valorPIB && data.valorPIB.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Valor de Producción y Aporte al PIB Regional</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                                <tr>
                                    <th className="px-3 py-2">Región</th>
                                    <th className="px-3 py-2 text-right">VBP Madera (Mill. S/.)</th>
                                    <th className="px-3 py-2 text-right">VBP Leña (Mill. S/.)</th>
                                    <th className="px-3 py-2 text-right">Valor Total (Mill. S/.)</th>
                                    <th className="px-3 py-2 text-center">Aporte al PIB</th>
                                    <th className="px-3 py-2">Observaciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.valorPIB.map((r, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 font-medium text-gray-900">{r.region}</td>
                                        <td className="px-3 py-2 text-right">{r.vbpMadera.toFixed(1)}</td>
                                        <td className="px-3 py-2 text-right">{r.vbpLena.toFixed(1)}</td>
                                        <td className="px-3 py-2 text-right font-bold text-green-600">{r.valorTotal.toFixed(1)}</td>
                                        <td className="px-3 py-2 text-center">
                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded font-medium">
                                                {r.aportePBI}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-gray-500 max-w-[250px] truncate" title={r.observacion}>{r.observacion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfertaForestal;
