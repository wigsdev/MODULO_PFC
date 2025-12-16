const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data/IV. ECONOMIA');
const outputDir = path.join(__dirname, '../public/data/economia');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to parse CSV with quotes
function parseCSV(content) {
    const lines = content.split('\n').filter(l => l.trim());
    const headers = parseCSVLine(lines[0]);
    const records = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length >= 2 && values[0]) {
            const record = {};
            headers.forEach((h, idx) => {
                record[h.trim()] = values[idx]?.trim() || '';
            });
            records.push(record);
        }
    }
    return { headers, records };
}

function parseCSVLine(line) {
    const parts = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            parts.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    parts.push(current.trim());
    return parts;
}

function parseNumber(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/,/g, '').replace(/[^\d.-]/g, '')) || 0;
}

// ============= 4.3.1 OFERTA FORESTAL =============
console.log('Processing 4.3.1 Oferta Forestal...');

const ofertaFile = path.join(dataDir, '4.3.1.OFERTA_PI1_20251121.csv');
const valorPIBFile = path.join(dataDir, '4.3.1.OFERTA_VALOR_Y_PIB_REGIONAL.csv');

let ofertaData = { metadata: { source: 'SERFOR - PI1', lastUpdated: new Date().toISOString().split('T')[0] } };

if (fs.existsSync(ofertaFile)) {
    const content = fs.readFileSync(ofertaFile, 'utf-8');
    const { records } = parseCSV(content);

    const regiones = records.filter(r => r['REGIÓN (PI1)'] && r['REGIÓN (PI1)'] !== 'TOTAL').map(r => ({
        region: r['REGIÓN (PI1)'],
        industrial: parseNumber(r['OFERTA INDUSTRIAL (Madera Rolliza m³)']),
        energetica: parseNumber(r['OFERTA ENERGÉTICA (Leña/Carbón m³)']),
        total: parseNumber(r['VOLUMEN TOTAL MOVILIZADO (m³)']),
        especies: r['ESPECIES PRINCIPALES (Top 3)'] || '',
        vocacion: r['VOCACIÓN PRODUCTIVA ACTUAL'] || ''
    }));

    const totales = records.find(r => r['REGIÓN (PI1)'] === 'TOTAL');

    ofertaData.kpi = {
        volumenTotal: totales ? parseNumber(totales['VOLUMEN TOTAL MOVILIZADO (m³)']) : regiones.reduce((s, r) => s + r.total, 0),
        industrial: totales ? parseNumber(totales['OFERTA INDUSTRIAL (Madera Rolliza m³)']) : regiones.reduce((s, r) => s + r.industrial, 0),
        energetica: totales ? parseNumber(totales['OFERTA ENERGÉTICA (Leña/Carbón m³)']) : regiones.reduce((s, r) => s + r.energetica, 0),
        regionLider: regiones.sort((a, b) => b.total - a.total)[0]?.region || ''
    };
    ofertaData.regiones = regiones;
}

// Add PIB data
if (fs.existsSync(valorPIBFile)) {
    const content = fs.readFileSync(valorPIBFile, 'utf-8');
    const { records } = parseCSV(content);

    ofertaData.valorPIB = records.filter(r => r['REGIÓN (PI1)'] && r['REGIÓN (PI1)'].trim()).map(r => ({
        region: r['REGIÓN (PI1)'],
        vbpMadera: parseNumber(r['VBP ESTIMADO MADERA (Millones S/.)']),
        vbpLena: parseNumber(r['VBP ESTIMADO LEÑA (Millones S/.)']),
        valorTotal: parseNumber(r['VALOR TOTAL PRODUCCIÓN (Millones S/.)']),
        aportePBI: r['APORTE EST. AL PBI REGIONAL (%)'] || '',
        observacion: r['OBSERVACIONES MACROECONÓMICAS'] || ''
    }));
}

fs.writeFileSync(path.join(outputDir, 'oferta_forestal.json'), JSON.stringify(ofertaData, null, 2));
console.log('  ✅ oferta_forestal.json created');

// ============= 4.3.2 CONSUMO INTERMEDIO =============
console.log('Processing 4.3.2 Consumo Intermedio...');

const consumoFile = path.join(dataDir, '4.3.2.CONSUMO_INTERMEDIO_PI1_20251121.xlsx .csv');
let consumoData = { metadata: { source: 'SERFOR - PI1', lastUpdated: new Date().toISOString().split('T')[0] } };

if (fs.existsSync(consumoFile)) {
    const content = fs.readFileSync(consumoFile, 'utf-8');
    const { records } = parseCSV(content);

    consumoData.sectores = records.filter(r => r['REGIÓN (PI1)'] && r['REGIÓN (PI1)'].trim()).map(r => ({
        region: r['REGIÓN (PI1)'],
        producto: r['PRODUCTO FORESTAL (Insumo)'] || '',
        sectorConsumidor: r['SECTOR CONSUMIDOR (Cliente Intermedio)'] || '',
        volumen: parseNumber(r['VOLUMEN CONSUMIDO EST. (m³)'].replace('~', '')),
        rendimiento: r['COEFICIENTE DE RENDIMIENTO'] || '',
        productoFinal: r['PRODUCTO FINAL GENERADO'] || '',
        observacion: r['OBSERVACIÓN DE MERCADO'] || ''
    }));

    const totalVolumen = consumoData.sectores.reduce((s, r) => s + r.volumen, 0);
    consumoData.kpi = {
        volumenTotal: totalVolumen,
        numSectores: consumoData.sectores.length,
        sectorPrincipal: consumoData.sectores.sort((a, b) => b.volumen - a.volumen)[0]?.sectorConsumidor || ''
    };
}

fs.writeFileSync(path.join(outputDir, 'consumo_intermedio.json'), JSON.stringify(consumoData, null, 2));
console.log('  ✅ consumo_intermedio.json created');

// ============= 4.3.3 UTILIZACION TOTAL =============
console.log('Processing 4.3.3 Utilización Total...');

const utilizacionFile = path.join(dataDir, '4.3.3.UTILIZACION_TOTAL_PI1.csv');
let utilizacionData = { metadata: { source: 'SERFOR - PI1', lastUpdated: new Date().toISOString().split('T')[0] } };

if (fs.existsSync(utilizacionFile)) {
    const content = fs.readFileSync(utilizacionFile, 'utf-8');
    const { records } = parseCSV(content);

    utilizacionData.indicadores = records.filter(r => r['COMPONENTE / INDICADOR'] && r['COMPONENTE / INDICADOR'].trim()).map(r => ({
        componente: r['COMPONENTE / INDICADOR'].replace(/[🪵🪚]/g, '').trim(),
        unidad: r['UNIDAD'] || '',
        valor: parseNumber(r['VALOR 2024']),
        interpretacion: r['INTERPRETACIÓN'] || ''
    }));

    // Extract key KPIs
    const maderaRolliza = utilizacionData.indicadores.find(i => i.componente.includes('Madera Rolliza'));
    const exportaciones = utilizacionData.indicadores.find(i => i.componente.includes('DEMANDA EXTERNA'));
    const importaciones = utilizacionData.indicadores.find(i => i.componente.includes('OFERTA EXTERNA'));
    const brecha = utilizacionData.indicadores.find(i => i.componente.includes('BRECHA'));

    utilizacionData.kpi = {
        produccionNacional: maderaRolliza?.valor || 0,
        exportaciones: exportaciones?.valor || 0,
        importaciones: importaciones?.valor || 0,
        brechaComercial: brecha?.valor || 0
    };
}

fs.writeFileSync(path.join(outputDir, 'utilizacion_total.json'), JSON.stringify(utilizacionData, null, 2));
console.log('  ✅ utilizacion_total.json created');

// ============= 4.3.4 INTENSIDAD DE USO =============
console.log('Processing 4.3.4 Intensidad de Uso...');

const intensidadNacFile = path.join(dataDir, '4.3.4. CONSUMO_INTENSIDAD_DE USO.csv');
const intensidadRegFile = path.join(dataDir, '4.3.4.INTENSIDAD_USO_REGIONAL.csv');
let intensidadData = { metadata: { source: 'SERFOR - PI1', lastUpdated: new Date().toISOString().split('T')[0] } };

if (fs.existsSync(intensidadNacFile)) {
    const content = fs.readFileSync(intensidadNacFile, 'utf-8');
    const { records } = parseCSV(content);

    intensidadData.serieHistorica = records.filter(r => r['AÑO'] && parseInt(r['AÑO'])).map(r => ({
        year: parseInt(r['AÑO']),
        produccionTotal: parseNumber(r['PRODUCCION_TOTAL']),
        produccionIndustrial: parseNumber(r['PRODUCCION_INDUSTRIAL']),
        importaciones: parseNumber(r['IMPORTACIONES']),
        exportaciones: parseNumber(r['EXPORTACIONES']),
        consumoTotal: parseNumber(r['CONSUMO_APARENTE_TOTAL']),
        consumoIndustrial: parseNumber(r['CONSUMO_APARENTE_IND']),
        poblacion: parseNumber(r['POBLACION_PERU']),
        perCapitaTotal: parseNumber(r['PER_CAPITA_TOTAL']),
        perCapitaIndustrial: parseNumber(r['PER_CAPITA_IND'])
    }));

    const ultimo = intensidadData.serieHistorica[intensidadData.serieHistorica.length - 1];
    intensidadData.kpi = {
        consumoPerCapita: ultimo?.perCapitaTotal || 0,
        consumoIndustrialPerCapita: ultimo?.perCapitaIndustrial || 0,
        consumoTotal: ultimo?.consumoTotal || 0,
        yearActual: ultimo?.year || 2024
    };
}

if (fs.existsSync(intensidadRegFile)) {
    const content = fs.readFileSync(intensidadRegFile, 'utf-8');
    const { records } = parseCSV(content);

    intensidadData.regiones = records.filter(r => r['REGION'] && r['REGION'].trim()).map(r => ({
        region: r['REGION'],
        consumoTotal: parseNumber(r['CONSUMO_TOTAL_M3']),
        poblacion: parseNumber(r['POBLACION_HAB']),
        pbiRegional: parseNumber(r['PBI_REGIONAL_MILLONES_SOL']),
        perCapita: parseNumber(r['PER_CAPITA_M3']),
        intensidad: parseNumber(r['INTENSIDAD_M3_POR_MILLON_PBI']),
        tipoConsumo: r['TIPO_CONSUMO_PREDOMINANTE'] || ''
    }));
}

fs.writeFileSync(path.join(outputDir, 'intensidad_uso.json'), JSON.stringify(intensidadData, null, 2));
console.log('  ✅ intensidad_uso.json created');

console.log('\n✅ All Cuentas Nacionales data processed successfully!');
