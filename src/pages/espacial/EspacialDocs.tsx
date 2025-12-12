import { FileText, Download, BookOpen } from 'lucide-react';

const MANUALS = [
    { title: "Manual de Frontera Agrícola", file: "MANUAL_TEC_2.1.1_FRONTERA_AGRICOLA.pdf", size: "898 KB" },
    { title: "Manual de Zonificación", file: "MANUAL_TEC_2.1.2_ZONIFICACION_APTITUD_PI1.pdf", size: "1.8 MB" },
    { title: "Manual de Zonas Susceptibles", file: "MANUAL_TEC_2.1.3_ZONAS_SUSCEPTIBLES.pdf", size: "1.1 MB" },
    { title: "Áreas de Formalización", file: "MANUAL_TEC_2.1.4_AREAS_FORMALIZACION.pdf", size: "1.5 MB" },
    { title: "Registro de Plantaciones", file: "MANUAL_TEC_2.6.1_REGISTRO_PLANTACIONES_FORESTALES.pdf", size: "1.4 MB" },
    { title: "Autoridades Forestales", file: "MANUAL_TEC_1.4.4_AUTORIDADES_FORESTALES.pdf", size: "576 KB" },
    { title: "Tierras para Plantaciones", file: "MANUAL_TEC_2.6.2_TIERRAS_PARA_PLANTACIONES_FORESTALES.pdf", size: "274 KB" },
    { title: "Potencial Forestal e Inventario", file: "MANUAL_TEC_2.2.4_POTENCIAL_FORESTAL_E_INVENTARIO.pdf", size: "478 KB" },
    { title: "Protocolo WMS", file: "FICHA_TEC_2.2_PROTOCOLO_WMS.pdf", size: "1.3 MB" },
    { title: "Protocolo Interoperabilidad", file: "FICHA_TEC_2.1.1_PROTOCOLO_DE_INTEROPERABILIDAD_MNSA.pdf", size: "1.0 MB" },
];

export default function EspacialDocs() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-700">
                    <BookOpen size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Documentación Técnica</h1>
                    <p className="text-gray-500 text-sm">Manuales y fichas técnicas del componente espacial (DOCS/II. ESPACIAL/03_DOCUMENTACION_TECNICA)</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                {MANUALS.map((doc, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-red-50 text-red-500 rounded">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">{doc.title}</h4>
                                <p className="text-xs text-gray-500">{doc.file} • {doc.size}</p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-serfor transition-colors p-2">
                            <Download size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
