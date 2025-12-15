const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/BD_MONITOREO_BOSQUES_20251119.xlsx');
const outputFile = path.join(__dirname, '../public/data/espacial/bosques.json');

try {
    console.log(`Processing file: ${inputFile}`);
    const workbook = XLSX.readFile(inputFile, { dense: true });
    const sheetName = workbook.SheetNames[0]; // 'HISTORICO_REGIONAL'
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Map and Clean Data
    const cleanData = rawData.map(row => ({
        region: row['REGION'],
        superficie2024: row['SUPERFICIE BOSQUE 2024 (Ha)'] || 0,
        perdida2023: row['PÉRDIDA 2023 (Ha)'] || 0,
        perdida2024: row['PÉRDIDA 2024 (Ha)'] || 0,
        variacion: row['VARIACIÓN PÉRDIDA (%)'] || 0, // Decimal percentage (e.g., 0.67 = 67%) or raw? Sample showed 0.6711 -> likely raw decimal if percentage column
        tendencia: row['TENDENCIA'] || 'Sin Datos'
    })).filter(r => r.region);

    // Calculate Totals
    const totalSuperficie = cleanData.reduce((acc, curr) => acc + curr.superficie2024, 0);
    const totalPerdida2024 = cleanData.reduce((acc, curr) => acc + curr.perdida2024, 0);
    const totalPerdida2023 = cleanData.reduce((acc, curr) => acc + curr.perdida2023, 0);

    // Sort by Surface Area (descending) for charts
    cleanData.sort((a, b) => b.superficie2024 - a.superficie2024);

    const dashboardData = {
        metadata: {
            title: "Monitoreo de Bosques y Carbono",
            source: "GEOBOSQUES / MINAM (2025)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            totalSuperficie: Math.round(totalSuperficie),
            totalPerdida2024: Math.round(totalPerdida2024),
            totalPerdida2023: Math.round(totalPerdida2023),
            variacionNacional: totalPerdida2023 > 0 ? ((totalPerdida2024 - totalPerdida2023) / totalPerdida2023) : 0
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
