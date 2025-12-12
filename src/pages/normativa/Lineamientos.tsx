import { Eye, Download, FileText, Search } from 'lucide-react';

interface Documento {
    id: string;
    titulo: string;
    norma: string;
    estado: 'Vigente' | 'Derogado' | 'En Consulta';
    fecha?: string;
    archivo: string; // Path relativo en /public
}

const DOCUMENTOS: Documento[] = [
    {
        id: '1',
        titulo: 'Ley Forestal y de Fauna Silvestre',
        norma: 'Ley N° 29763',
        estado: 'Vigente',
        fecha: '2011',
        archivo: '/normativa/lineamientos/ley-29763.pdf'
    },
    {
        id: '2',
        titulo: 'Reglamento para la Gestión Forestal',
        norma: 'DS Nº 018-2015-MINAGRI',
        estado: 'Vigente',
        fecha: '2015',
        archivo: '/normativa/lineamientos/ds-018-2015-gestion-forestal.pdf'
    },
    {
        id: '3',
        titulo: 'Reglamento para la Gestión de Fauna Silvestre',
        norma: 'DS Nº 019-2015-MINAGRI',
        estado: 'Vigente',
        fecha: '2015',
        archivo: '/normativa/lineamientos/ds-019-2015-fauna-silvestre.pdf'
    },
    {
        id: '4',
        titulo: 'Reglamento para la Gestión de Plantaciones Forestales y Sistemas Agroforestales',
        norma: 'DS Nº 020-2015-MINAGRI',
        estado: 'Vigente',
        fecha: '2015',
        archivo: '/normativa/lineamientos/ds-020-2015-plantaciones.pdf'
    },
    {
        id: '5',
        titulo: 'Reglamento para la Gestión Forestal y de Fauna Silvestre en Comunidades Nativas y Campesinas',
        norma: 'DS Nº 021-2015-MINAGRI',
        estado: 'Vigente',
        fecha: '2015',
        archivo: '/normativa/lineamientos/ds-021-2015-comunidades.pdf'
    },
    {
        id: '6',
        titulo: 'Política Nacional Forestal y de Fauna Silvestre al 2030',
        norma: 'D.S Nº 009-2023-MIDAGRI',
        estado: 'Vigente',
        fecha: '2023',
        archivo: '/normativa/lineamientos/ds-009-2023-politica-nacional.pdf'
    }
];

export default function Lineamientos() {
    const getBasePath = () => {
        return import.meta.env.BASE_URL.endsWith('/')
            ? import.meta.env.BASE_URL.slice(0, -1)
            : import.meta.env.BASE_URL;
    };

    const getFileUrl = (path: string) => `${getBasePath()}${path}`;

    return (
        <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-l-4 border-l-emerald-600">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Lineamientos de Política</h1>
                <p className="text-gray-600 text-sm">
                    Marco jurídico fundamental y políticas de estado que rigen el sector forestal peruano (Leyes, Reglamentos y Políticas Nacionales).
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Filtros / Buscador Header */}
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar norma..."
                            className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                        />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{DOCUMENTOS.length} documentos encontrados</span>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-800 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Documento / Título</th>
                                <th className="px-6 py-4">Norma Aprobatoria</th>
                                <th className="px-6 py-4 text-center">Estado</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {DOCUMENTOS.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <FileText className="text-emerald-600 mt-1 flex-shrink-0" size={18} />
                                            <div>
                                                <p className="font-medium text-gray-900">{doc.titulo}</p>
                                                <span className="text-xs text-gray-400">{doc.fecha}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                        {doc.norma}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${doc.estado === 'Vigente' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {doc.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <a
                                                href={getFileUrl(doc.archivo)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                                                title="Leer documento"
                                            >
                                                <Eye size={18} />
                                            </a>
                                            <a
                                                href={getFileUrl(doc.archivo)}
                                                download
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                                title="Descargar PDF"
                                            >
                                                <Download size={18} />
                                            </a>
                                        </div>
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
