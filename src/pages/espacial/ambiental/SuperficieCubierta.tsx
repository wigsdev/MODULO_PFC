import { useState, useEffect } from 'react';
import { TreePine, MapPin } from 'lucide-react';
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

interface RegionData {
    region: string;
    superficieTotal: number;
    supBosque: number;
    cobertura: number;
    fuente: string;
    observacion: string;
}

interface SuperficieData {
    metadata: { source: string; lastUpdated: string };
    kpi: {
        totalBosque: number;
        totalSuperficie: number;
        coberturaPromedio: string;
        regionLider: string;
        regionLiderCobertura: number;
    };
    regiones: RegionData[];
}

const getColorByCobertura = (cobertura: number) => {
    if (cobertura >= 80) return '#059669';
    if (cobertura >= 50) return '#10B981';
    if (cobertura >= 30) return '#F59E0B';
    if (cobertura > 0) return '#EF4444';
    return '#94A3B8';
};

export default function SuperficieCubierta() {
    const [data, setData] = useState<SuperficieData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/espacial/superficie_bosque.json`)
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
                <div className="flex items-center gap-3">
                    <TreePine className="text-green-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Superficie Cubierta por Bosque</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source}</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Total Superficie Bosque</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        {(data.kpi.totalBosque / 1000000).toFixed(2)}M
                        <span className="text-sm font-normal text-gray-400 ml-1">ha</span>
                    </h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Cobertura Promedio</p>
                    <h3 className="text-2xl font-bold text-gray-800">{data.kpi.coberturaPromedio}%</h3>
                    <p className="text-xs text-gray-500">Regiones con bosque</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-emerald-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Líder en Cobertura</p>
                    <h3 className="text-lg font-bold text-gray-800">{data.kpi.regionLider}</h3>
                    <p className="text-xs text-green-600">{data.kpi.regionLiderCobertura}% cobertura</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-purple-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Regiones Monitoreadas</p>
                    <h3 className="text-2xl font-bold text-gray-800">{data.regiones.length}</h3>
                    <p className="text-xs text-gray-500">Ámbito PI1</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[350px]">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Superficie de Bosque por Región (ha)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={data.regiones} layout="vertical" margin={{ left: 100, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                        <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="region" tick={{ fontSize: 11 }} width={95} />
                        <Tooltip
                            formatter={(v: number) => `${v.toLocaleString()} ha`}
                            labelFormatter={(label) => `Región: ${label}`}
                        />
                        <Bar dataKey="supBosque" name="Superficie Bosque" radius={[0, 4, 4, 0]}>
                            {data.regiones.map((entry, index) => (
                                <Cell key={index} fill={getColorByCobertura(entry.cobertura)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Detalle por Región</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2"><MapPin size={12} className="inline mr-1" />Región</th>
                                <th className="px-3 py-2 text-right">Superficie Total (ha)</th>
                                <th className="px-3 py-2 text-right">Superficie Bosque (ha)</th>
                                <th className="px-3 py-2 text-center">% Cobertura</th>
                                <th className="px-3 py-2">Observación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.regiones.map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium text-gray-900">{r.region}</td>
                                    <td className="px-3 py-2 text-right">{r.superficieTotal.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right font-bold text-green-600">{r.supBosque.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-center">
                                        <span
                                            className="px-2 py-0.5 rounded font-bold"
                                            style={{
                                                backgroundColor: `${getColorByCobertura(r.cobertura)}20`,
                                                color: getColorByCobertura(r.cobertura)
                                            }}
                                        >
                                            {r.cobertura}%
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-gray-500 max-w-[200px] truncate" title={r.observacion}>{r.observacion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Color Legend */}
            <div className="flex justify-center gap-6 text-xs">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: '#059669' }}></div>≥80%</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: '#10B981' }}></div>50-79%</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: '#F59E0B' }}></div>30-49%</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: '#EF4444' }}></div>&lt;30%</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: '#94A3B8' }}></div>Sin datos</div>
            </div>
        </div>
    );
}
