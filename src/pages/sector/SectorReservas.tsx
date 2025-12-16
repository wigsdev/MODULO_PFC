import { useState, useEffect } from 'react';
import { Globe, MapPin, Calendar, CheckCircle } from 'lucide-react';

export default function SectorReservas() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/sector/reservas.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading reservas data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando reservas de biosfera...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar reservas.json</div>;

    const { kpi, metadata, list } = data;

    return (
        <div className="space-y-4 animate-fade-in p-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Globe className="text-blue-600" size={20} /> {metadata.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Actualizado: {metadata.lastUpdated}</span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] uppercase font-bold text-gray-500">Reservas Reconocidas</h3>
                        <p className="text-2xl font-bold text-gray-800">{kpi.totalReserves}</p>
                    </div>
                    <CheckCircle size={24} className="text-blue-100" />
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] uppercase font-bold text-gray-500">Regiones Involucradas</h3>
                        <p className="text-2xl font-bold text-gray-800">{kpi.totalRegions}</p>
                    </div>
                    <MapPin size={24} className="text-emerald-100" />
                </div>
                <div className="px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] uppercase font-bold text-gray-500">Última Reconocida</h3>
                        <p className="text-sm font-bold text-gray-800 truncate max-w-[150px]" title={kpi.latestReserve}>{kpi.latestReserve}</p>
                    </div>
                    <Calendar size={24} className="text-indigo-100" />
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-6 uppercase border-b pb-2">Cronología de Reconocimiento MAB-UNESCO</h3>
                <div className="relative pt-8 pb-4 overflow-x-auto">
                    {/* Horizontal Line */}
                    <div className="absolute top-[43px] left-0 w-full h-0.5 bg-blue-100 min-w-[1000px]"></div>

                    <div className="flex gap-8 min-w-[1000px] px-4">
                        {list.map((item: any, idx: number) => (
                            <div key={idx} className="relative flex flex-col items-center flex-shrink-0 w-48">
                                {/* Year Label */}
                                <span className="text-lg font-bold text-blue-600 mb-4">{item.year}</span>

                                {/* Dot */}
                                <div className="z-10 w-4 h-4 rounded-full bg-white border-4 border-blue-500 shadow-sm mb-4"></div>

                                {/* Card content */}
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 w-full hover:shadow-md transition-shadow text-center h-full flex flex-col justify-between">
                                    <h4 className="font-bold text-gray-800 text-xs mb-2 leading-tight">{item.name}</h4>
                                    <div className="flex items-center justify-center gap-1 text-gray-500 text-[10px]">
                                        <MapPin size={10} />
                                        <span className="truncate max-w-full" title={item.regions}>{item.regions}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
