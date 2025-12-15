const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.2.4.BD_INVENTARIO_FORESTAL_202511211.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/inventario_forestal.json');

console.log(`Processing Inventory...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Helpers
    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseInt(val.toString().replace(/,/g, ''), 10) || 0;
    };

    const regions = rawData.map(r => ({
        region: r['REGIÓN PI1'],
        ecozona: r['ECOZONA REFERENCIAL (INFFS)'],
        especies: cleanNum(r['NRO_ESPECIES_FLORA']),
        fuente: r['FUENTE']
    })).filter(r => r.region);

    // Sort by Species Count Descending
    regions.sort((a, b) => b.especies - a.especies);

    // KPIs
    const totalEspecies = regions.reduce((acc, curr) => acc + curr.especies, 0);
    const topRegion = regions.length > 0 ? regions[0] : { region: 'N/A', especies: 0 };

    const output = {
        metadata: {
            title: "Inventario Nacional Forestal (Flora)",
            source: "INFFS / SERFOR (2025)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            totalEspecies,
            topRegionName: topRegion.region,
            topRegionValue: topRegion.especies,
            regionsCount: regions.length
        },
        regions
    };

    // Write Output
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Inventory:", error.message);
    process.exit(1);
}
