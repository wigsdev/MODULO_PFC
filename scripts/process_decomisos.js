const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.4.3.BD_DECOMISOS_FORESTALES_2024_20251121.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/decomisos.json');

console.log(`Processing Decomisos...`);

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
        aserrada: cleanNum(r['MADERA ASERRADA (m3)']),
        rolliza: cleanNum(r['MADERA ROLLIZA (m3)']),
        carbon: cleanNum(r['CARBÓN VEGETAL (kg)'])
    })).filter(r => r.region && (r.aserrada > 0 || r.rolliza > 0 || r.carbon > 0));

    // Sort by Total Wood desc
    regions.sort((a, b) => (b.aserrada + b.rolliza) - (a.aserrada + a.rolliza));

    const kpi = {
        totalAserrada: regions.reduce((acc, r) => acc + r.aserrada, 0),
        totalRolliza: regions.reduce((acc, r) => acc + r.rolliza, 0),
        totalCarbon: regions.reduce((acc, r) => acc + r.carbon, 0),
        topRegion: regions[0]?.region || 'N/A'
    };

    const output = {
        metadata: {
            title: "Decomisos Forestales (2024)",
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
    console.error("Error processing Decomisos:", error.message);
}
