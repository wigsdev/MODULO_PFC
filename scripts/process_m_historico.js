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
        const year = parseInt(r['AÑO']);
        const rowData = { year }; // changed 'name' to 'year'

        let rowTotal = 0;
        regions.forEach(region => {
            const val = cleanNum(r[region]);
            rowData[region] = val;
            rowTotal += val;
        });
        rowData.total = rowTotal;
        return rowData;
    }).filter(r => !isNaN(r.year));

    // KPI Calculations
    let totalAcumulado = 0;
    let deforestacionPico = 0;
    let añoPico = 0;
    const regionTotalsMap = {};

    // Initialize region totals
    regions.forEach(r => regionTotalsMap[r] = 0);

    timeline.forEach(t => {
        totalAcumulado += t.total;

        // Peak Year
        if (t.total > deforestacionPico) {
            deforestacionPico = t.total;
            añoPico = t.year;
        }

        // Region Totals
        regions.forEach(r => {
            regionTotalsMap[r] += (t[r] || 0);
        });
    });

    // Last Year Stats
    const lastRecord = timeline[timeline.length - 1] || {};
    const prevRecord = timeline[timeline.length - 2] || {};
    const ultimoAño = lastRecord.year || 0;
    const deforestacionUltimoAño = lastRecord.total || 0;

    // Tendencia (Change vs previous year)
    let tendencia = "0";
    if (lastRecord.total && prevRecord.total) {
        const diff = lastRecord.total - prevRecord.total;
        const pct = (diff / prevRecord.total) * 100;
        tendencia = pct.toFixed(1);
    }

    // Totales Por Region Array
    const totalesPorRegion = regions.map(r => ({
        region: r,
        total: regionTotalsMap[r]
    })).sort((a, b) => b.total - a.total);

    const output = {
        metadata: {
            source: "GeoBosques (2025)",
            lastUpdated: new Date().toISOString().split('T')[0],
            nota: "Deforestación anual en hectáreas"
        },
        kpi: {
            totalAcumulado,
            añoPico,
            deforestacionPico,
            ultimoAño,
            deforestacionUltimoAño,
            tendencia
        },
        regiones: regions,
        serieHistorica: timeline,
        totalesPorRegion
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
