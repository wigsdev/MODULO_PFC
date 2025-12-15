const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_REGIONS = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.2.3.BD_INDICADORES_FORESTALES_20251121.csv');
const INPUT_ECOZONES = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.2.3.BD_INDICADORES_FORESTALES_ECOZONAS_20251121.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/indicadores_bosque.json');

console.log(`Processing Indicators...`);

try {
    // 1. Process Ecozones (Master Data)
    const wbEco = XLSX.readFile(INPUT_ECOZONES);
    const rawEco = XLSX.utils.sheet_to_json(wbEco.Sheets[wbEco.SheetNames[0]]);

    // Helper parsers
    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(val.toString().replace(/,/g, '')) || 0;
    };

    const ecozones = rawEco.map(r => ({
        name: r['ECOZONA INFFS'],
        volumen: cleanNum(r['VOLUMEN (m³/ha)']),
        biomasa: cleanNum(r['BIOMASA (t/ha)']),
        carbono: cleanNum(r['CARBONO (tC/ha)']),
        fuente: r['FUENTE DOCUMENTAL']
    })).filter(r => r.name); // Filter empty rows

    // 2. Process Regions (Mapped Data)
    const wbReg = XLSX.readFile(INPUT_REGIONS);
    const rawReg = XLSX.utils.sheet_to_json(wbReg.Sheets[wbReg.SheetNames[0]]);

    const regions = rawReg.map(r => ({
        region: r['REGIÓN PI1'],
        ecozona: r['ECOZONA REFERENCIAL (INFFS)'],
        volumen: cleanNum(r['VOLUMEN TOTAL (m³/ha)']),
        biomasa: cleanNum(r['BIOMASA AÉREA (t/ha)']),
        carbono: cleanNum(r['CARBONO AÉREO (tC/ha)'])
    })).filter(r => r.region);

    // 3. Calculate KPIs (Simple averages for displayed regions)
    const avgCarbon = regions.reduce((acc, curr) => acc + curr.carbono, 0) / regions.length;
    const avgBiomass = regions.reduce((acc, curr) => acc + curr.biomasa, 0) / regions.length;
    const avgVolume = regions.reduce((acc, curr) => acc + curr.volumen, 0) / regions.length;

    const output = {
        metadata: {
            title: "Indicadores de Bosque (INFFS)",
            source: "INFFS / MINAM (2025)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            avgCarbon,
            avgBiomass,
            avgVolume,
            regionsCount: regions.length,
            ecozonesCount: ecozones.length
        },
        ecozones,
        regions
    };

    // Write Output
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Indicators:", error.message);
    process.exit(1);
}
