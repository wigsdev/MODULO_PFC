const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.3.1.BD_SUPERFICIE_CUBIERTA_POR_BOSQUE_20251121.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/superficie_cubierta.json');

console.log(`Processing Surface Coverage...`);

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Helpers
    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val || val === 'No Aplica' || val === '-') return 0;
        return parseFloat(val.toString().replace(/,/g, '').replace(/%/g, '')) || 0;
    };

    const regions = rawData.map(r => {
        const total = cleanNum(r['SUPERFICIE TOTAL (Ha)']);
        const bosque = cleanNum(r['SUP. BOSQUE (Ha)']);
        const noBosque = Math.max(0, total - bosque);
        const cobertura = cleanNum(r['% COBERTURA']);

        return {
            region: r['REGIÓN'],
            total,
            bosque,
            noBosque,
            cobertura,
            observacion: r['OBSERVACIÓN TÉCNICA']
        };
    }).filter(r => r.region && r.total > 0); // Exclude Ancash if total is 0 or invalid rows

    // KPIs
    const totalBosque = regions.reduce((acc, curr) => acc + curr.bosque, 0);
    const totalSuperficie = regions.reduce((acc, curr) => acc + curr.total, 0);
    const avgCobertura = regions.length > 0 ? regions.reduce((acc, curr) => acc + curr.cobertura, 0) / regions.length : 0;

    // Top Forest Region
    const topRegion = [...regions].sort((a, b) => b.bosque - a.bosque)[0] || { region: 'N/A', bosque: 0 };

    const output = {
        metadata: {
            title: "Superficie Cubierta por Bosque",
            source: "GeoBosques (2025)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            totalBosque,
            totalSuperficie,
            avgCobertura,
            topRegionName: topRegion.region,
            topRegionValue: topRegion.bosque
        },
        regions
    };

    // Write Output
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Surface Coverage:", error.message);
    process.exit(1);
}
