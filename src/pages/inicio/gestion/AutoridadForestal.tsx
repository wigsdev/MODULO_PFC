import { Gavel, MapPin, FileSearch } from 'lucide-react';

const AutoridadForestal = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-yellow-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1.4.4. Autoridad Forestal (Nacional y Regional)</h2>
                <p className="text-gray-700 leading-relaxed">
                    Esta sección define la cadena de mando y las competencias bajo las cuales opera el Sistema Nacional de Gestión Forestal y de Fauna Silvestre (SINAFOR). La Coordinación del Observatorio se alinea a esta rectoría (SERFOR) y articula con las Autoridades Regionales (ARFFS) para la validación del flujo de información.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Nacional */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-yellow-500">
                    <div className="flex items-center gap-3 mb-4">
                        <Gavel className="text-yellow-600" size={24} />
                        <h3 className="text-lg font-bold text-gray-900">Rol Nacional (SERFOR)</h3>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        Ejerce la Rectoría técnica y normativa en el marco de la Ley N.° 29763. Conduce los lineamientos y administra plataformas sectoriales clave: SNIFFS y IDE-i/GEOSERFOR.
                    </p>
                    <ul className="text-sm bg-yellow-50 p-4 rounded text-gray-700 space-y-2">
                        <li>• Normalización y políticas.</li>
                        <li>• Administración del SNIFFS.</li>
                        <li>• Rectoría del SINAFOR.</li>
                    </ul>
                </div>

                {/* Regional */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-yellow-500">
                    <div className="flex items-center gap-3 mb-4">
                        <MapPin className="text-yellow-600" size={24} />
                        <h3 className="text-lg font-bold text-gray-900">Rol Regional (ARFFS / ATFFS)</h3>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        Ejecutores de las funciones de gestión, control y fiscalización en campo. Su rol es la emisión de títulos habilitantes y la remisión de información primaria al SNIFFS.
                    </p>
                    <ul className="text-sm bg-yellow-50 p-4 rounded text-gray-700 space-y-2">
                        <li>• Emisión de títulos habilitantes.</li>
                        <li>• Control y vigilancia.</li>
                        <li>• Validación de datos en campo.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FileSearch className="text-gray-600" />
                    Productos Implementables
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded hover:bg-gray-50 transition-colors">
                        <strong className="block text-gray-900 mb-2">1. Esquema de Gobernanza Funcional</strong>
                        <p className="text-sm text-gray-600">Gráfico dinámico que ilustra la cadena de reporte y distribución de competencias.</p>
                    </div>
                    <div className="p-4 border rounded hover:bg-gray-50 transition-colors">
                        <strong className="block text-gray-900 mb-2">2. Directorio de Autoridades</strong>
                        <p className="text-sm text-gray-600">Listado georreferenciado de las ARFFS y ATFFS de las 7 regiones prioritarias (Sedes Administrativas).</p>
                    </div>
                    <div className="p-4 border rounded hover:bg-gray-50 transition-colors">
                        <strong className="block text-gray-900 mb-2">3. Matriz de Flujo de Información</strong>
                        <p className="text-sm text-gray-600">Resumen técnico de compromisos, formatos de envío y frecuencia de actualización.</p>
                    </div>
                    <div className="p-4 border rounded hover:bg-gray-50 transition-colors">
                        <strong className="block text-gray-900 mb-2">4. Marco Normativo de Acceso</strong>
                        <p className="text-sm text-gray-600">Acceso a la Ley N.° 29763 y plataformas sectoriales (SNIFFS, IDE-i).</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoridadForestal;
