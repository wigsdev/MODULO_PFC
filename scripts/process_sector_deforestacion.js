const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Inputs
const INDICATORS_FILE = path.join(__dirname, '../data/III. SECTOR/3.1.1.DEF_INDICAD_PRESION.csv');
const HISTORY_FILE = path.join(__dirname, '../data/III. SECTOR/3.1.1.TASA_DEFORESTACION_ANUAL.csv');

// Output
const OUTPUT_FILE = path.join(__dirname, '../public/data/sector/deforestacion.json');

console.log(`Processing Sector Deforestacion...`);

try {
    // 1. Process Indicators (2023 vs 2024 + Trends)
    const wbIndicators = XLSX.readFile(INDICATORS_FILE);
    const rawIndicators = XLSX.utils.sheet_to_json(wbIndicators.Sheets[wbIndicators.SheetNames[0]]);

    const cleanNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(val.toString().replace(/,/g, '')) || 0;
    };

    const regionalData = rawIndicators.map(r => ({
        region: r['REGIÓN'],
        loss2023: cleanNum(r['PÉRDIDA 2023 (ha)']),
        loss2024: cleanNum(r['PÉRDIDA 2024 (ha)']),
        variation: r['VARIACIÓN (%)'],
        trend: r['TENDENCIA (Semáforo)']
    })).filter(r => r.region);

    // Sort by Loss 2024 desc
    regionalData.sort((a, b) => b.loss2024 - a.loss2024);

    const kpi = {
        totalLoss2024: regionalData.reduce((acc, r) => acc + r.loss2024, 0),
        totalLoss2023: regionalData.reduce((acc, r) => acc + r.loss2023, 0),
        maxLossRegion: regionalData[0]?.region || 'N/A'
    };

    // 2. Process Historical History (2001-2024)
    const wbHistory = XLSX.readFile(HISTORY_FILE);
    const rawHistory = XLSX.utils.sheet_to_json(wbHistory.Sheets[wbHistory.SheetNames[0]]);

    // Transform from Wide (Years as Rows, Regions as Cols) to Long/Structured for Recharts
    // Actually, simple array of objects { year: 2001, "SAN MARTIN": 123, "LORETO": 456... } works for Recharts LineChart

    // Clean headers just in case (remove *)
    const cleanKey = (key) => key.replace('*', '').trim();

    const historyData = rawHistory.map(row => {
        const newRow = { year: row['TA'] || row['Año'] }; // Handle disparate header if needed
        Object.keys(row).forEach(key => {
            if (key !== 'TA' && key !== 'Año') {
                newRow[cleanKey(key)] = cleanNum(row[key]);
            }
        });
        return newRow;
    });

    const output = {
        metadata: {
            title: "Presión sobre el Bosque y Deforestación",
            source: "Geobosques (2024)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi,
        regionalData,
        historyData
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing Sector Deforestacion:", error.message);
    process.exit(1);
}
