const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data/IV. ECONOMIA');
const outputDir = path.join(__dirname, '../public/data/economia');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to parse CSV with quotes
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

// ============= 4.4.1 COSTOS PARA PFC =============
console.log('Processing 4.4.1 Costos para PFC...');

const costoYear1File = path.join(dataDir, '4.4.1.COSTOS_PARA_PFC_AÑO_1.csv');
const costoYear2_5File = path.join(dataDir, '4.4.1.COSTOS_PARA_PFC_AÑO_2_5.csv');

let costosData = {
    metadata: {
        source: 'SERFOR - Análisis Económico PFC',
        lastUpdated: new Date().toISOString().split('T')[0]
    }
};

// Year 1 data
if (fs.existsSync(costoYear1File)) {
    const content = fs.readFileSync(costoYear1File, 'utf-8');
    const { records } = parseCSV(content);

    costosData.year1 = records.map(r => ({
        id: parseInt(r['ID']) || 0,
        region: r['REGIÓN'] || '',
        especie: r['ESPECIE'] || '',
        sistema: r['SISTEMA RECOMENDADO (Default)'] || '',
        dFila: parseNumber(r['D_FILA (m)']),
        dPlanta: parseNumber(r['D_PLANTA (m)']),
        densidad: parseNumber(r['DENSIDAD']),
        precioPlanton: parseNumber(r['PRECIO PLANTON REF. (S/)']),
        precioTotalPlantones: parseNumber(r['PRECIO TOTAL DE PLANTONES']),
        precioJornal: parseNumber(r['PRECIO JORNAL']),
        jornalesBase: parseNumber(r['JORNALES BASE (Días/Ha)']),
        preparacionTerreno: parseNumber(r['PREPARACION DE TERRENO E INSTALACION']),
        costoInsumos: parseNumber(r['COSTO INSUMOS Y EQUIPOS (S/)']),
        gestionAdmin: parseNumber(r['GESTIÓN ADMIN (%)']),
        inversionTotal: parseNumber(r['INVERSION TOTAL'])
    }));

    // KPIs
    const inversiones = costosData.year1.map(r => r.inversionTotal);
    costosData.kpi = {
        inversionPromedio: inversiones.reduce((a, b) => a + b, 0) / inversiones.length,
        inversionMin: Math.min(...inversiones),
        inversionMax: Math.max(...inversiones),
        numEspecies: [...new Set(costosData.year1.map(r => r.especie))].length,
        numRegiones: [...new Set(costosData.year1.map(r => r.region))].length
    };
}

// Year 2-5 data
if (fs.existsSync(costoYear2_5File)) {
    const content = fs.readFileSync(costoYear2_5File, 'utf-8');
    const { records } = parseCSV(content);

    costosData.year2_5 = records.map(r => ({
        region: r['Región'] || '',
        frecuenciaDeshierbos: parseNumber(r['Frecuencia Deshierbos/Año']),
        manoObra: parseNumber(r['Mano de Obra (S/)']),
        insumos: parseNumber(r['Insumos (S/)']),
        costoAnual: parseNumber(r['Costo Total Anual (S/)']),
        observacion: r['Observación Técnica Crítica'] || ''
    }));

    const costosMantenimiento = costosData.year2_5.map(r => r.costoAnual);
    costosData.kpi.mantenimientoPromedio = costosMantenimiento.reduce((a, b) => a + b, 0) / costosMantenimiento.length;
    costosData.kpi.mantenimientoMin = Math.min(...costosMantenimiento);
    costosData.kpi.mantenimientoMax = Math.max(...costosMantenimiento);
}

fs.writeFileSync(path.join(outputDir, 'costos_pfc.json'), JSON.stringify(costosData, null, 2));
console.log('  ✅ costos_pfc.json created');

// ============= 4.4.2 GEO COSTOS (same data, used for geovisor calculations) =============
console.log('Processing 4.4.2 Geo Costos...');

const geoYear1File = path.join(dataDir, '4.4.2.GEO_COSTOS_PARA_PFC_AÑO_1.csv');
const geoYear2_5File = path.join(dataDir, '4.4.2.GEO_COSTOS_PARA_PFC_AÑO_2_5.csv');

let geoData = {
    metadata: {
        source: 'SERFOR - Geovisor de Costos PFC',
        lastUpdated: new Date().toISOString().split('T')[0]
    },
    formulas: {
        densidad: {
            cuadrado: "10000 / (D_Fila × D_Planta)",
            tresBolillo: "10000 / (D_Fila × D_Planta × 0.866)",
            rectangulo: "10000 / (D_Fila × D_Planta)"
        },
        inversionTotal: "PrecioTotalPlantones + PreparaciónTerreno + CostoInsumos + (Total × GestiónAdmin%)",
        precioTotalPlantones: "Densidad × PrecioPlantonRef",
        preparacionTerreno: "JornalesBase × PrecioJornal"
    }
};

// Year 1 data for geovisor
if (fs.existsSync(geoYear1File)) {
    const content = fs.readFileSync(geoYear1File, 'utf-8');
    const { records } = parseCSV(content);

    geoData.costosBase = records.map(r => ({
        id: parseInt(r['ID']) || 0,
        region: r['REGIÓN'] || '',
        especie: r['ESPECIE'] || '',
        sistema: r['SISTEMA RECOMENDADO (Default)'] || '',
        dFila: parseNumber(r['D_FILA (m)']),
        dPlanta: parseNumber(r['D_PLANTA (m)']),
        densidad: parseNumber(r['DENSIDAD']),
        precioPlanton: parseNumber(r['PRECIO PLANTON REF. (S/)']),
        precioJornal: parseNumber(r['PRECIO JORNAL']),
        jornalesBase: parseNumber(r['JORNALES BASE (Días/Ha)']),
        gestionAdminPct: parseNumber(r['GESTIÓN ADMIN (%)']),
        inversionTotal: parseNumber(r['INVERSION TOTAL'])
    }));
}

// Year 2-5 for geovisor
if (fs.existsSync(geoYear2_5File)) {
    const content = fs.readFileSync(geoYear2_5File, 'utf-8');
    const { records } = parseCSV(content);

    geoData.mantenimiento = records.map(r => ({
        region: r['Región'] || '',
        frecuencia: parseNumber(r['Frecuencia Deshierbos/Año']),
        manoObra: parseNumber(r['Mano de Obra (S/)']),
        insumos: parseNumber(r['Insumos (S/)']),
        costoAnual: parseNumber(r['Costo Total Anual (S/)'])
    }));
}

fs.writeFileSync(path.join(outputDir, 'geo_costos.json'), JSON.stringify(geoData, null, 2));
console.log('  ✅ geo_costos.json created');

console.log('\n✅ Costos PFC data processed successfully!');
