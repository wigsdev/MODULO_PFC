const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/IV. ECONOMIA/4.1.2.BD_PRECIOS_MADERAS.csv');
const OUTPUT_FILE = path.join(__dirname, '../public/data/economia/precios_madera.json');

console.log('Processing Economia 4.1.2: Precios Maderas...');

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Filter valid data (must have price and species)
    const validData = rawData.filter(r => r.PRECIO && !isNaN(r.PRECIO) && r.NOMCOM);

    // 1. Trend Analysis: Avg Price per Year per Species (Top 10 most common species)
    // Find top species by frequency
    const speciesCount = {};
    validData.forEach(r => {
        speciesCount[r.NOMCOM] = (speciesCount[r.NOMCOM] || 0) + 1;
    });

    // Sort species by frequency to focus on major ones
    const topSpecies = Object.keys(speciesCount)
        .sort((a, b) => speciesCount[b] - speciesCount[a])
        .slice(0, 20); // Top 20 for dropdown

    // Calculate annual avg price for these species
    const evolution = {};

    validData.forEach(r => {
        if (!topSpecies.includes(r.NOMCOM)) return;
        const year = r['AÑO'];
        const species = r.NOMCOM;
        const price = parseFloat(r.PRECIO);

        if (!evolution[species]) evolution[species] = {};
        if (!evolution[species][year]) evolution[species][year] = { sum: 0, count: 0 };

        evolution[species][year].sum += price;
        evolution[species][year].count += 1;
    });

    // Check if current year (2025) has significantly fewer records than 2024
    // If so, exclude it from the evolution chart to avoid misleading trends
    const currentYear = new Date().getFullYear();
    const yearCounts = {};
    validData.forEach(r => {
        const year = parseInt(r['AÑO']);
        if (year) yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    
    // Exclude current year if it has less than 30% of last complete year's records
    const lastCompleteYear = currentYear - 1;
    const excludeCurrentYear = yearCounts[currentYear] && yearCounts[lastCompleteYear] && 
        (yearCounts[currentYear] < yearCounts[lastCompleteYear] * 0.3);
    
    if (excludeCurrentYear) {
        console.log(`Note: Excluding ${currentYear} from evolution charts (only ${yearCounts[currentYear]} records vs ${yearCounts[lastCompleteYear]} in ${lastCompleteYear})`);
    }

    const formattedEvolution = Object.keys(evolution).map(species => {
        const years = Object.keys(evolution[species])
            .filter(y => !excludeCurrentYear || parseInt(y) !== currentYear) // Exclude incomplete year
            .sort();
        return {
            species,
            data: years.map(y => ({
                year: y,
                price: parseFloat((evolution[species][y].sum / evolution[species][y].count).toFixed(2))
            }))
        };
    });

    // 2. Current Avg Price by Product Type (2024 or latest)
    const latestYear = Math.max(...validData.map(r => parseInt(r['AÑO']) || 0));
    const recentData = validData.filter(r => r['AÑO'] == latestYear);

    const productPrices = {};
    recentData.forEach(r => {
        const prod = r['TIPPROD'] || 'Otros';
        if (!productPrices[prod]) productPrices[prod] = { sum: 0, count: 0 };
        productPrices[prod].sum += parseFloat(r.PRECIO);
        productPrices[prod].count += 1;
    });

    const productChart = Object.keys(productPrices).map(k => ({
        name: k,
        value: parseFloat((productPrices[k].sum / productPrices[k].count).toFixed(2))
    })).sort((a, b) => b.value - a.value);

    // 3. Raw List (export all data for client-side filtering)
    const list = validData
        .sort((a, b) => (b['AÑO'] - a['AÑO']) || (b['MES']?.localeCompare(a['MES']))) // Sort desc
        .map(r => ({
            id: r.ID,
            department: r.DEPART,
            year: r['AÑO'],
            month: r.MES,
            species: r.NOMCOM,
            product: r.TIPPROD,
            unit: r.UNID,
            price: parseFloat(r.PRECIO).toFixed(2),
            type: r.RECURSO
        }));

    const output = {
        metadata: {
            title: "Precios de Productos Forestales",
            source: "SNIFFS - Precios en Pie y Mercado (4.1.2)",
            latestYear
        },
        kpi: {
            totalRecords: validData.length,
            monitoredSpecies: Object.keys(speciesCount).length,
            avgPriceCurrent: productChart.length > 0 ? (productChart.reduce((a, b) => a + b.value, 0) / productChart.length).toFixed(2) : 0
        },
        topSpecies, // List for filters
        evolution: formattedEvolution,
        productPrices: productChart,
        list
    };

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Success! Data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error("Error processing 4.1.2:", error.message);
    process.exit(1);
}
