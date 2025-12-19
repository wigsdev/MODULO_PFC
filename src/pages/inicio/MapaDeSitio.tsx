import { Link } from 'react-router-dom';

const MapaDeSitio = () => {
    return (
        <div className="container mx-auto p-8 max-w-5xl bg-white h-[85vh] flex flex-col">
            <div className="flex-none">
                <h1 className="text-3xl font-bold mb-8 text-[#2E7D32] border-b-2 border-[#2E7D32] pb-4">
                    Mapa de Sitio - Observatorio de Plantaciones Forestales Comerciales
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto pr-6 prose max-w-none text-gray-800 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <ol className="list-none space-y-8 pb-8">
                    {/* I. INICIO */}
                    <li>
                        <h2 className="text-xl font-bold text-[#1B5E20] mb-3">I. INICIO</h2>
                        <ul className="pl-6 space-y-2">
                            <li><strong>1.1. Objetivo</strong></li>
                            <li><strong>1.2. Misión</strong></li>
                            <li><strong>1.3. Visión</strong></li>
                            <li>
                                <Link to="/gestion" className="font-bold text-blue-700 hover:underline">1.4. Gestión Organizacional</Link>
                                <ul className="pl-6 mt-2 space-y-1 text-sm text-gray-700">
                                    <li>1.4.1. Líneas prioritarias de trabajo
                                        <ul className="pl-6 mt-1 list-disc">
                                            <li>Línea A: Registro y directorio de proveedores PFC</li>
                                            <li>Línea B: Integración a registros sectoriales</li>
                                            <li>Línea C: Información estratégica de mercado</li>
                                        </ul>
                                    </li>
                                    <li>1.4.2. Organigrama</li>
                                    <li>1.4.3. Roles de las entidades vinculantes</li>
                                    <li>1.4.4. Autoridad forestal (Nacional y Regional)</li>
                                    <li>1.4.5. Plan operativo propuesto al primer año</li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    {/* II. ESPACIAL */}
                    <li>
                        <h2 className="text-xl font-bold text-[#1B5E20] mb-3">II. ESPACIAL</h2>
                        <ul className="pl-6 space-y-4">
                            <li>
                                <strong>2.1. Sistema para la Planificación Rural Agropecuaria</strong>
                                <ul className="pl-6 mt-1 space-y-1 text-sm">
                                    <li><Link to="/espacial/planificacion/frontera-agricola" className="text-blue-600 hover:underline">2.1.1. Frontera agrícola nacional (7 departamentos)</Link></li>
                                    <li><Link to="/espacial/planificacion/zonificacion-cultivos" className="text-blue-600 hover:underline">2.1.2. Zonificación de cultivos y plantaciones forestales comerciales</Link></li>
                                    <li><Link to="/espacial/planificacion/zonas-susceptibles" className="text-blue-600 hover:underline">2.1.3. Zonas susceptibles a mercado de tierras rurales agropecuarias</Link></li>
                                    <li><Link to="/espacial/planificacion/areas-formalizacion" className="text-blue-600 hover:underline">2.1.4. Áreas para formalización de propiedad</Link></li>
                                </ul>
                            </li>
                            <li>
                                <strong>2.2. Sistema de Monitoreo de Bosques y Carbono</strong>
                                <ul className="pl-6 mt-1 space-y-1 text-sm">
                                    <li><Link to="/espacial/monitoreo/superficie-bosque" className="text-blue-600 hover:underline">2.2.1. Superficie cubierta por bosque natural</Link></li>
                                    <li><Link to="/espacial/monitoreo/cambio-superficie" className="text-blue-600 hover:underline">2.2.2. Cambio de la superficie cubierta por bosque natural</Link></li>
                                    <li><Link to="/espacial/monitoreo/indicadores-bosque" className="text-blue-600 hover:underline">2.2.3. Indicadores de bosque y recurso forestal</Link></li>
                                    <li><Link to="/espacial/monitoreo/inventario-forestal" className="text-blue-600 hover:underline">2.2.4. Inventario Forestal (7 departamentos)</Link></li>
                                </ul>
                            </li>
                            <li>
                                <strong>2.3. Sistema de Información Ambiental</strong>
                                <ul className="pl-6 mt-1 space-y-1 text-sm">
                                    <li><Link to="/espacial/ambiental/superficie-cubierta" className="text-blue-600 hover:underline">2.3.1. Superficie cubierta por bosque a nivel regional</Link></li>
                                    <li><Link to="/espacial/ambiental/autoridades-ambientales" className="text-blue-600 hover:underline">2.3.2. Autoridades Ambientales</Link></li>
                                    <li><Link to="/espacial/ambiental/cambio-historico" className="text-blue-600 hover:underline">2.3.3. Cambio histórico de la superficie cubierta por bosque natural</Link></li>
                                </ul>
                            </li>
                            <li>
                                <strong>2.4. Sistema Nacional de Información Forestal (SNIFFS)</strong>
                                <ul className="pl-6 mt-1 space-y-1 text-sm">
                                    <li><Link to="/espacial/sniffs/aprovechamientos" className="text-blue-600 hover:underline">2.4.1. Aprovechamientos</Link></li>
                                    <li><Link to="/espacial/sniffs/movilizaciones" className="text-blue-600 hover:underline">2.4.2. Movilizaciones</Link></li>
                                    <li><Link to="/espacial/sniffs/decomisos" className="text-blue-600 hover:underline">2.4.3. Decomisos</Link></li>
                                    <li><Link to="/espacial/sniffs/plantaciones" className="text-blue-600 hover:underline">2.4.4. Plantaciones productoras y protectoras</Link></li>
                                    <li><Link to="/espacial/sniffs/plantaciones" className="text-blue-600 hover:underline">2.4.5. Registro de plantaciones, regentes, viveros, semilleros, etc.</Link></li>
                                </ul>
                            </li>
                            <li>
                                <strong>2.5. Información comercial</strong>
                                <ul className="pl-6 mt-1 space-y-1 text-sm">
                                    <li><Link to="/espacial/comercial/estudios-mercado" className="text-blue-600 hover:underline">2.5.1. Estudios de mercado de plantaciones forestales comerciales</Link></li>
                                    <li><Link to="/espacial/comercial/estadisticas" className="text-blue-600 hover:underline">2.5.2. Estadísticas de producción, exportación e importación de PFC</Link></li>
                                    <li><Link to="/espacial/comercial/boletines" className="text-blue-600 hover:underline">2.5.3. Boletines comerciales y precios de mercado</Link></li>
                                </ul>
                            </li>
                            <li>
                                <strong>2.6. Otros datos de información espacial</strong>
                                <ul className="pl-6 mt-1 space-y-1 text-sm">
                                    <li><Link to="/espacial/otros/plantaciones-registradas" className="text-blue-600 hover:underline">2.6.1. Plantaciones registradas (Histórico y Actual)</Link></li>
                                    <li><Link to="/espacial/otros/tierras-pfc" className="text-blue-600 hover:underline">2.6.2. Tierras con aptitud para PFC</Link></li>
                                    <li><Link to="/espacial/otros/mapa-bosque" className="text-blue-600 hover:underline">2.6.3. Mapa de bosques / No Bosques</Link></li>
                                    <li><Link to="/espacial/otros/sistemas-inversionista" className="text-blue-600 hover:underline">2.6.4. Sistemas de información para el inversionista</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    {/* III. SECTOR */}
                    <li>
                        <h2 className="text-xl font-bold text-[#1B5E20] mb-3">III. SECTOR</h2>
                        <ul className="pl-6 space-y-3">
                            <li>
                                <Link to="/sector/deforestacion" className="font-bold text-blue-700 hover:underline">3.1. Tasa Anual de Deforestación Histórica</Link>
                                <ul className="pl-6 mt-1 space-y-1 text-sm text-gray-700">
                                    <li>3.1.1. Descripción de la Tasa Anual de Deforestacion Histórica.</li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/sector/decomisos" className="font-bold text-blue-700 hover:underline">3.2. Volumen de Productos Maderables Decomisados</Link>
                                <ul className="pl-6 mt-1 space-y-1 text-sm text-gray-700">
                                    <li>3.2.1. Descripción del Volumen de Productos Maderables Decomisados.</li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/sector/especies" className="font-bold text-blue-700 hover:underline">3.3. Especies Maderables Decomisadas</Link>
                                <ul className="pl-6 mt-1 space-y-1 text-sm text-gray-700">
                                    <li>3.3.1. Descripción de las Especies maderables decomisadas</li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/sector/reservas" className="font-bold text-blue-700 hover:underline">3.4. Reservas de Biósfera</Link>
                                <ul className="pl-6 mt-1 space-y-1 text-sm text-gray-700">
                                    <li>3.4.1. Descripción de las Reservas de Biósfera</li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/sector/areas" className="font-bold text-blue-700 hover:underline">3.5. Areas Declaradas y/o Sustraidas</Link>
                                <ul className="pl-6 mt-1 space-y-1 text-sm text-gray-700">
                                    <li>3.5.1. Descripción de las Areas Declaradas y/o Sustraidas</li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/sector/sitios" className="font-bold text-blue-700 hover:underline">3.6. Sitios declarados</Link>
                                <ul className="pl-6 mt-1 space-y-1 text-sm text-gray-700">
                                    <li>3.6.1. Descripción de los Sitios declarados</li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/sector/carbono" className="font-bold text-blue-700 hover:underline">3.7. Mapa de contenidos de Carbono por Tipo de Bosques</Link>
                                <ul className="pl-6 mt-1 space-y-1 text-sm text-gray-700">
                                    <li>3.7.1. Descripción del Carbono almacenado en bosques</li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    {/* IV. ECONOMÍA */}
                    <li>
                        <h2 className="text-xl font-bold text-[#1B5E20] mb-3">IV. ECONOMÍA</h2>
                        <ul className="pl-6 space-y-3">
                            <li>
                                <strong>4.1. Datos de Productividad y Rendimiento</strong>
                                <ul className="pl-6 mt-1 space-y-1 text-sm">
                                    <li><Link to="/economia/proveedores" className="text-blue-600 hover:underline">4.1.1. Proveedores de bienes y Servicios</Link></li>
                                    <li><Link to="/economia/entidades-pnf" className="text-blue-600 hover:underline">4.1.2. Entidades Ejecutoras de Planes de Negocios Forestales</Link></li>
                                    <li><Link to="/economia/especies" className="text-blue-600 hover:underline">4.1.3. Especies aprovechadas</Link></li>
                                    <li><Link to="/economia/precios" className="text-blue-600 hover:underline">4.1.4. Precios Maderas</Link></li>
                                    <li><Link to="/economia/industria" className="text-blue-600 hover:underline">4.1.5. Transformación Industrial</Link></li>
                                </ul>
                            </li>
                            <li>
                                <strong>4.2. Datos de mercado</strong>
                                <ul className="pl-6 mt-1 space-y-1 text-sm">
                                    <li><Link to="/economia/movilizado" className="text-blue-600 hover:underline">4.2.1. Volumen movilizado</Link></li>
                                    <li><Link to="/economia/concesiones" className="text-blue-600 hover:underline">4.2.2. Volumen otorgado a plantaciones en tierras públicas...</Link></li>
                                    <li><Link to="/economia/exportaciones" className="text-blue-600 hover:underline">4.2.3. Exportaciones</Link></li>
                                    <li><Link to="/economia/importaciones" className="text-blue-600 hover:underline">4.2.4. Importaciones</Link></li>
                                    <li><Link to="/economia/balanza" className="text-blue-600 hover:underline">4.2.5. Balanza comercial</Link></li>
                                </ul>
                            </li>
                            <li>
                                <strong>4.3. Datos de Macroeconomía</strong>
                                <ul className="pl-6 mt-1 space-y-1 text-sm">
                                    <li><Link to="/economia/oferta" className="text-blue-600 hover:underline">4.3.1. Oferta</Link></li>
                                    <li><Link to="/economia/consumo-intermedio" className="text-blue-600 hover:underline">4.3.2. Consumo intermedio</Link></li>
                                    <li><Link to="/economia/utilizacion" className="text-blue-600 hover:underline">4.3.3. Utilización total</Link></li>
                                    <li><Link to="/economia/intensidad" className="text-blue-600 hover:underline">4.3.4. Consumo e intensidad de uso</Link></li>
                                </ul>
                            </li>
                            <li>
                                <strong>4.4. Datos Financieros</strong>
                                <ul className="pl-6 mt-1 space-y-1 text-sm">
                                    <li><Link to="/economia/costos" className="text-blue-600 hover:underline">4.4.1. Costos para Plantaciones Forestales Comerciales</Link></li>
                                    <li><Link to="/economia/geovisor-costos" className="text-blue-600 hover:underline">4.4.2. Geovisor de Costos</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    {/* V. NORMATIVA */}
                    <li>
                        <h2 className="text-xl font-bold text-[#1B5E20] mb-3">V. NORMATIVA</h2>
                        <ul className="pl-6 space-y-3">
                            <li>
                                <Link to="/normativa/planificacion" className="font-bold text-blue-700 hover:underline">5.1. Planificación para el desarrollo forestal</Link>
                                <ul className="pl-6 mt-1 space-y-1 text-sm text-gray-700">
                                    <li>5.1.1. Listado de leyes, decretos, reglamentos, normas y otros documentos.</li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/normativa/lineamientos" className="font-bold text-blue-700 hover:underline">5.2. Lineamientos de la politica forestal</Link>
                                <ul className="pl-6 mt-1 space-y-1 text-sm text-gray-700">
                                    <li>5.2.1. Listado de leyes, decretos, reglamentos, normas y otros documentos.</li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/normativa/manejo" className="font-bold text-blue-700 hover:underline">5.3. Manejo y aprovechamiento forestal de PFC</Link>
                                <ul className="pl-6 mt-1 space-y-1 text-sm text-gray-700">
                                    <li>5.3.1. Listado de leyes, decretos, reglamentos, normas y otros documentos.</li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/normativa/incentivos" className="font-bold text-blue-700 hover:underline">5.4. incetivos para el desarrollo del sector</Link>
                                <ul className="pl-6 mt-1 text-sm text-gray-700">
                                    <li>5.4.1. Listado de leyes, decretos, reglamentos, normas y otros documentos.</li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default MapaDeSitio;
