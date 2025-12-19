import { Users, FileCheck, Server, ShieldCheck, Network } from 'lucide-react';

const Organigrama = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-purple-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1.4.2. Organigrama y Modelo Operativo</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    El Observatorio de Plantaciones Forestales Comerciales (PFC) adopta una estructura operativa matricial, ligada funcionalmente al SNIFFS e interoperable tecnológicamente con la IDE-i SERFOR (GEOSERFOR). Este diseño establece líneas de reporte claras y funciones diferenciadas para garantizar la trazabilidad del dato, el control de calidad (QA) y la publicación estandarizada con metadatos.
                </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Estructura y Líneas de Reporte</h3>

                <div className="space-y-6">
                    {/* Coordinación */}
                    <div className="flex gap-4">
                        <div className="flex-none">
                            <div className="bg-purple-100 p-3 rounded-full text-purple-700"><Users size={24} /></div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900">1. Coordinación del Observatorio (SERFOR / UE-003)</h4>
                            <div className="mt-2 space-y-2 text-gray-700">
                                <p><strong className="text-purple-800">Función:</strong> Ejerce la dirección estratégica. Conduce la operación integral, aprueba lineamientos, planes operativos y el calendario oficial de actualizaciones. Articula la relación con los custodios sectoriales y lidera la validación multisectorial.</p>
                                <p><strong className="text-purple-800">Línea de Reporte:</strong> Reporta directamente al nivel directivo del SERFOR responsable del SNIFFS.</p>
                            </div>
                        </div>
                    </div>

                    {/* Unidad Técnica */}
                    <div className="flex gap-4">
                        <div className="flex-none">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-700"><FileCheck size={24} /></div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900">2. Unidad Técnica de Información y Análisis</h4>
                            <div className="mt-2 space-y-2 text-gray-700">
                                <p><strong className="text-blue-800">Función:</strong> Responsable de la "curaduría del dato". Ejecuta la ingesta, depuración y aseguramiento de la calidad (QA) verificando la consistencia semántica, temporal y espacial. Define los metadatos obligatorios, elabora fichas técnicas y gestiona el versionamiento.</p>
                                <p><strong className="text-blue-800">Línea de Reporte:</strong> Reporta a la Coordinación del Observatorio.</p>
                            </div>
                        </div>
                    </div>

                    {/* Soporte Tecnológico */}
                    <div className="flex gap-4">
                        <div className="flex-none">
                            <div className="bg-gray-100 p-3 rounded-full text-gray-700"><Server size={24} /></div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900">3. Unidad de Plataforma e Interoperabilidad (IDE-i / GEOSERFOR)</h4>
                            <div className="mt-2 space-y-2 text-gray-700">
                                <p><strong className="text-gray-800">Función:</strong> Provee el soporte tecnológico. Gestiona la publicación y consumo de servicios bajo estándares OGC (WMS/WMTS/WFS), administra el catálogo de metadatos y asegura la integración técnica con la infraestructura del SNIFFS.</p>
                                <p><strong className="text-gray-800">Línea de Reporte:</strong> Reporta a la Coordinación y mantiene enlace técnico con el equipo de IDE-i.</p>
                            </div>
                        </div>
                    </div>

                    {/* Puntos Focales */}
                    <div className="flex gap-4">
                        <div className="flex-none">
                            <div className="bg-green-100 p-3 rounded-full text-green-700"><Network size={24} /></div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900">4. Puntos Focales por Custodio (Entidades Vinculantes)</h4>
                            <div className="mt-2 space-y-2 text-gray-700">
                                <p><strong className="text-green-800">Función:</strong> Proveedores oficiales de información. Remiten los datasets cumpliendo con la ficha técnica y frecuencia establecida; validan los contenidos publicados y notifican nuevas versiones.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <ShieldCheck className="text-gray-600" />
                        Instrumentos de Gestión
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700 list-disc pl-5">
                        <li><strong>Organigrama Institucional:</strong> Esquema gráfico oficial.</li>
                        <li><strong>Manual de Operaciones:</strong> Documento normativo de procesos y políticas.</li>
                        <li><strong>Matriz de Información Estratégica:</strong> Inventario de productos y custodios.</li>
                        <li><strong>Evidencias de Validación:</strong> Actas de la Mesa Multisectorial.</li>
                    </ul>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Server className="text-gray-600" />
                        Fuentes de Soporte
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700 list-disc pl-5">
                        <li><strong>SNIFFS (SERFOR):</strong> Módulos y componentes del servicio nacional.</li>
                        <li><strong>GEOSERFOR / IDE-i:</strong> Visor cartográfico y catálogo de metadatos.</li>
                        <li><strong>OSINFOR:</strong> Observatorio de desempeño regulatorio.</li>
                        <li><strong>GEOBOSQUES (MINAM):</strong> Monitoreo de deforestación.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Organigrama;
