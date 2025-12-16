import { useState, useEffect } from 'react';
import { DollarSign, TreePine, MapPin, Calculator } from 'lucide-react';
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

interface Year1Data {
    id: number;
    region: string;
    especie: string;
    sistema: string;
    dFila: number;
    dPlanta: number;
    densidad: number;
    precioPlanton: number;
    precioTotalPlantones: number;
    precioJornal: number;
    jornalesBase: number;
    preparacionTerreno: number;
    costoInsumos: number;
    gestionAdmin: number;
    inversionTotal: number;
}

interface Year2_5Data {
    region: string;
    frecuenciaDeshierbos: number;
    manoObra: number;
    insumos: number;
    costoAnual: number;
    observacion: string;
}

interface CostosData {
    metadata: { source: string; lastUpdated: string };
    kpi: {
        inversionPromedio: number;
        inversionMin: number;
        inversionMax: number;
        numEspecies: number;
        numRegiones: number;
        mantenimientoPromedio: number;
        mantenimientoMin: number;
        mantenimientoMax: number;
    };
    year1: Year1Data[];
    year2_5: Year2_5Data[];
}

const REGION_COLORS: Record<string, string> = {
    'CAJAMARCA': '#10B981',
    'ANCASH': '#3B82F6',
    'PASCO': '#8B5CF6',
    'JUNIN': '#F59E0B',
    'HUANUCO': '#EF4444',
    'SAN MARTIN': '#06B6D4',
    'MADRE DE DIOS': '#EC4899'
};

const CostosPlantaciones = () => {
    const [data, setData] = useState<CostosData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterRegion, setFilterRegion] = useState<string>('');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/costos_pfc.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const filteredYear1 = filterRegion
        ? data.year1.filter(r => r.region === filterRegion)
        : data.year1;

    // Chart data - average by region
    const regionAvg = Object.entries(
        data.year1.reduce((acc, r) => {
            if (!acc[r.region]) acc[r.region] = { total: 0, count: 0 };
            acc[r.region].total += r.inversionTotal;
            acc[r.region].count++;
            return acc;
        }, {} as Record<string, { total: number; count: number }>)
    ).map(([region, data]) => ({
        region,
        promedio: Math.round(data.total / data.count)
    })).sort((a, b) => b.promedio - a.promedio);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <DollarSign className="text-green-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Costos para Plantaciones Forestales</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | Inversión por hectárea</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Inversión Promedio Año 1</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        S/ {data.kpi.inversionPromedio.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-gray-400 ml-1">/ha</span>
                    </h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Rango de Inversión</p>
                    <h3 className="text-lg font-bold text-gray-800">
                        S/ {data.kpi.inversionMin.toLocaleString()} - {data.kpi.inversionMax.toLocaleString()}
                    </h3>
                    <p className="text-xs text-gray-500">Min - Max</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-orange-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Mantenimiento Promedio</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        S/ {data.kpi.mantenimientoPromedio.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-gray-400 ml-1">/año</span>
                    </h3>
                    <p className="text-xs text-gray-500">Años 2-5</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-purple-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Especies / Regiones</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                        {data.kpi.numEspecies} <span className="text-sm font-normal text-gray-400">/ {data.kpi.numRegiones}</span>
                    </h3>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[280px]">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Inversión Promedio por Región (S//ha)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={regionAvg} layout="vertical" margin={{ left: 100, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                        <XAxis type="number" tickFormatter={(v) => `S/ ${v.toLocaleString()}`} tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="region" tick={{ fontSize: 10 }} width={95} />
                        <Tooltip formatter={(v: number) => [`S/ ${v.toLocaleString()}`, 'Promedio']} />
                        <Bar dataKey="promedio" radius={[0, 4, 4, 0]}>
                            {regionAvg.map((entry, index) => (
                                <Cell key={index} fill={REGION_COLORS[entry.region] || '#94A3B8'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Year 1 Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
                        <TreePine size={14} /> Costos de Instalación - Año 1 (S/ por hectárea)
                    </h3>
                    <select
                        value={filterRegion}
                        onChange={(e) => setFilterRegion(e.target.value)}
                        className="text-xs border border-gray-200 rounded px-2 py-1"
                    >
                        <option value="">Todas las Regiones</option>
                        {[...new Set(data.year1.map(r => r.region))].map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
                <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase sticky top-0">
                            <tr>
                                <th className="px-2 py-2"><MapPin size={10} className="inline" /> Región</th>
                                <th className="px-2 py-2">Especie</th>
                                <th className="px-2 py-2 text-center">Sistema</th>
                                <th className="px-2 py-2 text-center">Densidad</th>
                                <th className="px-2 py-2 text-right">Plantones</th>
                                <th className="px-2 py-2 text-right">M. Obra</th>
                                <th className="px-2 py-2 text-right">Insumos</th>
                                <th className="px-2 py-2 text-right">Admin %</th>
                                <th className="px-2 py-2 text-right font-bold">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredYear1.map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-2 py-2">
                                        <span className="px-1.5 py-0.5 rounded text-xs" style={{
                                            backgroundColor: `${REGION_COLORS[r.region] || '#94A3B8'}20`,
                                            color: REGION_COLORS[r.region] || '#94A3B8'
                                        }}>
                                            {r.region}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2 font-medium">{r.especie}</td>
                                    <td className="px-2 py-2 text-center text-gray-500">{r.sistema}</td>
                                    <td className="px-2 py-2 text-center">{r.densidad}</td>
                                    <td className="px-2 py-2 text-right">{r.precioTotalPlantones.toLocaleString()}</td>
                                    <td className="px-2 py-2 text-right">{r.preparacionTerreno.toLocaleString()}</td>
                                    <td className="px-2 py-2 text-right">{r.costoInsumos.toLocaleString()}</td>
                                    <td className="px-2 py-2 text-right">{(r.gestionAdmin * 100).toFixed(0)}%</td>
                                    <td className="px-2 py-2 text-right font-bold text-green-600">
                                        S/ {r.inversionTotal.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Year 2-5 Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                    <Calculator size={14} /> Costos de Mantenimiento - Años 2 al 5 (S/ por hectárea/año)
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                            <tr>
                                <th className="px-3 py-2">Región</th>
                                <th className="px-3 py-2 text-center">Deshierbos/Año</th>
                                <th className="px-3 py-2 text-right">Mano de Obra</th>
                                <th className="px-3 py-2 text-right">Insumos</th>
                                <th className="px-3 py-2 text-right font-bold">Costo Anual</th>
                                <th className="px-3 py-2">Observación Técnica</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.year2_5.map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium">{r.region}</td>
                                    <td className="px-3 py-2 text-center">
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">
                                            {r.frecuenciaDeshierbos}x
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-right">S/ {r.manoObra.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right">S/ {r.insumos.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right font-bold text-orange-600">
                                        S/ {r.costoAnual.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 max-w-[250px]">{r.observacion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CostosPlantaciones;
