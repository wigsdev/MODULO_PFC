import { Network, FileCheck, Server, UserCheck, Users, Briefcase, Map } from 'lucide-react';

export default function GestionContent() {
    return (
        <div className="max-w-5xl mx-auto p-8 space-y-20 scroll-smooth">

            {/* 1. Líneas Prioritarias */}
            <section id="lineas" className="scroll-mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-green-500 pl-4">1. Líneas Prioritarias de Trabajo</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                    <p className="text-gray-600">
                        Ejes estratégicos para cerrar las brechas de conexión entre oferta y demanda mediante directorios especializados y datos de inteligencia comercial.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="border border-green-100 rounded-lg p-4 bg-green-50/50">
                            <h3 className="font-bold text-green-800 mb-2">Línea A</h3>
                            <h4 className="font-semibold text-sm mb-2">Directorio de Proveedores PFC</h4>
                            <p className="text-xs text-gray-500">
                                Directorio comercial verificable de bienes y servicios (Eslabón I, II y III) en las regiones priorizadas.
                            </p>
                        </div>
                        <div className="border border-blue-100 rounded-lg p-4 bg-blue-50/50">
                            <h3 className="font-bold text-blue-800 mb-2">Línea B</h3>
                            <h4 className="font-semibold text-sm mb-2">Integración a Registros</h4>
                            <p className="text-xs text-gray-500">
                                Acceso único a registros oficiales: Regentes, Viveros, Semilleros y RNPF.
                            </p>
                        </div>
                        <div className="border border-orange-100 rounded-lg p-4 bg-orange-50/50">
                            <h3 className="font-bold text-orange-800 mb-2">Línea C</h3>
                            <h4 className="font-semibold text-sm mb-2">Inteligencia de Mercado</h4>
                            <p className="text-xs text-gray-500">
                                Datos de producción, precios, exportaciones y monitoreo satelital.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Organigrama */}
            <section id="organigrama" className="scroll-mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-purple-500 pl-4">2. Estructura y Organigrama</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-600 mb-6">
                        Modelo operativo matricial ligado al SNIFFS e interoperable con la IDE-i SERFOR.
                    </p>

                    <div className="space-y-4">
                        <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                            <div className="bg-purple-100 p-3 rounded-full h-fit text-purple-600"><Users size={24} /></div>
                            <div>
                                <h3 className="font-bold text-gray-800">Coordinación Ejecutiva (SERFOR)</h3>
                                <p className="text-sm text-gray-500">Dirección estratégica y articulación interinstitucional.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow ml-8 border-l-purple-200">
                            <div className="bg-blue-100 p-3 rounded-full h-fit text-blue-600"><FileCheck size={24} /></div>
                            <div>
                                <h3 className="font-bold text-gray-800">Unidad Técnica de Análisis</h3>
                                <p className="text-sm text-gray-500">Curaduría del dato, control de calidad (QA) y validación.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow ml-8 border-l-purple-200">
                            <div className="bg-gray-100 p-3 rounded-full h-fit text-gray-600"><Server size={24} /></div>
                            <div>
                                <h3 className="font-bold text-gray-800">Soporte Tecnológico (IDE-i)</h3>
                                <p className="text-sm text-gray-500">Infraestructura, servicios OGC e interoperabilidad.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Roles de Entidades */}
            <section id="roles" className="scroll-mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-4">3. Roles de Entidades Vinculantes</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { entity: 'SERFOR (SNIFFS)', role: 'Fuente Matriz', desc: 'Registros administrativos, Catastro y Normatividad.', icon: Briefcase },
                            { entity: 'MINAM (GeoBosques)', role: 'Monitoreo Ambiental', desc: 'Deforestación anual y alertas tempranas.', icon: Map },
                            { entity: 'OSINFOR', role: 'Supervisión', desc: 'Listas Rojas/Verdes y desempeño de títulos.', icon: FileCheck },
                            { entity: 'SUNAT / PROMPERÚ', role: 'Comercial', desc: 'Validación de contribuyentes y comercio exterior.', icon: Network },
                            { entity: 'GOREs / ARFFS', role: 'Regional', desc: 'Información primaria operativa y control de campo.', icon: Users },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 border rounded bg-gray-50">
                                <item.icon className="text-blue-500 mt-1" size={18} />
                                <div>
                                    <span className="font-bold text-gray-800 block text-sm">{item.entity}</span>
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{item.role}</span>
                                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Autoridad Forestal */}
            <section id="autoridad" className="scroll-mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-yellow-500 pl-4">4. Autoridad Forestal (Nacional y Regional)</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border-t-2 border-yellow-100">
                    <p className="text-gray-600 mb-4">
                        Marco institucional del SINAFOR para la articulación de datos y competencias.
                    </p>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 bg-yellow-50/30 rounded border border-yellow-100">
                            <div className="text-center md:text-left">
                                <h3 className="font-bold text-gray-900">Nivel Nacional (SERFOR)</h3>
                                <p className="text-sm text-gray-600">Rectoría técnica, normativa y administración del SNIFFS.</p>
                            </div>
                            <div className="h-px w-full md:w-px md:h-10 bg-yellow-200"></div>
                            <div className="text-center md:text-right">
                                <h3 className="font-bold text-gray-900">Nivel Regional (ARFFS/ATFFS)</h3>
                                <p className="text-sm text-gray-600">Gestión operativa, emisión de títulos y control en campo.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Plan Operativo */}
            <section id="plan" className="scroll-mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-red-500 pl-4">5. Plan Operativo (Año 1)</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Ciclo de Gestión de Datos</h3>
                    <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                        <div className="mb-8 ml-6">
                            <span className="virtual-marker absolute -left-[9px] bg-red-500 w-4 h-4 rounded-full border-2 border-white ring-2 ring-red-100"></span>
                            <h4 className="font-bold text-gray-900">Fase I: Ingesta y QA</h4>
                            <p className="text-sm text-gray-500 mt-1">Transformación del dato crudo, estandarización y control de calidad (Semántico, Temporal, Espacial).</p>
                        </div>
                        <div className="mb-8 ml-6">
                            <span className="virtual-marker absolute -left-[9px] bg-red-500 w-4 h-4 rounded-full border-2 border-white ring-2 ring-red-100"></span>
                            <h4 className="font-bold text-gray-900">Fase II: Publicación</h4>
                            <p className="text-sm text-gray-500 mt-1">Exposición pública, metadatos, versionamiento y servicios web (WMS/WFS).</p>
                        </div>
                        <div className="ml-6">
                            <span className="virtual-marker absolute -left-[9px] bg-red-500 w-4 h-4 rounded-full border-2 border-white ring-2 ring-red-100"></span>
                            <h4 className="font-bold text-gray-900">Fase III: Gobernanza</h4>
                            <p className="text-sm text-gray-500 mt-1">Validación multisectorial y feedback para el siguiente ciclo.</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
