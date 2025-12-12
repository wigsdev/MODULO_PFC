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
        titulo: 'Ley del Régimen Laboral Agrario y de Incentivos (Incluye Forestal)',
        norma: 'Ley N.° 31110',
        estado: 'Vigente',
        fecha: '2020',
        archivo: '/normativa/incentivos/ley-31110-regimen-agrario.pdf'
    },
    {
        id: '2',
        titulo: 'Beneficios Tributarios en la Amazonía (Exoneración IGV/Renta)',
        norma: 'Decreto Legislativo N.° 1517',
        estado: 'Vigente',
        fecha: '2021',
        archivo: '/normativa/incentivos/dl-1517-amazonia.pdf'
    },
    {
        id: '3',
        titulo: 'Ley de Competitividad Productiva (PROCOMPITE)',
        norma: 'Ley N.° 29337',
        estado: 'Vigente',
        fecha: '2009',
        archivo: '/normativa/incentivos/ley-29337-procompite.pdf'
    },
    {
        id: '4',
        titulo: 'Reestructuración del Fondo AGROPERÚ (Financiamiento Directo)',
        norma: 'D.S. N.° 004-2020-MINAGRI',
        estado: 'Vigente',
        fecha: '2020',
        archivo: '/normativa/incentivos/ds-004-2020-agroperu.pdf'
    },
    {
        id: '5',
        titulo: 'TUO de la Ley de Obras por Impuestos (OxI)',
        norma: 'D.S. N.° 081-2022-EF',
        estado: 'Vigente',
        fecha: '2022',
        archivo: '/normativa/incentivos/ds-081-2022-oxi.pdf'
    },
    {
        id: '6',
        titulo: 'TUO de la Ley de Asociaciones Público Privadas (APP)',
        norma: 'D.S. N.° 195-2023-EF',
        estado: 'Vigente',
        fecha: '2023',
        archivo: '/normativa/incentivos/ds-195-2023-app.pdf'
    }
];

export default function Incentivos() {
    const getBasePath = () => {
        return import.meta.env.BASE_URL.endsWith('/')
            ? import.meta.env.BASE_URL.slice(0, -1)
            : import.meta.env.BASE_URL;
    };

    const getFileUrl = (path: string) => `${getBasePath()}${path}`;

    return (
        <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-l-4 border-l-purple-500">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Incentivos para el Desarrollo</h1>
                <p className="text-gray-600 text-sm">
                    Marco legal de incentivos económicos, tributarios y financieros (Obras por Impuestos, APP, Fondos Concursables) para promover la inversión forestal.
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
                            className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
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
                                            <FileText className="text-purple-500 mt-1 flex-shrink-0" size={18} />
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
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
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
