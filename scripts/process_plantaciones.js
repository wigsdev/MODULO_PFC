const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.4.4.BD_PLANTACIONES_PRODUCTORAS_PROTECTORAS_RNPF_2024_20251121.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/plantaciones.json');

console.log(`Processing Plantaciones...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(val.toString().replace(/,/g, '')) || 0;
    };

    const regions = rawData.map(r => ({
        region: r['REGIÓN'],
        certificados: cleanNum(r['N° CERTIFICADOS']),
        produccion: cleanNum(r['SUP. PRODUCCIÓN (Ha)']),
        proteccion: cleanNum(r['SUP. PROTECCIÓN (Ha)']),
        restauracion: cleanNum(r['SUP. RESTAURACIÓN (Ha)']),
        total: cleanNum(r['TOTAL (Ha)'])
    })).filter(r => r.region && r.total > 0);

    // Sort by Total Area desc
    regions.sort((a, b) => b.total - a.total);

    const kpi = {
        totalArea: regions.reduce((acc, r) => acc + r.total, 0),
        totalCertificados: regions.reduce((acc, r) => acc + r.certificados, 0),
        topRegion: regions[0]?.region || 'N/A'
    };

    const output = {
        metadata: {
            title: "Plantaciones Forestales (RNPF 2024)",
            source: "SNIFFS - SERFOR (2024)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi,
        regions
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Plantaciones:", error.message);
}
