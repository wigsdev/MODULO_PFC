const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Input
const INPUT_FILE = path.join(__dirname, '../data/III. SECTOR/3.4.1.RESERVAS_DE_LA_BIOSFERA.csv');

// Output
const OUTPUT_FILE = path.join(__dirname, '../public/data/sector/reservas.json');

console.log(`Processing Sector Reservas...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const list = rawData.map(r => ({
        year: r['Año'],
        name: r['Reserva de Biosfera'],
        regions: r['Regiones']
    })).filter(r => r.name);

    // Sort by Year Descending
    list.sort((a, b) => b.year - a.year);

    // KPIs
    const uniqueRegions = new Set();
    list.forEach(item => {
        if (item.regions) {
            item.regions.split(',').forEach(reg => uniqueRegions.add(reg.trim()));
        }
    });

    const kpi = {
        totalReserves: list.length,
        totalRegions: uniqueRegions.size,
        latestReserve: list[0]?.name || 'N/A'
    };

    const output = {
        metadata: {
            title: "Reservas de Biosfera del Perú",
            source: "SERNANP / UNESCO",
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
    console.error("Error processing Sector Reservas:", error.message);
    process.exit(1);
}
