const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.2.2.BD_CAMBIO_DE_SUPERFICIE_CUBIERTA_POR_BOSQUE_NATURAL_20251119.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/espacial/cambio_bosque.json');

console.log(`Processing file: ${INPUT_FILE}`);

try {
    if (!fs.existsSync(INPUT_FILE)) {
        throw new Error(`Input file not found: ${INPUT_FILE}`);
    }

    // Read CSV using XLSX (handles quotes and delimiters automatically)
    const workbook = XLSX.readFile(INPUT_FILE); // works for CSV too
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Helper to parse numbers like "1,234.56" or "67.12%"
    const parseNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val || val === 'No Aplica' || val === '-') return 0;
        if (typeof val === 'string') {
            // Remove % if present, clean commas and spaces
            let clean = val.replace(/%/g, '').replace(/,/g, '').replace(/\s/g, '');
            return parseFloat(clean) || 0;
        }
        return 0;
    };

    // Clean and Map Data
    const cleanData = rawData.map(row => {
        // Map CSV headers to JSON fields
        return {
            region: row['REGION'],
            superficie2024: parseNum(row['SUPERFICIE BOSQUE 2024 (Ha)']),
            perdida2023: parseNum(row['PÉRDIDA 2023 (Ha)']),
            perdida2024: parseNum(row['PÉRDIDA 2024 (Ha)']),
            variacionPct: parseNum(row['VARIACIÓN PÉRDIDA (%)']),
            tendencia: row['TENDENCIA'] || 'Sin Dato'
        };
    }).filter(r => r.region && r.region !== 'TOTAL' && r.region !== 'No Aplica');

    // KPI Calculations
    const totalLoss2024 = cleanData.reduce((acc, curr) => acc + curr.perdida2024, 0);
    const totalLoss2023 = cleanData.reduce((acc, curr) => acc + curr.perdida2023, 0);
    
    // Weighted variation or global variation? 
    // Calculating global variation derived from totals
    const globalVariation = totalLoss2023 !== 0 
        ? ((totalLoss2024 - totalLoss2023) / totalLoss2023) * 100 
        : 0;

    // Count trends
    const trendCounts = cleanData.reduce((acc, curr) => {
        acc[curr.tendencia] = (acc[curr.tendencia] || 0) + 1;
        return acc;
    }, {});

    const output = {
        metadata: {
            title: "Cambio de Superficie y Pérdida de Bosque",
            source: "GEOBOSQUES / MINAM (2025)",
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        kpi: {
            totalLoss2024,
            totalLoss2023,
            variacionPct: globalVariation,
            regionsCritical: trendCounts['Aumento Crítico'] || 0,
            regionsReduction: (trendCounts['Reducción'] || 0) + (trendCounts['Reducción Notable'] || 0)
        },
        regions: cleanData
    };

    // Ensure output dir exists
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);
    console.log(`Summary: Loss 2024=${totalLoss2024.toFixed(2)}, Variation=${globalVariation.toFixed(2)}%`);

} catch (error) {
    console.error("Error processing Forest Change:", error.message);
    process.exit(1);
}
