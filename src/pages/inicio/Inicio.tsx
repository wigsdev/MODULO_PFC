import { Map, BarChart2, Activity, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Inicio() {
    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 scroll-smooth h-full">
            {/* Hero Section */}
            <div className="relative h-[450px] flex items-center justify-center text-center text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2000&auto=format&fit=crop"
                        className="w-full h-full object-cover"
                        alt="Bosque Peruano"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
                </div>
                <div className="relative z-10 max-w-4xl px-4 animate-fadeIn">
                    <span className="inline-block py-1 px-3 rounded-full bg-serfor-light/80 text-[10px] font-bold tracking-wider mb-4 border border-green-400">SNIFFS - SERFOR</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
                        Observatorio de <br />
                        <span className="text-yellow-400">Plantaciones Forestales</span>
                    </h1>
                    <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto font-light">
                        Información estratégica, espacial y estadística para impulsar la competitividad del sector forestal en las regiones priorizadas.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <a
                            href="https://wigsdev.github.io/GEOVISOR/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-serfor-light hover:bg-[#43a047] text-white px-8 py-3 rounded font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                        >
                            <Map size={18} /> Ver Geovisor
                        </a>
                        <Link to="/economia" className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white text-white px-8 py-3 rounded font-bold transition-all flex items-center gap-2">
                            <BarChart2 size={18} /> Ver Cifras 2024
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
                <section id="presentacion" className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-serfor-dark mb-6 border-l-4 border-yellow-400 pl-4">¿Qué es el Observatorio?</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed text-justify">
                            Es un módulo especializado del SNIFFS diseñado para recopilar, procesar y difundir información sobre la cadena de valor de las <strong>Plantaciones Forestales Comerciales (PFC)</strong>.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-justify">
                            Busca reducir la asimetría de información y conectar la oferta de productores con la demanda de mercado, focalizándose en las regiones de <strong>Áncash, Cajamarca, Huánuco, Junín, Pasco, San Martín y Madre de Dios</strong>.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-green-600">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-green-700 font-bold">A</div>
                            <h4 className="font-bold text-gray-800 text-sm">Directorio PFC</h4>
                            <p className="text-xs text-gray-500 mt-1">Proveedores y Servicios</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-blue-600">
                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-700 font-bold">B</div>
                            <h4 className="font-bold text-gray-800 text-sm">Registros</h4>
                            <p className="text-xs text-gray-500 mt-1">Integración Administrativa</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-orange-600 col-span-2">
                            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-700 font-bold">C</div>
                            <h4 className="font-bold text-gray-800 text-sm">Inteligencia de Mercado</h4>
                            <p className="text-xs text-gray-500 mt-1">Precios, Costos y Comercio Exterior</p>
                        </div>
                    </div>
                </section>

                <section className="bg-green-50 p-10 rounded-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-800">Nuestra Misión y Visión</h2>
                        <div className="w-16 h-1 bg-serfor mx-auto mt-2"></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div id="mision" className="bg-white p-8 rounded shadow-sm relative scroll-mt-24">
                            <Activity className="text-green-200 absolute top-4 right-4" size={48} />
                            <h3 className="text-lg font-bold text-serfor-dark mb-3">Misión</h3>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                Operar como la plataforma oficial de inteligencia para las Plantaciones Forestales Comerciales (PFC), que registra, integra y valida información estratégica de toda la cadena de valor (proveedores, producción y mercado). El Observatorio funciona como un módulo especializado articulado al SNIFFS e interoperable con GEOSERFOR, GEOBOSQUES y OSINFOR, con el fin de reducir la asimetría de información, fomentar la transparencia y potenciar la competitividad del sector mediante datos trazables para la toma de decisiones de inversión pública y privada.
                            </p>
                        </div>
                        <div id="vision" className="bg-white p-8 rounded shadow-sm relative scroll-mt-24">
                            <Layers className="text-blue-200 absolute top-4 right-4" size={48} />
                            <h3 className="text-lg font-bold text-blue-800 mb-3">Visión</h3>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                Consolidar al Observatorio de Plantaciones Forestales Comerciales (PFC) como la plataforma nacional de referencia para el acceso a información abierta, trazable e interoperable sobre la cadena de valor forestal. Integrado al SNIFFS y articulado con la IDE-i SERFOR, el Observatorio garantizará la disponibilidad de datos oficiales bajo estándares internacionales (OGC), permitiendo a los actores públicos, privados y académicos tomar decisiones estratégicas basadas en evidencia verificable y de calidad.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="objetivos" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-4">Objetivos Estratégicos</h2>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                            Desarrollar e implementar los mecanismos de selección, reconocimiento y gestión de información estratégica de mercado de bienes y servicios para las plantaciones forestales, materializados a través del Observatorio de Plantaciones Forestales Comerciales (PFC). Este instrumento técnico operará como un módulo especializado e interoperable del SNIFFS, focalizado en las siete regiones priorizadas.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: '1. Estructurar la Gobernanza', desc: 'Establecer un modelo de gestión organizacional articulado al SNIFFS que defina roles, flujos de validación y protocolos de interoperabilidad.' },
                                { title: '2. Consolidar la Oferta', desc: 'Implementar un directorio comercial verificable de los tres eslabones de la cadena de valor, integrando registros administrativos.' },
                                { title: '3. Generar Inteligencia Territorial', desc: 'Proveer herramientas de análisis geoespacial que identifiquen Zonas Susceptibles al Mercado y áreas de formalización.' },
                                { title: '4. Monitorear el Contexto Ambiental', desc: 'Contextualizar la actividad productiva mediante interoperabilidad con GeoBosques para visualizar cobertura y deforestación.' },
                                { title: '5. Proveer Indicadores de Competitividad', desc: 'Publicar indicadores estratégicos de precios, comercio exterior y costos de publicación regionalizados.' }
                            ].map((obj, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-all">
                                    <div className="bg-orange-100 text-orange-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-1">{obj.title.split('. ')[1]}</h4>
                                        <p className="text-sm text-gray-600">{obj.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
