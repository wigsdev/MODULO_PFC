const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../data/II. ESPACIAL/02_DATA_ATRIBUTOS/2.2.1.BD_SUPERFICIE_CUBIERTA_POR_BOSQUE_NATURAL_20251119.csv');
const outputFile = path.join(__dirname, '../public/data/espacial/bosques.json');

try {
    console.log(`Processing file: ${inputFile}`);
    if (!fs.existsSync(inputFile)) {
        console.warn(`⚠️ Input file not found, skipping: ${inputFile}`);
        process.exit(0);
    }

    // Read CSV file
    const csvContent = fs.readFileSync(inputFile, 'utf-8');
    const lines = csvContent.trim().split('\n');

    // Parse header and data
    const header = lines[0].split(',');
    const rawData = lines.slice(1).map(line => {
        // Handle quoted values with commas
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        return {
            region: values[0]?.replace(/"/g, '').trim(),
            superficie: values[1]?.replace(/"/g, '').replace(/,/g, '').trim()
        };
    });

    // Map and Clean Data
    const cleanData = rawData.map((row, index) => {
        let val = row.superficie;

        // Skip "No Aplica" or invalid values
        if (!val || val === 'No Aplica') {
            return null;
        }

        // Debug first row
        if (index === 0) console.log("Raw Row 0 Surface Value:", val, "Type:", typeof val);

        return {
            region: row.region,
            superficie2024: parseFloat(val) || 0
        };
    }).filter(r => r && r.region && r.superficie2024 > 0);

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
    console.log(`Processed: ${cleanData.length} regions.`);

} catch (error) {
    console.error("Error processing Bosques data:", error);
    process.exit(1);
}
