import { Database, FileSpreadsheet, Layers } from 'lucide-react';

const DATASETS = [
    { title: "Frontera Agrícola", file: "BD_MNSA_FRONTERA_AGRICOLA_PI1.xlsx", size: "53 KB", desc: "Superficie agrícola nacional para diferenciar zonas de expansión forestal." },
    { title: "Zonificación de Aptitud", file: "BD_ZONIFICACION_APTITUD_20251121.xlsx", size: "131 KB", desc: "Clasificación de tierras forestales y de protección." },
    { title: "Susceptibilidad Física", file: "DB_SUSCEPTIBILIDAD_FINAL_HCO.xlsx", size: "1.9 MB", desc: "Análisis de riesgos físicos y biológicos en Huánuco." },
    { title: "Inventario Forestal", file: "BD_SERIE_HISTORICA_BOSQUES_20251121.xlsx", size: "10 KB", desc: "Serie histórica de cobertura de bosques 2001-2024." },
    { title: "Plantaciones RNPF", file: "BD_PLANTACIONES_RNPF_20251121.xlsx", size: "11 KB", desc: "Registro Nacional de Plantaciones Forestales." },
    { title: "Viveros y Semilleros", file: "BD_VIVEROS_SEMILLEROS_20251119.xlsx", size: "11 KB", desc: "Directorio de fuentes semilleras y viveros acreditados." },
];

export default function EspacialDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-green-100 rounded-lg text-green-700">
                    <Database size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard de Atributos Espaciales</h1>
                    <p className="text-gray-500 text-sm">Repositorio de datos tabulares vinculados al Geovisor (DOCS/II. ESPACIAL/02_DATA_ATRIBUTOS)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DATASETS.map((data, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Layers size={20} />
                            </div>
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">{data.size}</span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">{data.title}</h3>
                        <p className="text-sm text-gray-500 mb-6 h-12 overflow-hidden">{data.desc}</p>

                        <button className="w-full flex items-center justify-center gap-2 py-2 border border-green-200 text-green-700 rounded-lg hover:bg-green-50 text-sm font-medium transition-colors">
                            <FileSpreadsheet size={16} />
                            Ver Tabla de Datos
                        </button>
                        <div className="mt-3 text-[10px] text-gray-400 text-center truncate">
                            Fuente: {data.file}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
