const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.3.3.BD_CAMBIO_HISTORICO_DE_LA_SUPERFICIE_CUBIERTA_POR_BOSQUE_20251121.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/cambio_historico.json');

console.log(`Processing Historical Change...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Helper to parse numbers
    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(val.toString().replace(/,/g, '')) || 0;
    };

    // Extract Years and Regions
    // Data Structure: { AÑO: 2001, HUÁNUCO: "10,784", ... }
    const regions = [
        'HUÁNUCO', 'SAN MARTÍN', 'MADRE DE DIOS', 'JUNÍN', 'PASCO', 'CAJAMARCA'
    ];

    const timeline = rawData.map(r => {
        const year = r['AÑO'];
        const rowData = { name: year.toString() }; // 'name' for Recharts XAxis

        regions.forEach(region => {
            rowData[region] = cleanNum(r[region]);
        });
        return rowData;
    }).filter(r => r.name && r.name !== 'TOTAL');

    // KPI Calculations
    let totalAccumulated = 0;
    let maxLossValue = 0;
    let maxLossYear = '';
    let totalYears = timeline.length;

    timeline.forEach(t => {
        let yearlyTotal = 0;
        regions.forEach(r => {
            const val = t[r] || 0;
            yearlyTotal += val;
            totalAccumulated += val;
        });

        if (yearlyTotal > maxLossValue) {
            maxLossValue = yearlyTotal;
            maxLossYear = t.name;
        }
    });

    const output = {
        metadata: {
            title: "Tendencia de Pérdida de Bosque (2001-2024)",
            source: "GeoBosques (2025)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            totalAccumulated,
            avgYearly: totalYears > 0 ? totalAccumulated / totalYears : 0,
            maxLossYear,
            maxLossValue
        },
        regionsList: regions,
        timeline
    };

    // Write Output
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Historical Change:", error.message);
    process.exit(1);
}
