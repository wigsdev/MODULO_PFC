import React, { useState, useEffect } from 'react';
import {
    Users,
    MapPin,
    Briefcase,
    Search,
    Filter,
    ExternalLink,
    Truck,
    Hammer
} from 'lucide-react';

interface ProveedorData {
    metadata: {
        title: string;
        source: string;
        lastUpdated: string;
        count: number;
    };
    kpi: {
        total: number;
        regionsCount: number;
    };
    filters: {
        regions: string[];
        eslabones: string[];
        tipos: string[];
    };
    list: Array<{
        id: number;
        region: string;
        rol: string;
        razonSocial: string;
        eslabon: string;
        tipo: string;
        servicio: string;
        contacto: string;
        correo: string;
    }>;
}

const Proveedores = () => {
    const [data, setData] = useState<ProveedorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filters
    const [selectedRegion, setSelectedRegion] = useState('Todos');
    const [selectedEslabon, setSelectedEslabon] = useState('Todos');
    const [selectedTipo, setSelectedTipo] = useState('Todos');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/proveedores.json?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando directorio...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const filteredList = data.list.filter(item => {
        const matchesSearch =
            item.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.servicio.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRegion = selectedRegion === 'Todos' || item.region === selectedRegion;
        const matchesEslabon = selectedEslabon === 'Todos' || item.eslabon === selectedEslabon;
        const matchesTipo = selectedTipo === 'Todos' || item.tipo === selectedTipo;

        return matchesSearch && matchesRegion && matchesEslabon && matchesTipo;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="text-green-600" />
                        Proveedores de Bienes y Servicios
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Directorio de actores clave en la cadena de valor forestal.
                    </p>
                </div>
                <div className="text-sm text-gray-500 text-right">
                    <p>Fuente: {data.metadata.source}</p>
                    <p>Total Registros: {data.metadata.count}</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Total Proveedores</p>
                            <h3 className="text-2xl font-bold text-gray-800">{data.kpi.total}</h3>
                        </div>
                        <Briefcase className="text-green-200" size={32} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">Regiones Cubiertas</p>
                            <h3 className="text-2xl font-bold text-gray-800">{data.kpi.regionsCount}</h3>
                        </div>
                        <MapPin className="text-blue-200" size={32} />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                    <h3 className="text-lg font-semibold whitespace-nowrap">Directorio</h3>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full xl:w-auto">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar proveedor..."
                                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="border rounded-lg px-3 py-2 text-sm bg-white"
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                            <option value="Todos">Todas Regiones</option>
                            {data.filters.regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>

                        <select
                            className="border rounded-lg px-3 py-2 text-sm bg-white"
                            value={selectedEslabon}
                            onChange={(e) => setSelectedEslabon(e.target.value)}
                        >
                            <option value="Todos">Todos Eslabones</option>
                            {data.filters.eslabones.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>

                        <select
                            className="border rounded-lg px-3 py-2 text-sm bg-white"
                            value={selectedTipo}
                            onChange={(e) => setSelectedTipo(e.target.value)}
                        >
                            <option value="Todos">Todos Tipos</option>
                            {data.filters.tipos.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Razón Social</th>
                                <th className="px-4 py-3">Región</th>
                                <th className="px-4 py-3">Eslabón</th>
                                <th className="px-4 py-3">Tipo</th>
                                <th className="px-4 py-3">Bien / Servicio</th>
                                <th className="px-4 py-3">Contacto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredList.slice(0, 10).map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {item.razonSocial}
                                        <div className="text-xs text-gray-500 font-normal">{item.rol}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{item.region}</td>
                                    <td className="px-4 py-3 text-xs">
                                        <span className="px-2 py-1 bg-gray-100 rounded-lg inline-block leading-relaxed text-center">{item.eslabon}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{item.tipo}</td>
                                    <td className="px-4 py-3 text-gray-800">{item.servicio}</td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        <div>{item.contacto}</div>
                                        <div className="truncate max-w-[150px]" title={item.correo}>{item.correo}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 text-center text-xs text-gray-500 border-t">
                        Mostrando {Math.min(10, filteredList.length)} de {filteredList.length} registros
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Proveedores;
