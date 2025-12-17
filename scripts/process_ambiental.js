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

function parsePercent(str) {
    if (!str) return 0;
    return parseFloat(str.replace('%', '').replace(',', '.')) || 0;
}

// ============= 2.3.1 SUPERFICIE CUBIERTA POR BOSQUE =============
console.log('Processing 2.3.1 Superficie Cubierta por Bosque...');

const superficieFile = path.join(dataDir, '2.3.1.BD_SUPERFICIE_CUBIERTA_POR_BOSQUE_20251121.csv');
let superficieData = {
    metadata: {
        source: 'GeoBosques (2024)',
        lastUpdated: new Date().toISOString().split('T')[0]
    }
};

if (fs.existsSync(superficieFile)) {
    const content = fs.readFileSync(superficieFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    // Helper to parse CSV with quoted fields (handles "8,530,054" format)
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

    superficieData.regiones = [];
    let totalBosque = 0;
    let totalSuperficie = 0;

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 6) continue;

        const region = values[0] || '';
        const superficieTotal = parseNumber(values[1]);
        const supBosque = parseNumber(values[2]);
        const cobertura = parsePercent(values[3]);
        const fuente = values[4] || '';
        const observacion = values[5] || '';

        if (!region) continue;

        totalBosque += supBosque;
        totalSuperficie += superficieTotal;

        superficieData.regiones.push({
            region,
            superficieTotal,
            supBosque,
            cobertura,
            fuente,
            observacion
        });
    }

    // Exclude Áncash (0 coverage, outside monitoring) from averages
    const regionesConBosque = superficieData.regiones.filter(r => r.supBosque > 0);
    const regionLider = [...regionesConBosque].sort((a, b) => b.cobertura - a.cobertura)[0];

    superficieData.kpi = {
        totalBosque,
        totalSuperficie,
        coberturaPromedio: regionesConBosque.length > 0
            ? (regionesConBosque.reduce((s, r) => s + r.cobertura, 0) / regionesConBosque.length).toFixed(2)
            : 0,
        regionLider: regionLider?.region || '',
        regionLiderCobertura: regionLider?.cobertura || 0
    };

    // Sort by bosque for chart
    superficieData.regiones.sort((a, b) => b.supBosque - a.supBosque);
}

fs.writeFileSync(path.join(outputDir, 'superficie_bosque.json'), JSON.stringify(superficieData, null, 2));
console.log('  ✅ superficie_bosque.json created');

// ============= 2.3.2 AUTORIDADES AMBIENTALES =============
console.log('Processing 2.3.2 Autoridades Ambientales...');

const autoridadesFile = path.join(dataDir, '2.3.2.BD_AUTORIDADES_AMBIENTALES_20251121.csv');
let autoridadesData = {
    metadata: {
        source: 'Compilación SERFOR',
        lastUpdated: new Date().toISOString().split('T')[0]
    }
};

if (fs.existsSync(autoridadesFile)) {
    const content = fs.readFileSync(autoridadesFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    autoridadesData.entidades = [];

    for (let i = 1; i < lines.length; i++) {
        // Handle CSV with commas inside quotes
        const matches = lines[i].match(/(".*?"|[^,]+)/g);
        if (!matches || matches.length < 6) continue;

        const nivel = matches[0]?.trim().replace(/"/g, '') || '';
        const entidad = matches[1]?.trim().replace(/"/g, '') || '';
        const siglas = matches[2]?.trim().replace(/"/g, '') || '';
        const funcion = matches[3]?.trim().replace(/"/g, '') || '';
        const ambito = matches[4]?.trim().replace(/"/g, '') || '';
        const enlace = matches[5]?.trim().replace(/"/g, '') || '';

        if (!nivel) continue;

        autoridadesData.entidades.push({
            nivel,
            entidad,
            siglas,
            funcion,
            ambito,
            enlace: enlace.startsWith('www.') ? `https://${enlace}` : enlace
        });
    }

    const nacionales = autoridadesData.entidades.filter(e => e.nivel === 'NACIONAL');
    const regionales = autoridadesData.entidades.filter(e => e.nivel === 'REGIONAL');

    autoridadesData.kpi = {
        totalEntidades: autoridadesData.entidades.length,
        nacionales: nacionales.length,
        regionales: regionales.length
    };

    autoridadesData.byNivel = {
        nacional: nacionales,
        regional: regionales
    };
}

fs.writeFileSync(path.join(outputDir, 'autoridades_ambientales.json'), JSON.stringify(autoridadesData, null, 2));
console.log('  ✅ autoridades_ambientales.json created');

// ============= 2.3.3 CAMBIO HISTÓRICO =============
console.log('Processing 2.3.3 Cambio Histórico...');

const cambioFile = path.join(dataDir, '2.3.3.BD_CAMBIO_HISTORICO_DE_LA_SUPERFICIE_CUBIERTA_POR_BOSQUE_20251121.csv');
let cambioData = {
    metadata: {
        source: 'GeoBosques (2024)',
        lastUpdated: new Date().toISOString().split('T')[0],
        nota: 'Deforestación anual en hectáreas'
    }
};

if (fs.existsSync(cambioFile)) {
    const content = fs.readFileSync(cambioFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    // Helper to parse CSV with quoted fields (handles "10,784" format)
    function parseCSVLineCambio(line) {
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

    const headerValues = parseCSVLineCambio(lines[0]);
    const regiones = headerValues.slice(1).map(h => h.replace('*', '')); // Skip AÑO, remove asterisks
    cambioData.regiones = regiones;
    cambioData.serieHistorica = [];

    const totalesPorRegion = {};
    regiones.forEach(r => totalesPorRegion[r] = 0);

    let totalGeneral = 0;
    let añoPico = { year: 0, total: 0 };

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLineCambio(lines[i]);
        if (values.length < 2) continue;

        const year = parseInt(values[0]);
        if (!year || isNaN(year)) continue;

        const record = { year };
        let totalAnual = 0;

        regiones.forEach((region, idx) => {
            const val = parseNumber(values[idx + 1]);
            record[region] = val;
            totalesPorRegion[region] += val;
            totalAnual += val;
        });

        record.total = totalAnual;
        totalGeneral += totalAnual;

        if (totalAnual > añoPico.total) {
            añoPico = { year, total: totalAnual };
        }

        cambioData.serieHistorica.push(record);
    }

    const ultimoAño = cambioData.serieHistorica[cambioData.serieHistorica.length - 1];
    const penultimoAño = cambioData.serieHistorica[cambioData.serieHistorica.length - 2];

    cambioData.kpi = {
        totalAcumulado: totalGeneral,
        añoPico: añoPico.year,
        deforestacionPico: añoPico.total,
        ultimoAño: ultimoAño?.year || 0,
        deforestacionUltimoAño: ultimoAño?.total || 0,
        tendencia: ultimoAño && penultimoAño
            ? ((ultimoAño.total - penultimoAño.total) / penultimoAño.total * 100).toFixed(1)
            : 0
    };

    cambioData.totalesPorRegion = Object.entries(totalesPorRegion)
        .filter(([r, v]) => v > 0)
        .map(([region, total]) => ({ region, total }))
        .sort((a, b) => b.total - a.total);
}

fs.writeFileSync(path.join(outputDir, 'cambio_historico.json'), JSON.stringify(cambioData, null, 2));
console.log('  ✅ cambio_historico.json created');

console.log('\n✅ Sistema Información Ambiental data processed successfully!');
