
import { useState, useEffect } from 'react';
import { Download, Sprout, Search, MapPin, Building2 } from 'lucide-react';

export default function RegistrosViveros() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('');

    useEffect(() => {
        const url = `${import.meta.env.BASE_URL} data / espacial / registros_viveros.json ? t = ${new Date().getTime()} `;
        fetch(url)
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading viveros data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Cargando viveros...</div>;
    if (!data) return <div className="p-10 text-center text-red-500 text-sm">Error: No se pudo cargar registros_viveros.json</div>;

    const { metadata, list } = data;

    // Unique Departments for Filter
    const departments = Array.from(new Set(list.map((item: any) => item.departamento))).sort() as string[];

    // Filtering Logic
    const filteredList = list.filter((item: any) => {
        const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.especies.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = deptFilter ? item.departamento === deptFilter : true;
        return matchesSearch && matchesDept;
    });

    return (
        <div className="space-y-4 animate-fade-in p-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Sprout className="text-green-600" size={20} />
                        {metadata.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="hidden md:inline">Actualizado: {metadata.lastUpdated}</span>
                    <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                        <Download size={13} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar por vivero o especie..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="py-2 px-4 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                >
                    <option value="">Todos los Departamentos</option>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto max-h-[500px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Establecimiento</th>
                                <th className="px-6 py-3 font-semibold">Ubicación</th>
                                <th className="px-6 py-3 font-semibold">Especies Principales</th>
                                <th className="px-6 py-3 font-semibold text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredList.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{item.nombre}</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <Building2 size={10} /> {item.titular}
                                            </span>
                                            <span className="text-[10px] text-gray-400 mt-1 px-1.5 py-0.5 bg-gray-100 rounded inline-block w-fit">
                                                {item.tipo}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1 font-medium text-gray-700">
                                                <MapPin size={12} className="text-gray-400" /> {item.departamento}
                                            </span>
                                            <span className="text-xs pl-4">{item.provincia}, {item.distrito}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={item.especies}>
                                        {item.especies}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.estado === 'Activo'
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-red-50 text-red-700'
                                            }`}>
                                            {item.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredList.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                        No se encontraron registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 px-6 py-2 border-t text-xs text-gray-500 text-right">
                    Mostrando {filteredList.length} de {list.length} registros
                </div>
            </div>
        </div>
    );
}
