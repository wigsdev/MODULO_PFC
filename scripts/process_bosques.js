const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.2.1.BD_SUPERFICIE_CUBIERTA_POR_BOSQUE_NATURAL_20251119.xlsx');
const outputFile = path.join(__dirname, '../public/data/espacial/bosques.json');

try {
    console.log(`Processing file: ${inputFile}`);
    if (!fs.existsSync(inputFile)) {
        throw new Error(`Input file not found: ${inputFile}`);
    }

    const workbook = XLSX.readFile(inputFile, { dense: true });
    const sheetName = workbook.SheetNames[0]; // 'SUPERFICIE_BOSQUE_NATURAL'
    console.log(`Reading sheet: ${sheetName}`);

    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Map and Clean Data
    const cleanData = rawData.map(row => ({
        region: row['REGION'],
        superficie2024: row['SUPERFICIE BOSQUE 2024 (Ha)'] || 0
    })).filter(r => r.region);

    // Calculate Totals
    const totalSuperficie = cleanData.reduce((acc, curr) => acc + curr.superficie2024, 0);

    // Sort by Surface Area (descending) for charts
    cleanData.sort((a, b) => b.superficie2024 - a.superficie2024);

    const dashboardData = {
        metadata: {
            title: "Superficie de Bosque Natural",
            source: "GEOBOSQUES / MINAM (2025)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            totalSuperficie: Math.round(totalSuperficie)
        },
        regions: cleanData
    };

    // Ensure directory exists
    const outDir = path.dirname(outputFile);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(dashboardData, null, 2));
    console.log(`Success! Data written to ${outputFile}`);
    console.log(`Process: ${cleanData.length} regions.`);

} catch (error) {
    console.error("Error processing Bosques data:", error);
    process.exit(1);
}
