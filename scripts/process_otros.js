const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS');
const outputDir = path.join(__dirname, '../public/data/espacial');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function parseNumber(str) {
    if (!str || str === 'Sin datos' || str === 'N/A (Bosque Andino)') return 0;
    return parseFloat(str.replace(/,/g, '').replace(/"/g, '').replace(/[^\d.-]/g, '')) || 0;
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

// ============= 2.6.1 REGISTRO PFC 7D =============
console.log('Processing 2.6.1 Registro PFC...');

const registroFile = path.join(dataDir, '2.6.1.REGISTRO_PFC_7D.csv');
let registroData = {
    metadata: {
        source: 'SERFOR / SNIFFS',
        lastUpdated: new Date().toISOString().split('T')[0]
    }
};

if (fs.existsSync(registroFile)) {
    const content = fs.readFileSync(registroFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    registroData.registros = [];
    const porAnio = {};
    const porDepartamento = {};
    const porTipoPersona = {};
    const porRegimen = {};
    let totalArea = 0;

    for (let i = 2; i < lines.length; i++) { // Start at 2 (header is split across lines)
        const values = parseCSVLine(lines[i]);
        if (values.length < 12) continue;

        const anio = parseInt(values[0]) || 0;
        const certificado = values[1] || '';
        const titular = values[2] || '';
        const tipoPersona = values[3] || '';
        const regimen = values[4] || '';
        const finalidad = values[5] || '';
        const departamento = values[7] || '';
        const provincia = values[8] || '';
        const distrito = values[9] || '';
        const area = parseNumber(values[11]);

        if (!anio || anio < 2000 || anio > 2030) continue;

        totalArea += area;

        // Aggregations
        porAnio[anio] = (porAnio[anio] || 0) + 1;
        porDepartamento[departamento] = (porDepartamento[departamento] || { count: 0, area: 0 });
        porDepartamento[departamento].count++;
        porDepartamento[departamento].area += area;
        porTipoPersona[tipoPersona] = (porTipoPersona[tipoPersona] || 0) + 1;
        porRegimen[regimen] = (porRegimen[regimen] || 0) + 1;

        registroData.registros.push({
            anio,
            certificado,
            titular: titular.substring(0, 50) + (titular.length > 50 ? '...' : ''),
            tipoPersona,
            regimen,
            finalidad,
            departamento,
            provincia,
            distrito,
            area
        });
    }

    // Convert to arrays for charts
    registroData.porAnio = Object.entries(porAnio)
        .map(([year, count]) => ({ year: parseInt(year), count }))
        .sort((a, b) => a.year - b.year);

    registroData.porDepartamento = Object.entries(porDepartamento)
        .map(([name, data]) => ({ departamento: name, count: data.count, area: data.area }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

    registroData.porTipoPersona = Object.entries(porTipoPersona)
        .map(([name, count]) => ({ tipo: name, count }));

    registroData.porRegimen = Object.entries(porRegimen)
        .map(([name, count]) => ({ regimen: name, count }))
        .sort((a, b) => b.count - a.count);

    registroData.departamentos = [...new Set(registroData.registros.map(r => r.departamento))].sort();
    registroData.anios = [...new Set(registroData.registros.map(r => r.anio))].sort();

    registroData.kpi = {
        totalRegistros: registroData.registros.length,
        totalArea: Math.round(totalArea * 100) / 100,
        topDepartamento: registroData.porDepartamento[0]?.departamento || 'N/A',
        promedioAreaPorRegistro: Math.round((totalArea / registroData.registros.length) * 100) / 100
    };
}

fs.writeFileSync(path.join(outputDir, 'registro_pfc.json'), JSON.stringify(registroData, null, 2));
console.log(`  ✅ registro_pfc.json created (${registroData.registros?.length || 0} registros)`);

// ============= 2.6.2 TIERRAS PARA PFC =============
console.log('Processing 2.6.2 Tierras para PFC...');

const tierrasFile = path.join(dataDir, '2.6.2.TIERRAS_PARA_PFC.csv');
let tierrasData = {
    metadata: {
        source: 'ZEE / MINAM',
        lastUpdated: new Date().toISOString().split('T')[0]
    }
};

if (fs.existsSync(tierrasFile)) {
    const content = fs.readFileSync(tierrasFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    tierrasData.tierras = [];
    const porAptitud = {};
    const porDepartamento = {};
    let totalSuperficie = 0;

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 5) continue;

        const aptitud = values[0] || '';
        const departamento = values[1] || '';
        const provincia = values[2] || '';
        const distrito = values[3] || '';
        const superficie = parseNumber(values[4]);

        if (!aptitud || !departamento) continue;

        totalSuperficie += superficie;

        porAptitud[aptitud] = (porAptitud[aptitud] || 0) + superficie;
        porDepartamento[departamento] = (porDepartamento[departamento] || { total: 0, aptitudes: {} });
        porDepartamento[departamento].total += superficie;
        porDepartamento[departamento].aptitudes[aptitud] = (porDepartamento[departamento].aptitudes[aptitud] || 0) + superficie;

        tierrasData.tierras.push({
            aptitud,
            departamento,
            provincia,
            distrito,
            superficie
        });
    }

    tierrasData.porAptitud = Object.entries(porAptitud)
        .map(([name, value]) => ({ aptitud: name, superficie: Math.round(value * 100) / 100 }))
        .sort((a, b) => b.superficie - a.superficie);

    tierrasData.porDepartamento = Object.entries(porDepartamento)
        .map(([name, data]) => ({
            departamento: name,
            total: Math.round(data.total * 100) / 100,
            ...Object.fromEntries(Object.entries(data.aptitudes).map(([k, v]) => [k.replace(/ /g, '_').replace(/\//g, '_'), Math.round(v * 100) / 100]))
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 12);

    tierrasData.aptitudes = [...new Set(tierrasData.tierras.map(t => t.aptitud))].sort();
    tierrasData.departamentos = [...new Set(tierrasData.tierras.map(t => t.departamento))].sort();

    const forestalProductivo = porAptitud['FORESTAL PRODUCTIVO'] || 0;
    const proteccion = porAptitud['PROTECCION'] || 0;

    tierrasData.kpi = {
        superficieTotal: Math.round(totalSuperficie * 100) / 100,
        superficieForestalProductivo: Math.round(forestalProductivo * 100) / 100,
        porcentajeForestalProductivo: Math.round((forestalProductivo / totalSuperficie) * 10000) / 100,
        superficieProteccion: Math.round(proteccion * 100) / 100,
        porcentajeProteccion: Math.round((proteccion / totalSuperficie) * 10000) / 100,
        topDepartamento: tierrasData.porDepartamento[0]?.departamento || 'N/A'
    };
}

fs.writeFileSync(path.join(outputDir, 'tierras_pfc.json'), JSON.stringify(tierrasData, null, 2));
console.log(`  ✅ tierras_pfc.json created (${tierrasData.tierras?.length || 0} registros)`);

// ============= 2.6.3 BOSQUE NO BOSQUE =============
console.log('Processing 2.6.3 Bosque No Bosque...');

const bosqueFile = path.join(dataDir, '2.6.3.BD_BOSQUE_NO_BOSQUE.csv');
let bosqueData = {
    metadata: {
        source: 'GeoBosques / MINAM',
        lastUpdated: new Date().toISOString().split('T')[0]
    }
};

if (fs.existsSync(bosqueFile)) {
    const content = fs.readFileSync(bosqueFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    bosqueData.regiones = [];
    let totals = null;

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 6) continue;

        const region = values[0] || '';
        if (!region || region.startsWith('Área Potencial') || region.startsWith('Cajamarca (*)') || region.startsWith('Áncash')) continue;

        const lineaBaseNoBosque = parseNumber(values[1]);
        const perdidaAcumulada = parseNumber(values[2]);
        const bosqueRemanente = parseNumber(values[3]);
        const cuerposAgua = parseNumber(values[4]);
        const areaPotencial = parseNumber(values[5]);

        const record = {
            region,
            lineaBaseNoBosque,
            perdidaAcumulada,
            bosqueRemanente,
            cuerposAgua,
            areaPotencial
        };

        if (region === 'TOTAL') {
            totals = record;
        } else {
            bosqueData.regiones.push(record);
        }
    }

    // Sort by area potencial
    bosqueData.regiones.sort((a, b) => b.areaPotencial - a.areaPotencial);

    bosqueData.kpi = {
        areaPotencialTotal: totals?.areaPotencial || 0,
        bosqueRemanenteTotal: totals?.bosqueRemanente || 0,
        perdidaAcumuladaTotal: totals?.perdidaAcumulada || 0,
        regionMayorPotencial: bosqueData.regiones[0]?.region || 'N/A',
        regionMayorBosque: [...bosqueData.regiones].sort((a, b) => b.bosqueRemanente - a.bosqueRemanente)[0]?.region || 'N/A'
    };
}

fs.writeFileSync(path.join(outputDir, 'bosque_no_bosque.json'), JSON.stringify(bosqueData, null, 2));
console.log(`  ✅ bosque_no_bosque.json created (${bosqueData.regiones?.length || 0} regiones)`);

// ============= 2.6.4 SISTEMAS DE INFORMACIÓN =============
console.log('Processing 2.6.4 Sistemas de Información...');

const sistemasFile = path.join(dataDir, '2.6.4.BD_SISTEMAS_INFO_PI1_20251121.csv');
let sistemasData = {
    metadata: {
        source: 'Compilación SERFOR',
        lastUpdated: new Date().toISOString().split('T')[0]
    }
};

if (fs.existsSync(sistemasFile)) {
    const content = fs.readFileSync(sistemasFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    sistemasData.sistemas = [];
    const tiposDato = new Set();

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 7) continue;

        const nombre = values[0] || '';
        const siglas = values[1] || '';
        const institucion = values[2] || '';
        const utilidad = values[3] || '';
        const tipoDato = values[4] || '';
        const nivelAcceso = values[5] || '';
        const enlace = values[6] || '';

        if (!nombre) continue;

        tiposDato.add(tipoDato);

        sistemasData.sistemas.push({
            nombre,
            siglas,
            institucion,
            utilidad,
            tipoDato,
            nivelAcceso,
            enlace
        });
    }

    sistemasData.tiposDato = [...tiposDato];
    sistemasData.kpi = {
        totalSistemas: sistemasData.sistemas.length,
        sistemasPublicos: sistemasData.sistemas.filter(s => s.nivelAcceso.includes('Público')).length
    };
}

fs.writeFileSync(path.join(outputDir, 'sistemas_info.json'), JSON.stringify(sistemasData, null, 2));
console.log(`  ✅ sistemas_info.json created (${sistemasData.sistemas?.length || 0} sistemas)`);

console.log('\n✅ Otros Datos Espaciales processed successfully!');
