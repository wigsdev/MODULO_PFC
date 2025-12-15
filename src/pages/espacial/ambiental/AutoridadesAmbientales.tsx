import { useState, useEffect } from 'react';
import { Download, Share2, Building2, ExternalLink, Globe } from 'lucide-react';

export default function AutoridadesAmbientales() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL}data/espacial/autoridades_ambientales.json?t=${new Date().getTime()}`;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading autoridades data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando autoridades...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar autoridades_ambientales.json</div>;

    const { metadata, autoridades } = data;

    return (
        <div className="space-y-4 animate-fade-in p-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Building2 className="text-blue-600" size={20} />
                        {metadata.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="hidden md:inline">Actualizado: {metadata.lastUpdated}</span>
                    <div className="h-4 w-px bg-gray-200 mx-1 hidden md:block"></div>
                    <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <Share2 size={13} />
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <Download size={13} />
                    </button>
                </div>
            </div>

            {/* Responsive Table Container */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Entidad</th>
                                <th className="px-6 py-3 font-semibold hidden md:table-cell">Función Principal</th>
                                <th className="px-6 py-3 font-semibold">Ámbito</th>
                                <th className="px-6 py-3 font-semibold text-center">Enlace</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {autoridades.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{item.siglas}</span>
                                            <span className="text-xs text-gray-500">{item.entidad}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell max-w-xs">
                                        {item.funcion}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.nivel === 'NACIONAL'
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'bg-emerald-50 text-emerald-700'
                                            }`}>
                                            {item.ambito}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <a
                                            href={item.enlace}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-md border border-gray-200 hover:border-blue-200 transition-all group"
                                        >
                                            <span className="text-xs font-bold">Ir a Sitio</span>
                                            <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
