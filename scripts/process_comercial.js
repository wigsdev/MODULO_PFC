const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS');
const outputDir = path.join(__dirname, '../public/data/espacial');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function parseNumber(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/,/g, '').replace(/[^\d.-]/g, '')) || 0;
}

// Helper to parse CSV with quoted fields
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// ============= 2.5.1 ESTUDIOS DE MERCADO PFC =============
console.log('Processing 2.5.1 Estudios de Mercado PFC...');

const estudiosFile = path.join(dataDir, '2.5.1.EST_DE_MERCADO_DE_PFC.csv');
let estudiosData = {
    metadata: {
        source: 'Compilación SERFOR',
        lastUpdated: new Date().toISOString().split('T')[0]
    }
};

if (fs.existsSync(estudiosFile)) {
    const content = fs.readFileSync(estudiosFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    estudiosData.estudios = [];
    const regiones = new Set();
    const instituciones = new Set();

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 5) continue;

        const region = values[0] || '';
        const titulo = values[1] || '';
        const institucion = values[2] || '';
        const descripcion = values[3] || '';
        const enlace = values[4] || '';

        if (!region || !titulo) continue;

        regiones.add(region);
        instituciones.add(institucion);

        estudiosData.estudios.push({
            region,
            titulo,
            institucion,
            descripcion,
            enlace
        });
    }

    estudiosData.regiones = [...regiones].sort();
    estudiosData.instituciones = [...instituciones].sort();
    estudiosData.kpi = {
        totalEstudios: estudiosData.estudios.length,
        regionesConEstudios: regiones.size
    };
}

fs.writeFileSync(path.join(outputDir, 'estudios_mercado.json'), JSON.stringify(estudiosData, null, 2));
console.log('  ✅ estudios_mercado.json created');

// ============= 2.5.2 ESTADÍSTICAS PRODUCCIÓN/EXPO/IMPO =============
console.log('Processing 2.5.2 Estadísticas Producción/Expo/Impo...');

const estadFile = path.join(dataDir, '2.5.2.ESTAD_PROD_EXPO_IMPO_PCF.csv');
let estadData = {
    metadata: {
        source: 'SERFOR / SUNAT',
        lastUpdated: new Date().toISOString().split('T')[0]
    }
};

if (fs.existsSync(estadFile)) {
    const content = fs.readFileSync(estadFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    estadData.produccion = [];
    estadData.importacion = [];
    estadData.exportacion = [];

    let totalProduccion = 0;
    let totalImportacion = 0;
    let totalExportacion = 0;

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 5) continue;

        const fase = (values[0] || '').toUpperCase();
        const producto = values[1] || '';
        const detalle = values[2] || '';
        const unidad = values[3] || '';
        const cantidad = parseNumber(values[4]);

        if (!producto) continue;

        const record = { producto, detalle, unidad, cantidad };

        if (fase.includes('PRODUCCIÓN') || fase.includes('PRODUCCION')) {
            estadData.produccion.push(record);
            if (unidad === 'm³') totalProduccion += cantidad;
        } else if (fase.includes('IMPORTACIÓN') || fase.includes('IMPORTACION')) {
            estadData.importacion.push(record);
            if (unidad.includes('US$')) totalImportacion += cantidad;
        } else if (fase.includes('EXPORTACIÓN') || fase.includes('EXPORTACION')) {
            estadData.exportacion.push(record);
            if (unidad.includes('US$')) totalExportacion += cantidad;
        }
    }

    estadData.kpi = {
        totalProduccion,
        totalImportacion,
        totalExportacion,
        balanzaComercial: totalExportacion - totalImportacion,
        deficitComercial: totalImportacion - totalExportacion
    };
}

fs.writeFileSync(path.join(outputDir, 'estadisticas_comercio.json'), JSON.stringify(estadData, null, 2));
console.log('  ✅ estadisticas_comercio.json created');

// ============= 2.5.3 BOLETINES COMERCIALES =============
console.log('Processing 2.5.3 Boletines Comerciales...');

const boletinesFile = path.join(dataDir, '2.5.3.BOLETINES_COMERCIALES_20251121.csv');
let boletinesData = {
    metadata: {
        source: 'Compilación SERFOR',
        lastUpdated: new Date().toISOString().split('T')[0]
    }
};

if (fs.existsSync(boletinesFile)) {
    const content = fs.readFileSync(boletinesFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    boletinesData.boletines = [];
    const frecuencias = new Set();

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 5) continue;

        const nombre = values[0] || '';
        const institucion = values[1] || '';
        const frecuencia = values[2] || '';
        const tematica = values[3] || '';
        const enlace = values[4] || '';

        if (!nombre) continue;

        frecuencias.add(frecuencia);

        boletinesData.boletines.push({
            nombre,
            institucion,
            frecuencia,
            tematica,
            enlace: enlace.startsWith('http') ? enlace : `https://${enlace}`
        });
    }

    boletinesData.frecuencias = [...frecuencias];
    boletinesData.kpi = {
        totalBoletines: boletinesData.boletines.length
    };
}

fs.writeFileSync(path.join(outputDir, 'boletines_comerciales.json'), JSON.stringify(boletinesData, null, 2));
console.log('  ✅ boletines_comerciales.json created');

console.log('\n✅ Información Comercial data processed successfully!');
