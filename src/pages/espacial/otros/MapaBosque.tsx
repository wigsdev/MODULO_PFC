import { useState, useEffect } from 'react';
import { TreePine, AlertTriangle, Leaf, Target } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from 'recharts';

interface RegionBosque {
    region: string;
    lineaBaseNoBosque: number;
    perdidaAcumulada: number;
    bosqueRemanente: number;
    cuerposAgua: number;
    areaPotencial: number;
}

interface BosqueData {
    metadata: { source: string; lastUpdated: string };
    kpi: {
        areaPotencialTotal: number;
        bosqueRemanenteTotal: number;
        perdidaAcumuladaTotal: number;
        regionMayorPotencial: string;
        regionMayorBosque: string;
    };
    regiones: RegionBosque[];
}

const COLORS = {
    noBosque: '#94A3B8',
    perdida: '#EF4444',
    remanente: '#10B981',
    potencial: '#3B82F6'
};

export default function MapaBosque() {
    const [data, setData] = useState<BosqueData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/espacial/bosque_no_bosque.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const formatNumber = (n: number) => {
        if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
        if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
        return n.toLocaleString();
    };

    // Chart data for stacked bar
    const chartData = data.regiones.map(r => ({
        region: r.region.substring(0, 12),
        'No Bosque 2000': r.lineaBaseNoBosque,
        'Pérdida 2001-2024': r.perdidaAcumulada,
        'Bosque Remanente': r.bosqueRemanente
    }));

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <TreePine className="text-green-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Mapa Bosque / No Bosque</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | {data.regiones.length} regiones monitoreadas</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Leaf size={12} /> Bosque Remanente Total
                    </p>
                    <h3 className="text-xl font-bold text-green-600">{formatNumber(data.kpi.bosqueRemanenteTotal)} ha</h3>
                    <p className="text-xs text-gray-500">Año 2024</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <AlertTriangle size={12} /> Pérdida Acumulada
                    </p>
                    <h3 className="text-xl font-bold text-red-600">{formatNumber(data.kpi.perdidaAcumuladaTotal)} ha</h3>
                    <p className="text-xs text-gray-500">2001-2024</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Target size={12} /> Área Potencial Elegible
                    </p>
                    <h3 className="text-xl font-bold text-blue-600">{formatNumber(data.kpi.areaPotencialTotal)} ha</h3>
                    <p className="text-xs text-gray-500">Para plantaciones</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-purple-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Mayor Potencial</p>
                    <h3 className="text-lg font-bold text-purple-600">{data.kpi.regionMayorPotencial}</h3>
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[380px]">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Cobertura por Región (Hectáreas)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={chartData} margin={{ left: 20, right: 20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="region" tick={{ fontSize: 10 }} interval={0} />
                        <YAxis tickFormatter={(v) => formatNumber(v)} tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(v: number) => `${formatNumber(v)} ha`} />
                        <Legend />
                        <Bar dataKey="No Bosque 2000" stackId="a" fill={COLORS.noBosque} />
                        <Bar dataKey="Pérdida 2001-2024" stackId="a" fill={COLORS.perdida} />
                        <Bar dataKey="Bosque Remanente" fill={COLORS.remanente} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Area Potencial Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[280px]">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Área Potencial Elegible por Región (ha)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={data.regiones} layout="vertical" margin={{ left: 100, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                        <XAxis type="number" tickFormatter={(v) => formatNumber(v)} tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="region" tick={{ fontSize: 10 }} width={95} />
                        <Tooltip formatter={(v: number) => `${formatNumber(v)} ha`} />
                        <Bar dataKey="areaPotencial" radius={[0, 4, 4, 0]} name="Área Potencial">
                            {data.regiones.map((_, index) => (
                                <Cell key={index} fill={index === 0 ? '#3B82F6' : '#93C5FD'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Detalle por Región</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2">Región</th>
                                <th className="px-3 py-2 text-right">No Bosque 2000 (ha)</th>
                                <th className="px-3 py-2 text-right">Pérdida 2001-2024 (ha)</th>
                                <th className="px-3 py-2 text-right">Bosque Remanente (ha)</th>
                                <th className="px-3 py-2 text-right">Cuerpos Agua (ha)</th>
                                <th className="px-3 py-2 text-right">Área Potencial (ha)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.regiones.map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium">{r.region}</td>
                                    <td className="px-3 py-2 text-right text-gray-500">{formatNumber(r.lineaBaseNoBosque)}</td>
                                    <td className="px-3 py-2 text-right text-red-600 font-bold">{formatNumber(r.perdidaAcumulada)}</td>
                                    <td className="px-3 py-2 text-right text-green-600 font-bold">{formatNumber(r.bosqueRemanente)}</td>
                                    <td className="px-3 py-2 text-right text-blue-500">{formatNumber(r.cuerposAgua)}</td>
                                    <td className="px-3 py-2 text-right font-bold text-blue-700">{formatNumber(r.areaPotencial)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 text-sm mb-2">Notas sobre los datos</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                    <li>• <strong>Área Potencial Elegible:</strong> Suma de lo que ya no era bosque en 2000 + deforestación hasta 2024. Es la "tierra disponible" teórica para PFC.</li>
                    <li>• <strong>Cajamarca:</strong> Datos solo de provincias amazónicas (Jaén/San Ignacio) monitoreadas por GeoBosques.</li>
                    <li>• <strong>Áncash:</strong> No reporta en "Bosques Húmedos Amazónicos". Requiere capa de "Cobertura Vegetal Nacional (MINAM)".</li>
                </ul>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.noBosque }}></div>
                    No Bosque (2000)
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.perdida }}></div>
                    Pérdida (2001-2024)
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.remanente }}></div>
                    Bosque Remanente
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.potencial }}></div>
                    Área Potencial
                </div>
            </div>
        </div>
    );
}
