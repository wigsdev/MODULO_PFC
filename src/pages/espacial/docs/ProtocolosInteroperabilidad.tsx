import { Eye, Download, FileCode, Search } from 'lucide-react';

const PROTOCOLS = [
    { id: '1', title: "Protocolo WMS", file: "FICHA_TEC_2.2_PROTOCOLO_WMS.pdf", size: "1.3 MB", desc: "Especificaciones técnicas para la publicación de servicios de mapas web (WMS)." },
    { id: '2', title: "Protocolo Interoperabilidad", file: "FICHA_TEC_2.1.1_PROTOCOLO_DE_INTEROPERABILIDAD_MNSA.pdf", size: "1.0 MB", desc: "Estándares y lineamientos para el intercambio de información geoespacial del MNSA." },
];

export default function ProtocolosInteroperabilidad() {
    const getFileUrl = (filename: string) => `${import.meta.env.BASE_URL}docs/espacial/manuales/${filename}`;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-emerald-500">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Protocolos de Interoperabilidad</h1>
                <p className="text-gray-600">
                    Estándares y fichas técnicas que definen las reglas para el intercambio de información espacial y la integración de servicios.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar protocolo..."
                            className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                        />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{PROTOCOLS.length} documentos</span>
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
                            {PROTOCOLS.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded mt-1">
                                                <FileCode size={20} />
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
