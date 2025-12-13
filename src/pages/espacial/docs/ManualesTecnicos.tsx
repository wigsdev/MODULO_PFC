import { Eye, Download, FileText, Search } from 'lucide-react';

const MANUALS = [
    { id: '1', title: "Manual de Frontera Agrícola", file: "MANUAL_TEC_2.1.1_FRONTERA_AGRICOLA.pdf", size: "898 KB", desc: "Lineamientos para la identificación de la frontera agrícola." },
    { id: '2', title: "Manual de Zonificación", file: "MANUAL_TEC_2.1.2_ZONIFICACION_APTITUD_PI1.pdf", size: "1.8 MB", desc: "Metodología para la zonificación de aptitud forestal." },
    { id: '3', title: "Manual de Zonas Susceptibles", file: "MANUAL_TEC_2.1.3_ZONAS_SUSCEPTIBLES.pdf", size: "1.1 MB", desc: "Identificación de zonas susceptibles a la deforestación." },
    { id: '4', title: "Áreas de Formalización", file: "MANUAL_TEC_2.1.4_AREAS_FORMALIZACION.pdf", size: "1.5 MB", desc: "Procedimientos para la formalización de áreas." },
    { id: '5', title: "Registro de Plantaciones", file: "MANUAL_TEC_2.6.1_REGISTRO_PLANTACIONES_FORESTALES.pdf", size: "1.4 MB", desc: "Guía para el registro nacional de plantaciones." },
    { id: '6', title: "Autoridades Forestales", file: "MANUAL_TEC_1.4.4_AUTORIDADES_FORESTALES.pdf", size: "576 KB", desc: "Directorio y funciones de las autoridades regionales." },
    { id: '7', title: "Tierras para Plantaciones", file: "MANUAL_TEC_2.6.2_TIERRAS_PARA_PLANTACIONES_FORESTALES.pdf", size: "274 KB", desc: "Criterios para la identificación de tierras aptas." },
    { id: '8', title: "Potencial Forestal e Inventario", file: "MANUAL_TEC_2.2.4_POTENCIAL_FORESTAL_E_INVENTARIO.pdf", size: "478 KB", desc: "Evaluación del potencial e inventario forestal." },
];

export default function ManualesTecnicos() {
    const getFileUrl = (filename: string) => `${import.meta.env.BASE_URL}docs/espacial/manuales/${filename}`;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Manuales Técnicos</h1>
                <p className="text-gray-600">
                    Colección de manuales y guías técnicas para el uso e interpretación de la información espacial del módulo.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar manual..."
                            className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{MANUALS.length} documentos</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-800 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Documento / Descripción</th>
                                <th className="px-6 py-4 text-center">Tamaño</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {MANUALS.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded mt-1">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{doc.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{doc.desc}</p>
                                                <span className="text-[10px] text-gray-400 font-mono mt-1 block">{doc.file}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {doc.size}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <a
                                                href={getFileUrl(doc.file)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Ver Documento"
                                            >
                                                <Eye size={18} />
                                            </a>
                                            <a
                                                href={getFileUrl(doc.file)}
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
