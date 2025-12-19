import { Building2, Map, ShieldAlert, BadgeCheck, FileText } from 'lucide-react';

const RolesEntidades = () => {
    const entidades = [
        {
            nombre: 'Fuente Matriz (SERFOR – SNIFFS)',
            rol: 'Proveedor Primario',
            descripcion: 'Actúa como el proveedor primario de registros administrativos. Suministra el acceso a los módulos de Control (trazabilidad), Estadística (producción), Catastro y Normatividad.',
            icon: Building2,
            color: 'bg-green-100 text-green-700'
        },
        {
            nombre: 'Soporte Geoespacial (IDE-i / GEOSERFOR)',
            rol: 'Infraestructura Tecnológica',
            descripcion: 'Provee la infraestructura para la publicación de servicios web geográficos (WMS/WFS) y la gestión del catálogo de metadatos, garantizando estándares OGC.',
            icon: Map,
            color: 'bg-blue-100 text-blue-700'
        },
        {
            nombre: 'Monitoreo Ambiental (MINAM – GEOBOSQUES)',
            rol: 'Contexto Territorial',
            descripcion: 'Aporta el contexto territorial crítico mediante datos de deforestación anual y alertas tempranas, permitiendo el análisis de riesgo ambiental.',
            icon: ShieldAlert,
            color: 'bg-emerald-100 text-emerald-700'
        },
        {
            nombre: 'Supervisión y Legalidad (OSINFOR)',
            rol: 'Verificación Legal',
            descripcion: 'Provee insumos de verificación de cumplimiento legal (Listas Verde y Roja) y resultados de fiscalización de títulos habilitantes.',
            icon: BadgeCheck,
            color: 'bg-red-100 text-red-700'
        },
        {
            nombre: 'Inteligencia Comercial (SUNAT / PROMPERÚ)',
            rol: 'Validación y Mercado',
            descripcion: 'SUNAT valida el estado del contribuyente (RUC) y PROMPERÚ suministra series estadísticas de comercio exterior (exportaciones e importaciones).',
            icon: FileText,
            color: 'bg-yellow-100 text-yellow-700'
        },
        {
            nombre: 'Generación Regional (ARFFS / GORE)',
            rol: 'Información Primaria',
            descripcion: 'Los GOREs actúan como generadores de información primaria operativa y estadística en campo, alimentando al SNIFFS y validando la realidad territorial.',
            icon: Building2,
            color: 'bg-indigo-100 text-indigo-700'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-blue-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1.4.3. Roles de las entidades vinculantes</h2>
                <p className="text-gray-700 leading-relaxed">
                    Esta sección formaliza el ecosistema de gobernanza de datos del Observatorio. Se define la matriz de responsabilidades institucionales para la provisión, validación y actualización de la información, operando bajo un modelo de interoperabilidad federada.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {entidades.map((ent, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${ent.color}`}>
                                <ent.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">{ent.nombre}</h3>
                                <div className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 mb-2">
                                    {ent.rol}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{ent.descripcion}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-slate-800 mb-4">Protocolos de Interoperabilidad</h3>
                <p className="text-sm text-slate-600 mb-4">
                    El Observatorio no duplica bases de datos dinámicas, sino que consume servicios web oficiales mediante dos protocolos estándar:
                </p>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="bg-white p-4 rounded border border-slate-200">
                        <strong className="block text-slate-900 mb-2">PROTOCOLO P-01: Monitoreo Satelital (WMS)</strong>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                            <li><strong>Objetivo:</strong> Visualización de cobertura y pérdida.</li>
                            <li><strong>Fuente:</strong> GeoBosques (MINAM).</li>
                            <li><strong>Mecanismo:</strong> Servicio OGC WMS (servicio_bnb2024).</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded border border-slate-200">
                        <strong className="block text-slate-900 mb-2">PROTOCOLO P-02: Catastro Administrativo (WFS/API)</strong>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                            <li><strong>Objetivo:</strong> Consulta en tiempo real de derechos.</li>
                            <li><strong>Fuente:</strong> SNIFFS (SERFOR).</li>
                            <li><strong>Mecanismo:</strong> Servicio WFS o API Rest.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RolesEntidades;
