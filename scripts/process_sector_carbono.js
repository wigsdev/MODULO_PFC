const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Input
const INPUT_FILE = path.join(__dirname, '../data/III. SECTOR/3.7.1.MAPA_CARBONO_TIPO_DE_BOSQUE.csv');

// Output
const OUTPUT_FILE = path.join(__dirname, '../public/data/sector/carbono.json');

console.log(`Processing Sector Carbono...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(val.toString().replace(/,/g, '')) || 0;
    };

    const list = rawData.map(r => ({
        region: r['REGIÓN'],
        ecozone: r['ECOZONA PREDOMINANTE'],
        stockC: cleanNum(r['STOCK PROM. (tC/ha)']),
        stockCO2: cleanNum(r['STOCK PROM. (tCO2e/ha)']),
        vocation: r['VOCACIÓN DE NEGOCIO (Mercado Carbono)']
    })).filter(r => r.region);

    // Sort by Stock C Descending
    list.sort((a, b) => b.stockC - a.stockC);

    const kpi = {
        avgStockC: list.reduce((acc, r) => acc + r.stockC, 0) / list.length,
        maxStockRegion: list[0]?.region || 'N/A',
        totalPotentialRegions: list.length
    };

    const output = {
        metadata: {
            title: "Mapa de Carbono y Vocación de Negocio",
            source: "MINAM / Proyectos REDD+",
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
    console.error("Error processing Sector Carbono:", error.message);
    process.exit(1);
}
