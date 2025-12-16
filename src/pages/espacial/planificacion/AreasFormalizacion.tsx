import { useState, useEffect } from 'react';
import { FileText, MapPin, Users, AlertCircle } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface Prioridad {
    tipo: string;
    superficie: number;
    predios: number;
    distritos: number;
    porcentaje: string;
}

interface Provincia {
    nombre: string;
    superficie: number;
    predios: number;
    distritos: number;
}

interface TopDistrito {
    prioridad: string;
    prioridadCorta: string;
    provincia: string;
    distrito: string;
    superficie: number;
    predios: number;
}

interface BrechaData {
    metadata: { source: string; lastUpdated: string; departamento: string };
    kpi: {
        superficieTotal: number;
        prediosTotal: number;
        superficieMuyAlta: number;
        superficieAlta: number;
        provinciaLider: string;
    };
    prioridad: Prioridad[];
    provincias: Provincia[];
    topDistritos: TopDistrito[];
}

const PRIORIDAD_COLORS = ['#DC2626', '#F59E0B'];

export default function AreasFormalizacion() {
    const [data, setData] = useState<BrechaData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/espacial/brecha_titulacion.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const pctMuyAlta = ((data.kpi.superficieMuyAlta / data.kpi.superficieTotal) * 100).toFixed(1);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex items-center gap-3">
                    <FileText className="text-orange-600" size={24} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Brecha de Titulación - Áreas de Formalización</h1>
                        <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | {data.metadata.departamento}</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Superficie Total por Titular</p>
                    <h3 className="text-xl font-bold text-gray-800">
                        {data.kpi.superficieTotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-gray-400 ml-1">ha</span>
                    </h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Users size={12} /> Predios Estimados
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800">{data.kpi.prediosTotal.toLocaleString()}</h3>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-orange-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Prioridad Muy Alta</p>
                    <h3 className="text-xl font-bold text-red-600">
                        {data.kpi.superficieMuyAlta.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-gray-400 ml-1">ha</span>
                    </h3>
                    <p className="text-xs text-red-600">{pctMuyAlta}% del total</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Provincia Prioritaria</p>
                    <h3 className="text-lg font-bold text-gray-800">{data.kpi.provinciaLider}</h3>
                    <p className="text-xs text-gray-500">Mayor brecha</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Pie Chart - Prioridad */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[320px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Distribución por Prioridad de Titulación</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                            <Pie
                                data={data.prioridad}
                                cx="50%"
                                cy="45%"
                                outerRadius={80}
                                dataKey="superficie"
                                nameKey="tipo"
                                label={({ tipo, porcentaje }) => `${tipo.split('(')[0].trim()}: ${porcentaje}%`}
                                labelLine={false}
                            >
                                {data.prioridad.map((_, index) => (
                                    <Cell key={index} fill={PRIORIDAD_COLORS[index % PRIORIDAD_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: number) => `${v.toLocaleString()} ha`} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-600 rounded"></div>Muy Alta (Corredor)</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-400 rounded"></div>Alta (Expansión)</div>
                    </div>
                </div>

                {/* Bar Chart - Top Provincias */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[320px]">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Brecha por Provincia (ha)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={data.provincias} layout="vertical" margin={{ left: 100, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                            <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="nombre" tick={{ fontSize: 10 }} width={95} />
                            <Tooltip formatter={(v: number) => `${v.toLocaleString()} ha`} />
                            <Bar dataKey="superficie" fill="#DC2626" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Distritos Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                    <AlertCircle size={14} className="text-red-500" /> Top 20 Distritos con Mayor Brecha
                </h3>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase sticky top-0">
                            <tr>
                                <th className="px-3 py-2">#</th>
                                <th className="px-3 py-2">Prioridad</th>
                                <th className="px-3 py-2"><MapPin size={10} className="inline" /> Provincia</th>
                                <th className="px-3 py-2">Distrito</th>
                                <th className="px-3 py-2 text-right">Superficie (ha)</th>
                                <th className="px-3 py-2 text-right">Predios Est.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.topDistritos.map((d, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${d.prioridadCorta === 'Muy Alta'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {d.prioridadCorta}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-gray-600">{d.provincia}</td>
                                    <td className="px-3 py-2 font-medium text-gray-900">{d.distrito}</td>
                                    <td className="px-3 py-2 text-right font-bold text-red-600">{d.superficie.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-3 py-2 text-right">{d.predios.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Prioridad Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.prioridad.map((p, idx) => (
                    <div key={idx} className={`rounded-lg shadow-sm border p-4 ${idx === 0 ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                        }`}>
                        <h4 className={`font-bold mb-2 ${idx === 0 ? 'text-red-800' : 'text-orange-800'}`}>{p.tipo}</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Superficie</p>
                                <p className="font-bold">{p.superficie.toLocaleString()} ha</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Predios</p>
                                <p className="font-bold">{p.predios.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Distritos</p>
                                <p className="font-bold">{p.distritos}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
