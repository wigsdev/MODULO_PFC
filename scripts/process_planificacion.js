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

// ============= 2.1.3 SUSCEPTIBILIDAD =============
console.log('Processing 2.1.3 Susceptibilidad...');

const susceptibilidadFile = path.join(dataDir, '2.1.3.SUSCEPTIBILIDAD_FINAL_HCO.csv');
let susceptibilidadData = {
    metadata: {
        source: 'SERFOR - Análisis de Susceptibilidad',
        lastUpdated: new Date().toISOString().split('T')[0],
        departamento: 'HUANUCO'
    }
};

if (fs.existsSync(susceptibilidadFile)) {
    const content = fs.readFileSync(susceptibilidadFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',');

    // Aggregate data
    const byGradoMercado = {};
    const byNivelAcceso = {};
    const byProvincia = {};
    const byDistrito = {};

    let totalSuperficie = 0;
    let totalRegistros = 0;

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < 6) continue;

        const nivelAcceso = values[0]?.trim() || '';
        const gradoMercado = values[1]?.trim() || '';
        const superficie = parseNumber(values[2]);
        const provincia = values[4]?.trim() || '';
        const distrito = values[5]?.trim() || '';

        // Skip empty rows
        if (!nivelAcceso || superficie === 0) continue;

        totalSuperficie += superficie;
        totalRegistros++;

        // By Grado Mercado
        if (!byGradoMercado[gradoMercado]) byGradoMercado[gradoMercado] = 0;
        byGradoMercado[gradoMercado] += superficie;

        // By Nivel Acceso
        if (!byNivelAcceso[nivelAcceso]) byNivelAcceso[nivelAcceso] = 0;
        byNivelAcceso[nivelAcceso] += superficie;

        // By Provincia
        if (!byProvincia[provincia]) byProvincia[provincia] = { superficie: 0, count: 0 };
        byProvincia[provincia].superficie += superficie;
        byProvincia[provincia].count++;

        // By Distrito (for top list)
        const distritoKey = `${provincia}-${distrito}`;
        if (!byDistrito[distritoKey]) byDistrito[distritoKey] = { provincia, distrito, superficie: 0 };
        byDistrito[distritoKey].superficie += superficie;
    }

    susceptibilidadData.kpi = {
        superficieTotal: totalSuperficie,
        totalRegistros,
        superficieAlta: byNivelAcceso['ALTA'] || 0,
        superficieMedia: byNivelAcceso['MEDIA'] || 0,
        provinciaLider: Object.entries(byProvincia).sort((a, b) => b[1].superficie - a[1].superficie)[0]?.[0] || ''
    };

    susceptibilidadData.gradoMercado = Object.entries(byGradoMercado).map(([grado, superficie]) => ({
        grado,
        superficie,
        porcentaje: ((superficie / totalSuperficie) * 100).toFixed(2)
    })).sort((a, b) => b.superficie - a.superficie);

    susceptibilidadData.nivelAcceso = Object.entries(byNivelAcceso).map(([nivel, superficie]) => ({
        nivel,
        superficie,
        porcentaje: ((superficie / totalSuperficie) * 100).toFixed(2)
    }));

    susceptibilidadData.provincias = Object.entries(byProvincia).map(([nombre, data]) => ({
        nombre,
        superficie: data.superficie,
        registros: data.count
    })).sort((a, b) => b.superficie - a.superficie);

    susceptibilidadData.topDistritos = Object.values(byDistrito)
        .sort((a, b) => b.superficie - a.superficie)
        .slice(0, 15);
}

fs.writeFileSync(path.join(outputDir, 'susceptibilidad.json'), JSON.stringify(susceptibilidadData, null, 2));
console.log('  ✅ susceptibilidad.json created');

// ============= 2.1.4 BRECHA TITULACION =============
console.log('Processing 2.1.4 Brecha Titulación...');

const brechaFile = path.join(dataDir, '2.1.4.BRECHA_TITULACION.csv');
let brechaData = {
    metadata: {
        source: 'MNSA / SICAR',
        lastUpdated: new Date().toISOString().split('T')[0],
        departamento: 'HUANUCO'
    }
};

if (fs.existsSync(brechaFile)) {
    const content = fs.readFileSync(brechaFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    const byPrioridad = {};
    const byProvincia = {};
    const distritos = [];

    let totalSuperficie = 0;
    let totalPredios = 0;

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < 7) continue;

        const prioridad = values[0]?.trim() || '';
        const provincia = values[2]?.trim() || '';
        const distrito = values[3]?.trim() || '';
        const superficie = parseNumber(values[4]);
        const predios = parseNumber(values[5]);

        if (!prioridad) continue;

        totalSuperficie += superficie;
        totalPredios += predios;

        // By Prioridad
        if (!byPrioridad[prioridad]) byPrioridad[prioridad] = { superficie: 0, predios: 0, count: 0 };
        byPrioridad[prioridad].superficie += superficie;
        byPrioridad[prioridad].predios += predios;
        byPrioridad[prioridad].count++;

        // By Provincia
        if (!byProvincia[provincia]) byProvincia[provincia] = { superficie: 0, predios: 0, count: 0 };
        byProvincia[provincia].superficie += superficie;
        byProvincia[provincia].predios += predios;
        byProvincia[provincia].count++;

        distritos.push({ prioridad, provincia, distrito, superficie, predios });
    }

    const prioridadMuyAlta = byPrioridad['MUY ALTA (Corredor Económico)'] || { superficie: 0, predios: 0 };
    const prioridadAlta = byPrioridad['ALTA (Zona de Expansión)'] || { superficie: 0, predios: 0 };

    brechaData.kpi = {
        superficieTotal: totalSuperficie,
        prediosTotal: Math.round(totalPredios),
        superficieMuyAlta: prioridadMuyAlta.superficie,
        superficieAlta: prioridadAlta.superficie,
        provinciaLider: Object.entries(byProvincia).sort((a, b) => b[1].superficie - a[1].superficie)[0]?.[0] || ''
    };

    brechaData.prioridad = Object.entries(byPrioridad).map(([tipo, data]) => ({
        tipo: tipo.includes('MUY ALTA') ? 'Muy Alta (Corredor Económico)' : 'Alta (Zona Expansión)',
        superficie: data.superficie,
        predios: Math.round(data.predios),
        distritos: data.count,
        porcentaje: ((data.superficie / totalSuperficie) * 100).toFixed(2)
    }));

    brechaData.provincias = Object.entries(byProvincia).map(([nombre, data]) => ({
        nombre,
        superficie: data.superficie,
        predios: Math.round(data.predios),
        distritos: data.count
    })).sort((a, b) => b.superficie - a.superficie);

    brechaData.topDistritos = distritos
        .sort((a, b) => b.superficie - a.superficie)
        .slice(0, 20)
        .map(d => ({
            ...d,
            predios: Math.round(d.predios),
            prioridadCorta: d.prioridad.includes('MUY ALTA') ? 'Muy Alta' : 'Alta'
        }));
}

fs.writeFileSync(path.join(outputDir, 'brecha_titulacion.json'), JSON.stringify(brechaData, null, 2));
console.log('  ✅ brecha_titulacion.json created');

console.log('\n✅ Planificación Rural data processed successfully!');
