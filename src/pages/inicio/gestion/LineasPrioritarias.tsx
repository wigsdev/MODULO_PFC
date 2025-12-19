import { LayoutGrid, Users, Briefcase } from 'lucide-react';

const LineasPrioritarias = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-green-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1.4.1. Líneas prioritarias de trabajo</h2>
                <p className="text-gray-700 leading-relaxed">
                    Esta sección define los tres ejes estratégicos para la gestión de información del Observatorio, cuyo desarrollo y resultados están alineados directamente con los cuatro Componentes del Proyecto de Inversión (PI) para Plantaciones Forestales. Estos ejes están diseñados para cerrar las brechas de conexión entre oferta y demanda mediante directorios especializados y datos de inteligencia comercial.
                </p>
            </div>

            {/* Línea A */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-100 p-3 rounded-full text-green-700">
                        <LayoutGrid size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Línea A — Registro y directorio de proveedores PFC (PRIORITARIA)</h3>
                </div>

                <div className="pl-4 border-l-2 border-green-100 space-y-4">
                    <p className="text-gray-700 font-medium">
                        <span className="font-bold text-green-800">Objetivo:</span> Implementar un directorio comercial verificable y georreferenciado que consolide la oferta de bienes y servicios en las 7 regiones priorizadas, integrando la información oficial con la base de datos primaria levantada en campo para cubrir los tres eslabones de la cadena de valor.
                    </p>

                    <h4 className="font-bold text-gray-800 mt-6">Categorización de Actores (Basado en Matriz de Oferta)</h4>
                    <p className="text-gray-600 mb-4">El directorio clasifica a los actores según el campo Rol del actor o proveedor y Categoría técnica:</p>

                    <ul className="grid gap-4 md:grid-cols-3">
                        <li className="bg-gray-50 p-4 rounded border border-gray-200">
                            <strong className="block text-green-700 mb-2">Eslabón I (Inversión)</strong>
                            <span className="text-sm text-gray-600">Laboratorios geotécnicos, Viveros forestales, Proveedores de insumos y Formuladores de planes de negocio.</span>
                        </li>
                        <li className="bg-gray-50 p-4 rounded border border-gray-200">
                            <strong className="block text-green-700 mb-2">Eslabón II (Producción)</strong>
                            <span className="text-sm text-gray-600">Regentes forestales, Coordinadores técnicos, Residentes de obra y Empresas de servicios forestales.</span>
                        </li>
                        <li className="bg-gray-50 p-4 rounded border border-gray-200">
                            <strong className="block text-green-700 mb-2">Eslabón III (Transformación)</strong>
                            <span className="text-sm text-gray-600">Centros de Transformación Primaria (CTP) y empresas de segunda transformación.</span>
                        </li>
                    </ul>

                    <h4 className="font-bold text-gray-800 mt-6">Producto Oficial (Estructura de Datos)</h4>
                    <div className="bg-slate-50 p-5 rounded-lg text-sm border border-slate-200">
                        <ul className="space-y-3 list-disc pl-5 text-gray-700">
                            <li><strong className="text-slate-900">Identificación Legal:</strong> Razón Social, RUC/DNI, Representante Legal.</li>
                            <li><strong className="text-slate-900">Perfil Comercial y Técnico:</strong> Eslabón, Rol del actor, Categoría técnica/Rubro, Bien o Servicio Específico.</li>
                            <li><strong className="text-slate-900">Variables Económicas:</strong> Costo Unit. (S/), Capacidad / Vol. anual.</li>
                            <li><strong className="text-slate-900">Ubicación y Contacto:</strong> Región, Domicilio fiscal, Cobertura, Email y Teléfono.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Línea B */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                        <Users size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Línea B — Integración a registros sectoriales</h3>
                </div>

                <div className="pl-4 border-l-2 border-blue-100 space-y-4">
                    <p className="text-gray-700 font-medium">
                        <span className="font-bold text-blue-800">Objetivo:</span> Proveer un punto de acceso único y actualizado a los registros administrativos oficiales necesarios para la operación forestal, garantizando la interoperabilidad con los custodios de la información.
                    </p>

                    <h4 className="font-bold text-gray-800 mt-4">Estrategia de Interoperabilidad</h4>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                            <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">
                                <strong>Registro Nacional de Plantaciones (RNPF):</strong> Conexión con el Módulo de Control del SNIFFS.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">
                                <strong>Registro de Regentes Forestales:</strong> Enlace al buscador de licencias vigentes del SERFOR.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">
                                <strong>Registro de Productores de Semillas:</strong> Vinculación con padrones de INIA/SENASA.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Línea C */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-700">
                        <Briefcase size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Línea C — Información estratégica de mercado</h3>
                </div>

                <div className="pl-4 border-l-2 border-orange-100 space-y-4">
                    <p className="text-gray-700 font-medium">
                        <span className="font-bold text-orange-800">Objetivo:</span> Integrar fuentes primarias de inteligencia comercial y ambiental para el análisis de riesgo y rentabilidad.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-orange-50 p-4 rounded border border-orange-200">
                            <h5 className="font-bold text-orange-800 mb-2">Mercado</h5>
                            <p className="text-sm text-gray-700">Producción maderable (SNIFFS), Exportaciones/Importaciones (SUNAT/ADEX), Precios referenciales.</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded border border-orange-200">
                            <h5 className="font-bold text-orange-800 mb-2">Territorio</h5>
                            <p className="text-sm text-gray-700">Deforestación y alertas tempranas (GEOBOSQUES), Desempeño regulatorio por título habilitante (OSINFOR).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineasPrioritarias;
