import { useState, useEffect } from 'react';
import { Map, ExternalLink, Calculator, TreePine, Info } from 'lucide-react';

interface CostoBase {
    id: number;
    region: string;
    especie: string;
    sistema: string;
    dFila: number;
    dPlanta: number;
    densidad: number;
    precioPlanton: number;
    precioJornal: number;
    jornalesBase: number;
    gestionAdminPct: number;
    inversionTotal: number;
}

interface Mantenimiento {
    region: string;
    frecuencia: number;
    manoObra: number;
    insumos: number;
    costoAnual: number;
}

interface Formulas {
    densidad: { cuadrado: string; tresBolillo: string; rectangulo: string };
    inversionTotal: string;
    precioTotalPlantones: string;
    preparacionTerreno: string;
}

interface GeoData {
    metadata: { source: string; lastUpdated: string };
    formulas: Formulas;
    costosBase: CostoBase[];
    mantenimiento: Mantenimiento[];
}

// Placeholder URL - will be updated when geovisor is deployed
const GEOVISOR_URL = "https://geovisor-costos-pfc.example.com"; // TODO: Update with actual URL

const GeovisorCostos = () => {
    const [data, setData] = useState<GeoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState<string>('');
    const [selectedEspecie, setSelectedEspecie] = useState<string>('');

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/economia/geo_costos.json`)
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error('Error loading data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

    const regiones = [...new Set(data.costosBase.map(r => r.region))];
    const especies = selectedRegion
        ? [...new Set(data.costosBase.filter(r => r.region === selectedRegion).map(r => r.especie))]
        : [...new Set(data.costosBase.map(r => r.especie))];

    const selectedRecord = selectedRegion && selectedEspecie
        ? data.costosBase.find(r => r.region === selectedRegion && r.especie === selectedEspecie)
        : null;

    const mantenimientoRegion = selectedRegion
        ? data.mantenimiento.find(m => m.region.toUpperCase() === selectedRegion.toUpperCase())
        : null;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 h-[54px] flex items-center">
                <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Map className="text-indigo-600" size={24} />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Geovisor de Costos PFC</h1>
                            <p className="text-xs text-gray-500">Fuente: {data.metadata.source} | Calculadora de inversión</p>
                        </div>
                    </div>
                    <a
                        href={GEOVISOR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        Abrir Geovisor <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            {/* Formulas Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-sm border border-indigo-100 p-4">
                <h3 className="text-sm font-bold text-indigo-800 uppercase mb-3 flex items-center gap-2">
                    <Calculator size={16} /> Fórmulas de Cálculo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/70 rounded-lg p-3">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <TreePine size={14} /> Densidad de Plantación
                        </h4>
                        <div className="space-y-1 text-xs font-mono">
                            <p><span className="text-indigo-600 font-bold">Cuadrado:</span> {data.formulas.densidad.cuadrado}</p>
                            <p><span className="text-purple-600 font-bold">Tres Bolillo:</span> {data.formulas.densidad.tresBolillo}</p>
                            <p><span className="text-blue-600 font-bold">Rectángulo:</span> {data.formulas.densidad.rectangulo}</p>
                        </div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                        <h4 className="font-semibold text-gray-700 mb-2">Componentes de Inversión</h4>
                        <div className="space-y-1 text-xs font-mono">
                            <p><span className="text-green-600 font-bold">Plantones:</span> {data.formulas.precioTotalPlantones}</p>
                            <p><span className="text-orange-600 font-bold">Preparación:</span> {data.formulas.preparacionTerreno}</p>
                            <p><span className="text-red-600 font-bold">Total:</span> {data.formulas.inversionTotal}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Calculator */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                    <Info size={14} /> Demostración de Cálculo
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Región</label>
                        <select
                            value={selectedRegion}
                            onChange={(e) => { setSelectedRegion(e.target.value); setSelectedEspecie(''); }}
                            className="w-full text-sm border border-gray-200 rounded px-3 py-2"
                        >
                            <option value="">Seleccionar región...</option>
                            {regiones.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Especie</label>
                        <select
                            value={selectedEspecie}
                            onChange={(e) => setSelectedEspecie(e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-3 py-2"
                            disabled={!selectedRegion}
                        >
                            <option value="">Seleccionar especie...</option>
                            {especies.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end">
                        {selectedRecord && (
                            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 w-full">
                                <p className="text-xs text-green-600 font-semibold">INVERSIÓN TOTAL</p>
                                <p className="text-xl font-bold text-green-700">S/ {selectedRecord.inversionTotal.toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Calculation Breakdown */}
                {selectedRecord && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-3">Desglose del Cálculo para {selectedRecord.especie} en {selectedRecord.region}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                            <div className="bg-white p-3 rounded border">
                                <p className="text-gray-500 font-semibold mb-1">1. DENSIDAD</p>
                                <p className="font-mono">Sistema: {selectedRecord.sistema}</p>
                                <p className="font-mono">Fila: {selectedRecord.dFila}m × Planta: {selectedRecord.dPlanta}m</p>
                                <p className="font-bold text-indigo-600">=  {selectedRecord.densidad} plantas/ha</p>
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <p className="text-gray-500 font-semibold mb-1">2. COSTO PLANTONES</p>
                                <p className="font-mono">{selectedRecord.densidad} × S/{selectedRecord.precioPlanton}</p>
                                <p className="font-bold text-green-600">= S/ {(selectedRecord.densidad * selectedRecord.precioPlanton).toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <p className="text-gray-500 font-semibold mb-1">3. MANO DE OBRA</p>
                                <p className="font-mono">{selectedRecord.jornalesBase} jornales × S/{selectedRecord.precioJornal}</p>
                                <p className="font-bold text-orange-600">= S/ {(selectedRecord.jornalesBase * selectedRecord.precioJornal).toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <p className="text-gray-500 font-semibold mb-1">4. GESTIÓN ADMIN</p>
                                <p className="font-mono">Subtotal × {(selectedRecord.gestionAdminPct * 100).toFixed(0)}%</p>
                                <p className="font-bold text-purple-600">Incluido en total</p>
                            </div>
                        </div>

                        {mantenimientoRegion && (
                            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                                <h5 className="font-semibold text-orange-800 mb-2">Mantenimiento Anual (Años 2-5)</h5>
                                <div className="grid grid-cols-4 gap-4 text-xs">
                                    <div>
                                        <p className="text-gray-500">Deshierbos/Año</p>
                                        <p className="font-bold">{mantenimientoRegion.frecuencia}x</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Mano de Obra</p>
                                        <p className="font-bold">S/ {mantenimientoRegion.manoObra.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Insumos</p>
                                        <p className="font-bold">S/ {mantenimientoRegion.insumos.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Total Anual</p>
                                        <p className="font-bold text-orange-600">S/ {mantenimientoRegion.costoAnual.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!selectedRecord && (
                    <div className="text-center py-8 text-gray-400">
                        Selecciona una región y especie para ver el desglose del cálculo
                    </div>
                )}
            </div>

            {/* Data Reference Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Datos Base del Geovisor</h3>
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase sticky top-0">
                            <tr>
                                <th className="px-2 py-2">Región</th>
                                <th className="px-2 py-2">Especie</th>
                                <th className="px-2 py-2 text-center">Sistema</th>
                                <th className="px-2 py-2 text-center">D. Fila (m)</th>
                                <th className="px-2 py-2 text-center">D. Planta (m)</th>
                                <th className="px-2 py-2 text-center">Densidad</th>
                                <th className="px-2 py-2 text-right">Jornal (S/)</th>
                                <th className="px-2 py-2 text-right">Admin %</th>
                                <th className="px-2 py-2 text-right font-bold">Total (S/)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.costosBase.map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-2 py-2">{r.region}</td>
                                    <td className="px-2 py-2 font-medium">{r.especie}</td>
                                    <td className="px-2 py-2 text-center text-gray-500">{r.sistema}</td>
                                    <td className="px-2 py-2 text-center">{r.dFila}</td>
                                    <td className="px-2 py-2 text-center">{r.dPlanta}</td>
                                    <td className="px-2 py-2 text-center font-bold text-indigo-600">{r.densidad}</td>
                                    <td className="px-2 py-2 text-right">{r.precioJornal}</td>
                                    <td className="px-2 py-2 text-right">{(r.gestionAdminPct * 100).toFixed(0)}%</td>
                                    <td className="px-2 py-2 text-right font-bold text-green-600">
                                        {r.inversionTotal.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GeovisorCostos;
