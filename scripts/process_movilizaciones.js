const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.4.2.BD_MOVILIZACION_FORESTAL_2024_20251121.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/movilizaciones.json');

console.log(`Processing Movilizaciones...`);

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
        volumen: cleanNum(r['VOLUMEN MADERA ASERRADA (m3)']),
        depositos: cleanNum(r['DEPÓSITOS Y CENTROS (N°)'])
    })).filter(r => r.region && (r.volumen > 0 || r.depositos > 0));

    // Sort by Volumen desc
    regions.sort((a, b) => b.volumen - a.volumen);

    const kpi = {
        totalVolumen: regions.reduce((acc, r) => acc + r.volumen, 0),
        totalDepositos: regions.reduce((acc, r) => acc + r.depositos, 0),
        topRegion: regions[0]?.region || 'N/A'
    };

    const output = {
        metadata: {
            title: "Movilización Forestal (2024)",
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
    console.error("Error processing Movilizaciones:", error.message);
}
