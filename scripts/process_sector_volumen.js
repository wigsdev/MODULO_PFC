const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Input
const INPUT_FILE = path.join(__dirname, '../data/III. SECTOR/3.2.1.VOL_PROD_MAD_DECOMISADOS.csv');

// Output
const OUTPUT_FILE = path.join(__dirname, '../public/data/sector/volumen_decomisado.json');

console.log(`Processing Sector Volumen Decomisado...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val || val === '-') return 0;
        return parseFloat(val.toString().replace(/,/g, '')) || 0;
    };

    const list = rawData.map(r => ({
        region: r['DEPARTAMENTO'],
        aserrada: cleanNum(r['MADERA ASERRADA (m³)']),
        rolliza: cleanNum(r['MADERA ROLLIZA (m³)']),
        carbon: cleanNum(r['CARBÓN (kg)'])
    })).filter(r => r.region);

    // Calculate Totals per Region for sorting (by Wood volume)
    list.forEach(item => {
        item.totalWood = item.aserrada + item.rolliza;
    });

    // Sort by Total Wood Volume Descending
    list.sort((a, b) => b.totalWood - a.totalWood);

    const kpi = {
        totalAserrada: list.reduce((acc, r) => acc + r.aserrada, 0),
        totalRolliza: list.reduce((acc, r) => acc + r.rolliza, 0),
        totalCarbon: list.reduce((acc, r) => acc + r.carbon, 0),
        topRegionWood: list[0]?.region || 'N/A'
    };

    const output = {
        metadata: {
            title: "Volumen de Productos Forestales Decomisados",
            source: "SNIFFS - Reportes de Decomisos",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi,
        list
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Sector Volumen Decomisado:", error.message);
    process.exit(1);
}
