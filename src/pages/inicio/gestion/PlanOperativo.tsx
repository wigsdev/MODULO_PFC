import { Database, Eye, ShieldCheck, AlertTriangle } from 'lucide-react';

const PlanOperativo = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-red-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1.4.5. Plan operativo propuesto al primer año</h2>
                <p className="text-gray-700 leading-relaxed">
                    Establece el ciclo anual de gestión de la información del Observatorio, garantizando la coherencia técnica y la oficialidad del dato mediante procedimientos estandarizados de ingesta, Control de Calidad (QA), versionamiento y validación multisectorial.
                </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-8">Ciclo de Gestión de Datos (4 Fases)</h3>

                <div className="relative border-l-2 border-gray-200 ml-3 space-y-10">
                    {/* Fase I */}
                    <div className="ml-8 relative">
                        <span className="absolute -left-[41px] bg-red-500 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">1</span>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                                <Database size={20} className="text-red-500" />
                                Fase I: Ingesta y Control de Calidad (QA)
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">Transformación del dato crudo en recurso listo. Se aplican controles estrictos:</p>
                            <ul className="grid md:grid-cols-3 gap-4 text-sm">
                                <li className="bg-white p-3 rounded shadow-sm border border-gray-100">
                                    <strong className="block text-red-700">QA Semántico</strong>
                                    <span className="text-gray-600">Validación de terminología.</span>
                                </li>
                                <li className="bg-white p-3 rounded shadow-sm border border-gray-100">
                                    <strong className="block text-red-700">QA Temporal</strong>
                                    <span className="text-gray-600">Vigencia del registro.</span>
                                </li>
                                <li className="bg-white p-3 rounded shadow-sm border border-gray-100">
                                    <strong className="block text-red-700">QA Espacial</strong>
                                    <span className="text-gray-600">Topología y superposición.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Fase II */}
                    <div className="ml-8 relative">
                        <span className="absolute -left-[41px] bg-red-500 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">2</span>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                                <Eye size={20} className="text-red-500" />
                                Fase II: Publicación y Servicios
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                                <li><strong>Metadatos:</strong> Cada dataset cuenta con ficha técnica IDE-i.</li>
                                <li><strong>Versionamiento:</strong> Bitácora de cambios (Changelog) para trazabilidad.</li>
                                <li><strong>Servicios OGC:</strong> Prioridad a WMS/WFS para evitar réplicas locales.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Fase III */}
                    <div className="ml-8 relative">
                        <span className="absolute -left-[41px] bg-red-500 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">3</span>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                                <ShieldCheck size={20} className="text-red-500" />
                                Fase III: Gobernanza y Validación
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">Aval institucional de los productos:</p>
                            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                                <li><strong>Calendario:</strong> Fechas de corte y alertas de vencimiento.</li>
                                <li><strong>Validación Multisectorial:</strong> 2 sesiones anuales con SERFOR, MINAM, OSINFOR.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-orange-500">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <AlertTriangle className="text-orange-500" />
                    Gestión de Riesgos Operacionales
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: 'Disponibilidad', text: 'Fallo de servicios externos (WMS/API). Mitigación: Caché temporal y monitoreo uptime.' },
                        { title: 'Cambio de Esquema', text: 'Modificación de estructura de datos fuente. Mitigación: Scripts de ingesta flexibles.' },
                        { title: 'Coherencia Espacial', text: 'Conflictos de superposición. Mitigación: Validación anual contra zonas oficiales.' }
                    ].map((risk, i) => (
                        <div key={i} className="bg-orange-50 p-4 rounded border border-orange-100">
                            <strong className="block text-orange-800 mb-2">{risk.title}</strong>
                            <p className="text-sm text-gray-700">{risk.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlanOperativo;
